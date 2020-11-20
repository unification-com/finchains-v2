import React from "react"
import PropTypes from "prop-types"

export default class Currency extends React.Component {
  constructor(props) {
    super(props)
    this.formatNumber = this.formatNumber.bind(this)
    this.currencySymbol = this.currencySymbol.bind(this)
    this.state = {
      formatted: null,
    }
  }

  formatNumber() {
    const { price } = this.props
    return new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 20 }).format(price)
  }

  currencySymbol() {
    const { currency } = this.props
    switch (currency) {
      case "GBP":
        return { sym: "£", before: true }
      case "USD":
      case "CAD":
      case "AUD":
        return { sym: "$", before: true }
      case "EUR":
        return { sym: "€", before: true }
      case "CNY":
        return { sym: "¥", before: true }
      case "HKD":
        return { sym: "HK$", before: true }
      case "JPY":
        return { sym: "¥", before: true }
      case "BTC":
      case "XBT":
        return { sym: "₿", before: true }
      case "XMR":
        return { sym: "ɱ", before: true }
      case "LTC":
        return { sym: "Ł", before: true }
      case "ETH":
        return { sym: "Ξ", before: true }
      default:
        return { sym: currency, before: false }
    }
  }

  async componentDidMount() {
    const { displaySymbol } = this.props
    const price = this.formatNumber()
    const symbol = this.currencySymbol()
    const formatted = displaySymbol ? (symbol.before ? `${symbol.sym}${price}` : `${price} ${symbol.sym}`) : price
    await this.setState({ formatted })
  }

  render() {
    const { formatted } = this.state
    return <span>{formatted}</span>
  }
}

Currency.propTypes = {
  price: PropTypes.string || PropTypes.number,
  currency: PropTypes.string,
  displaySymbol: PropTypes.bool,
}
