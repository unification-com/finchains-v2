const { DexSubgraph } = require("./dexsubgraph")

const QL_URL = "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06"
const QL_ENDPOINT = "pairs"
const TOKEN_0 = "token0"
const TOKEN_0_PRICE = "token0Price"
const TOKEN_1 = "token1"
const TOKEN_1_PRICE = "token1Price"

// DEXs use pair contract address in place of SYMBOL pairs
const PAIRS = [
  "0x4a35582a710e1f4b2030a3f826da20bfb6703c09", // DAI/WETH
  "0xdc9232e2df177d7a12fdff6ecbab114e2231198d", // WBTC/WETH
  "0x853ee4b2a13f8a742d64c8f088be7ba2131f670d", // USDC/WETH
  "0xf6422b997c7f54d1c6a6e103bcb1499eea0a7046", // USDT/WETH
]

// For each pair contract, this will return two reciprocal price objects
// e.g. xFUND/WETH and WETH/xFUND
const getPrices = async () => {
  const subql = new DexSubgraph(QL_URL, QL_ENDPOINT, TOKEN_0, TOKEN_0_PRICE, TOKEN_1, TOKEN_1_PRICE, true)
  return subql.getData(PAIRS)
}

module.exports = {
  getPrices,
}
