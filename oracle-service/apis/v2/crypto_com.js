require("dotenv").config()
const _ = require("lodash/core")
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ADA/BTC",
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
    const url = "https://uat-api.3ona.co/v2/public/get-ticker"

    const response = await fetcher(url)

    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pairData = getPairData(pair)
      const base = pairData.base
      const target = pairData.target

      const d = _.find(Object.entries(response.json.result.data), function (o) {
        return o[1].i === pairData.apiPairName
      })

      if (d) {
        const price = scientificToDecimal(d[1].a).toString()
        const priceInt = Web3.utils.toWei(price, "ether")
        const timestamp = d[1].t
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
