import nextConnect from "next-connect"
import middleware from "../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { txHash },
  } = req

  await req.dbModels.TxHashes.findOne({
    where: {
      txHash,
    },
  })
    .then(async (data) => {
      const dataResults = {}
      const tx = {}
      const submissions = []
      const discrepancies = []
      if (data) {
        tx.txHash = data.txHash
        tx.height = data.height
        const txHashId = data.id

        const submissionRes = await req.dbModels.CurrencyUpdates7Days.findOne({
          attributes: ["price", "priceRaw", "timestamp"],
          include: [
            { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
            { model: req.dbModels.ExchangeOracles, attributes: ["exchange", "address"] },
            { model: req.dbModels.TxHashes, attributes: ["txHash"] },
          ],
          where: {
            txHashId,
          },
          raw: true,
        })

        if (submissionRes) {
          submissions.push(submissionRes)
        }

        const discrepanciesResults = await req.dbModels.Discrepancies7Days.findAll({
          attributes: ["price1", "price2", "diff", "timestamp1", "timestamp2", "threshold"],
          include: [
            { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
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
            { model: req.dbModels.TxHashes, attributes: ["txHash"] },
          ],
          where: {
            txHashId,
          },
          raw: true,
        })

        if (discrepanciesResults) {
          for (let i = 0; i < discrepanciesResults.length; i += 1) {
            discrepancies.push(discrepanciesResults[i])
          }
        }
      }

      dataResults.submissions = submissions
      dataResults.discrepancies = discrepancies
      dataResults.tx = tx
      res.json(dataResults)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
