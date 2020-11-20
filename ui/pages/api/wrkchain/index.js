import nextConnect from "next-connect"
import middleware from "../../../middleware/db"

const { getPagination, getPagingData } = require("../../../utils/pagination")

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { page },
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

  req.dbModels.WrkchainBlocks.findAndCountAll({
    attributes: ["height", "mainchainTx", "timestamp"],
    limit,
    offset,
    order: [["height", "DESC"]],
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
