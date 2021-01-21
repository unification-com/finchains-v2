require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ATOM_USDT",
  "ATOM_BTC",
  "BCH_BTC",
  "BCH_USDT",
  "BTC_USDT",
  "BTC_PAX",
  "BTC_USDC",
  "EOS_USDT",
  "EOS_BTC",
  "ETC_USDT",
  "ETC_BTC",
  "ETC_ETH",
  "EOS_ETH",
  "DOT_USDT",
  "ETH_BTC",
  "ETH_USDT",
  "LINK_BTC",
  "LINK_ETH",
  "LINK_USDT",
  "LTC_USDT",
  "LTC_BTC",
  "LTC_ETH",
  "NEO_USDT",
  "NEO_BTC",
  "NEO_ETH",
  "TRX_BTC",
  "TRX_USDT",
  "TRX_ETH",
  "XLM_USDT",
  "XLM_BTC",
  "XLM_ETH",
  "XRP_BTC",
  "XRP_USDT",
  "XRP_ETH",
]

const orgExchangeData = async () => {
  try {
    const final = []
    let base
    let target

    for (let i = 0; i < filter.length; i += 1) {
      base = filter[i].split("_", 1)[0]
      target = filter[i].split("_", 2)[1]

      const url = `https://openapi.bitmart.com/v2/ticker?symbol=${filter[i]}`
      console.log(new Date(), "get", url)

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      console.log(response)
      const price = scientificToDecimal(response.json.current_price).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = Math.floor(Date.parse(response.date)/1000)
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
