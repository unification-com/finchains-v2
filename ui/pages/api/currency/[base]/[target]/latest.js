import nextConnect from "next-connect"
import { Op, Sequelize } from "sequelize"
import middleware from "../../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target },
  } = req

  req.dbModels.CurrencyUpdates.findAll({
    attributes: ["exchangeOracleId", [Sequelize.fn("max", Sequelize.col("CurrencyUpdates.id")), "rId"]],
    include: [{ model: req.dbModels.Pairs, attributes: ["name", "base", "target"], where: { base, target } }],
    group: ["exchangeOracleId", "Pair.id"],
  })
    .then(function (maxIds) {
      const rIds = []
      for (let i = 0; i < maxIds.length; i += 1) {
        rIds.push(maxIds[i].dataValues.rId)
      }
      req.dbModels.CurrencyUpdates.findAll({
        attributes: ["price", "priceRaw", "timestamp"],
        include: [
          { model: req.dbModels.ExchangeOracles, attributes: ["exchange"] },
          { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
          { model: req.dbModels.TxHashes, attributes: ["txHash"] },
        ],
        where: {
          id: {
            [Op.in]: rIds,
          },
        },
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
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
