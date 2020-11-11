import nextConnect from "next-connect"
import middleware from "../../../../../middleware/db"

const { getPagination, getPagingData } = require("../../../../../utils/pagination")

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target, page },
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

  req.dbModels.Discrepancies.findAndCountAll({
    attributes: ["price1", "price2", "diff", "timestamp1", "timestamp2", "txHash"],
    include: [
      { model: req.dbModels.Pairs, attributes: ["name", "base", "target"], where: { base, target } },
      { model: req.dbModels.ExchangeOracles, as: "ExchangeOracle1", attributes: ["exchange", "address"] },
      { model: req.dbModels.ExchangeOracles, as: "ExchangeOracle2", attributes: ["exchange", "address"] },
    ],
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
})

export default handler
