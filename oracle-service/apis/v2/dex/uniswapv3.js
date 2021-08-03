const { DexSubgraph } = require("./dexsubgraph")

const QL_URL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
const QL_ENDPOINT = "pools"
const TOKEN_0 = "token0"
const TOKEN_0_PRICE = "token0Price"
const TOKEN_1 = "token1"
const TOKEN_1_PRICE = "token1Price"

// DEXs use pair contract address in place of SYMBOL pairs
const PAIRS = [
  "0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8", // DAI/WETH
  "0xcbcdf9626bc03e24f779434178a73a0b4bad62ed", // WBTC/WETH
  "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8", // USDC/WETH
  "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36", // USDT/WETH
  "0x2f62f2b4c5fcd7570a709dec05d68ea19c82a9ec", // SHIB/WETH
  "0x73a6a761fe483ba19debb8f56ac5bbf14c0cdad1", // SUSHI/WETH
  "0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801", // UNI/WETH
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
