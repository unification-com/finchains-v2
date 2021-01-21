require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ada_usdt",
  "atom_btc",
  "atom_usdt",
  "bch_btc",
  "bch_usdt",
  "btc_usdt",
  "dot_usdt",
  "eos_btc",
  "eos_eth",
  "eos_usdt",
  "etc_btc",
  "etc_eth",
  "etc_usdt",
  "eth_btc",
  "eth_usdt",
  "fund_btc",
  "fund_eth",
  "fund_usdt",
  "link_usdt",
  "ltc_btc",
  "ltc_usdt",
  "neo_btc",
  "neo_eth",
  "neo_usdt",
  "trx_btc",
  "trx_eth",
  "trx_usdt",
  "xlm_usdt",
  "xmr_btc",
  "xmr_usdt",
  "xrp_btc",
  "xrp_eth",
  "xrp_usdt",
]

const orgExchangeData = async () => {
  try {
    const final = []
    const url = "https://openapi.digifinex.com/v3/ticker"
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    const res_arr = Object.entries(response.json.ticker)
    const timestamp = response.json.date
    for (let i = 0; i < filter.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of res_arr) {
        if (value.symbol === filter[i]) {
          const base = filter[i].split("_", 1)[0].toUpperCase()
          const target = filter[i].split("_", 2)[1].toUpperCase()
          const price = scientificToDecimal(value.last).toString()
          const priceInt = Web3.utils.toWei(price, "ether")

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

