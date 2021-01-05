import nextConnect from "next-connect"
import { Op, Sequelize } from "sequelize"
import BN from "bn.js"
import Web3 from "web3"
import middleware from "../../../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target, time },
  } = req

  const d = new Date()
  const ts = Math.floor(d / 1000)
  let tsQuery = ts
  const oneMinute = 60
  const oneHour = 3600
  const oneDay = oneHour * 24
  const oneWeek = oneDay * 7
  const oneMonth = oneDay * 30

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
    case "1WK":
      tsQuery = ts - oneWeek
      break
    case "1MN":
      tsQuery = ts - oneMonth
      break
  }


  req.dbModels.CurrencyUpdates.findAll({
    attributes: ["exchangeOracleId", [Sequelize.fn("max", Sequelize.col("CurrencyUpdates.id")), "rId"]],
    include: [{ model: req.dbModels.Pairs, attributes: ["name"], where: { base, target } }],
    group: ["exchangeOracleId", "Pair.id"],
    where: {
      timestamp: {
        [Op.gte]: tsQuery,
      },
    },
  })
    .then(function (maxIds) {
      const rIds = []
      for (let i = 0; i < maxIds.length; i += 1) {
        rIds.push(maxIds[i].dataValues.rId)
      }
      req.dbModels.CurrencyUpdates.findAll({
        attributes: ["price"],
        where: {
          id: {
            [Op.in]: rIds,
          },
        },
        raw: true,
      })
        .then((data) => {
          const dataRet = {}
          if (data.length > 0) {
            let totalBN = new BN("0")
            for (let i = 0; i < data.length; i += 1) {
              const priceBn = new BN(data[i].price)
              totalBN = totalBN.add(priceBn)
            }
            const avg = totalBN.div(new BN(data.length))
            dataRet.price = avg.toString()
            dataRet.priceRaw = Web3.utils.fromWei(avg)
          } else {
            dataRet.price = "0"
            dataRet.priceRaw = "0"
          }
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
