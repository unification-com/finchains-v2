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

export default class CurrencyHistoryContainer extends React.Component {
  constructor(props) {
    super(props)

    const { currentBase, currentTarget } = this.props
    const currentPair = `${currentBase}/${currentTarget}`

    this.fetchData = this.fetchData.bind(this)

    this.state = {
      currentBase,
      currentTarget,
      currentPair,
      bases: {},
      targets: {},
      currencyData: {},
      chartData: [],
      discrepancyData: {},
      latestPrices: {},
      dataLoading: true,
    }
  }

  async fetchData() {
    const { currentBase, currentPair } = this.state
    let bases = {}
    const basesApiUrl = "/api/pairs/bases"
    const basesDataRes = await fetch(basesApiUrl)
    if (basesDataRes.ok && basesDataRes.status === 200) {
      bases = await basesDataRes.json()
    }

    let targets = {}
    const targetsApiUrl = `/api/pairs/${currentBase}`

    const targetsDataRes = await fetch(targetsApiUrl)
    if (targetsDataRes.ok && targetsDataRes.status === 200) {
      targets = await targetsDataRes.json()
    }

    let currencyData = {}

    const dataApiUrl = `/api/currency/${currentPair}`

    const currencyDataRes = await fetch(dataApiUrl)
    if (currencyDataRes.ok && currencyDataRes.status === 200) {
      currencyData = await currencyDataRes.json()
    }

    let chartData = []
    const chartDatapiUrl = `/api/currency/${currentPair}/chart`

    const chartDataRes = await fetch(chartDatapiUrl)
    if (chartDataRes.ok && chartDataRes.status === 200) {
      chartData = await chartDataRes.json()
    }

    let discrepancyData = {}

    const discrepancyApiUrl = `/api/discrepancy/${currentPair}`

    const discrepancyDataRes = await fetch(discrepancyApiUrl)
    if (discrepancyDataRes.ok && discrepancyDataRes.status === 200) {
      discrepancyData = await discrepancyDataRes.json()
    }

    let latestPrices = {}
    const latestApiUrl = `/api/currency/${currentPair}/latest`

    const latestDataRes = await fetch(latestApiUrl)
    if (latestDataRes.ok && latestDataRes.status === 200) {
      latestPrices = await latestDataRes.json()
    }

    await this.setState({
      bases,
      targets,
      currencyData,
      chartData,
      discrepancyData,
      latestPrices,
      dataLoading: false,
    })
  }

  async componentDidMount() {
    await this.fetchData()
  }

  render() {
    const {
      currentBase,
      currentTarget,
      currentPair,
      bases,
      targets,
      currencyData,
      chartData,
      discrepancyData,
      latestPrices,
      dataLoading,
    } = this.state

    return (
      <>
        {dataLoading ? <></> : <LatestPrices latestPrices={latestPrices} />}
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      {dataLoading ? (
                        <h4>Loading</h4>
                      ) : (
                        <h4>
                          <PairSelect
                            bases={bases}
                            targets={targets}
                            currentBase={currentBase}
                            currentTarget={currentTarget}
                            url={"/history/"}
                          />
                        </h4>
                      )}
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {dataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <PriceChart priceData={chartData} base={currentBase} target={currentTarget} legend={true} />
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
                      <h3>{currentPair} - Last 100 Submissions</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {dataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <CurrencyUpdateTable
                    data={currencyData}
                    base={currentBase}
                    target={currentTarget}
                    paginate={true}
                    apiUrl={`/api/currency/${currentPair}`}
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
                      <h3>{currentPair} - Last 100 Discrepancies</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {dataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <DiscrepancyTable
                    data={discrepancyData}
                    base={currentBase}
                    target={currentTarget}
                    paginate={true}
                    apiUrl={`/api/discrepancy/${currentPair}`}
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

CurrencyHistoryContainer.propTypes = {
  currentBase: PropTypes.string,
  currentTarget: PropTypes.string,
}
