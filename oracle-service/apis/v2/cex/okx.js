require("dotenv").config()
const _ = require("lodash/core")
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../../../utils")

const filter = [
  "ATOM/USDT",
  "BCH/USDT",
  "BTC/USDT",
  "BTC/USDC",
  "EOS/USDT",
  "ETC/USDT",
  "DOT/USDT",
  "ETH/USDT",
  "LINK/USDT",
  "LTC/USDT",
  "TRX/USDT",
  "SHIB/USDT",
  "BONE/USDT",
  "LEASH/USDT",
  "ADA/USDT",
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

    // generate query URL
    const url = `https://www.okx.com/api/v5/market/tickers?instType=SPOT`
    const response = await fetcher(url)

    for (let i = 0; i < filter.length; i += 1) {
      const pair = filter[i]
      const pairData = getPairData(pair)
      const d = _.find(response.json.data, function (o) {
        return o.instId === pairData.apiPairName
      })

      if (d) {
        const base = pairData.base
        const target = pairData.target
        const price = scientificToDecimal(d.last).toString()
        const priceInt = Web3.utils.toWei(price, "ether")
        const timestamp = Math.floor(parseInt(d.ts, 10) / 1000)
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
  } catch (error) {
    console.error(new Date(), "ERROR:")
    console.error(error)
  }

  return final
}

module.exports = {
  getPrices,
}
