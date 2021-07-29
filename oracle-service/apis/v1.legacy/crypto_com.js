require("dotenv").config()
const Web3 = require("web3")
const fetch = require("isomorphic-unfetch")
const { scientificToDecimal } = require("../../utils")
const { currencies } = require("./config")

// standardised function to get prices from an exchange's API
const getPrices = () => {
  return new Promise((resolve, reject) => {
    const bases = []
    const targets = {}
    // load desired bases and targets from config.js
    // ToDo - only load pairs supported by the exchange API. No point querying unsupported pairs
    // filter can be hard-coded per exchange API.
    for (let i = 0; i < currencies.length; i += 1) {
      const c = currencies[i]
      bases.push(c.base)
      targets[c.sybmol] = c.targets
    }

    // generate query URL
    const basesStr = bases.join(",")
    const URL = `https://api.coingecko.com/api/v3/exchanges/crypto_com/tickers?coin_ids=${basesStr}`
    console.log(new Date(), "get", URL)

    // get data
    fetch(URL)
      .then((r) => r.json())
      .then((data) => {
        // process results
        const results = []

        for (let i = 0; i < data.tickers.length; i += 1) {
          const d = data.tickers[i]
          // only include configured bases
          if (targets[d.base]) {
            // only include configured targets
            if (targets[d.base].includes(d.target)) {
              // ensure prices are not in "e" format
              const price = scientificToDecimal(d.last).toString()

              // standardise all prices to 10^18 for int calculations in smart contract
              const priceInt = Web3.utils.toWei(price, "ether")

              // convert returned time to unix epoch
              const timestamp = Math.floor(Date.parse(d.timestamp) / 1000)

              // generate standardised return data object
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
        // return the results to the caller
        resolve(results)
      })
      .catch((err) => {
        // return error to the caller
        reject(err)
      })
  })
}

module.exports = {
  getPrices,
}
