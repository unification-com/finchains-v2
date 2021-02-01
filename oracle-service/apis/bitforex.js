require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

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
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `coin-${target.toLowerCase()}-${base.toLowerCase()}`
  return { apiPairName, pair, base, target }
}

// Example "coin-usdt-ada",

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
      const url = `https://api.bitforex.com/api/v1/market/ticker?symbol=${pairList[i]}`
      console.log(new Date(), "get", url)
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const base = pairLookup[pairList[i]].base
      const target = pairLookup[pairList[i]].target
      const price = scientificToDecimal(response.json.data.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.time
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
