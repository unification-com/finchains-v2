const { DexSubgraph } = require("./dexsubgraph")

const QL_URL = "https://api.thegraph.com/subgraphs/name/sushiswap/exchange"
const QL_ENDPOINT = "pairs"
const TOKEN_0 = "token0"
const TOKEN_0_PRICE = "token0Price"
const TOKEN_1 = "token1"
const TOKEN_1_PRICE = "token1Price"

// DEXs use pair contract address in place of SYMBOL pairs
const PAIRS = [
  "0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f", // DAI/WETH
  "0xceff51756c56ceffca006cd410b03ffc46dd3a58", // WBTC/WETH
  "0x397ff1542f962076d0bfe58ea045ffa2d347aca0", // USDC/WETH
  "0x06da0fd433c1a5d7a4faa01111c044910a184553", // USDT/WETH
  "0x24d3dd4a62e29770cf98810b09f89d3a90279e7a", // SHIB/WETH
  "0x795065dcc9f64b5614c407a6efdc400da6221fb0", // SUSHI/WETH
  "0xdafd66636e2561b0284edde37e42d192f2844d40", // UNI/WETH
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
