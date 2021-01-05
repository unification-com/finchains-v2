import nextConnect from "next-connect"
import middleware from "../../../../middleware/db"

const { toCanonicalJSON } = require("@tendermint/belt")

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { exchange },
  } = req

  req.dbModels.ExchangeOracles.findOne({
    attributes: ["id"],
    where: { exchange },
  })
    .then(function (exch) {
      req.dbModels.ExchangePairs.findAll({
        attributes: ["pairId"],
        include: [
          { model: req.dbModels.Pairs, attributes: ["base"], group: ["Pair.base"], order: [["base", "ASC"]] },
        ],
        where: {
          exchangeOracleId: exch.id,
        },
        raw: true,
      })
        .then((data) => {
          const dataReturn = []
          for (let i = 0; i < data.length; i += 1) {
            const base = data[i]["Pair.base"]
            if (!dataReturn.includes(base)) {
              dataReturn.push(base)
            }
          }
          res.json(dataReturn.sort())
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
