require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ADAUSDT",
  "BCHEUR",
  "BCHGBP",
  "BCHUSD",
  "BCHUSDT",
  "XBTEUR",
  "XBTGBP",
  "XBTUSD",
  "XBTUSDC",
  "XBTUSDT",
  "DOTUSDT",
  "EOSETH",
  "EOSUSDT",
  "ETCETH",
  "ETHEUR",
  "ETHGBP",
  "ETHUSD",
  "ETHUSDC",
  "ETHUSDT",
  "LINKETH",
  "LINKEUR",
  "LINKUSD",
  "LINKUSDT",
  "LTCETH",
  "LTCEUR",
  "LTCGBP",
  "LTCUSD",
  "LTCUSDT",
  "TRXETH",
  "XLMEUR",
  "XLMUSD",
  "XRPETH",
  "XRPEUR",
  "XRPGBP",
  "XRPUSD",
  "XRPUSDT",
]

// standardised function to get prices from an exchange's API
const orgExchangeData = async () => {
  try {
    const final = []
    let base
    let target
    for (let i = 0; i < filter.length; i += 1) {
      const substr = filter[i].substring(0, 4)
      if (substr === "LINK") {
        base = substr
        target = filter[i].substring(4)
      } else {
        base = filter[i].substring(0, 3)
        target = filter[i].substring(3)
      }
      const url = `https://api.kraken.com/0/public/Ticker?pair=${filter[i]}`
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const res_pair = Object.keys(response.json.result)
      const price = scientificToDecimal(response.json.result[`${res_pair}`].c[0]).toString()
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
    return final
  } catch (error) {
    console.error(error)
  }
}

const getPrices = async () => {
  await orgExchangeData()
}

module.exports = {
  getPrices,
}

