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
const orgExchangeData = async () => {
  try {
    const final = []
    let base
    let target

    for (let i = 0; i < filter.length; i += 1) {
      base = filter[i].split("/", 1)[0]
      target = filter[i].split("/", 2)[1]
      pair = base + target

      const url = `https://api.binance.com/api/v3/trades?symbol=${pair}`
      console.log(new Date(), "get", url)

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const res_select = response.json[499]
      const price = scientificToDecimal(res_select.price).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = res_select.time
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
