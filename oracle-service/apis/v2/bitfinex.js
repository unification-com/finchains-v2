require("dotenv").config()
const _ = require("lodash/core")
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ADA/UST",
  "ADA/BTC",
  "BCHABC/USD",
  "BCHN/USD",
  "BTC/UST",
  "BTC/USD",
  "EOS/UST",
  "EOS/ETH",
  "EOS/BTC",
  "DOT/UST",
  "ETC/BTC",
  "ETC/USD",
  "ETH/BTC",
  "ETH/EUR",
  "ETH/GBP",
  "ETH/USD",
  "ETH/UST",
  "LINK/UST",
  "LINK/USD",
  "LTC/BTC",
  "LTC/USD",
  "LTC/UST",
  "NEO/BTC",
  "NEO/ETH",
  "TRX/BTC",
  "TRX/ETH",
  "XLM/BTC",
  "XLM/ETH",
  "XLM/USD",
  "XMR/BTC",
  "XMR/USD",
  "XRP/BTC",
  "XRP/USD",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  let target = pair.split("/", 2)[1]
  let apiPairName
  switch (base) {
    case "LINK":
    case "BCHABC":
    case "BCHN":
      apiPairName = `t${base}:${target}`
      break
    default:
      apiPairName = `t${base}${target}`
      break
  }
  // cleanse/standardise
  if (target === "UST") {
    target = "USDT"
  }
  return { apiPairName, pair, base, target }
}

const getPrices = async () => {
  const final = []
  try {
    const pairList = []
    for (let i = 0; i < filter.length; i += 1) {
      const pairData = getPairData(filter[i])
      pairList.push(pairData.apiPairName)
    }

    // generate query URL
    const url = `https://api-pub.bitfinex.com/v2/tickers?symbols=${pairList}`
    const response = await fetcher(url)
    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pairData = getPairData(pair)
      const d = _.find(response.json, function (o) {
        return o[0] === pairData.apiPairName
      })

      if (d) {
        const base = pairData.base
        const target = pairData.target
        const price = scientificToDecimal(d[7]).toString()
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
