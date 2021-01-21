require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "coin-usdt-ada",
  "coin-usdt-atom",
  "coin-btc-bch",
  "coin-usdt-bch",
  "coin-usdt-btc",
  "coin-usdt-dot",
  "coin-btc-eos",
  "coin-usdt-eos",
  "coin-btc-eth",
  "coin-usdt-eth",
  "coin-btc-fund",
  "coin-eth-fund",
  "coin-usdt-fund",
  "coin-btc-link",
  "coin-eth-link",
  "coin-usdt-ltc",
  "coin-usdt-neo",
  "coin-btc-trx",
  "coin-usdt-trx",
  "coin-usdt-xlm",
  "coin-btc-xrp",
  "coin-usdt-xrp",
]

const orgExchangeData = async () => {
  try {
    const final = []
    let base
    let target

    for (let i = 0; i < filter.length; i += 1) {
      base = filter[i].split("-", 3)[2].toUpperCase()
      target = filter[i].split("-", 2)[1].toUpperCase()
      const url = `https://api.bitforex.com/api/v1/market/ticker?symbol=${filter[i]}`
      console.log(new Date(), "get", url)

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const price = scientificToDecimal(response.json.data.last).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = response.json.time
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

getPrices()

module.exports = {
  getPrices,
}
