require("dotenv").config()
const _ = require("lodash/core")
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../../../utils")

const filter = [
  "ATOM/USDT",
  "BCH/BTC",
  "BCH/USDT",
  "BTC/USDT",
  "EOS/BTC",
  "EOS/ETH",
  "EOS/USDT",
  "ETC/BTC",
  "ETC/USDT",
  "ETH/BTC",
  "ETH/USDT",
  "FUND/BTC",
  "LINK/BTC",
  "LINK/USDT",
  "LTC/BTC",
  "LTC/USDT",
  "NEO/BTC",
  "NEO/USDT",
  "TRX/BTC",
  "TRX/USDT",
  "XLM/BTC",
  "XLM/USDT",
  "XRP/BTC",
  "XRP/USDT",
  "SHIB/USDT",
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base}-${target}`
  return { apiPairName, pair, base, target }
}

const getPrices = async () => {
  const final = []
  try {
    const pairList = []
    for (let i = 0; i < filter.length; i += 1) {
      const pairData = getPairData(filter[i])
      pairList.push(pairData.apiPairName)
    }
    const url = `https://api.probit.com/api/exchange/v1/ticker?market_ids=${pairList}`
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pairData = getPairData(pair)
      const base = pairData.base
      const target = pairData.target

      const d = _.find(Object.entries(response.json.data), function (o) {
        return o[1].market_id === pairData.apiPairName
      })

      if (d) {
        const price = scientificToDecimal(d[1].last).toString()
        const priceInt = Web3.utils.toWei(price, "ether")
        const timestamp = Math.floor(Date.parse(d[1].time) / 1000)
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
  } catch (err) {
    console.error(err)
  }
  return final
}

module.exports = {
  getPrices,
}
