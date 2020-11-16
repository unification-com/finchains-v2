import React from "react"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import fetch from "isomorphic-unfetch"
import PropTypes from "prop-types"
import PriceChart from "../../../components/PriceChart"
import Layout from "../../../layouts/layout"
import CurrencyUpdateTable from "../../../components/CurrencyUpdateTable"
import DiscrepancyTable from "../../../components/DiscrepancyTable"
import LatestPrices from "../../../components/LatestPrices"
import PairSelect from "../../../components/PairSelect"

export async function getServerSideProps({ query }) {
  const { base, target } = query

  const currentBase = base
  const currentTarget = target

  let bases = {}
  const basesApiUrl = "http://localhost:3000/api/pairs/bases"
  const basesDataRes = await fetch(basesApiUrl)
  if (basesDataRes.ok && basesDataRes.status === 200) {
    bases = await basesDataRes.json()
  }

  let targets = {}
  const targetsApiUrl = `http://localhost:3000/api/pairs/${currentBase}`

  const targetsDataRes = await fetch(targetsApiUrl)
  if (targetsDataRes.ok && targetsDataRes.status === 200) {
    targets = await targetsDataRes.json()
  }

  const currentPair = `${currentBase}/${currentTarget}`

  let currencyData = {}

  const dataApiUrl = `http://localhost:3000/api/currency/${currentPair}`

  const currencyDataRes = await fetch(dataApiUrl)
  if (currencyDataRes.ok && currencyDataRes.status === 200) {
    currencyData = await currencyDataRes.json()
  }

  let chartData = []
  const chartDatapiUrl = `http://localhost:3000/api/currency/${currentPair}/chart`

  const chartDataRes = await fetch(chartDatapiUrl)
  if (chartDataRes.ok && chartDataRes.status === 200) {
    chartData = await chartDataRes.json()
  }

  let discrepancyData = {}

  const discrepancyApiUrl = `http://localhost:3000/api/discrepancy/${currentPair}`

  const discrepancyDataRes = await fetch(discrepancyApiUrl)
  if (discrepancyDataRes.ok && discrepancyDataRes.status === 200) {
    discrepancyData = await discrepancyDataRes.json()
  }

  let latestPrices = {}
  const latestApiUrl = `http://localhost:3000/api/currency/${currentPair}/latest`

  const latestDataRes = await fetch(latestApiUrl)
  if (latestDataRes.ok && latestDataRes.status === 200) {
    latestPrices = await latestDataRes.json()
  }

  return {
    props: {
      currencyData,
      currentPair,
      currentBase,
      currentTarget,
      discrepancyData,
      latestPrices,
      bases,
      targets,
      chartData,
    },
  }
}

export default function Home({
  currencyData,
  currentPair,
  currentBase,
  currentTarget,
  discrepancyData,
  latestPrices,
  bases,
  targets,
  chartData,
}) {
  return (
    <Layout>
      <div className="content">
        <LatestPrices latestPrices={latestPrices} />
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h4>
                        <PairSelect
                          bases={bases}
                          targets={targets}
                          currentBase={currentBase}
                          currentTarget={currentTarget}
                          url={"/"}
                        />
                      </h4>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <PriceChart priceData={chartData} base={currentBase} target={currentTarget} legend={true} />
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
                <CurrencyUpdateTable data={currencyData} base={currentBase} target={currentTarget} />
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
                <DiscrepancyTable data={discrepancyData} base={currentBase} target={currentTarget} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

Home.propTypes = {
  currencyData: PropTypes.object,
  discrepancyData: PropTypes.object,
  latestPrices: PropTypes.array,
  currentPair: PropTypes.string,
  currentBase: PropTypes.string,
  currentTarget: PropTypes.string,
  bases: PropTypes.array,
  targets: PropTypes.array,
  chartData: PropTypes.array,
}
