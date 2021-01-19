import nextConnect from "next-connect"
import { Op, Sequelize } from "sequelize"
import BN from "bn.js"
import Web3 from "web3"
import middleware from "../../../../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

const getQuartile = (arr, q) => {
  const pos = (arr.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (arr[base + 1] !== undefined) {
    return arr[base] + rest * (arr[base + 1] - arr[base])
  }
  return arr[base]
}

const removeOutliers = (dataSet) => {
  // sort into ascending order
  dataSet.sort((a, b) => a - b)

  // calculate quartiles and interquartile range
  const Q1 = getQuartile(dataSet, 0.25)
  const Q3 = getQuartile(dataSet, 0.75)
  const IQR = Q3 - Q1

  const noneOutliers = []
  dataSet.forEach((number) => {
    if (number > Q3 + 1.5 * IQR || number < Q1 - 1.5 * IQR) {
      // ignore outlier
    } else {
      // add to dataset
      noneOutliers.push(number)
    }
  })
  return noneOutliers
}

const calculateMean = (dataSet) => {
  let totalBN = new BN("0")
  for (let i = 0; i < dataSet.length; i += 1) {
    const priceBn = Web3.utils.toWei(String(dataSet[i]), "ether")
    totalBN = totalBN.add(new BN(priceBn))
  }
  return totalBN.div(new BN(dataSet.length))
}

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
        const outliersRemoved = removeOutliers(dataSet)
        const mean = calculateMean(outliersRemoved)
        dataRet.price = mean.toString()
        dataRet.priceRaw = Web3.utils.fromWei(mean)
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
