const exchangeLookup = (exchange) => {
  switch (exchange) {
    case "gdax":
      return "Coinbase Pro"
    case "binance_us":
      return "Binance US"
    case "huobi":
      return "Huobi Global"
    case "kucoin":
      return "KuCoin"
    case "crypto_com":
      return "Crypto.com"
    case "pancakeswap":
      return "PancakeSwap"
    case "quickswap":
      return "QuickSwap"
    case "shibaswap":
      return "Shibaswap"
    case "sushiswap":
      return "SushiSwap"
    case "uniswapv2":
      return "Uniswap v2"
    case "uniswapv3":
      return "Uniswap v3"
    case "mexc":
      return "MEXC"
    case "bitget":
      return "Bitget"
    case "biconomy":
      return "Biconomy"
    case "okc":
      return "OKX"
    case "poloniex":
      return "Poloniex"
    case "xt_com":
      return "XT.com"
    default:
      return exchange ? exchange.charAt(0).toUpperCase() + exchange.slice(1) : ""
  }
}

const exchageTlaLookup = [
  {
    exchange: "binance",
    tla: "BNC",
  },
  {
    exchange: "bitfinex",
    tla: "BFI",
  },
  {
    exchange: "bitforex",
    tla: "BFO",
  },
  {
    exchange: "bitmart",
    tla: "BMR",
  },
  {
    exchange: "bitstamp",
    tla: "BTS",
  },
  {
    exchange: "bittrex",
    tla: "BTX",
  },
  {
    exchange: "coinsbit",
    tla: "CBT",
  },
  {
    exchange: "crypto_com",
    tla: "CRY",
  },
  {
    exchange: "digifinex",
    tla: "DFX",
  },
  {
    exchange: "gate",
    tla: "GAT",
  },
  {
    exchange: "gdax",
    tla: "GDX",
  },
  {
    exchange: "gemini",
    tla: "GMN",
  },
  {
    exchange: "huobi",
    tla: "HUO",
  },
  {
    exchange: "kraken",
    tla: "KRK",
  },
  {
    exchange: "probit",
    tla: "PRB",
  },
  {
    exchange: "pancakeswap",
    tla: "PNK",
  },
  {
    exchange: "quickswap",
    tla: "QWK",
  },
  {
    exchange: "shibaswap",
    tla: "SHB",
  },
  {
    exchange: "sushiswap",
    tla: "SHS",
  },
  {
    exchange: "uniswapv2",
    tla: "UN2",
  },
  {
    exchange: "uniswapv3",
    tla: "UN3",
  },
  {
    exchange: "mexc",
    tla: "MEX",
  },
  {
    exchange: "bitget",
    tla: "BTG",
  },
  {
    exchange: "biconomy",
    tla: "BIC",
  },
  {
    exchange: "okx",
    tla: "OKX",
  },
  {
    exchange: "poloniex",
    tla: "PLX",
  },
  {
    exchange: "xt_com",
    tla: "XTC",
  },
]

const tlaToExchange = (tla) => {
  let exchange
  for (let i = 0; i < exchageTlaLookup.length; i += 1) {
    if (tla === exchageTlaLookup[i].tla) {
      exchange = exchageTlaLookup[i].exchange
    }
  }
  return exchange
}

const exchangeToTla = (ex) => {
  let tla
  for (let i = 0; i < exchageTlaLookup.length; i += 1) {
    if (ex === exchageTlaLookup[i].exchange) {
      tla = exchageTlaLookup[i].tla
    }
  }
  return tla
}

module.exports = {
  exchangeLookup,
  exchangeToTla,
  tlaToExchange,
}
