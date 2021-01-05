import nextConnect from "next-connect"
import { Op, Sequelize } from "sequelize"
import middleware from "../../../../middleware/db"

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
          {
            model: req.dbModels.Pairs,
            attributes: ["name", "base", "target"],
            order: [
              ["base", "ASC"],
              ["target", "ASC"],
            ],
          },
        ],
        where: {
          exchangeOracleId: exch.id,
        },
        raw: true,
      })
        .then((data) => {
          const pairs = []
          for (let i = 0; i < data.length; i += 1) {
            const d = data[i]
            const p = {
              name: d["Pair.name"],
              base: d["Pair.base"],
              target: d["Pair.target"],
            }
            pairs.push(p)
          }
          res.json(pairs.sort())
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
