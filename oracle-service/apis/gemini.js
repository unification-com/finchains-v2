require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

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
    for (let i = 0; i < filter.length; i += 1) {
      const url = `https://api.gemini.com/v1/pubticker/${pairList[i]}`
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)

      console.log(new Date(), "get", url)

      const base = pairLookup[pairList[i]].base
      const target = pairLookup[pairList[i]].target
      const price = scientificToDecimal(response.json.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.volume.timestamp
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
  console.log(await orgExchangeData())
}

module.exports = {
  getPrices,
}