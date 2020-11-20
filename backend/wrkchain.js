const { WrkchainBlocks } = require("../common/db/models")
const { getWrkChainInfo, getTx, submitWrkChainHash } = require("../common/mainchain")

const sleepFor = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getOrAddWrkchaiSubmission = async (height, mainchainTx, timestamp) => {
  return WrkchainBlocks.findOrCreate({
    where: {
      height,
      mainchainTx,
    },
    defaults: {
      height,
      mainchainTx,
      timestamp,
    },
  })
}

const processWrkchainBlock = async (data) => {
  const { WRKCHAIN_ID } = process.env
  const nthBlock = process.env.NTH_BLOCK || 4
  const blockHeight = Number(data.number)
  const hash = data.hash
  const parentHash = data.parentHash
  console.log(new Date(), "got", blockHeight)
  if (blockHeight % parseInt(nthBlock, 10) === 0) {
    // submit WRKChain hashes
    console.log(new Date(), "submit WRKChain hashes")
    try {
      const wrkchainInfo = await getWrkChainInfo()
      if ("result" in wrkchainInfo) {
        if (
          parseInt(wrkchainInfo.result.wrkchain_id, 10) === parseInt(WRKCHAIN_ID, 10) &&
          (blockHeight > parseInt(wrkchainInfo.result.lastblock, 10) ||
            parseInt(wrkchainInfo.result.num_blocks, 10) === 0)
        ) {
          console.log(new Date(), "height", blockHeight, "hash", hash, "parentHash", parentHash)
          const now = new Date()
          const timestamp = Math.round(now.getTime() / 1000)
          const txHash = await submitWrkChainHash(blockHeight, hash, parentHash)

          console.log(new Date(), "txHash", txHash)
          await sleepFor(7000)
          if (txHash.length > 0) {
            const tx = await getTx(txHash)
            if (tx) {
              const [wrkchainBlock, wrkchainBlockCreated] = await getOrAddWrkchaiSubmission(
                blockHeight,
                txHash,
                timestamp,
              )
              if (wrkchainBlockCreated) {
                console.log(new Date(), "added new WrkChain block to db")
              } else {
                console.log(new Date(), "WrkChain block already in db", wrkchainBlock)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(new Date(), "ERROR:")
      console.error(error)
    }
  }
}

module.exports = {
  processWrkchainBlock,
}
