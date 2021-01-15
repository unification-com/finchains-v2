import nextConnect from "next-connect"
import middleware from "../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const latestExchangeUpdates = []

  req.dbModels.ExchangeOracles.findAll({
    attributes: ["id"],
  })
    .then(async function (oracleIds) {
      for (let i = 0; i < oracleIds.length; i += 1) {
        const oId = oracleIds[i].id
        const dbRes = await req.dbModels.CurrencyUpdates.findOne({
          attributes: ["price", "priceRaw", "timestamp", "txHash"],
          include: [
            { model: req.dbModels.ExchangeOracles, attributes: ["exchange"] },
            { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
          ],
          order: [["timestamp", "DESC"]],
          where: { exchangeOracleId: oId },
          raw: true,
        })
        latestExchangeUpdates.push(dbRes)
      }
      res.json(latestExchangeUpdates)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
