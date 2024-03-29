require("dotenv").config()
const _ = require("lodash/core")
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../../../utils")

const filter = [
  "ADA/USDT",
  "ATOM/BTC",
  "ATOM/USDT",
  "BCH/BTC",
  "BCH/USDT",
  "BTC/USDC",
  "BTC/USDT",
  "DOT/USDT",
  "EOS/BTC",
  "EOS/USDT",
  "ETH/BTC",
  "ETH/USDT",
  "LINK/BTC",
  "LINK/USDT",
  "LTC/BTC",
  "LTC/USDT",
  "NEO/BTC",
  "NEO/USDT",
  "XLM/BTC",
  "XLM/USDT",
  "XRP/BTC",
  "XRP/USDT",
  "BONE/USDT",
  "SHIB/USDT",
  "FUND/USDT",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base.toLowerCase()}_${target.toLowerCase()}`
  return { apiPairName, pair, base, target }
}

const getPrices = async () => {
  const final = []
  try {
    const url = "https://sapi.xt.com/v4/public/ticker/price"

    const response = await fetcher(url)

    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pairData = getPairData(pair)
      const base = pairData.base
      const target = pairData.target

      const d = _.find(response.json.result, function (o) {
        return o.s === pairData.apiPairName
      })

      if (d) {
        const price = scientificToDecimal(d.p).toString()
        const priceInt = Web3.utils.toWei(price, "ether")
        const timestamp = Math.floor(d.t / 1000)
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
