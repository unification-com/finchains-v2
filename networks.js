require("dotenv").config()
const HDWalletProvider = require("@truffle/hdwallet-provider")

const { CONTRACT_DEPLOY_PKEY, WEB3_PROVIDER_HTTP } = process.env

module.exports = {
  networks: {
    development: {
      protocol: "http",
      host: "localhost",
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: "*",
    },
    finchains: {
      provider: () => new HDWalletProvider([CONTRACT_DEPLOY_PKEY], WEB3_PROVIDER_HTTP, 0, 1),
      networkId: 867,
      gasPrice: 10e9,
    },
  },
}
