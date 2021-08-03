require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher, sleepFor } = require("../../../utils")

const filter = [
  "ATOM/BTC",
  "BCH/BTC",
  "BCH/EUR",
  "BCH/GBP",
  "BCH/USD",
  "BTC/EUR",
  "BTC/GBP",
  "BTC/USD",
  "BTC/USDC",
  "EOS/BTC",
  "ETC/BTC",
  "ETH/BTC",
  "ETH/EUR",
  "ETH/GBP",
  "ETH/USD",
  "ETH/USDC",
  "LINK/BTC",
  "LINK/ETH",
  "LINK/EUR",
  "LINK/GBP",
  "LINK/USD",
  "LTC/BTC",
  "LTC/EUR",
  "LTC/GBP",
  "LTC/USD",
  "XLM/BTC",
  "XLM/EUR",
  "XLM/USD",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base}-${target}`
  return { apiPairName, pair, base, target }
}

const getPrices = async () => {
  const final = []

  for (let i = 0; i < filter.length; i += 1) {
    const pair = filter[i]
    const pairData = getPairData(pair)
    const base = pairData.base
    const target = pairData.target

    try {
      const url = `https://api.pro.coinbase.com/products/${pairData.apiPairName}/ticker`

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const price = scientificToDecimal(response.json.price).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = Math.floor(Date.parse(response.json.time) / 1000)
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
