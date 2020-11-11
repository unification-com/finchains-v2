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
    default:
      return exchange.charAt(0).toUpperCase() + exchange.slice(1)
  }
}

module.exports = {
  exchangeLookup,
}
