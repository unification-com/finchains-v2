require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

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

const orgExchangeData = async () => {
  try {
    const final = []
    const pairList = []
    const pairLookup = {}
    for (let i = 0; i < filter.length; i += 1) {
      const pairData = getPairData(filter[i])
      pairList.push(pairData.apiPairName)
      pairLookup[pairData.apiPairName] = pairData
    }
    // Need to access Huobi api pair by pair to get "last price" data
    for (let i = 0; i < filter.length; i += 1) {
      const url = `https://www.bitstamp.net/api/v2/ticker/${pairList[i]}`
      console.log(new Date(), "get", url)

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const base = pairLookup[pairList[i]].base
      const target = pairLookup[pairList[i]].target
      const price = scientificToDecimal(response.json.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.timestamp
      const td = {
        base,
        target,
        pair: `${base}/${target}`,
        price,
        priceInt,
        timestamp,
      }
      final.push(td)
    }
    return final
  } catch (err) {
    console.error(err)
  }
}

const getPrices = async () => {
  await orgExchangeData()
}

module.exports = {
  getPrices,
}
