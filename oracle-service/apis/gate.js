require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

// standardised function to get prices from an exchange's API
const filter = [
  "ADA_BTC",
  "ADA_USDT",
  "ATOM_BTC",
  "ATOM_USDT",
  "BCH_BTC",
  "BCH_USDT",
  "BTC_PAX",
  "BTC_USDC",
  "BTC_USDT",
  "DOT_USDT",
  "EOS_BTC",
  "EOS_ETH",
  "EOS_USDT",
  "ETC_BTC",
  "ETC_ETH",
  "ETC_USDT",
  "ETH_BTC",
  "ETH_USDT",
  "LINK_ETH",
  "LINK_USDT",
  "LTC_BTC",
  "LTC_USDT",
  "NEO_BTC",
  "NEO_USDT",
  "TRX_ETH",
  "TRX_USDT",
  "XLM_BTC",
  "XLM_ETH",
  "XLM_USDT",
  "XMR_BTC",
  "XMR_USDT",
  "XRP_BTC",
  "XRP_USDT",
]
const orgExchangeData = async () => {
  try {
    const final = []
    const url = "https://api.gateio.ws/api/v4/spot/tickers"
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    const res_arr = Object.entries(response.json)
    for (let i = 0; i < filter.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of res_arr) {
        if (value.currency_pair === filter[i]) {
          const base = filter[i].split("_", 1)[0]
          const target = filter[i].split("_", 2)[1]
          const price = scientificToDecimal(value.last).toString()
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
