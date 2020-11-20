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
      console.log(new Date(), "Tx sent", txHash)
    })
    .on("error", function (err) {
      console.log(new Date(), "Failed", err)
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
      console.log(new Date(), "Tx sent", txHash)
    })
    .on("error", function (err) {
      console.log(new Date(), "Failed", err)
    })
}

const getLastSubmitTime = async (pair, oracleAddress) => {
  const web3 = new Web3(WEB3_PROVIDER_HTTP)
  const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS)
  return new Promise((resolve, reject) => {
    contract.methods.getLastSubmitTimeByAddress(pair, oracleAddress).call(function (error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const submitPrice = async (pair, priceInt, priceRaw, timestamp) => {
  const provider = new HDWalletProvider(WALLET_PKEY, WEB3_PROVIDER_HTTP)
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS)

  // wrap in Promise and return
  return new Promise((resolve, reject) => {
    contract.methods
      .updateCurrency(pair, priceInt, priceRaw, timestamp)
      .send({ from: WALLET_ADDRESS })
      .on("transactionHash", function (txHash) {
        resolve(txHash)
      })
      .on("error", function (err) {
        reject(err)
      })
  })
}

const watchBlocks = async (cb = function () {}) => {
  const web3Ws = new Web3(WEB3_PROVIDER_WS)

  console.log(new Date(), "running block watcher")
  web3Ws.eth
    .subscribe("newBlockHeaders")
    .on("connected", function newBlockHeadersConnected(subscriptionId) {
      console.log(new Date(), "newBlockHeaders connected", subscriptionId)
    })
    .on("data", function newBlockHeadersRecieved(blockHeader) {
      cb(blockHeader, null)
    })
    .on("error", function newBlockHeadersError(error) {
      cb(null, error)
    })
}

const watchEvent = async (eventName, fromBlock = 0, cb = function () {}) => {
  const web3Ws = new Web3(
    new Web3.providers.WebsocketProvider(WEB3_PROVIDER_WS, {
      clientOptions: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
      },
    }),
  )
  const watchContract = await new web3Ws.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS)

  // keep ws connection alive
  console.log(new Date(), "running watcher")
  web3Ws.eth
    .subscribe("newBlockHeaders")
    .on("connected", function newBlockHeadersConnected(subscriptionId) {
      console.log(new Date(), "newBlockHeaders connected", subscriptionId)
    })
    .on("data", function newBlockHeadersRecieved(blockHeader) {
      console.log(new Date(), "got block", blockHeader.number)
    })
    .on("error", function newBlockHeadersError(error) {
      console.error(new Date(), "ERROR:")
      console.error(error)
    })

  watchContract.events[eventName]({
    fromBlock,
  })
    .on("data", async function onCurrencyUpdateEvent(event) {
      cb(event, null)
    })
    .on("error", function onCurrencyUpdateError(error) {
      cb(null, error)
    })
}

const getBlockNumber = async () => {
  const web3 = new Web3(WEB3_PROVIDER_HTTP)
  return web3.eth.getBlockNumber()
}

const getPastEvents = async (fromBlock, toBlock, eventName, cb = function () {}) => {
  const web3 = new Web3(WEB3_PROVIDER_HTTP)
  const contract = await new web3.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS)
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
  getLastSubmitTime,
  getPastEvents,
  setThreshold,
  submitPrice,
  watchBlocks,
  watchEvent,
}
