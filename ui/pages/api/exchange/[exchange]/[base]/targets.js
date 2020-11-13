import nextConnect from "next-connect"
import middleware from "../../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { exchange, base },
  } = req

  req.dbModels.CurrencyUpdates.findAll({
    attributes: ["pairId"],
    include: [
      { model: req.dbModels.ExchangeOracles, attributes: ["id"], where: { exchange } },
      {
        model: req.dbModels.Pairs,
        attributes: ["target"],
        where: { base },
        order: [["target", "ASC"]],
      },
    ],
    group: ["ExchangeOracle.id", "CurrencyUpdates.pairId", "Pair.target"],
    raw: true,
  })
    .then((data) => {
      const dataReturn = []
      for (let i = 0; i < data.length; i += 1) {
        const target = data[i]["Pair.target"]
        if (!dataReturn.includes(target)) {
          dataReturn.push(target)
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

export default handler
