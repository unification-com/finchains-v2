import nextConnect from "next-connect"
import middleware from "../../../middleware/db"
import { exchangeToTla, exchangeLookup } from "../../../utils/exchange"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  req.dbModels.ExchangeOracles.findAll({
    attributes: ["exchange", "address"],
    order: [["exchange", "ASC"]],
  })
    .then((data) => {
      const retData = []
      for (let i = 0; i < data.length; i += 1) {
        const d = {
          exchange: data[i].exchange,
          address: data[i].address,
          tla: exchangeToTla(data[i].exchange),
          name: exchangeLookup(data[i].exchange),
        }
        retData.push(d)
      }
      res.json(retData)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
