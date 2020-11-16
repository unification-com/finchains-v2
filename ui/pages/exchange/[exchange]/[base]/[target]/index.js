import React from "react"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import fetch from "isomorphic-unfetch"
import PropTypes from "prop-types"
import PriceChart from "../../../../../components/PriceChart"
import Layout from "../../../../../layouts/layout"
import CurrencyUpdateTable from "../../../../../components/CurrencyUpdateTable"
import DiscrepancyTable from "../../../../../components/DiscrepancyTable"
import PairSelect from "../../../../../components/PairSelect"
import ExchangeSelect from "../../../../../components/ExchangeSelect"
import { exchangeLookup } from "../../../../../utils/exchange"
import LatestPrices from "../../../../../components/LatestPrices"

export async function getServerSideProps({ query }) {
  const { base, exchange, target } = query

  const currentBase = base
  const currentTarget = target

  let exchanges = []
  const exchangesApiUrl = `http://localhost:3000/api/exchange`
  const exchangesDataRes = await fetch(exchangesApiUrl)
  if (exchangesDataRes.ok && exchangesDataRes.status === 200) {
    exchanges = await exchangesDataRes.json()
  }

  let bases = []
  const basesApiUrl = `http://localhost:3000/api/exchange/${exchange}/bases`
  const basesDataRes = await fetch(basesApiUrl)
  if (basesDataRes.ok && basesDataRes.status === 200) {
    bases = await basesDataRes.json()
  }

  let targets = []
  const targetsApiUrl = `http://localhost:3000/api/exchange/${exchange}/${currentBase}/targets`

  const targetsDataRes = await fetch(targetsApiUrl)
  if (targetsDataRes.ok && targetsDataRes.status === 200) {
    targets = await targetsDataRes.json()
  }

  const currentPair = `${currentBase}/${currentTarget}`

  let currencyData = {}
  const dataApiUrl = `http://localhost:3000/api/exchange/${exchange}/${currentPair}`
  const currencyDataRes = await fetch(dataApiUrl)
  if (currencyDataRes.ok && currencyDataRes.status === 200) {
    currencyData = await currencyDataRes.json()
  }

  let disrepancyData = {}
  const discrepancyApiUrl = `http://localhost:3000/api/exchange/${exchange}/${currentPair}/discrepancy`
  const discrepancyDataRes = await fetch(discrepancyApiUrl)
  if (discrepancyDataRes.ok && discrepancyDataRes.status === 200) {
    disrepancyData = await discrepancyDataRes.json()
  }

  const latestPriceData = []
  const latestPriceUrl = `http://localhost:3000/api/exchange/${exchange}/${currentPair}/latest`
  const latestPriceDataRes = await fetch(latestPriceUrl)
  if (latestPriceDataRes.ok && latestPriceDataRes.status === 200) {
    latestPriceData.push(await latestPriceDataRes.json())
  }

  let chartData = []
  const chartDatapiUrl = `http://localhost:3000/api/exchange/${exchange}/${currentPair}/chart`

  const chartDataRes = await fetch(chartDatapiUrl)
  if (chartDataRes.ok && chartDataRes.status === 200) {
    chartData = await chartDataRes.json()
  }

  return {
    props: {
      chartData,
      currencyData,
      currentPair,
      currentBase,
      currentTarget,
      latestPriceData,
      disrepancyData,
      bases,
      targets,
      exchange,
      exchanges,
    },
  }
}

export default function Exchange({
  chartData,
  currencyData,
  currentPair,
  currentBase,
  currentTarget,
  latestPriceData,
  disrepancyData,
  bases,
  targets,
  exchange,
  exchanges,
}) {
  return (
    <Layout>
      <div className="content">
        <LatestPrices latestPrices={latestPriceData} />
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h4>
                        <img src={`/img/${exchange}.webp`} alt={exchangeLookup(exchange)} width={"40"} />{" "}
                        <ExchangeSelect url={"/exchange/"} exchanges={exchanges} currentExchange={exchange} />
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
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <PriceChart priceData={chartData} base={currentBase} target={currentTarget} legend={false} />
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
                <CurrencyUpdateTable
                  data={currencyData}
                  base={currentBase}
                  target={currentTarget}
                  paginate={true}
                  apiUrl={`/api/exchange/${exchange}/${currentPair}`}
                />
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
                <DiscrepancyTable
                  data={disrepancyData}
                  base={currentBase}
                  target={currentTarget}
                  paginate={true}
                  apiUrl={`/api/exchange/${exchange}/${currentPair}/discrepancy`}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

Exchange.propTypes = {
  chartData: PropTypes.array,
  currencyData: PropTypes.object,
  disrepancyData: PropTypes.object,
  currentPair: PropTypes.string,
  currentBase: PropTypes.string,
  currentTarget: PropTypes.string,
  latestPriceData: PropTypes.array,
  bases: PropTypes.array,
  targets: PropTypes.array,
  exchange: PropTypes.string,
  exchanges: PropTypes.array,
}
