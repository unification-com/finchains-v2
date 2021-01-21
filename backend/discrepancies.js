const BN = require("bn.js")
const { Discrepancies, Discrepancies7Days, LastGethBlock, sequelize } = require("../common/db/models")
const { getOrAddPair } = require("./pairs")
const { getOrAddExchangeOracle } = require("./exchangeOracles")

const getOrAddDiscrepancy = async (
  pairId,
  txHash,
  exchangeOracle1Id,
  price1,
  timestamp1,
  exchangeOracle2Id,
  price2,
  timestamp2,
  threshold,
  diff,
) => {
  return Discrepancies.findOrCreate({
    where: {
      txHash,
      pairId,
      exchangeOracle1Id,
      exchangeOracle2Id,
    },
    defaults: {
      pairId,
      exchangeOracle1Id,
      price1,
      timestamp1,
      exchangeOracle2Id,
      price2,
      timestamp2,
      threshold,
      diff,
    },
  })
}

const getOrAddDiscrepancy7Day = async (
  pairId,
  txHash,
  exchangeOracle1Id,
  price1,
  timestamp1,
  exchangeOracle2Id,
  price2,
  timestamp2,
  threshold,
  diff,
) => {
  return Discrepancies7Days.findOrCreate({
    where: {
      txHash,
      pairId,
      exchangeOracle1Id,
      exchangeOracle2Id,
    },
    defaults: {
      pairId,
      exchangeOracle1Id,
      price1,
      timestamp1,
      exchangeOracle2Id,
      price2,
      timestamp2,
      threshold,
      diff,
    },
  })
}

const cleanDiscrepancy7Day = async () => {
  const d = new Date()
  const oneWeekAgo = Math.floor(d / 1000) - 604800

  const [results, metadata] = await sequelize.query(
    `DELETE FROM "Discrepancies7Days" WHERE timestamp1 <= '${oneWeekAgo}'`,
  )
  console.log(new Date(), "results", results)
  console.log(new Date(), "deleted", metadata.rowCount, "rows from Discrepancies7Days")
}

// ideally to be run before the contract watcher starts
// if migrating from an existing database.
const copyDiscrepancies7Days = async () => {
  const d = new Date()
  const oneWeekAgo = Math.floor(d / 1000) - 604800

  // to continue from an interrupted copy
  const last = await Discrepancies7Days.max("timestamp1")

  if (isNaN(last)) {
    console.log(new Date(), "copy 7 days discrepancies from", oneWeekAgo)

    const [results, metadata] = await sequelize.query(
      `INSERT INTO "Discrepancies7Days" SELECT * FROM "Discrepancies" WHERE timestamp1 >= '${oneWeekAgo}'`,
    )
    console.log(new Date(), "results", results)
    console.log(new Date(), "Discrepancies: copied", metadata, "rows")

    // set auto increment ID
    if (metadata > 0) {
      const currId = await Discrepancies7Days.max("id")
      console.log(new Date(), "set sequence to", currId)

      const [results1, metadata1] = await sequelize.query(
        `SELECT setval('public."Discrepancies7Days_id_seq"', ${currId}, true)`,
      )

      console.log(new Date(), "results1", results1)
      console.log(new Date(), "metadata1", metadata1)
    }
  } else {
    console.log(new Date(), "Discrepancies data already copied")
  }
}

const processDiscrepancy = async (event) => {
  try {
    const height = event.blockNumber
    const txHash = event.transactionHash
    const pairName = event.returnValues.pair
    const oracle1 = event.returnValues.oracle1
    const price1 = event.returnValues.price1
    const timestamp1 = event.returnValues.timestamp1
    const exchange1 = event.returnValues.exchange1
    const oracle2 = event.returnValues.oracle2
    const price2 = event.returnValues.price2
    const timestamp2 = event.returnValues.timestamp2
    const exchange2 = event.returnValues.exchange2
    const threshold = event.returnValues.threshold

    const today = new Date()
    const oneWeekAgo = Math.floor(today / 1000) - 604800

    const [pair, pairCreated] = await getOrAddPair(pairName)
    if (pairCreated) {
      console.log(new Date(), "added new pair", pairName, pair.id)
    }
    const [eo1, eoCreated1] = await getOrAddExchangeOracle(oracle1, exchange1)
    if (eoCreated1) {
      console.log(new Date(), "added new exchange oracle", exchange1, oracle1, eo1.id)
    }
    const [eo2, eoCreated2] = await getOrAddExchangeOracle(oracle2, exchange2)
    if (eoCreated2) {
      console.log(new Date(), "added new exchange oracle", exchange2, oracle2, eo2.id)
    }

    const p1Bn = new BN(price1)
    const p2Bn = new BN(price2)

    const diff = BN.max(p1Bn, p2Bn).sub(BN.min(p1Bn, p2Bn))

    // full historical archive
    const [d, dCreated] = await getOrAddDiscrepancy(
      pair.id,
      txHash,
      eo1.id,
      price1,
      timestamp1,
      eo2.id,
      price2,
      timestamp2,
      threshold,
      diff.toString(),
    )

    if (dCreated) {
      console.log(new Date(), "inserted discrepancy - archive", d.id)
    }

    // 7 day history for API
    if (parseInt(timestamp1, 10) >= oneWeekAgo) {
      const [dyDay, d7DayCreated] = await getOrAddDiscrepancy7Day(
        pair.id,
        txHash,
        eo1.id,
        price1,
        timestamp1,
        eo2.id,
        price2,
        timestamp2,
        threshold,
        diff.toString(),
      )

      if (d7DayCreated) {
        console.log(new Date(), "inserted discrepancy - 7 day", dyDay.id)
      }
    }

    const [l, lCreated] = await LastGethBlock.findOrCreate({
      where: {
        event: "Discrepancy",
      },
      defaults: {
        event: "Discrepancy",
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
  cleanDiscrepancy7Day,
  copyDiscrepancies7Days,
  processDiscrepancy,
}
