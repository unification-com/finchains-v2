const { getDexPrices } = require("./dexsubgraph")

const QL_URL = "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap"
const QL_ENDPOINT = "pair"
const TOKEN_0 = "token0"
const TOKEN_0_PRICE = "token0Price"
const TOKEN_1 = "token1"
const TOKEN_1_PRICE = "token1Price"

// DEXs use pair contract address in place of SYMBOL pairs
const PAIRS = [
  "0x4a35582a710e1f4b2030a3f826da20bfb6703c09", // DAI/WETH
]

// For each pair contract, this will return two reciprocal price objects
// e.g. xFUND/WETH and WETH/xFUND
const getPrices = async () => {
  return getDexPrices(PAIRS, QL_URL, QL_ENDPOINT, TOKEN_0, TOKEN_0_PRICE, TOKEN_1, TOKEN_1_PRICE)
}

module.exports = {
  getPrices,
}
