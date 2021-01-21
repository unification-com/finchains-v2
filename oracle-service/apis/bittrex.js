require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "BTC-ADA",
  "USDT-ADA",
  "BTC-ATOM",
  "USDT-ATOM",
  "BTC-BCH",
  "EUR-BCH",
  "USD-BCH",
  "USDT-BCH",
  "EUR-BTC",
  "USD-BTC",
  "USDT-BTC",
  "USDT-DOT",
  "BTC-EOS",
  "ETH-EOS",
  "USDT-EOS",
  "BTC-ETC",
  "ETH-ETC",
  "USDT-ETC",
  "BTC-ETH",
  "EUR-ETH",
  "USD-ETH",
  "USDT-ETH",
  "BTC-LINK",
  "ETH-LINK",
  "USD-LINK",
  "USDT-LINK",
  "BTC-LTC",
  "ETH-LTC",
  "USD-LTC",
  "USDT-LTC",
  "BTC-NEO",
  "ETH-NEO",
  "USDT-NEO",
  "BTC-TRX",
  "ETH-TRX",
  "USDT-TRX",
  "BTC-XLM",
  "ETH-XLM",
  "EUR-XLM",
  "USD-XLM",
  "USDT-XLM",
  "BTC-XMR",
  "USDT-XMR",
  "BTC-XRP",
  "ETH-XRP",
  "EUR-XRP",
  "USD-XRP",
  "USDT-XRP",
]

const orgExchangeData = async () => {
  try {
    const final = []
    const url = "https://api.bittrex.com/api/v1.1/public/getmarketsummaries"
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    const res_arr = response.json.result
    for (let i = 0; i < filter.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in res_arr) {
        if (filter[i] === res_arr[key].MarketName) {
          const base = filter[i].split("-", 2)[1]
          const target = filter[i].split("-", 1)[0]
          const price = scientificToDecimal(res_arr[key].Last).toString()
          const priceInt = Web3.utils.toWei(price, "ether")
          const time = res_arr[key].TimeStamp
          const timestamp = Math.floor(Date.parse(time) / 1000)

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
