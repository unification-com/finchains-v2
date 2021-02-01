require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  'ATOM/BTC', 'BCH/BTC',  'BCH/EUR',
  'BCH/GBP',  'BCH/USD',  'BTC/EUR',
  'BTC/GBP',  'BTC/USD',  'BTC/USDC',
  'EOS/BTC',  'ETC/BTC',  'ETH/BTC',
  'ETH/EUR',  'ETH/GBP',  'ETH/USD',
  'ETH/USDC', 'LINK/BTC', 'LINK/ETH',
  'LINK/EUR', 'LINK/GBP', 'LINK/USD',
  'LTC/BTC',  'LTC/EUR',  'LTC/GBP',
  'LTC/USD',  'XLM/BTC',  'XLM/EUR',
  'XLM/USD'
]

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
      const url = `https://api.pro.coinbase.com/products/${pairList[i]}/ticker`
      console.log(new Date(), "get", url)

      // eslint-disable-next-line no-await-in-loop
      const response = await fetcher(url)
      const base = pairLookup[pairList[i]].base
      const target = pairLookup[pairList[i]].target
      const price = scientificToDecimal(response.json.price).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = Math.floor(Date.parse(response.json.time)/1000)
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
