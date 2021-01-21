require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "BCH_BTC",
  "BCH_USD",
  "BTC_EUR",
  "BTC_PAX",
  "BTC_USD",
  "BTC_USDC",
  "BTC_USDT",
  "EOS_BTC",
  "EOS_ETH",
  "EOS_USDT",
  "ETC_BTC",
  "ETC_ETH",
  "ETH_BTC",
  "ETH_EUR",
  "ETH_USD",
  "ETH_USDC",
  "ETH_USDT",
  "LINK_BTC",
  "LINK_ETH",
  "LINK_USDT",
  "LTC_BTC",
  "LTC_ETH",
  "LTC_USD",
  "LTC_USDT",
  "TRX_BTC",
  "TRX_ETH",
  "TRX_USDT",
  "XLM_BTC",
  "XRP_BTC",
]

const orgExchangeData = async () => {
  try {
    const final = []
    const url = "https://coinsbit.io/api/v1/public/tickers"
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    const res_arr = response.json.result
    for (let i = 0; i < filter.length; i += 1) {
      const selection = res_arr[filter[i]]
      if (selection != null) {
        const base = filter[i].split("_", 1)[0]
        const target = filter[i].split("_", 2)[1]
        const price = scientificToDecimal(selection.ticker.last).toString()
        const priceInt = Web3.utils.toWei(price, "ether")
        // time already returned in unix epoch format
        const timestamp = selection.at

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
