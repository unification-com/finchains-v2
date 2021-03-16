require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher, sleepFor } = require("../utils")

const filter = [
  "BCH/BTC",
  "BCH/USD",
  "BTC/EUR",
  "BTC/GBP",
  "BTC/USD",
  "ETH/BTC",
  "ETH/EUR",
  "ETH/GBP",
  "ETH/USD",
  "LINK/BTC",
  "LINK/ETH",
  "LINK/USD",
  "LTC/BTC",
  "LTC/ETH",
  "LTC/USD",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base.toLowerCase()}${target.toLowerCase()}`
  return { apiPairName, pair, base, target }
}

const getPrices = async () => {
  const final = []
  try {
    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pairData = getPairData(pair)
      const base = pairData.base
      const target = pairData.target
      const url = `https://api.gemini.com/v1/pubticker/${pairData.apiPairName}`
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)

      const price = scientificToDecimal(response.json.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.volume.timestamp
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