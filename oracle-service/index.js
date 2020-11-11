require("dotenv").config()
const Web3 = require("web3")
const { addOracle, setThreshold, submitPrice } = require("../common/ethereum")
const { getExchangePrices } = require("./apis/coingecko")

const runSetThreshold = async (args) => {
  const pair = args[1]
  const threshold = args[2]

  if (!pair) {
    console.log("no pair set")
    return
  }

  if (!threshold) {
    console.log("no threshold set")
    return
  }
  const thresholdWei = Web3.utils.toWei(threshold.toString(), "ether")
  console.log("set threshold for", pair, "to", thresholdWei, `(${threshold})`)
  await setThreshold(pair, thresholdWei)
  process.exit(0)
}

const runAddOracle = async (args) => {
  const exchange = args[1]
  const address = args[2]

  if (!exchange) {
    console.log("no exchange set")
    return
  }

  if (!Web3.utils.isAddress(address)) {
    console.log("invalid address")
    return
  }

  console.log("add oracle", exchange, address)
  await addOracle(exchange, address)
  process.exit(0)
}

const runOracle = async () => {
  const { BASES, EXCHANGE } = process.env
  await getExchangePrices(EXCHANGE, BASES)
    .then(async (data) => {
      const submitTasks = []
      for (let i = 0; i < data.length; i += 1) {
        const d = data[i]
        submitTasks.push(submitPrice(d.pair, d.priceInt, d.price, d.timestamp))
      }
      await Promise.all(submitTasks)
    })
    .catch((err) => {
      console.error("ERROR:", err)
    })
  process.exit(0)
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
      console.log("nothing to do")
      break
  }
}

run()
