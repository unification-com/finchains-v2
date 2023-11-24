import nextConnect from "next-connect"
import { Op } from "sequelize"
import middleware from "../../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target },
  } = req

  // default timespan is last hour
  const d = new Date()
  const ts = Math.floor(d / 1000)
  const lastHour = ts - 3600

  req.dbModels.CurrencyUpdates.findAll({
    attributes: ["priceRaw"],
    include: [
      { model: req.dbModels.Pairs, attributes: ["name"], where: { base, target } },
      { model: req.dbModels.ExchangeOracles, attributes: ["exchange"] },
    ],
    where: {
      timestamp: {
        [Op.gte]: lastHour,
      },
    },
    order: [["timestamp", "DESC"]],
  })
    .then(function (cData) {
      const exchangesUsed = []

      const dataRet = {
        base,
        target,
        time: "1H",
        pair: `${base}/${target}`,
        exchange_type: "both",
      }

      const dataSet = []
      for (let i = 0; i < cData.length; i += 1) {
        dataSet.push(Number(cData[i].priceRaw))
        if (!exchangesUsed.includes(cData[i].ExchangeOracle.exchange)) {
          exchangesUsed.push(cData[i].ExchangeOracle.exchange)
        }
      }
      dataRet.prices = dataSet
      dataRet.exchanges = exchangesUsed
      res.json(dataRet)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
