import nextConnect from "next-connect"
import { Op, Sequelize } from "sequelize"
import BN from "bn.js"
import Web3 from "web3"
import middleware from "../../../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target },
  } = req

  const d = new Date()
  const ts = Math.floor(d / 1000)
  const lastFiveMins = ts - 3600

  req.dbModels.CurrencyUpdates.findAll({
    attributes: ["exchangeOracleId", [Sequelize.fn("max", Sequelize.col("CurrencyUpdates.id")), "rId"]],
    include: [{ model: req.dbModels.Pairs, attributes: ["name"], where: { base, target } }],
    group: ["exchangeOracleId", "Pair.id"],
    where: {
      timestamp: {
        [Op.gt]: lastFiveMins,
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
