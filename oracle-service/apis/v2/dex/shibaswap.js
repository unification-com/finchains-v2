const { DexSubgraph } = require("./dexsubgraph")

const QL_URL = "https://api.thegraph.com/subgraphs/name/shibaswaparmy/exchange"
const QL_ENDPOINT = "pairs"
const TOKEN_0 = "token0"
const TOKEN_0_PRICE = "token0Price"
const TOKEN_1 = "token1"
const TOKEN_1_PRICE = "token1Price"

// DEXs use pair contract address in place of SYMBOL pairs
const PAIRS = [
  "0x43a76c98cd94e309b0ab1757a42a51bcaa334ff5", // xFUND/WETH
  "0x8faf958e36c6970497386118030e6297fff8d275", // DAI/WETH
  "0x86cccda3799a43fbceb4cec6ad8b028f5bf8b3dd", // WBTC/WETH
  "0x20e95253e54490d8d30ea41574b24f741ee70201", // USDC/WETH
  "0x703b120f15ab77b986a24c6f9262364d02f9432f", // USDT/WETH
  "0xcf6daab95c476106eca715d48de4b13287ffdeaa", // SHIB/WETH
  "0x6cbefa95e42960e579c2a3058c05c6a08e2498e9", // SUSHI/WETH
  "0x9d406c4067a53f65de1a8a9273d55bfea5870a75", // UNI/WETH
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
