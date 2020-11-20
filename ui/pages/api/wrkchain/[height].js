import nextConnect from "next-connect"
import middleware from "../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const {
    query: { height },
  } = req

  req.dbModels.WrkchainBlocks.findOne({
    attributes: ["height", "mainchainTx", "timestamp"],
    where: { height },
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
