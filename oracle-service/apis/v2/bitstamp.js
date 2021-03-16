require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher, sleepFor } = require("../utils")

const filter = [
  "BTC/USD",
  "BTC/EUR",
  "BTC/GBP",
  "BTC/USDC",
  "XRP/USD",
  "XRP/EUR",
  "XRP/BTC",
  "XRP/GBP",
  "LTC/USD",
  "LTC/EUR",
  "LTC/BTC",
  "LTC/GBP",
  "ETH/USD",
  "ETH/EUR",
  "ETH/BTC",
  "ETH/GBP",
  "ETH/USDC",
  "BCH/USD",
  "BCH/EUR",
  "BCH/BTC",
  "BCH/GBP",
  "XLM/BTC",
  "XLM/USD",
  "XLM/EUR",
  "XLM/GBP",
  "LINK/USD",
  "LINK/EUR",
  "LINK/GBP",
  "LINK/BTC",
  "LINK/ETH",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base.toLowerCase()}${target.toLowerCase()}`
  return { apiPairName, pair, base, target }
}

const getPrices = async () => {
  const final = []

  // Need to access bitstamp api pair by pair to get "last price" data
  for (let i = 0; i < filter.length; i += 1) {
    const pair = filter[i]
    const pairData = getPairData(pair)
    try {
      const url = `https://www.bitstamp.net/api/v2/ticker/${pairData.apiPairName}`

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const base = pairData.base
      const target = pairData.target
      const price = scientificToDecimal(response.json.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.timestamp
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
    await sleepFor(200)
  }
  return final
}

module.exports = {
  getPrices,
}
