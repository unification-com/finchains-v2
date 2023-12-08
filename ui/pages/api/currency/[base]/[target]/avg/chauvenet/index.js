import nextConnect from "next-connect"
import { Op } from "sequelize"
import Web3 from "web3"
import middleware from "../../../../../../../middleware/db"

const { removeOutliersChauvenet, getStats, cleanseForBn } = require("../../../../../../../utils/stats")

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target },
  } = req

  const d = new Date()
  const ts = Math.floor(d / 1000)
  const dMax = 2 // default to 2

  const tsQuery = ts - 3600

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
        time: "1H",
        pair: `${base}/${target}`,
        dMax,
        outlierMethod: "chauvenet",
      }
      const dataSet = []
      if (data.length > 0) {
        for (let i = 0; i < data.length; i += 1) {
          dataSet.push(Number(data[i].priceRaw))
        }
        const outliersRemoved = removeOutliersChauvenet(dataSet, dMax)
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
