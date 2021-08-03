require("dotenv").config()
const _ = require("lodash/core")
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../../../utils")

const filter = [
  "ADA/BTC",
  "ADA/USDT",
  "ATOM/BTC",
  "ATOM/USDT",
  "BCH/BTC",
  "BCH/USDC",
  "BCH/USDT",
  "DOT/USDT",
  "EOS/BTC",
  "EOS/ETH",
  "EOS/USDT",
  "ETC/BTC",
  "ETC/ETH",
  "ETC/USDT",
  "ETH/BTC",
  "ETH/USDC",
  "ETH/USDT",
  "LINK/BTC",
  "LINK/ETH",
  "LINK/USDT",
  "LTC/BTC",
  "LTC/ETH",
  "LTC/USDT",
  "NEO/BTC",
  "NEO/ETH",
  "NEO/USDT",
  "TRX/BTC",
  "TRX/ETH",
  "TRX/USDT",
  "XLM/BTC",
  "XLM/ETH",
  "XLM/USDT",
  "XMR/BTC",
  "XMR/USDT",
  "XRP/BTC",
  "XRP/ETH",
  "XRP/USDT",
]

const getPrices = async () => {
  const final = []
  try {
    const url = `https://api.binance.com/api/v3/ticker/price`
    const response = await fetcher(url)

    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pA = pair.split("/")
      const base = pA[0]
      const target = pA[1]

      const d = _.find(Object.entries(response.json), function (o) {
        return o[1].symbol === `${base}${target}`
      })

      if (d) {
        const price = scientificToDecimal(d[1].price).toString()
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
  } catch (error) {
    console.error(new Date(), "ERROR:")
    console.error(error)
  }
  return final
}

module.exports = {
  getPrices,
}
