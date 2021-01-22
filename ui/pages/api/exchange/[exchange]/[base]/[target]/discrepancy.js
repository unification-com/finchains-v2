import nextConnect from "next-connect"
import { Op } from "sequelize"
import middleware from "../../../../../../middleware/db"

const { getPagination, getPagingData } = require("../../../../../../utils/pagination")

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target, exchange, page },
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

  req.dbModels.ExchangeOracles.findOne({
    attributes: ["id"],
    where: { exchange },
  })
    .then((exIdData) => {
      if (exIdData) {
        req.dbModels.Discrepancies.findAndCountAll({
          attributes: ["price1", "price2", "diff", "timestamp1", "timestamp2", "threshold"],
          include: [
            { model: req.dbModels.Pairs, attributes: ["name", "base", "target"], where: { base, target } },
            { model: req.dbModels.TxHashes, attributes: ["txHash"] },
            {
              model: req.dbModels.ExchangeOracles,
              as: "ExchangeOracle1",
              attributes: ["exchange", "address"],
            },
            {
              model: req.dbModels.ExchangeOracles,
              as: "ExchangeOracle2",
              attributes: ["exchange", "address"],
            },
          ],
          where: {
            [Op.or]: [{ exchangeOracle1Id: exIdData.id }, { exchangeOracle2Id: exIdData.id }],
          },
          limit,
          offset,
          order: [["timestamp1", "DESC"]],
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
      } else {
        const currencyData = getPagingData([], pageQuery, limit)
        res.json(currencyData)
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
