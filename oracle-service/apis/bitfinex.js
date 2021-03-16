require("dotenv").config()
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
  "LINK/BTC",
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

    // generate query URL
    const url = `https://api-pub.bitfinex.com/v2/tickers?symbols=${pairList}`
    console.log(new Date(), "get", url)

    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    for (let i = 0; i < response.json.length; i += 1) {
      const apiPairName = response.json[i][0]
      const base = pairLookup[apiPairName].base
      const target = pairLookup[apiPairName].target
      const pair = `${base}/${target}`
      const p = response.json[i][7]
      const price = scientificToDecimal(p).toString()
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
    return final
  } catch (err) {
    console.error(err)
    return []
  }
}

const getPrices = async () => {
  await orgExchangeData()
}

module.exports = {
  getPrices,
}
