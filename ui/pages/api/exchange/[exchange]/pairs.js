import nextConnect from "next-connect"
import middleware from "../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { exchange },
  } = req

  req.dbModels.CurrencyUpdates.findAll({
    attributes: ["pairId"],
    include: [
      { model: req.dbModels.ExchangeOracles, attributes: ["id"], where: { exchange } },
      {
        model: req.dbModels.Pairs,
        attributes: ["base", "target"],
        order: [
          ["base", "ASC"],
          ["target", "ASC"],
        ],
      },
    ],
    group: ["ExchangeOracle.id", "CurrencyUpdates.pairId", "Pair.base", "Pair.target"],
    raw: true,
  })
    .then((data) => {
      const dataReturn = {}
      for (let i = 0; i < data.length; i += 1) {
        const base = data[i]["Pair.base"]
        const target = data[i]["Pair.target"]
        if (!dataReturn[base]) {
          dataReturn[base] = {
            base,
            targets: [],
          }
        }
        dataReturn[base].targets.push(target)
      }
      res.json(dataReturn)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
