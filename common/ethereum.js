require("dotenv").config()
const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")

const {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  WALLET_PKEY,
  WALLET_ADDRESS,
  WEB3_PROVIDER_HTTP,
  WEB3_PROVIDER_WS,
} = process.env

const addOracle = async (exchange, oracleAddress) => {
  const provider = new HDWalletProvider(WALLET_PKEY, WEB3_PROVIDER_HTTP)
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS)

  await contract.methods
    .addExchange(oracleAddress, exchange)
    .send({ from: WALLET_ADDRESS })
    .on("transactionHash", function (txHash) {
      console.log("Tx sent", txHash)
    })
    .on("error", function (err) {
      console.log("Failed", err)
    })
}

const setThreshold = async (pair, threshold) => {
  const provider = new HDWalletProvider(WALLET_PKEY, WEB3_PROVIDER_HTTP)
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS)

  await contract.methods
    .setThreshold(pair, threshold)
    .send({ from: WALLET_ADDRESS })
    .on("transactionHash", function (txHash) {
      console.log("Tx sent", txHash)
    })
    .on("error", function (err) {
      console.log("Failed", err)
    })
}

const submitPrice = async (pair, priceInt, priceRaw, timestamp) => {
  const provider = new HDWalletProvider(WALLET_PKEY, WEB3_PROVIDER_HTTP)
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS)

  console.log("submit", pair, priceRaw, priceInt, "at", timestamp)
  await contract.methods
    .updateCurrency(pair, priceInt, priceRaw, timestamp)
    .send({ from: WALLET_ADDRESS })
    .on("transactionHash", function (txHash) {
      console.log("Tx sent", txHash)
    })
    .on("error", function (err) {
      console.log("Failed", err)
    })
}

const watchBlocks = async (cb = function () {}) => {
  const web3Ws = new Web3(WEB3_PROVIDER_WS)

  console.log("running watcher")
  web3Ws.eth
    .subscribe("newBlockHeaders")
    .on("connected", function newBlockHeadersConnected(subscriptionId) {
      console.log("newBlockHeaders connected", subscriptionId)
    })
    .on("data", function newBlockHeadersRecieved(blockHeader) {
      cb(blockHeader, null)
    })
    .on("error", function newBlockHeadersError(error) {
      cb(null, error)
    })
}

const watchEvent = async (eventName, fromBlock = 0, cb = function () {}) => {
  const web3Ws = new Web3(WEB3_PROVIDER_WS)
  const watchContract = await new web3Ws.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS)

  // keep ws connection alive
  console.log("running watcher")
  web3Ws.eth
    .subscribe("newBlockHeaders")
    .on("connected", function newBlockHeadersConnected(subscriptionId) {
      console.log("newBlockHeaders connected", subscriptionId)
    })
    .on("data", function newBlockHeadersRecieved(blockHeader) {
      console.log("got block", blockHeader.number)
    })
    .on("error", function newBlockHeadersError(error) {
      console.error(error)
    })

  watchContract.events[eventName]({
    fromBlock,
  })
    .on("data", async function onCurrencyUpdateEvent(event) {
      cb(event, null)
    })
    .on("error", function onCurrencyUpdateError(error) {
      console.error("onCurrencyUpdateError error", error)
      cb(null, error)
    })
}

const getBlockNumber = async () => {
  const provider = new HDWalletProvider(WALLET_PKEY, WEB3_PROVIDER_HTTP)
  const web3 = new Web3(provider)
  return web3.eth.getBlockNumber()
}

const getPastEvents = async (fromBlock, toBlock, eventName, cb = function () {}) => {
  const provider = new HDWalletProvider(WALLET_PKEY, WEB3_PROVIDER_HTTP)
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS)
  await contract.getPastEvents(
    eventName,
    {
      fromBlock,
      toBlock,
    },
    function (error, events) {
      cb(events, error)
    },
  )
}

module.exports = {
  addOracle,
  getBlockNumber,
  getPastEvents,
  setThreshold,
  submitPrice,
  watchBlocks,
  watchEvent,
}
