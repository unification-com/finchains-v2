require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher, sleepFor } = require("../../../utils")

const filter = [
  "ATOM/USDT",
  "ATOM/BTC",
  "BCH/BTC",
  "BCH/USDT",
  "BTC/USDT",
  "BTC/USDC",
  "EOS/USDT",
  "ETC/USDT",
  "DOT/USDT",
  "ETH/BTC",
  "ETH/USDT",
  "LINK/BTC",
  "LINK/ETH",
  "LINK/USDT",
  "LTC/USDT",
  "LTC/BTC",
  "LTC/ETH",
  "NEO/USDT",
  "NEO/ETH",
  "TRX/BTC",
  "TRX/USDT",
  "TRX/ETH",
  "XLM/USDT",
  "XLM/BTC",
  "XLM/ETH",
  "SHIB/USDT",
  "BONE/USDT",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base}_${target}`
  return { apiPairName, pair, base, target }
}

const getPrices = async () => {
  const final = []

  for (let i = 0; i < filter.length; i += 1) {
    const pair = filter[i]
    const pairData = getPairData(pair)
    try {
      const url = `https://api-cloud.bitmart.com/spot/quotation/v3/ticker?symbol=${pairData.apiPairName}`

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const base = pairData.base
      const target = pairData.target
      const price = scientificToDecimal(response.json.data.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = parseInt(response.json.data.ts, 10)
      const td = {
        base,
        target,
        pair,
        price,
        priceInt,
        timestamp,
      }
      final.push(td)
    } catch (err) {
      console.error(err)
    }
    await sleepFor(300)
  }
  return final
}

module.exports = {
  getPrices,
}
