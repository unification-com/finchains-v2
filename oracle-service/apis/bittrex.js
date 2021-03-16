require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  'ADA/BTC',  'ADA/USDT',  'ATOM/BTC', 'ATOM/USDT',
  'BCH/BTC',  'BCH/EUR',   'BCH/USD',  'BCH/USDT',
  'BTC/EUR',  'BTC/USD',   'BTC/USDT', 'DOT/USDT',
  'EOS/BTC',  'EOS/ETH',   'EOS/USDT', 'ETC/BTC',
  'ETC/ETH',  'ETC/USDT',  'ETH/BTC',  'ETH/EUR',
  'ETH/USD',  'ETH/USDT',  'LINK/BTC', 'LINK/ETH',
  'LINK/USD', 'LINK/USDT', 'LTC/BTC',  'LTC/ETH',
  'LTC/USD',  'LTC/USDT',  'NEO/BTC',  'NEO/ETH',
  'NEO/USDT', 'TRX/BTC',   'TRX/ETH',  'TRX/USDT',
  'XLM/BTC',  'XLM/ETH',   'XLM/EUR',  'XLM/USD',
  'XLM/USDT', 'XMR/BTC',   'XMR/USDT', 'XRP/BTC',
  'XRP/ETH',  'XRP/EUR',   'XRP/USD',  'XRP/USDT'
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${target}-${base}`
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
    const url = "https://api.bittrex.com/api/v1.1/public/getmarketsummaries"
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    console.log(new Date(), "get", url)
    const res_arr = response.json.result
    for (let i = 0; i < filter.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in res_arr) {
        if (pairList[i] === res_arr[key].MarketName) {
          const base = pairLookup[pairList[i]].base
          const target = pairLookup[pairList[i]].target
          const price = scientificToDecimal(res_arr[key].Last).toString()
          const priceInt = Web3.utils.toWei(price, "ether")
          const time = res_arr[key].TimeStamp
          const timestamp = Math.floor(Date.parse(time) / 1000)

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
      }
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
