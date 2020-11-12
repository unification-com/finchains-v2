const BN = require("bn.js")
const { Discrepancies, LastGethBlock } = require("../common/db/models")
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
      console.log(new Date(), "inserted discrepancy", d.id)
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
      await l.update({ height })
    }
  } catch (err) {
    console.error(new Date(), "ERROR:")
    console.error(err)
    console.error(event)
  }
}

module.exports = {
  processDiscrepancy,
}
