import React from "react"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import fetch from "isomorphic-unfetch"
import PropTypes from "prop-types"
import PriceChart from "../../../../../components/PriceChart"
import Layout from "../../../../../layouts/layout"
import CurrencyUpdateTable from "../../../../../components/CurrencyUpdateTable"
import PairSelect from "../../../../../components/PairSelect"
import PaginationWrapper from "../../../../../components/PaginationWrapper";
import { exchangeLookup } from "../../../../../utils/exchange"

export async function getServerSideProps({ query }) {
  const { base, exchange, target, page } = query

  const currentBase = base
  const currentTarget = target

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

  const dataApiUrl = `http://localhost:3000/api/exchange/${exchange}/${currentPair}?page=${page}`

  const currencyDataRes = await fetch(dataApiUrl)
  if (currencyDataRes.ok && currencyDataRes.status === 200) {
    currencyData = await currencyDataRes.json()
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
      bases,
      targets,
      exchange,
    },
  }
}

export default function Exchange({
  chartData,
  currencyData,
  currentPair,
  currentBase,
  currentTarget,
  bases,
  targets,
  exchange,
}) {
  return (
    <Layout>
      <div className="content">
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h3>
                        {exchangeLookup(exchange)}: {currentPair} - Chart
                      </h3>
                      <PairSelect
                        bases={bases}
                        targets={targets}
                        currentBase={currentBase}
                        currentTarget={currentTarget}
                        url={`/exchange/${exchange}/`}
                        exchange
                        legend={false}
                      />
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <PriceChart priceData={chartData} base={currentBase} target={currentTarget} />
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
                <CurrencyUpdateTable data={currencyData} base={currentBase} target={currentTarget} />
                <PaginationWrapper
                  currentPage={currencyData.currentPage}
                  totalPages={currencyData.totalPages}
                  page={`/exchange/${exchange}/${currentBase}/${currentTarget}`}
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
  currentPair: PropTypes.string,
  currentBase: PropTypes.string,
  currentTarget: PropTypes.string,
  bases: PropTypes.array,
  targets: PropTypes.array,
  exchange: PropTypes.string,
}
