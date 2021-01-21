require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "bchbtc",
  "bchusd",
  "btceur",
  "btcgbp",
  "btcusd",
  "ethbtc",
  "etheur",
  "ethgbp",
  "ethusd",
  "linkbtc",
  "linketh",
  "linkusd",
  "ltcbtc",
  "ltceth",
  "ltcusd",
]

const orgExchangeData = async () => {
  try {
    const final = []
    let base
    let target
    for (let i = 0; i < filter.length; i += 1) {
      const substr = filter[i].substring(0, 4)
      if (substr === "link" || substr === "atom") {
        base = substr.toUpperCase()
        target = filter[i].substring(4).toUpperCase()
      } else {
        base = filter[i].substring(0, 3).toUpperCase()
        target = filter[i].substring(3).toUpperCase()
      }
      const url = `https://api.gemini.com/v1/pubticker/${filter[i]}`
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const price = scientificToDecimal(response.json.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.volume.timestamp
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
  console.log(await orgExchangeData())
}

getPrices()


