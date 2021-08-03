const { DexSubgraph } = require("./dexsubgraph")

const QL_URL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
const QL_ENDPOINT = "pairs"
const TOKEN_0 = "token0"
const TOKEN_0_PRICE = "token0Price"
const TOKEN_1 = "token1"
const TOKEN_1_PRICE = "token1Price"

// DEXs use pair contract address in place of SYMBOL pairs
const PAIRS = [
  "0xab2d2f5bc36620a57ec4bb60d6a7df2a847deab5", // xFUND/WETH
  "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11", // DAI/WETH
  "0xbb2b8038a1640196fbe3e38816f3e67cba72d940", // WBTC/WETH
  "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc", // USDC/WETH
  "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", // USDT/WETH
  "0x811beed0119b4afce20d2583eb608c6f7af1954f", // SHIB/WETH
  "0xce84867c3c02b05dc570d0135103d3fb9cc19433", // SUSHI/WETH
  "0xd3d2e2692501a5c9ca623199d38826e513033a17", // UNI/WETH
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
