const { getDexPrices } = require("./dexsubgraph")

const QL_URL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
const QL_ENDPOINT = "pair"
const TOKEN_0 = "token0"
const TOKEN_0_PRICE = "token0Price"
const TOKEN_1 = "token1"
const TOKEN_1_PRICE = "token1Price"

// DEXs use pair contract address in place of SYMBOL pairs
const PAIRS = [
  "0xab2d2f5bc36620a57ec4bb60d6a7df2a847deab5", // xFUND/WETH
  "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11", // DAI/WETH
]
// For each pair contract, this will return two reciprocal price objects
// e.g. xFUND/WETH and WETH/xFUND
const getPrices = async () => {
  return getDexPrices(PAIRS, QL_URL, QL_ENDPOINT, TOKEN_0, TOKEN_0_PRICE, TOKEN_1, TOKEN_1_PRICE)
}

module.exports = {
  getPrices,
}
