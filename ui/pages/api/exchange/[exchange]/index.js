import nextConnect from "next-connect"
import middleware from "../../../../middleware/db"

const { getPagination, getPagingData } = require("../../../../utils/pagination")

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { exchange, page },
  } = req

  let pageQuery = 1
  if (page) {
    pageQuery = parseInt(page, 10)
  }

  const size = 100

  if (pageQuery < 1) {
    pageQuery = 1
  }

  const { limit, offset } = getPagination(pageQuery, size)

  req.dbModels.CurrencyUpdates.findAndCountAll({
    attributes: ["price", "priceRaw", "timestamp", "txHash"],
    include: [
      { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
      { model: req.dbModels.ExchangeOracles, attributes: ["exchange", "address"], where: { exchange } },
    ],
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

export default handler
