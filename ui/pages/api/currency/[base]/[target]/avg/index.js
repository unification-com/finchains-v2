import nextConnect from "next-connect"
import { Op } from "sequelize"
import Web3 from "web3"
import middleware from "../../../../../../middleware/db"

const { cleanseForBn, getStats } = require("../../../../../../utils/stats")

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

  req.dbModels.CurrencyUpdates7Days.findAll({
    attributes: ["priceRaw"],
    include: [{ model: req.dbModels.Pairs, attributes: ["name"], where: { base, target } }],
    where: {
      timestamp: {
        [Op.gte]: lastHour,
      },
    },
  })
    .then(function (data) {
      const dataRet = {}
      const dataSet = []
      if (data.length > 0) {
        for (let i = 0; i < data.length; i += 1) {
          dataSet.push(Number(data[i].priceRaw))
        }
        const stats = getStats(dataSet)
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
