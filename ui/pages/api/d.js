import nextConnect from "next-connect"
import Sequelize from "sequelize"
import Web3 from "web3"
import middleware from "../../middleware/db"

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  req.dbModels.Discrepancies.findAll({
    attributes: [
      [Sequelize.fn("min", Sequelize.col("diff")), "minDiff"],
      [Sequelize.fn("max", Sequelize.col("diff")), "maxDiff"],
    ],
    include: [{ model: req.dbModels.Pairs, attributes: ["name"] }],
    group: ["Pair.name"],
    raw: true,
  })
    .then((data) => {
      const processedData = []
      for (let i = 0; i < data.length; i += 1) {
        const d = {
          pair: data[i]["Pair.name"],
          minDiff: data[i].minDiff,
          maxDiff: data[i].maxDiff,
          min: Web3.utils.fromWei(data[i].minDiff),
          max: Web3.utils.fromWei(data[i].maxDiff),
        }
        processedData.push(d)
      }

      res.json(processedData)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send({
        message: "error occurred while retrieving data.",
      })
    })
})

export default handler
