require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher, sleepFor } = require("../../../utils")

const filter = [
  "ADA/BTC",
  "ADA/USDT",
  "ATOM/BTC",
  "ATOM/USDT",
  "BCH/BTC",
  "BCH/USDT",
  "BTC/USDT",
  "DOT/USDT",
  "EOS/BTC",
  "EOS/ETH",
  "EOS/USDT",
  "ETC/BTC",
  "ETC/USDT",
  "ETH/BTC",
  "ETH/USDT",
  "LINK/BTC",
  "LINK/ETH",
  "LINK/USDT",
  "LTC/BTC",
  "LTC/USDT",
  "NEO/BTC",
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
  "XRP/USDT",
  "SHIB/USDT",
  "BONE/USDT",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base.toLowerCase()}${target.toLowerCase()}`
  return { apiPairName, pair, base, target }
}

// get data
const getPrices = async () => {
  const final = []
  try {
    // Iterate through filter array of pairs
    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pairData = getPairData(pair)
      const base = pairData.base
      const target = pairData.target
      const url = `https://api.huobi.pro/market/trade?symbol=${pairData.apiPairName}`

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)

      const price = scientificToDecimal(response.json.tick.data[0].price).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = Math.floor(parseInt(response.json.tick.data[0].ts, 10) / 1000)
      const td = {
        base,
        target,
        pair,
        price,
        priceInt,
        timestamp,
      }
      final.push(td)
      await sleepFor(200)
    }
  } catch (err) {
    console.error(err)
  }
  return final
}

module.exports = {
  getPrices,
}
