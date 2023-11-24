import nextConnect from "next-connect"
import { Op } from "sequelize"
import middleware from "../../../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target, time },
  } = req

  const exchanges = req.exchanges.cexs

  const d = new Date()
  const ts = Math.floor(d / 1000)

  let tsQuery = ts
  const oneMinute = 60
  const oneHour = 3600
  const oneDay = oneHour * 24

  // default is one hour
  switch (time) {
    case "5M":
      tsQuery = ts - oneMinute * 5
      break
    case "10M":
      tsQuery = ts - oneMinute * 10
      break
    case "30M":
      tsQuery = ts - oneMinute * 30
      break
    case "1H":
    default:
      tsQuery = ts - oneHour
      break
    case "2H":
      tsQuery = ts - oneHour * 2
      break
    case "6H":
      tsQuery = ts - oneHour * 6
      break
    case "12H":
      tsQuery = ts - oneHour * 12
      break
    case "24H":
      tsQuery = ts - oneDay
      break
    case "48H":
      tsQuery = ts - oneDay * 2
      break
  }

  req.dbModels.ExchangeOracles.findAll({
    attributes: ["id"],
    where: {
      exchange: {
        [Op.in]: exchanges,
      },
    },
  })
    .then(function (data) {
      const exchIds = []
      for (let i = 0; i < data.length; i += 1) {
        exchIds.push(data[i].id)
      }
      req.dbModels.CurrencyUpdates.findAll({
        attributes: ["priceRaw"],
        include: [
          { model: req.dbModels.Pairs, attributes: ["name"], where: { base, target } },
          { model: req.dbModels.ExchangeOracles, attributes: ["exchange"] },
        ],
        where: {
          timestamp: {
            [Op.gte]: tsQuery,
          },
          exchangeOracleId: {
            [Op.in]: exchIds,
          },
        },
        order: [["timestamp", "DESC"]],
      })
        .then(function (cData) {
          const exchangesUsed = []

          const dataRet = {
            base,
            target,
            time,
            pair: `${base}/${target}`,
            exchange_type: "cex",
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
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
