import React from "react"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"

import { exchangeLookup } from "../utils/exchange"

export default class ExchangeSelect extends React.Component {
  constructor(props) {
    super(props)

    this.handleExchangeChange = this.handleExchangeChange.bind(this)
    this.fetchPairs = this.fetchPairs.bind(this)

    const { currentExchange } = this.props
    this.state = { currentExchange }
  }

  async fetchPairs() {
    const { currentExchange } = this.state
    const targetsApiUrl = `/api/exchange/${currentExchange}/pairs`

    let pairs = []
    const targetsDataRes = await fetch(targetsApiUrl)
    if (targetsDataRes.ok && targetsDataRes.status === 200) {
      pairs = await targetsDataRes.json()
    }

    return pairs
  }

  async handleExchangeChange(event) {
    const { url } = this.props
    const exchange = event.target.value
    await this.setState({ currentExchange: exchange })
    const pairs = await this.fetchPairs()
    if (pairs.length > 0) {
      window.location = `${url}${exchange}/${pairs[0].base}/${pairs[0].targets[0]}`
    }
  }

  render() {
    const { currentExchange, exchanges } = this.props

    const exchangeOptions = exchanges.map((v) => (
      <option key={`e_${v.exchange}`} value={v.exchange}>
        {exchangeLookup(v.exchange)}
      </option>
    ))

    return (
      <>
        <select value={currentExchange} onChange={this.handleExchangeChange} className={"select-css"}>
          <option key={`e_select_default`} value={exchanges[0].exchange}>
            Select...
          </option>
          {exchangeOptions}
        </select>
      </>
    )
  }
}

ExchangeSelect.propTypes = {
  currentExchange: PropTypes.string,
  exchanges: PropTypes.array,
  url: PropTypes.string,
}
