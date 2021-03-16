require("dotenv").config()
const BN = require("bn.js")
const { Discrepancies, LastGethBlock, sequelize } = require("../common/db/models")
const { getOrAddPair } = require("./pairs")
const { getOrAddExchangeOracle } = require("./exchangeOracles")
const { getOrAddTxHash } = require("./txHashes")

const { FULL_ARCHIVE_MODE } = process.env

const getOrAddDiscrepancy = async (
  pairId,
  txHashId,
  exchangeOracle1Id,
  price1,
  timestamp1,
  exchangeOracle2Id,
  price2,
  timestamp2,
  threshold,
  diff,
  height,
) => {
  return Discrepancies.findOrCreate({
    where: {
      txHashId,
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
      height,
    },
  })
}

const cleanDiscrepancy7Day = async () => {
  const d = new Date()
  const oneWeekAgo = Math.floor(d / 1000) - 604800

  const [, metadata] = await sequelize.query(
    `DELETE FROM "Discrepancies" WHERE timestamp1 <= '${oneWeekAgo}'`,
  )
  console.log(new Date(), "deleted", metadata.rowCount, "rows from Discrepancies")
}

const processDiscrepancy = async (event) => {
  try {
    const fullArchive = parseInt(FULL_ARCHIVE_MODE, 10) === 1
    let addRecord = false

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

    const tsCheck = Math.min(parseInt(timestamp1, 10), parseInt(timestamp2, 10))

    if (fullArchive || tsCheck >= oneWeekAgo) {
      addRecord = true
    }

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

    if (addRecord) {
      const [txH, txCreated] = await getOrAddTxHash(txHash, height)
      if (txCreated) {
        console.log(new Date(), "added new tx hash", txHash, height, txH.id)
      }

      const p1Bn = new BN(price1)
      const p2Bn = new BN(price2)

      const diff = BN.max(p1Bn, p2Bn).sub(BN.min(p1Bn, p2Bn))

      const [d, dCreated] = await getOrAddDiscrepancy(
        pair.id,
        txH.id,
        eo1.id,
        price1,
        timestamp1,
        eo2.id,
        price2,
        timestamp2,
        threshold,
        diff.toString(),
        height,
      )

      if (dCreated) {
        console.log(new Date(), "inserted discrepancy", d.id)
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
  processDiscrepancy,
}
