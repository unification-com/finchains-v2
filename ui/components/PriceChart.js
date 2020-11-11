import React from "react"
import PropTypes from "prop-types"
import { Line } from "react-chartjs-2"
import randomColor from "randomcolor"
import { exchangeLookup } from "../utils/exchange"

export default class PriceChart extends React.Component {
  constructor(props) {
    super(props)

    this.setChart = this.setChart.bind(this)
    this.generateMultiChart = this.generateMultiChart.bind(this)
    this.formatDate = this.formatDate.bind(this)

    const { base, target } = this.props

    this.state = {
      chartData: null,
      chartOptions: null,
      dataLoaded: false,
      base,
      target,
    }
  }

  formatDate(timestamp) {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(timestamp * 1000))
  }

  generateMultiChart() {
    const { priceData, base, target } = this.props

    const labels = [] // array of labels
    const dataSets = [] // array of final objects
    const dataByDate = {}
    const exchanges = []
    const firstData = {}

    if (priceData.results) {
      // calculate exchanges and labels first
      for (let i = 0; i < priceData.results.length; i += 1) {
        const res = priceData.results[i]
        const formattedTime = this.formatDate(priceData.results[i].timestamp)
        const exchange = res["ExchangeOracle.exchange"]
        if (!exchanges.includes(exchange)) {
          exchanges.push(exchange)
        }

        if (!labels.includes(formattedTime)) {
          labels.push(formattedTime)
        }

        if (!firstData[exchange]) {
          firstData[exchange] = parseFloat(res.priceRaw)
        }
      }
      labels.sort()

      for (let i = 0; i < priceData.results.length; i += 1) {
        // get info
        const res = priceData.results[i]
        const exchange = res["ExchangeOracle.exchange"]
        const price = parseFloat(res.priceRaw)
        const timestamp = res.timestamp
        const formattedTime = this.formatDate(timestamp)

        for (let j = 0; j < exchanges.length; j += 1) {
          if (!dataByDate[formattedTime]) {
            dataByDate[formattedTime] = {}
          }

          dataByDate[formattedTime][exchanges[j]] = 0.0
        }

        dataByDate[formattedTime][exchange] = price
      }

      for (let i = 0; i < exchanges.length; i += 1) {
        const exchange = exchanges[i]
        const data = []
        for (const dateKey of Object.keys(dataByDate)) {
          let price = dataByDate[dateKey][exchange]
          if (price <= 0.0) {
            if (data.length === 0) {
              price = firstData[exchange]
            } else {
              price = data[data.length - 1]
            }
          }
          data.push(price)
        }

        const colour = randomColor({ format: "rgba", luminosity: "bright", hue: "blue", alpha: 0.9 })

        const exchangeData = {
          label: exchangeLookup(exchange),
          data,
          backgroundColor: colour.replace("0.9", "0.2"),
          borderColor: colour,
          fill: true,
        }
        dataSets.push(exchangeData)
      }
    }

    const chartData = { labels, datasets: dataSets }

    const chartOptions = {}

    return { chartData, chartOptions }
  }

  async setChart() {
    const { chartData, chartOptions } = this.generateMultiChart()

    this.setState({ chartData, chartOptions, dataLoaded: true })
  }

  async componentDidMount() {
    await this.setChart()
  }

  render() {
    const { chartData, chartOptions, dataLoaded } = this.state

    if (dataLoaded) {
      return <Line data={chartData} options={chartOptions} />
    }
    return <></>
  }
}

PriceChart.propTypes = {
  priceData: PropTypes.object,
  base: PropTypes.string,
  target: PropTypes.string,
}
