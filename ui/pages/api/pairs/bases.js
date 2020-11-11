import nextConnect from "next-connect"
import middleware from "../../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  req.dbModels.Pairs.aggregate("base", "DISTINCT", { plain: false, order: [["base", "ASC"]] })
    .then((data) => {
      const dataResults = []
      for (let i = 0; i < data.length; i += 1) {
        dataResults.push(data[i].DISTINCT)
      }
      res.json({ results: dataResults })
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
