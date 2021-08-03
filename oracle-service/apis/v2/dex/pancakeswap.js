const { DexSubgraph } = require("./dexsubgraph")

const QL_URL = "https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2"
const QL_ENDPOINT = "pairs"
const TOKEN_0 = "token0"
const TOKEN_0_PRICE = "token0Price"
const TOKEN_1 = "token1"
const TOKEN_1_PRICE = "token1Price"

// DEXs use pair contract address in place of SYMBOL pairs
const PAIRS = [
  "0xd171b26e4484402de70e3ea256be5a2630d7e88d", // WBTC/WETH
  "0x16afc4f2ad82986bbe2a4525601f8199ab9c832d", // SUSHI/WETH
]

// For each pair contract, this will return two reciprocal price objects
// e.g. xFUND/WETH and WETH/xFUND
const getPrices = async () => {
  const subql = new DexSubgraph(QL_URL, QL_ENDPOINT, TOKEN_0, TOKEN_0_PRICE, TOKEN_1, TOKEN_1_PRICE)
  return subql.getData(PAIRS)
}

module.exports = {
  getPrices,
}
