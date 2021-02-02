require("dotenv").config()
const { CurrencyUpdates, LastGethBlock, sequelize } = require("../common/db/models")
const { getOrAddPair } = require("./pairs")
const { getOrAddExchangeOracle } = require("./exchangeOracles")
const { getOrAddExchangePair } = require("./exchangePairs")
const { getOrAddTxHash } = require("./txHashes")

const { FULL_ARCHIVE_MODE } = process.env

const getOrAddCurrencyUpdate = async (
  exchangeOracleId,
  pairId,
  txHashId,
  price,
  priceRaw,
  timestamp,
  height,
) => {
  return CurrencyUpdates.findOrCreate({
    where: {
      txHashId,
    },
    defaults: {
      exchangeOracleId,
      pairId,
      price,
      priceRaw,
      timestamp,
      height,
    },
  })
}

const cleanCurrencyUpdate7Day = async () => {
  const d = new Date()
  const oneWeekAgo = Math.floor(d / 1000) - 604800

  const [, metadata] = await sequelize.query(
    `DELETE FROM "CurrencyUpdates" WHERE timestamp <= '${oneWeekAgo}'`,
  )
  console.log(new Date(), "deleted", metadata.rowCount, "rows from CurrencyUpdates")
}

const processCurrencyUpdate = async (event) => {
  try {
    const fullArchive = parseInt(FULL_ARCHIVE_MODE, 10) === 1
    let addRecord = false

    const height = event.blockNumber
    const txHash = event.transactionHash
    const oracleAddress = event.returnValues.from
    const pairName = event.returnValues.pair
    const price = event.returnValues.price
    const priceRaw = event.returnValues.priceRaw
    const timestamp = event.returnValues.timestamp
    const exchange = event.returnValues.exchange

    const d = new Date()
    const oneWeekAgo = Math.floor(d / 1000) - 604800

    if (fullArchive || parseInt(timestamp, 10) >= oneWeekAgo) {
      addRecord = true
    }

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

    if (addRecord) {
      const [txH, txCreated] = await getOrAddTxHash(txHash, height)
      if (txCreated) {
        console.log(new Date(), "added new tx hash", txHash, height, txH.id)
      }

      const [cu, cuCreated] = await getOrAddCurrencyUpdate(
        eo.id,
        pair.id,
        txH.id,
        price,
        priceRaw,
        timestamp,
        height,
      )

      if (cuCreated) {
        console.log(new Date(), "inserted currency update - archive", cu.id)
      }
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
      if (height > l.height) {
        await l.update({ height })
      }
    }
  } catch (err) {
    console.error(new Date(), "ERROR:")
    console.error(err)
    console.error(event)
  }
}

module.exports = {
  cleanCurrencyUpdate7Day,
  processCurrencyUpdate,
}
