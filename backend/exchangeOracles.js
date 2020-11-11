const { ExchangeOracles } = require("../common/db/models")

const getOrAddExchangeOracle = async (address, exchange) => {
  return ExchangeOracles.findOrCreate({
    where: {
      address,
      exchange,
    },
  })
}

module.exports = {
  getOrAddExchangeOracle,
}
