import nextConnect from "next-connect"
import middleware from "../../../../../middleware/db"

const { Op } = require("sequelize")

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target },
  } = req

  const oneHour = 60 * 60
  const twoHours = oneHour * 2
  const sixHours = twoHours * 3
  const twelveHours = sixHours * 2
  const oneDay = twelveHours * 2
  const oneWeek = oneDay * 7

  const d = new Date()
  const ts = Math.floor(d / 1000)
  const tsToGet = ts - oneWeek

  req.dbModels.CurrencyUpdates7Days.findAll({
    attributes: ["price", "priceRaw", "timestamp"],
    include: [
      { model: req.dbModels.Pairs, attributes: ["name", "base", "target"], where: { base, target } },
      { model: req.dbModels.ExchangeOracles, attributes: ["exchange", "address"] },
    ],
    where: { timestamp: { [Op.gt]: tsToGet } },
    order: [["timestamp", "ASC"]],
    raw: true,
  })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
