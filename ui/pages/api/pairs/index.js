import nextConnect from "next-connect"
import middleware from "../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  await req.dbModels.Pairs.findAll({
    attributes: ["name", "base", "target"],
    order: [["name", "ASC"]],
  })
    .then((data) => {
      const dataResults = []
      for (let i = 0; i < data.length; i += 1) {
        dataResults.push(data[i].dataValues)
      }
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
