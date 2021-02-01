import nextConnect from "next-connect"
import { Op } from "sequelize"
import Web3 from "web3"
import middleware from "../../../../../../../middleware/db"

const { removeOutliersIQD, cleanseForBn, getStats } = require("../../../../../../../utils/stats")

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

  req.dbModels.CurrencyUpdates.findAll({
    attributes: ["priceRaw"],
    include: [{ model: req.dbModels.Pairs, attributes: ["name"], where: { base, target } }],
    where: {
      timestamp: {
        [Op.gte]: tsQuery,
      },
    },
  })
    .then(function (data) {
      const dataRet = {
        base,
        target,
        time,
        pair: `${base}/${target}`,
        outlierMethod: "iqd",
      }
      const dataSet = []
      if (data.length > 0) {
        for (let i = 0; i < data.length; i += 1) {
          dataSet.push(Number(data[i].priceRaw))
        }
        const outliersRemoved = removeOutliersIQD(dataSet)
        const stats = getStats(outliersRemoved)

        const mean = cleanseForBn(stats.mean)
        dataRet.price = Web3.utils.toWei(String(mean), "ether")
        dataRet.priceRaw = mean
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

export default handler
