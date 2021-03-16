require("dotenv").config()
const Web3 = require("web3")
const { addOracle, getLastSubmitTime, setThreshold, submitPrice } = require("../common/ethereum")

const { exchangeApiLoader } = require("./apis")
const { currencies } = require("./config")

const API_V = process.env.EXCHANGE_API_V || "v2"
console.log(new Date(), "using exchange API", API_V)
const exchangeApis = exchangeApiLoader(API_V)

const sleepFor = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const runSetThreshold = async (args) => {
  const pair = args[1]
  const threshold = args[2]

  if (!pair) {
    console.log(new Date(), "no pair set")
    return
  }

  if (!threshold) {
    console.log(new Date(), "no threshold set")
    return
  }
  const thresholdWei = Web3.utils.toWei(threshold.toString(), "ether")
  console.log(new Date(), "set threshold for", pair, "to", thresholdWei, `(${threshold})`)
  await setThreshold(pair, thresholdWei)
  process.exit(0)
}

const runAddOracle = async (args) => {
  const exchange = args[1]
  const address = args[2]

  if (!exchange) {
    console.log(new Date(), "no exchange set")
    return
  }

  if (!Web3.utils.isAddress(address)) {
    console.log(new Date(), "invalid address")
    return
  }

  console.log(new Date(), "add oracle", exchange, address)
  await addOracle(exchange, address)
  process.exit(0)
}

const runOracle = async () => {
  const { EXCHANGE, WALLET_ADDRESS } = process.env
  await exchangeApis[EXCHANGE].getPrices()
    .then(async (data) => {
      for (let i = 0; i < data.length; i += 1) {
        try {
          const d = data[i]
          console.log(new Date(), EXCHANGE, "submit", d.pair, d.priceInt, d.price, "at", d.timestamp)
          const lastSubTime = await getLastSubmitTime(d.pair, WALLET_ADDRESS)
          if (parseInt(d.timestamp, 10) > parseInt(lastSubTime, 10)) {
            const txHash = await submitPrice(d.pair, d.priceInt, d.price, d.timestamp)
            console.log(new Date(), "txHash", txHash)
            await sleepFor(200)
          } else {
            console.log(new Date(), EXCHANGE, "timestamp", d.timestamp, "= lastSubTime", lastSubTime)
          }
        } catch (err) {
          console.error(new Date(), "ERROR:")
          console.error(err)
        }
      }
      process.exit(0)
    })
    .catch((err) => {
      console.error(new Date(), "ERROR:")
      console.error(err)
    })
}

const testOracle = async (args) => {
  const exchanges = args[1]
  let exchangesArr
  const tasks = []

  if (!exchanges) {
    exchangesArr = Object.keys(exchangeApis)
  } else {
    exchangesArr = exchanges.split(",")
  }

  for (let i = 0; i < exchangesArr.length; i += 1) {
    const exchange = exchangesArr[i]
    const t = exchangeApis[exchange]
      .getPrices()
      .then(async (data) => {
        for (let j = 0; j < data.length; j += 1) {
          const pair = data[j].pair
          const base = data[j].base
          const target = data[j].target
          const price = data[j].price
          const ts = data[j].timestamp
          console.log(exchange, pair, base, target, ts, price)
        }
        console.log(exchange, "done")
      })
      .catch((err) => {
        console.error(new Date(), "ERROR:")
        console.error(err)
      })
    tasks.push(t)
  }

  await Promise.all(tasks)
  process.exit(0)
}

const listExchanges = () => {
  Object.keys(exchangeApis).forEach((exchange) => {
    console.log(exchange)
  })
}

const listWantedPairs = () => {
  for (let i = 0; i < currencies.length; i += 1) {
    for (let j = 0; j < currencies[i].targets.length; j += 1) {
      console.log(`${currencies[i].sybmol}/${currencies[i].targets[j]}`)
    }
  }
}

const run = async () => {
  const args = process.argv.slice(2)
  const doWhat = args[0]

  switch (doWhat) {
    case "add-oracle":
      await runAddOracle(args)
      break
    case "run-oracle":
      await runOracle()
      break
    case "set-threshold":
      await runSetThreshold(args)
      break
    case "test-oracle":
      await testOracle(args)
      break
    case "list-exchanges":
      listExchanges()
      break
    case "list-pairs":
      listWantedPairs()
      break
    default:
      console.log(new Date(), "nothing to do")
      break
  }
}

run()
