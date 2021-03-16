require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ADA/BTC",
  "ADA/USDT",
  "ATOM/BTC",
  "ATOM/USDT",
  "BCH/BTC",
  "BCH/USDC",
  "BCH/USDT",
  "DOT/USDT",
  "EOS/BTC",
  "EOS/ETH",
  "EOS/USDT",
  "ETC/BTC",
  "ETC/ETH",
  "ETC/USDT",
  "ETH/BTC",
  "ETH/USDC",
  "ETH/USDT",
  "LINK/BTC",
  "LINK/ETH",
  "LINK/USDT",
  "LTC/BTC",
  "LTC/ETH",
  "LTC/USDT",
  "NEO/BTC",
  "NEO/ETH",
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
  "XRP/ETH",
  "XRP/USDT",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = base + target
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
    const url = `https://api.binance.com/api/v3/ticker/price`
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    console.log(new Date(), "get", url)
    const res_arr = Object.entries(response.json)
    for (let i = 0; i < pairList.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of res_arr) {
        if (value.symbol === pairList[i]) {
          const match = pairLookup[value.symbol]
          const base = match.base
          const target = match.target
          const price = scientificToDecimal(value.price).toString()
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
        }
      }
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
