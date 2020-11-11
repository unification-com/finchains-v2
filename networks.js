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
      protocol: "http",
      host: "35.194.35.234",
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: "867",
    },
  },
}
