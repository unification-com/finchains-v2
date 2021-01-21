require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = ["BTC-EUR", "BTC-GBP", "BTC-USD", "ETH-BTC"]

const orgExchangeData = async () => {
  try {
    const final = []
    for (let i = 0; i < filter.length; i += 1) {
      const url = `https://api-public.sandbox.pro.coinbase.com/products/${filter[i]}/ticker`
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      console.log(response)
      const base = filter[i].split("-", 1)[0]
      const target = filter[i].split("-", 2)[1]
      const price = scientificToDecimal(response.json.price).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = Math.floor(Date.parse(response.json.time) / 1000)
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
  orgExchangeData()
}

getPrices()

