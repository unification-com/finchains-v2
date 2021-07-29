const { getDexPrices } = require("./dexsubgraph")

const QL_URL = "https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2"
const QL_ENDPOINT = "pair"
const TOKEN_0 = "token0"
const TOKEN_0_PRICE = "token0Price"
const TOKEN_1 = "token1"
const TOKEN_1_PRICE = "token1Price"

// DEXs use pair contract address in place of SYMBOL pairs
const PAIRS = [
  "0xc736ca3d9b1e90af4230bd8f9626528b3d4e0ee0", // WBNB/BabyDoge
]

// For each pair contract, this will return two reciprocal price objects
// e.g. xFUND/WETH and WETH/xFUND
const getPrices = async () => {
  return getDexPrices(PAIRS, QL_URL, QL_ENDPOINT, TOKEN_0, TOKEN_0_PRICE, TOKEN_1, TOKEN_1_PRICE)
}

module.exports = {
  getPrices,
}
