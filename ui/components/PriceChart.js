import React from "react"
import ButtonGroup from "react-bootstrap/cjs/ButtonGroup"
import Button from "react-bootstrap/cjs/Button"
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
    this.setTimestampFrom = this.setTimestampFrom.bind(this)
    this.setChartWithFromTime = this.setChartWithFromTime.bind(this)

    const { base, target } = this.props

    const d = new Date()
    const tsNow = Math.floor(d / 1000)

    this.state = {
      chartData: null,
      chartOptions: null,
      dataLoaded: false,
      base,
      target,
      tsNow,
      tsFrom: tsNow,
      tsFromOut: "Week",
      colours: {},
    }
  }

  async setTimestampFrom(from) {
    const { tsNow } = this.state
    const oneHour = 60 * 60
    const twoHours = oneHour * 2
    const sixHours = twoHours * 3
    const twelveHours = sixHours * 2
    const oneDay = twelveHours * 2
    const oneWeek = oneDay * 7

    let tsFrom
    let tsFromOut

    switch (from) {
      case "1hour":
        tsFrom = tsNow - oneHour
        tsFromOut = "Hour"
        break
      case "2hours":
        tsFrom = tsNow - twoHours
        tsFromOut = "2 Hours"
        break
      case "6hours":
        tsFrom = tsNow - sixHours
        tsFromOut = "6 Hours"
        break
      case "12hours":
        tsFrom = tsNow - twelveHours
        tsFromOut = "12 Hours"
        break
      case "1day":
        tsFrom = tsNow - oneDay
        tsFromOut = "Day"
        break
      case "1week":
      default:
        tsFrom = tsNow - oneWeek
        tsFromOut = "Week"
        break
    }
    await this.setState({ tsFrom, tsFromOut })
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
    const { priceData, base, target, legend } = this.props
    const { tsFrom, tsNow, colours } = this.state

    const labels = [] // array of labels
    const dataSets = [] // array of final objects
    const dataByDate = {}
    const exchanges = []
    const firstData = {}

    if (priceData) {
      // calculate exchanges and labels first
      for (let i = 0; i < priceData.length; i += 1) {
        const res = priceData[i]
        if (res.timestamp >= tsFrom) {
          const formattedTime = this.formatDate(res.timestamp)
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
      }
      labels.sort()

      for (let i = 0; i < priceData.length; i += 1) {
        // get info
        const res = priceData[i]
        const exchange = res["ExchangeOracle.exchange"]
        const price = parseFloat(res.priceRaw)
        const timestamp = res.timestamp
        if (timestamp >= tsFrom) {
          const formattedTime = this.formatDate(timestamp)

          for (let j = 0; j < exchanges.length; j += 1) {
            if (!dataByDate[formattedTime]) {
              dataByDate[formattedTime] = {}
            }

            dataByDate[formattedTime][exchanges[j]] = 0.0
          }

          dataByDate[formattedTime][exchange] = price
        }
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

        const exchangeData = {
          label: exchangeLookup(exchange),
          data,
          backgroundColor: colours[exchange].backgroundColor,
          borderColor: colours[exchange].borderColor,
          fill: true,
          // borderWidth: 1,
          borderDashOffset: 0.0,
          pointRadius: 1,
          // lineTension: 0.5,
        }
        dataSets.push(exchangeData)
      }
    }

    const chartData = { labels, datasets: dataSets }

    const chartOptions = {
      legend: {
        display: { legend },
      },
    }

    return { chartData, chartOptions }
  }

  async setChart() {
    const { chartData, chartOptions } = this.generateMultiChart()

    await this.setState({ chartData, chartOptions, dataLoaded: true })
  }

  async componentDidMount() {
    const { priceData } = this.props
    const colours = {}
    if (priceData) {
      // calculate exchanges and labels first
      for (let i = 0; i < priceData.length; i += 1) {
        const exchange = priceData[i]["ExchangeOracle.exchange"]
        if (!colours[exchange]) {
          const colour = randomColor({ format: "rgba", luminosity: "bright", hue: "blue", alpha: 0.9 })
          colours[exchange] = {
            backgroundColor: colour.replace("0.9", "0.2"),
            borderColor: colour,
          }
        }
      }
    }
    await this.setState({ colours })
    await this.setTimestampFrom("1week")
    await this.setChart()
  }

  async setChartWithFromTime(from) {
    await this.setTimestampFrom(from)
    await this.setChart()
  }

  render() {
    const { chartData, chartOptions, dataLoaded, tsFromOut, tsFrom, tsNow } = this.state

    if (dataLoaded) {
      return (
        <>
          <h4 className="float-left">
            Last {tsFromOut}: {this.formatDate(tsFrom)} - {this.formatDate(tsNow)}
          </h4>
          <ButtonGroup className="btn-group-toggle float-right" data-toggle="buttons">
            <Button
              tag="label"
              className={"btn-simple"}
              color="info"
              size="sm"
              onClick={async () => await this.setChartWithFromTime("1hour")}
            >
              1 Hour
            </Button>
            <Button
              tag="label"
              className={"btn-simple"}
              color="info"
              size="sm"
              onClick={async () => await this.setChartWithFromTime("2hours")}
            >
              2 Hours
            </Button>
            <Button
              tag="label"
              className={"btn-simple"}
              color="info"
              size="sm"
              onClick={async () => await this.setChartWithFromTime("6hours")}
            >
              6 Hours
            </Button>
            <Button
              tag="label"
              className={"btn-simple"}
              color="info"
              size="sm"
              onClick={async () => await this.setChartWithFromTime("12hours")}
            >
              12 Hours
            </Button>
            <Button
              tag="label"
              className={"btn-simple"}
              color="info"
              size="sm"
              onClick={async () => await this.setChartWithFromTime("1day")}
            >
              1 Day
            </Button>
            <Button
              tag="label"
              className={"btn-simple"}
              color="info"
              size="sm"
              onClick={async () => await this.setChartWithFromTime("1week")}
            >
              1 Week
            </Button>
          </ButtonGroup>
          <Line data={chartData} options={chartOptions} />
        </>
      )
    }
    return <></>
  }
}

PriceChart.propTypes = {
  priceData: PropTypes.array,
  base: PropTypes.string,
  target: PropTypes.string,
  legend: PropTypes.bool,
}
