require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "btcusd",
  "btceur",
  "btcgbp",
  "btcusdc",
  "xrpusd",
  "xrpeur",
  "xrpbtc",
  "xrpgbp",
  "ltcusd",
  "ltceur",
  "ltcbtc",
  "ltcgbp",
  "ethusd",
  "etheur",
  "ethbtc",
  "ethgbp",
  "ethusdc",
  "bchusd",
  "bcheur",
  "bchbtc",
  "bchgbp",
  "xlmbtc",
  "xlmusd",
  "xlmeur",
  "xlmgbp",
  "linkusd",
  "linkeur",
  "linkgbp",
  "linkbtc",
  "linketh",
]

const orgExchangeData = async () => {
  try {
    const final = []
    let base
    let target
    // Iterate through filter array of pairs
    for (let i = 0; i < filter.length; i += 1) {
      const substr = filter[i].substring(0, 4)
      if (substr === "link" || substr === "atom") {
        base = substr.toUpperCase()
        target = filter[i].substring(4).toUpperCase()
      } else {
        base = filter[i].substring(0, 3).toUpperCase()
        target = filter[i].substring(3).toUpperCase()
      }

      // Need to access Huobi api pair by pair to get "last price" data
      const url = `https://www.bitstamp.net/api/v2/ticker/${filter[i]}`
      console.log(new Date(), "get", url)

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const price = scientificToDecimal(response.json.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.timestamp
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
