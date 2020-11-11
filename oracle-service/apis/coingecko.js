require("dotenv").config()
const Web3 = require("web3")
const fetch = require("isomorphic-unfetch")
const { scientificToDecimal } = require("../utils")

const baseUrl = "https://api.coingecko.com/api/v3/exchanges"

const getExchangePrices = (exchange, bases) => {
  return new Promise((resolve, reject) => {
    const URL = `${baseUrl}/${exchange}/tickers?coin_ids=${bases}`
    console.log(URL)
    fetch(URL)
      .then((r) => r.json())
      .then((data) => {
        const results = []

        for (let i = 0; i < data.tickers.length; i += 1) {
          const d = data.tickers[i]
          const price = scientificToDecimal(d.last).toString()

          // standardise all prices to 10^18 for int calculations in contract
          const priceInt = Web3.utils.toWei(price, "ether")

          const timestamp = Math.floor(Date.parse(d.timestamp) / 1000)

          const td = {
            base: d.base,
            target: d.target,
            pair: `${d.base}/${d.target}`,
            price,
            priceInt,
            timestamp,
          }
          results.push(td)
        }
        resolve(results)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = {
  getExchangePrices,
}
