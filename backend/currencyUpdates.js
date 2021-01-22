const { CurrencyUpdates, CurrencyUpdates7Days, LastGethBlock, sequelize } = require("../common/db/models")
const { getOrAddPair } = require("./pairs")
const { getOrAddExchangeOracle } = require("./exchangeOracles")
const { getOrAddExchangePair } = require("./exchangePairs")
const { getOrAddTxHash } = require("./txHashes")

const getOrAddCurrencyUpdate = async (exchangeOracleId, pairId, txHashId, price, priceRaw, timestamp) => {
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
    },
  })
}

const getOrAddCurrencyUpdate7Day = async (exchangeOracleId, pairId, txHashId, price, priceRaw, timestamp) => {
  return CurrencyUpdates7Days.findOrCreate({
    where: {
      txHashId,
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

const cleanCurrencyUpdate7Day = async () => {
  const d = new Date()
  const oneWeekAgo = Math.floor(d / 1000) - 604800

  const [results, metadata] = await sequelize.query(
    `DELETE FROM "CurrencyUpdates7Days" WHERE timestamp <= '${oneWeekAgo}'`,
  )
  console.log(new Date(), "results", results)
  console.log(new Date(), "deleted", metadata.rowCount, "rows from CurrencyUpdates7Days")
}

// ideally to be run before the contract watcher starts
// if migrating from an existing database.
const copyCurrencyUpdate7Days = async () => {
  const d = new Date()
  const oneWeekAgo = Math.floor(d / 1000) - 604800

  const last = await CurrencyUpdates7Days.max("timestamp")

  if (isNaN(last)) {
    console.log(new Date(), "copy 7 days currency updates from", oneWeekAgo)

    const [results, metadata] = await sequelize.query(
      `INSERT INTO "CurrencyUpdates7Days" SELECT * FROM "CurrencyUpdates" WHERE timestamp >= '${oneWeekAgo}'`,
    )
    console.log(new Date(), "results", results)
    console.log(new Date(), "CurrencyUpdates: copied", metadata, "rows")

    // set auto increment ID
    if (metadata > 0) {
      const currId = await CurrencyUpdates7Days.max("id")
      console.log(new Date(), "set sequence to", currId)

      const [results1, metadata1] = await sequelize.query(
        `SELECT setval('public."CurrencyUpdates7Days_id_seq"', ${currId}, true)`,
      )

      console.log(new Date(), "results1", results1)
      console.log(new Date(), "metadata1", metadata1)
    }
  } else {
    console.log(new Date(), "CurrencyUpdates data already copied")
  }
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

    const d = new Date()
    const oneWeekAgo = Math.floor(d / 1000) - 604800

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

    const [txH, txCreated] = await getOrAddTxHash(txHash, height)
    if (txCreated) {
      console.log(new Date(), "added new tx hash", txHash, height, txH.id)
    }

    // full historical archive
    const [cu, cuCreated] = await getOrAddCurrencyUpdate(eo.id, pair.id, txH.id, price, priceRaw, timestamp)

    if (cuCreated) {
      console.log(new Date(), "inserted currency update - archive", cu.id)
    }

    // 7 day history for API
    if (parseInt(timestamp, 10) >= oneWeekAgo) {
      const [cu7d, cu7dCreated] = await getOrAddCurrencyUpdate7Day(
        eo.id,
        pair.id,
        txH.id,
        price,
        priceRaw,
        timestamp,
      )

      if (cu7dCreated) {
        console.log(new Date(), "inserted currency update - 7 day", cu7d.id)
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
  copyCurrencyUpdate7Days,
  processCurrencyUpdate,
}
