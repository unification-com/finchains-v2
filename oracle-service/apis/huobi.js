require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "adabtc",
  "adausdt",
  "atombtc",
  "atomusdt",
  "bchbtc",
  "bchusdt",
  "btcusdt",
  "dotusdt",
  "eosbtc",
  "eoseth",
  "eosusdt",
  "etcbtc",
  "etcusdt",
  "ethbtc",
  "ethusdt",
  "linkbtc",
  "linketh",
  "linkusdt",
  "ltcbtc",
  "ltcusdt",
  "neobtc",
  "neousdt",
  "trxbtc",
  "trxeth",
  "trxusdt",
  "xlmbtc",
  "xlmeth",
  "xlmusdt",
  "xmrbtc",
  "xmrusdt",
  "xrpbtc",
  "xrpusdt",
]

// get data
const orgExchangeData = async () => {
  try {
    const final = []
    let base
    let target
    // Iterate through filter array of pairs
    for (let i = 0; i < filter.length; i += 1) {
      // formatting filter elements for standardized return of base/target/pairs
      const substr = filter[i].substring(0, 4)
      if (substr === "link" || substr === "atom") {
        base = substr.toUpperCase()
        target = filter[i].substring(4).toUpperCase()
      } else {
        base = filter[i].substring(0, 3).toUpperCase()
        target = filter[i].substring(3).toUpperCase()
      }

      // Need to access Huobi api pair by pair to get "last price" data
      const url = `https://api.huobi.pro/market/trade?symbol=${filter[i]}`
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const price = scientificToDecimal(response.json.tick.data[0].price).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.tick.data[0].ts
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
    
  } catch (err) {
    console.error(err)
  }
  return final
}

const getPrices = async () => {
  await orgExchangeData()
}

module.exports = {
  getPrices,
}
