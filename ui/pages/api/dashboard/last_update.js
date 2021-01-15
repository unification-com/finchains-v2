import nextConnect from "next-connect"
import middleware from "../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  req.dbModels.CurrencyUpdates.findOne({
    attributes: ["price", "priceRaw", "timestamp", "txHash"],
    include: [
      { model: req.dbModels.ExchangeOracles, attributes: ["exchange"] },
      { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
    ],
    order: [["timestamp", "DESC"]],
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

export default handler
