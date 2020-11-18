const Web3 = require("web3")
const BN = require("bn.js")
const { Pairs, Discrepancies } = require("../common/db/models")

const discMean = async () => {
  Pairs.findAll({
    attributes: ["id", "name", "base", "target"],
    order: [["name", "ASC"]],
  })
    .then(async (pairData) => {
      const processedData = []
      if (pairData) {
        for (let i = 0; i < pairData.length; i += 1) {
          const pairId = pairData[i].id
          const name = pairData[i].name
          const base = pairData[i].base
          const target = pairData[i].target
          let max = new BN("0")
          const minWei = Web3.utils.toWei("1000000", "ether")
          let min = new BN(minWei)
          let total = new BN("0")
          let mean = new BN("1")
          const descRes = await Discrepancies.findAll({
            attributes: ["diff"],
            where: { pairId },
            order: [["timestamp1", "DESC"]],
          })

          if(descRes.length > 0) {
            for (let j = 0; j < descRes.length; j += 1) {
              const diff = new BN(descRes[j].diff)
              if (diff.gt(max)) {
                max = diff.clone()
              }
              if (diff.lt(min)) {
                min = diff.clone()
              }
              total = total.add(diff)
            }
            mean = total.div(new BN(String(descRes.length)))
          } else {
            max = new BN("1")
            min = new BN("1")
          }

          const d = {
            pair: name,
            base,
            target,
            minBn: min.toString(),
            maxBn: max.toString(),
            min: Web3.utils.fromWei(min),
            max: Web3.utils.fromWei(max),
            mean: Web3.utils.fromWei(mean),
            num: descRes.length,
          }

          processedData.push(d)
        }
      }
      console.log(JSON.stringify(processedData))
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(0)
    })
}

discMean()
