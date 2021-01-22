import nextConnect from "next-connect"
import middleware from "../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  req.dbModels.Discrepancies.findOne({
    attributes: ["price1", "price2", "diff", "timestamp1", "timestamp2", "threshold"],
    include: [
      { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
      { model: req.dbModels.TxHashes, attributes: ["txHash"] },
      {
        model: req.dbModels.ExchangeOracles,
        as: "ExchangeOracle1",
        attributes: ["exchange", "address"],
      },
      {
        model: req.dbModels.ExchangeOracles,
        as: "ExchangeOracle2",
        attributes: ["exchange", "address"],
      },
    ],
    order: [["timestamp1", "DESC"]],
    raw: true,
  })
    .then((data) => {
      if (data) {
        res.json(data)
      } else {
        res.json({})
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
