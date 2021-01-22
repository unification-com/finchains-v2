import nextConnect from "next-connect"
import middleware from "../../../../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { base, target, exchange },
  } = req

  req.dbModels.CurrencyUpdates7Days.findOne({
    attributes: ["price", "priceRaw", "timestamp"],
    include: [
      { model: req.dbModels.Pairs, attributes: ["name", "base", "target"], where: { base, target } },
      { model: req.dbModels.ExchangeOracles, attributes: ["exchange"], where: { exchange } },
    ],
    order: [["timestamp", "DESC"]],
    raw: true,
  })
    .then((data) => {
      if (data) {
        res.json(data)
      } else {
        res.json([])
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
