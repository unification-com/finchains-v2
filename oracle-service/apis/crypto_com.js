require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ADA_BTC",
  "ADA_USDT",
  "ATOM_BTC",
  "ATOM_USDT",
  "BCH_BTC",
  "BCH_USDT",
  "BTC_USDC",
  "BTC_USDT",
  "DOT_USDT",
  "EOS_BTC",
  "EOS_USDT",
  "ETH_BTC",
  "ETH_USDT",
  "LINK_BTC",
  "LINK_USDT",
  "LTC_BTC",
  "LTC_USDT",
  "NEO_BTC",
  "NEO_USDT",
  "XLM_BTC",
  "XLM_USDT",
  "XRP_BTC",
  "XRP_USDT",
]

const orgExchangeData = async () => {
  try {
    const final = []
    const url = "https://uat-api.3ona.co/v2/public/get-ticker"
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    const res_arr = Object.entries(response.json.result.data)
    for (let i = 0; i < filter.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of res_arr) {
        if (value.i === filter[i]) {
          const base = filter[i].split("_", 1)[0].toUpperCase()
          const target = filter[i].split("_", 2)[1].toUpperCase()
          const price = scientificToDecimal(value.a).toString()
          const priceInt = Web3.utils.toWei(price, "ether")
          const timestamp = value.t
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
