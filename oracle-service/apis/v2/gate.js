require("dotenv").config()
const _ = require("lodash/core")
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../../utils")

// standardised function to get prices from an exchange's API
const filter = [
  "ADA/BTC",
  "ADA/USDT",
  "ATOM/BTC",
  "ATOM/USDT",
  "BCH/BTC",
  "BCH/USDT",
  "BTC/PAX",
  "BTC/USDC",
  "BTC/USDT",
  "DOT/USDT",
  "EOS/BTC",
  "EOS/ETH",
  "EOS/USDT",
  "ETC/BTC",
  "ETC/ETH",
  "ETC/USDT",
  "ETH/BTC",
  "ETH/USDT",
  "LINK/ETH",
  "LINK/USDT",
  "LTC/BTC",
  "LTC/USDT",
  "NEO/BTC",
  "NEO/USDT",
  "TRX/ETH",
  "TRX/USDT",
  "XLM/BTC",
  "XLM/ETH",
  "XLM/USDT",
  "XMR/BTC",
  "XMR/USDT",
  "XRP/BTC",
  "XRP/USDT",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base}_${target}`
  return { apiPairName, pair, base, target }
}

const getPrices = async () => {
  const final = []
  try {
    const url = "https://api.gateio.ws/api/v4/spot/tickers"
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)

    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pairData = getPairData(pair)
      const base = pairData.base
      const target = pairData.target

      const d = _.find(Object.entries(response.json), function (o) {
        return o[1].currency_pair === pairData.apiPairName
      })

      if (d) {
        const price = scientificToDecimal(d[1].last).toString()
        const priceInt = Web3.utils.toWei(price, "ether")
        const timestamp = Math.floor(Date.parse(response.date) / 1000)
        const td = {
          base,
          target,
          pair,
          price,
          priceInt,
          timestamp,
        }
        final.push(td)
      }
    }
  } catch (err) {
    console.error(err)
  }
  return final
}

module.exports = {
  getPrices,
}
