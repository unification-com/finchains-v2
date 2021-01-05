const { ExchangePairs } = require("../common/db/models")

const getOrAddExchangePair = async (exchangeOracleId, pairId) => {
  return ExchangePairs.findOrCreate({
    where: {
      exchangeOracleId,
      pairId,
    },
  })
}

module.exports = {
  getOrAddExchangePair,
}
