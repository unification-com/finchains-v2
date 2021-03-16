require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = ["BTC/EUR", "BTC/GBP", "BTC/USD", "ETH/BTC"]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base}-${target}`
  return { apiPairName, pair, base, target }
}

const orgExchangeData = async () => {
  try {
    const final = []
    const pairList = []
    const pairLookup = {}
    for (let i = 0; i < filter.length; i += 1) {
      const pairData = getPairData(filter[i])
      pairList.push(pairData.apiPairName)
      pairLookup[pairData.apiPairName] = pairData
    }
    for (let i = 0; i < filter.length; i += 1) {
      const url = `https://api-public.sandbox.pro.coinbase.com/products/${pairList[i]}/ticker`
      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)

      console.log(new Date(), "get", url)

      const base = pairLookup[pairList[i]].base
      const target = pairLookup[pairList[i]].target
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
  await orgExchangeData()
}

module.exports = {
  getPrices,
}