require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ATOM-USDT",
  "BCH-BTC",
  "BCH-USDT",
  "BTC-USDT",
  "EOS-BTC",
  "EOS-ETH",
  "EOS-USDT",
  "ETC-BTC",
  "ETC-USDT",
  "ETH-BTC",
  "ETH-USDT",
  "FUND-BTC",
  "LINK-BTC",
  "LINK-USDT",
  "LTC-BTC",
  "LTC-USDT",
  "NEO-BTC",
  "NEO-USDT",
  "TRX-BTC",
  "TRX-USDT",
  "XLM-BTC",
  "XLM-USDT",
  "XRP-BTC",
  "XRP-USDT",
]

const orgExchangeData = async () => {
  try {
    const final = []
    const filter_list = filter.join("%2C")
    const url = `https://api.probit.com/api/exchange/v1/ticker?market_ids=${filter_list}`
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    for (let i = 0; i < filter.length; i += 1) {
      const base = filter[i].split("-", 1)[0]
      const target = filter[i].split("-", 2)[1]
      const price = scientificToDecimal(response.json.data[i].last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = Math.floor(Date.parse(response.json.data[i].time) / 1000)
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
