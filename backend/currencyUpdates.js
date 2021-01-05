const { CurrencyUpdates, LastGethBlock } = require("../common/db/models")
const { getOrAddPair } = require("./pairs")
const { getOrAddExchangeOracle } = require("./exchangeOracles")
const { getOrAddExchangePair } = require("./exchangePairs")

const getOrAddCurrencyUpdate = async (exchangeOracleId, pairId, txHash, price, priceRaw, timestamp) => {
  return CurrencyUpdates.findOrCreate({
    where: {
      txHash,
    },
    defaults: {
      exchangeOracleId,
      pairId,
      price,
      priceRaw,
      timestamp,
    },
  })
}

const processCurrencyUpdate = async (event) => {
  try {
    const height = event.blockNumber
    const txHash = event.transactionHash
    const oracleAddress = event.returnValues.from
    const pairName = event.returnValues.pair
    const price = event.returnValues.price
    const priceRaw = event.returnValues.priceRaw
    const timestamp = event.returnValues.timestamp
    const exchange = event.returnValues.exchange

    const [pair, pairCreated] = await getOrAddPair(pairName)
    if (pairCreated) {
      console.log(new Date(), "added new pair", pairName, pair.id)
    }
    const [eo, eoCreated] = await getOrAddExchangeOracle(oracleAddress, exchange)
    if (eoCreated) {
      console.log(new Date(), "added new exchange oracle", exchange, oracleAddress, eo.id)
    }

    const [exPair, exPairCreated] = await getOrAddExchangePair(eo.id, pair.id)
    if (exPairCreated) {
      console.log(new Date(), "added new exchange oracle pair link", exchange, pairName, exPair.id)
    }

    const [cu, cuCreated] = await getOrAddCurrencyUpdate(eo.id, pair.id, txHash, price, priceRaw, timestamp)

    if (cuCreated) {
      console.log(new Date(), "inserted currency update", cu.id)
    }

    const [l, lCreated] = await LastGethBlock.findOrCreate({
      where: {
        event: "CurrencyUpdate",
      },
      defaults: {
        event: "CurrencyUpdate",
        height,
      },
    })

    if (!lCreated) {
      await l.update({ height })
    }
  } catch (err) {
    console.error(new Date(), "ERROR:")
    console.error(err)
    console.error(event)
  }
}

module.exports = {
  processCurrencyUpdate,
}
