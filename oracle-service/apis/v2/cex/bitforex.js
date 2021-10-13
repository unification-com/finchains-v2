require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher, sleepFor } = require("../../../utils")

const filter = [
  "ADA/USDT",
  "ATOM/USDT",
  "BCH/BTC",
  "BCH/USDT",
  "BTC/USDT",
  "DOT/USDT",
  "EOS/BTC",
  "EOS/USDT",
  "ETH/BTC",
  "ETH/USDT",
  "FUND/BTC",
  "FUND/ETH",
  "FUND/USDT",
  "LINK/BTC",
  "LINK/ETH",
  "LTC/USDT",
  "NEO/USDT",
  "TRX/BTC",
  "TRX/USDT",
  "XLM/USDT",
  "XRP/BTC",
  "XRP/USDT",
  "SHIB/USDT",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `coin-${target.toLowerCase()}-${base.toLowerCase()}`
  return { apiPairName, pair, base, target }
}

// Example "coin-usdt-ada",

const getPrices = async () => {
  const final = []
  for (let i = 0; i < filter.length; i += 1) {
    const pair = filter[i]
    const pairData = getPairData(pair)
    const url = `https://api.bitforex.com/api/v1/market/ticker?symbol=${pairData.apiPairName}`
    try {
      const response = await fetcher(url)
      const base = pairData.base
      const target = pairData.target
      const price = scientificToDecimal(response.json.data.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = Math.floor(parseInt(response.json.time, 10) / 1000)
      const td = {
        base,
        target,
        pair,
        price,
        priceInt,
        timestamp,
      }
      final.push(td)
    } catch (error) {
      console.error(new Date(), "ERROR:")
      console.error(error)
    }
    await sleepFor(200)
  }

  return final
}

module.exports = {
  getPrices,
}
