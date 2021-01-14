import nextConnect from "next-connect"
import middleware from "../../../../../middleware/db"
import { exchangeToTla, exchangeLookup } from "../../../../../utils/exchange"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target },
  } = req

  req.dbModels.Pairs.findOne({
    attributes: ["id"],
    where: {
      base,
      target,
    },
  })
    .then((data) => {
      if (!data) {
        // pair not currently tracked. Return empty result
        res.json([])
      }
      req.dbModels.ExchangePairs.findAll({
        attributes: ["exchangeOracleId"],
        include: [{ model: req.dbModels.ExchangeOracles, attributes: ["address", "exchange"] }],
        where: {
          pairId: data.id,
        },
        raw: true,
      }).then(function (exData) {
        const resRet = []
        for (let i = 0; i < exData.length; i += 1) {
          const exd = {
            exchange: exData[i]["ExchangeOracle.exchange"],
            address: exData[i]["ExchangeOracle.address"],
            tla: exchangeToTla(exData[i]["ExchangeOracle.exchange"]),
            name: exchangeLookup(exData[i]["ExchangeOracle.exchange"]),
          }
          resRet.push(exd)
        }
        res.json(resRet)
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
