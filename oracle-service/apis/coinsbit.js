require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  'BCH/BTC',  'BCH/USD',   'BTC/EUR',
  'BTC/PAX',  'BTC/USD',   'BTC/USDC',
  'BTC/USDT', 'EOS/BTC',   'EOS/ETH',
  'EOS/USDT', 'ETC/BTC',   'ETC/ETH',
  'ETH/BTC',  'ETH/EUR',   'ETH/USD',
  'ETH/USDC', 'ETH/USDT',  'LINK/BTC',
  'LINK/ETH', 'LINK/USDT', 'LTC/BTC',
  'LTC/ETH',  'LTC/USD',   'LTC/USDT',
  'TRX/BTC',  'TRX/ETH',   'TRX/USDT',
  'XLM/BTC',  'XRP/BTC'
]

const getPairData = (pair) => {
  const base = pair.split("/", 1)[0]
  const target = pair.split("/", 2)[1]
  const apiPairName = `${base}_${target}`
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
    const url = "https://coinsbit.io/api/v1/public/tickers"
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    console.log(new Date(), "get", url)
    const res_arr = response.json.result
    for (let i = 0; i < filter.length; i += 1) {
      const selection = res_arr[pairList[i]]
      if (selection != null) {
        const base = pairLookup[pairList[i]].base
        const target = pairLookup[pairList[i]].target
        const price = scientificToDecimal(selection.ticker.last).toString()
        const priceInt = Web3.utils.toWei(price, "ether")
        // time already returned in unix epoch format
        const timestamp = selection.at

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
