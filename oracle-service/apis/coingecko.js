require("dotenv").config()
const Web3 = require("web3")
const fetch = require("isomorphic-unfetch")
const { scientificToDecimal } = require("../utils")
const { currencies } = require("../config")

const baseUrl = "https://api.coingecko.com/api/v3/exchanges"

const getExchangePrices = (exchange) => {
  return new Promise((resolve, reject) => {
    const bases = []
    const targets = {}
    for (let i = 0; i < currencies.length; i += 1) {
      const c = currencies[i]
      bases.push(c.base)
      targets[c.sybmol] = c.targets
    }

    const basesStr = bases.join(",")

    const URL = `${baseUrl}/${exchange}/tickers?coin_ids=${basesStr}`
    console.log(new Date(), "get", URL)
    fetch(URL)
      .then((r) => r.json())
      .then((data) => {
        const results = []

        for (let i = 0; i < data.tickers.length; i += 1) {
          const d = data.tickers[i]
          if (targets[d.base]) {
            if (targets[d.base].includes(d.target)) {
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
          }
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
