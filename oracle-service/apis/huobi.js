require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

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
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base.toLowerCase()}${target.toLowerCase()}`
  return { apiPairName, pair, base, target }
}

// get data
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
    // Iterate through filter array of pairs
    for (let i = 0; i < filter.length; i += 1) {
   
      const url = `https://api.huobi.pro/market/trade?symbol=${pairList[i]}`
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)

      console.log(new Date(), "get", url)

      const base = pairLookup[pairList[i]].base
      const target = pairLookup[pairList[i]].target
      const price = scientificToDecimal(response.json.tick.data[0].price).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.tick.data[0].ts
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

getPrices()
module.exports = {
  getPrices,
}
