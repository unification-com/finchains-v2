require("dotenv").config()
const _ = require("lodash/core")
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../../utils")

const filter = [
  "ADA/BTC",
  "ADA/USDT",
  "ATOM/BTC",
  "ATOM/USDT",
  "BCH/BTC",
  "BCH/EUR",
  "BCH/USD",
  "BCH/USDT",
  "BTC/EUR",
  "BTC/USD",
  "BTC/USDT",
  "DOT/USDT",
  "EOS/BTC",
  "EOS/ETH",
  "EOS/USDT",
  "ETC/BTC",
  "ETC/ETH",
  "ETC/USDT",
  "ETH/BTC",
  "ETH/EUR",
  "ETH/USD",
  "ETH/USDT",
  "LINK/BTC",
  "LINK/ETH",
  "LINK/USD",
  "LINK/USDT",
  "LTC/BTC",
  "LTC/ETH",
  "LTC/USD",
  "LTC/USDT",
  "NEO/BTC",
  "NEO/ETH",
  "NEO/USDT",
  "TRX/BTC",
  "TRX/ETH",
  "TRX/USDT",
  "XLM/BTC",
  "XLM/ETH",
  "XLM/EUR",
  "XLM/USD",
  "XLM/USDT",
  "XMR/BTC",
  "XMR/USDT",
  "XRP/BTC",
  "XRP/ETH",
  "XRP/EUR",
  "XRP/USD",
  "XRP/USDT",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${target}-${base}`
  return { apiPairName, pair, base, target }
}

const getPrices = async () => {
  const final = []
  try {
    const url = "https://api.bittrex.com/api/v1.1/public/getmarketsummaries"
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)

    const res_arr = response.json.result

    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pairData = getPairData(pair)
      const base = pairData.base
      const target = pairData.target

      const d = _.find(res_arr, function (o) {
        return o.MarketName === pairData.apiPairName
      })

      if (d) {
        const price = scientificToDecimal(d.Last).toString()
        const priceInt = Web3.utils.toWei(price, "ether")
        const time = d.TimeStamp
        const timestamp = Math.floor(Date.parse(time) / 1000)
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
    }
  } catch (err) {
    console.error(err)
  }

  return final
}

module.exports = {
  getPrices,
}
