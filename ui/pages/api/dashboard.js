import nextConnect from "next-connect"
import middleware from "../../middleware/db"
import {Op, Sequelize} from "sequelize";

const { exchangeLookup } = require("../../utils/exchange")

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const results = {}
  try {
    // Pairs
    const pairRes = await req.dbModels.Pairs.findAndCountAll({
      attributes: ["name", "base", "target"],
      order: [["name", "ASC"]],
    })
    const pairs = {
      num: pairRes.count,
      data: pairRes.rows,
    }
    results.pairs = pairs

    // Exchanges
    const ExchRes = await req.dbModels.ExchangeOracles.findAndCountAll({
      attributes: ["exchange", "address"],
      order: [["exchange", "ASC"]],
    })

    const exchRows = []
    for (let i = 0; i < ExchRes.count; i += 1) {
      exchRows.push({
        exchange: ExchRes.rows[i].exchange,
        address: ExchRes.rows[i].address,
        name: exchangeLookup(ExchRes.rows[i].exchange),
      })
    }
    const exchanges = {
      num: ExchRes.count,
      data: exchRows,
    }
    results.exchanges = exchanges

    // latest Updates by Exchange
    const latestExchangeIdsRes = await req.dbModels.CurrencyUpdates.findAll({
      attributes: ["exchangeOracleId", [Sequelize.fn("max", Sequelize.col("CurrencyUpdates.id")), "rId"]],
      group: ["exchangeOracleId"],
    })
    const rIds = []
    for (let i = 0; i < latestExchangeIdsRes.length; i += 1) {
      rIds.push(latestExchangeIdsRes[i].dataValues.rId)
    }
    const latestExchangeRes = await req.dbModels.CurrencyUpdates.findAll({
      attributes: ["price", "priceRaw", "timestamp", "txHash"],
      include: [
        { model: req.dbModels.ExchangeOracles, attributes: ["exchange"] },
        { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
      ],
      where: {
        id: {
          [Op.in]: rIds,
        },
      },
      order: [["timestamp", "DESC"]],
      raw: true,
    })

    results.latestExchangeUpdates = latestExchangeRes

    const lastUpdate = await req.dbModels.CurrencyUpdates.findOne({
      attributes: ["price", "priceRaw", "timestamp", "txHash"],
      include: [
        { model: req.dbModels.ExchangeOracles, attributes: ["exchange"] },
        { model: req.dbModels.Pairs, attributes: ["name", "base", "target"] },
      ],
      order: [["timestamp", "DESC"]],
      raw: true,
    })

    results.lastUpdate = lastUpdate

    const lastDiscrepancy = await req.dbModels.Discrepancies.findOne({
      attributes: ["price1", "price2", "diff", "timestamp1", "timestamp2", "txHash", "threshold"],
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
      ],
      order: [["timestamp1", "DESC"]],
      raw: true,
    })

    results.lastDiscrepancy = lastDiscrepancy

    res.json(results)
  } catch (err) {
    console.error(err)
    res.status(500).send({
      message: "error occurred while retrieving data.",
    })
  }
})

export default handler
