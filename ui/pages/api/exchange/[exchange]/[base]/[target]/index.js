import nextConnect from "next-connect"
import middleware from "../../../../../../middleware/db"

const { getPagination, getPagingData } = require("../../../../../../utils/pagination")

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { exchange, base, target, page },
  } = req

  let pageQuery = 1
  if (page) {
    pageQuery = parseInt(page, 10)
  }

  const size = 20

  if (pageQuery < 1) {
    pageQuery = 1
  }

  const { limit, offset } = getPagination(pageQuery, size)

  let exchangeId

  req.dbModels.ExchangeOracles.findOne({
    attributes: ["id"],
    where: { exchange },
  })
    .then((exch) => {
      exchangeId = exch.id
      req.dbModels.Pairs.findOne({
        attributes: ["id"],
        where: { base, target },
      })
        .then((pair) => {
          req.dbModels.CurrencyUpdates.findAndCountAll({
            attributes: ["price", "priceRaw", "timestamp"],
            include: [
              { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
              { model: req.dbModels.ExchangeOracles, attributes: ["exchange", "address"] },
              { model: req.dbModels.TxHashes, attributes: ["txHash"] },
            ],
            where: { pairId: pair.id, exchangeOracleId: exchangeId },
            limit,
            offset,
            order: [["timestamp", "DESC"]],
            raw: true,
          })
            .then((data) => {
              const currencyData = getPagingData(data, pageQuery, limit)
              res.json(currencyData)
            })
            .catch((err) => {
              console.error(err)
              res.status(500).send({
                message: "error occurred while retrieving data.",
              })
            })
        })
        .catch((err) => {
          console.error(err)
          res.status(500).send({
            message: "error occurred while retrieving data.",
          })
        })
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
