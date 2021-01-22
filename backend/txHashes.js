const { TxHashes } = require("../common/db/models")

const getOrAddTxHash = async (txHash, height) => {
  return TxHashes.findOrCreate({
    where: {
      txHash,
    },
    defaults: {
      height,
    },
  })
}

module.exports = {
  getOrAddTxHash,
}
