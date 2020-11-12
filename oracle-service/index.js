require("dotenv").config()
const Web3 = require("web3")
const { addOracle, setThreshold, submitPrice } = require("../common/ethereum")
const { getExchangePrices } = require("./apis/coingecko")

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
  const { BASES, EXCHANGE } = process.env
  await getExchangePrices(EXCHANGE, BASES)
    .then(async (data) => {
      for (let i = 0; i < data.length; i += 1) {
        const d = data[i]
        console.log(new Date(), EXCHANGE, "submit", d.pair, d.priceInt, d.price, "at", d.timestamp)
        const txHash = await submitPrice(d.pair, d.priceInt, d.price, d.timestamp)
        console.log(new Date(), "txHash", txHash)
      }
      process.exit(0)
    })
    .catch((err) => {
      console.error(new Date(), "ERROR:")
      console.error(err)
      process.exit(1)
    })
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
    default:
      console.log(new Date(), "nothing to do")
      break
  }
}

run()
