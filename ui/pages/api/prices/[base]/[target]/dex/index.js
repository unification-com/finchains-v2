import nextConnect from "next-connect"
import { Op } from "sequelize"
import middleware from "../../../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target },
  } = req

  const exchanges = req.exchanges.dexs

  // default timespan is last hour
  const d = new Date()
  const ts = Math.floor(d / 1000)
  const lastHour = ts - 3600

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
        include: [{ model: req.dbModels.Pairs, attributes: ["name"], where: { base, target } }],
        where: {
          timestamp: {
            [Op.gte]: lastHour,
          },
          exchangeOracleId: {
            [Op.in]: exchIds,
          },
        },
        order: [["timestamp", "DESC"]],
      })
        .then(function (cData) {
          const dataRet = {
            base,
            target,
            time: "1H",
            pair: `${base}/${target}`,
            exchanges,
            exchange_type: "dex",
          }

          const dataSet = []
          for (let i = 0; i < cData.length; i += 1) {
            dataSet.push(Number(cData[i].priceRaw))
          }
          dataRet.prices = dataSet
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
