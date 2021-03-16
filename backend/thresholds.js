const BN = require("bn.js")
const Web3 = require("web3")
const { Discrepancies, Pairs } = require("../common/db/models")

const calculateThresholds = async () => {
  const pairs = await Pairs.findAll({
    attributes: ["id"],
    order: [
      ["base", "ASC"],
      ["target", "ASC"],
    ],
  })

  const numToUse = 100

  const thresholds = []

  for (let i = 0; i < pairs.length; i += 1) {
    let maxBn = new BN(0)
    let total = new BN(0)
    let minBn = new BN("1000000000000000000000000000000000000000")
    const discRes = await Discrepancies.findAll({
      attributes: ["price1", "price2", "diff", "timestamp1", "timestamp2", "threshold"],
      include: [{ model: Pairs, attributes: ["name", "base", "target"] }],
      where: { pairId: pairs[i].id },
      order: [["timestamp1", "DESC"]],
      limit: numToUse,
      raw: true,
    })
    if (discRes.length > 0) {
      for (let j = 0; j < discRes.length; j += 1) {
        const diff = new BN(discRes[j].diff)
        total = total.add(diff)
        if (diff.gt(maxBn)) {
          maxBn = diff
        }
        if (diff.lt(minBn)) {
          minBn = diff
        }
      }
      const min = Web3.utils.fromWei(minBn)
      const max = Web3.utils.fromWei(maxBn)
      const meanBn = total.div(new BN(numToUse))
      const mean = Web3.utils.fromWei(meanBn)
      const halfMaxBn = maxBn.div(new BN(2))
      const halfMax = Web3.utils.fromWei(halfMaxBn)
      const d = {
        pair: discRes[0]["Pair.name"],
        base: discRes[0]["Pair.base"],
        target: discRes[0]["Pair.target"],
        minBn: minBn.toString(),
        maxBn: maxBn.toString(),
        min,
        max,
        meanBn: meanBn.toString(),
        mean,
        halfMaxBn: halfMaxBn.toString(),
        halfMax,
      }
      thresholds.push(d)
    }
  }

  console.log(thresholds)
}

module.exports = {
  calculateThresholds,
}
