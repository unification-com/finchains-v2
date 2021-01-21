require("dotenv").config()
const Web3 = require("web3")
const { scientificToDecimal, fetcher } = require("../utils")

const filter = [
  "ADA/UST",
  "ADA/BTC",
  "BCHABC/USD",
  "BCHN/USD",
  "BTC/UST",
  "BTC/USD",
  "EOS/UST",
  "EOS/ETH",
  "EOS/BTC",
  "DOT/UST",
  "ETC/BTC",
  "ETC/USD",
  "ETH/BTC",
  "ETH/EUR",
  "ETH/GBP",
  "ETH/USD",
  "ETH/UST",
  "LINK/BTC",
  "LINK/UST",
  "LINK/USD",
  "LTC/BTC",
  "LTC/USD",
  "LTC/UST",
  "NEO/BTC",
  "NEO/ETH",
  "TRX/BTC",
  "TRX/ETH",
  "XLM/BTC",
  "XLM/ETH",
  "XLM/USD",
  "XMR/BTC",
  "XMR/USD",
  "XRP/BTC",
  "XRP/USD",
]

const orgExchangeData = async () => {
  try {
    const final = []
    const pairList = []
    const baseList = []
    const targetList = []
    for (let i = 0; i < filter.length; i += 1) {
      const base = filter[i].split("/", 1)[0]
      const target = filter[i].split("/", 2)[1]
      baseList.push(base)
      targetList.push(target)

      if (baseList[i] === "LINK" || baseList[i] === "BCHABC" || baseList[i] === "BCHN" ) {
        const pair = `t${baseList[i]}:${targetList[i]}`
        pairList.push(pair)
        continue
      }

      const pair = `t${baseList[i]}${targetList[i]}`
      pairList.push(pair)
    }
    // generate query URL
    const url = `https://api-pub.bitfinex.com/v2/tickers?symbols=${pairList}`
    console.log(new Date(), "get", url)

    for (let i = 0; i < targetList; i = +1) {
      if (targetList[i] === "UST") {
        targetList[i] = "USDT"
      }
    }
    // eslint-disable-next-line no-await-in-loop
    const response = await fetcher(url)
    for (let i = 0; i < filter.length; i += 1){
      const p = response.json[i][7]
      const price = scientificToDecimal(p).toString()
      const priceInt = Web3.utils.toWei(price, "ether")
      const timestamp = Math.floor(Date.parse(response.date) / 1000)
      const td = {
        base: baseList[i],
        target: targetList[i],
        pair: `${baseList[i]}/${targetList[i]}`,
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

// module.exports = {
//   getPrices,
// }

