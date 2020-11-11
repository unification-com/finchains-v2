const formatNumber = (num) => {
  return new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 20 }).format(num)
}

const currencySymbol = (currency) => {
  switch (currency) {
    case "GBP":
      return "£"
    case "USD":
    case "CAD":
    case "AUD":
      return "$"
    case "EUR":
      return "€"
    case "CNY":
      return "¥"
    case "HKD":
      return "HK$"
    case "JPY":
      return "¥"
    case "BTC":
    case "XBT":
      return "₿"
    case "XMR":
      return "ɱ"
    case "LTC":
      return "Ł"
    case "ETH":
      return "Ξ"
    default:
      return ""
  }
}

module.exports = { currencySymbol, formatNumber }
