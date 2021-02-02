const { CurrencyUpdates, Discrepancies, TxHashes, sequelize } = require("../common/db/models")

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

const cleanTxHash7Day = async () => {
  let cMinHeight = await CurrencyUpdates.min("height")
  let dMinHeight = await Discrepancies.min("height")

  if (isNaN(cMinHeight)) {
    cMinHeight = 0
  }

  if (isNaN(dMinHeight)) {
    dMinHeight = 0
  }

  let delHeight = 0
  if (cMinHeight === 0 || dMinHeight === 0) {
    delHeight = Math.max(cMinHeight, dMinHeight)
  } else {
    delHeight = Math.min(cMinHeight, dMinHeight)
  }

  console.log(new Date(), "cMinHeight", cMinHeight, "dMinHeight", dMinHeight, "delHeight", delHeight)

  if (delHeight > 0) {
    const [, metadata] = await sequelize.query(`DELETE FROM "TxHashes" WHERE height < '${delHeight}'`)
    console.log(new Date(), "deleted", metadata.rowCount, "rows from TxHashes")
  }
}

module.exports = {
  cleanTxHash7Day,
  getOrAddTxHash,
}
