import React from "react"
import fetch from "isomorphic-unfetch"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import PropTypes from "prop-types"
import PairSelect from "../PairSelect"
import LatestPrices from "../LatestPrices"
import PriceChart from "../PriceChart"
import CurrencyUpdateTable from "../CurrencyUpdateTable"
import DiscrepancyTable from "../DiscrepancyTable"
import { exchangeLookup } from "../../utils/exchange"
import ExchangeSelect from "../ExchangeSelect"

export default class ExchangeContainer extends React.Component {
  constructor(props) {
    super(props)

    const { currentBase, currentTarget, exchange } = this.props
    const currentPair = `${currentBase}/${currentTarget}`

    this.fetchExchangesData = this.fetchExchangesData.bind(this)
    this.fetchPairData = this.fetchPairData.bind(this)
    this.fetchCurrencyData = this.fetchCurrencyData.bind(this)
    this.fetchDiscrepancyData = this.fetchDiscrepancyData.bind(this)
    this.fetchLatestPricesData = this.fetchLatestPricesData.bind(this)
    this.fetchChartData = this.fetchChartData.bind(this)

    this.state = {
      currentBase,
      currentTarget,
      currentPair,
      exchange,
      exchanges: [],
      bases: [],
      targets: [],
      currencyData: {},
      latestPriceData: [],
      chartData: [],
      discrepancyData: {},
      exchangesDataLoading: true,
      pairsDataLoading: true,
      currencyDataLoading: true,
      discrepancyDataLoading: true,
      latestPriceDataLoading: true,
      chartDataLoading: true,
    }
  }

  async fetchExchangesData() {
    let exchanges = []
    const exchangesApiUrl = `/api/exchange`
    const exchangesDataRes = await fetch(exchangesApiUrl)
    if (exchangesDataRes.ok && exchangesDataRes.status === 200) {
      exchanges = await exchangesDataRes.json()
    }
    await this.setState({
      exchanges,
      exchangesDataLoading: false,
    })
  }

  async fetchPairData() {
    const { currentBase, exchange } = this.state

    let bases = []
    const basesApiUrl = `/api/exchange/${exchange}/bases`
    const basesDataRes = await fetch(basesApiUrl)
    if (basesDataRes.ok && basesDataRes.status === 200) {
      bases = await basesDataRes.json()
    }

    let targets = []
    const targetsApiUrl = `/api/exchange/${exchange}/${currentBase}/targets`

    const targetsDataRes = await fetch(targetsApiUrl)
    if (targetsDataRes.ok && targetsDataRes.status === 200) {
      targets = await targetsDataRes.json()
    }
    await this.setState({
      bases,
      targets,
      pairsDataLoading: false,
    })
  }

  async fetchCurrencyData() {
    const { currentPair, exchange } = this.state

    let currencyData = {}
    const dataApiUrl = `/api/exchange/${exchange}/${currentPair}`
    const currencyDataRes = await fetch(dataApiUrl)
    if (currencyDataRes.ok && currencyDataRes.status === 200) {
      currencyData = await currencyDataRes.json()
    }
    await this.setState({
      currencyData,
      currencyDataLoading: false,
    })
  }

  async fetchDiscrepancyData() {
    const { currentPair, exchange } = this.state

    let discrepancyData = {}
    const discrepancyApiUrl = `/api/exchange/${exchange}/${currentPair}/discrepancy`
    const discrepancyDataRes = await fetch(discrepancyApiUrl)
    if (discrepancyDataRes.ok && discrepancyDataRes.status === 200) {
      discrepancyData = await discrepancyDataRes.json()
    }
    await this.setState({
      discrepancyData,
      discrepancyDataLoading: false,
    })
  }

  async fetchLatestPricesData() {
    const { currentPair, exchange } = this.state

    const latestPriceData = []
    const latestPriceUrl = `/api/exchange/${exchange}/${currentPair}/latest`
    const latestPriceDataRes = await fetch(latestPriceUrl)
    if (latestPriceDataRes.ok && latestPriceDataRes.status === 200) {
      latestPriceData.push(await latestPriceDataRes.json())
    }

    await this.setState({
      latestPriceData,
      latestPriceDataLoading: false,
    })
  }

  async fetchChartData() {
    const { currentPair, exchange } = this.state

    let chartData = []
    const chartDatapiUrl = `/api/exchange/${exchange}/${currentPair}/chart`

    const chartDataRes = await fetch(chartDatapiUrl)
    if (chartDataRes.ok && chartDataRes.status === 200) {
      chartData = await chartDataRes.json()
    }

    await this.setState({
      chartData,
      chartDataLoading: false,
    })
  }

  componentDidMount() {
    this.fetchExchangesData()
    this.fetchPairData()
    this.fetchCurrencyData()
    this.fetchDiscrepancyData()
    this.fetchLatestPricesData()
    this.fetchChartData()
  }

  render() {
    const {
      currentBase,
      currentTarget,
      currentPair,
      exchange,
      bases,
      targets,
      currencyData,
      chartData,
      exchanges,
      discrepancyData,
      latestPriceData,
      exchangesDataLoading,
      pairsDataLoading,
      currencyDataLoading,
      discrepancyDataLoading,
      latestPriceDataLoading,
      chartDataLoading,
    } = this.state

    return (
      <>
        {latestPriceDataLoading ? <></> : <LatestPrices latestPrices={latestPriceData} />}
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      {exchangesDataLoading || pairsDataLoading ? (
                        <h4>Loading</h4>
                      ) : (
                        <h4>
                          <img src={`/img/${exchange}.webp`} alt={exchangeLookup(exchange)} width={"40"} />{" "}
                          <ExchangeSelect
                            url={"/exchange/"}
                            exchanges={exchanges}
                            currentExchange={exchange}
                          />
                          {" : "}
                          <PairSelect
                            bases={bases}
                            targets={targets}
                            currentBase={currentBase}
                            currentTarget={currentTarget}
                            url={`/exchange/${exchange}/`}
                            exchange={exchange}
                          />
                        </h4>
                      )}
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {chartDataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <PriceChart
                    priceData={chartData}
                    base={currentBase}
                    target={currentTarget}
                    legend={false}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h3>
                        {exchangeLookup(exchange)}: {currentPair} - Submission History
                      </h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {currencyDataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <CurrencyUpdateTable
                    data={currencyData}
                    base={currentBase}
                    target={currentTarget}
                    paginate={true}
                    apiUrl={`/api/exchange/${exchange}/${currentPair}`}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h3>
                        {exchangeLookup(exchange)}: {currentPair} - Discrepancy History
                      </h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {discrepancyDataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <DiscrepancyTable
                    data={discrepancyData}
                    base={currentBase}
                    target={currentTarget}
                    paginate={true}
                    apiUrl={`/api/exchange/${exchange}/${currentPair}/discrepancy`}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    )
  }
}

ExchangeContainer.propTypes = {
  currentBase: PropTypes.string,
  currentTarget: PropTypes.string,
  exchange: PropTypes.string,
}
