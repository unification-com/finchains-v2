require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ADA/USDT",
  "BCH/EUR",
  "BCH/GBP",
  "BCH/USD",
  "BCH/USDT",
  "BTC/EUR",
  "BTC/GBP",
  "BTC/USD",
  "BTC/USDC",
  "BTC/USDT",
  "DOT/USDT",
  "EOS/ETH",
  "EOS/USDT",
  "ETC/ETH",
  "ETH/EUR",
  "ETH/GBP",
  "ETH/USD",
  "ETH/USDC",
  "ETH/USDT",
  "LINK/ETH",
  "LINK/EUR",
  "LINK/USD",
  "LINK/USDT",
  "LTC/ETH",
  "LTC/EUR",
  "LTC/GBP",
  "LTC/USD",
  "LTC/USDT",
  "TRX/ETH",
  "XLM/EUR",
  "XLM/USD",
  "XRP/ETH",
  "XRP/EUR",
  "XRP/GBP",
  "XRP/USD",
  "XRP/USDT",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base}${target}`
  return { apiPairName, pair, base, target }
}

// standardised function to get prices from an exchange's API
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
      const url = `https://api.kraken.com/0/public/Ticker?pair=${pairList[i]}`
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const res_pair = Object.keys(response.json.result)
      const base = pairLookup[pairList[i]].base
      const target = pairLookup[pairList[i]].target
      const price = scientificToDecimal(response.json.result[`${res_pair}`].c[0]).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = Math.floor(Date.parse(response.date) / 1000)
      const td = {
        base,
        target,
        pair: `${base}/${target}`,
        price,
        priceInt,
        timestamp,
      }
      final.push(td)
      console.log(final)
    }
    return final
  } catch (error) {
    console.error(error)
  }
}

const getPrices = async () => {
  await orgExchangeData()
}

module.exports = {
  getPrices,
}
