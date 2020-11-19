import React from "react"
import Link from "next/link"
import fetch from "isomorphic-unfetch"
import PropTypes from "prop-types"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Web3 from "web3"
import Table from "react-bootstrap/Table"
import Layout from "../layouts/layout"
import { exchangeLookup } from "../utils/exchange"
import DateTime from "../components/DateTime"
import { currencySymbol, formatNumber } from "../utils/format"
import EthTx from "../components/EthTx"
import PairSelect from "../components/PairSelect"
import ExchangeSelect from "../components/ExchangeSelect"

export async function getServerSideProps() {
  let dashboardData = {
    pairs: {
      num: 0,
      data: [],
    },
    exchanges: {
      num: 0,
      data: [],
    },
    latestExchangeUpdates: [],
    lastUpdate: {},
    lastDiscrepancy: {},
  }
  const dashboardApiUrl = "http://localhost:3000/api/dashboard"
  const dashboardDataRes = await fetch(dashboardApiUrl)
  if (dashboardDataRes.ok && dashboardDataRes.status === 200) {
    dashboardData = await dashboardDataRes.json()
  }

  let bases = {}
  const basesApiUrl = "http://localhost:3000/api/pairs/bases"
  const basesDataRes = await fetch(basesApiUrl)
  if (basesDataRes.ok && basesDataRes.status === 200) {
    bases = await basesDataRes.json()
  }

  let targets = {}
  const targetsApiUrl = `http://localhost:3000/api/pairs/${bases[0]}`

  const targetsDataRes = await fetch(targetsApiUrl)
  if (targetsDataRes.ok && targetsDataRes.status === 200) {
    targets = await targetsDataRes.json()
  }

  let exchanges = []
  const exchangesApiUrl = `http://localhost:3000/api/exchange`
  const exchangesDataRes = await fetch(exchangesApiUrl)
  if (exchangesDataRes.ok && exchangesDataRes.status === 200) {
    exchanges = await exchangesDataRes.json()
  }

  return {
    props: {
      dashboardData,
      bases,
      targets,
      exchanges,
    },
  }
}

export default function Home({ dashboardData, bases, targets, exchanges }) {
  return (
    <Layout>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="12" key="num_pairs">
            <Card className="card-chart">
              <Card.Header>
                <Card.Title>Pairs Tracked</Card.Title>
                <h4>
                  {dashboardData.pairs.num} Pairs{" "}
                  <PairSelect
                    bases={bases}
                    targets={targets}
                    url={"/history/"}
                    currentBase={bases[0]}
                    currentTarget={targets[0]}
                  />
                </h4>
              </Card.Header>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="12" key="num_exchanges">
            <Card className="card-chart">
              <Card.Header>
                <Card.Title>Exchange Oracles</Card.Title>
                <h4>
                  {dashboardData.exchanges.num} Exchanges
                  {" "}
                  <ExchangeSelect url={"/exchange/"} exchanges={exchanges}  />
                </h4>
              </Card.Header>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="12" key="latest_submission">
            <Card className="card-chart">
              <Card.Header>
                <Card.Title>
                  Last Submission: <DateTime datetime={dashboardData.lastUpdate.timestamp} withTime={true} />
                </Card.Title>
                <h4>
                  <img
                    src={`/img/${dashboardData.lastUpdate["ExchangeOracle.exchange"]}.webp`}
                    alt={exchangeLookup(dashboardData.lastUpdate["ExchangeOracle.exchange"])}
                    width={"15"}
                  />{" "}
                  {exchangeLookup(dashboardData.lastUpdate["ExchangeOracle.exchange"])}{" "}
                  {dashboardData.lastUpdate["Pair.name"]}
                  <br />
                  {currencySymbol(dashboardData.lastUpdate["Pair.target"])}
                  {formatNumber(dashboardData.lastUpdate.priceRaw)}
                </h4>
              </Card.Header>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="12" key="latest_discrepancy">
            <Card className="card-chart">
              <Card.Header>
                <Card.Title>
                  Last Discrepancy:{" "}
                  <DateTime datetime={dashboardData.lastDiscrepancy.timestamp1} withTime={true} />
                </Card.Title>
                <h5>
                  <img
                    src={`/img/${dashboardData.lastDiscrepancy["ExchangeOracle1.exchange"]}.webp`}
                    alt={exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle1.exchange"])}
                    width={"15"}
                  />{" "}
                  {exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle1.exchange"])}
                  {": "}
                  {dashboardData.lastDiscrepancy["Pair.name"]}{" "}
                  {currencySymbol(dashboardData.lastDiscrepancy["Pair.target"])}
                  {formatNumber(Web3.utils.fromWei(dashboardData.lastDiscrepancy.price1))}
                  <br />
                  <img
                    src={`/img/${dashboardData.lastDiscrepancy["ExchangeOracle2.exchange"]}.webp`}
                    alt={exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle2.exchange"])}
                    width={"15"}
                  />{" "}
                  {exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle2.exchange"])}
                  {": "}
                  {dashboardData.lastDiscrepancy["Pair.name"]}{" "}
                  {currencySymbol(dashboardData.lastDiscrepancy["Pair.target"])}
                  {formatNumber(Web3.utils.fromWei(dashboardData.lastDiscrepancy.price2))}
                  <br />
                  <img
                    src={`/img/${dashboardData.lastDiscrepancy["ExchangeOracle1.exchange"]}.webp`}
                    alt={exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle1.exchange"])}
                    width={"15"}
                  />
                  {" / "}
                  <img
                    src={`/img/${dashboardData.lastDiscrepancy["ExchangeOracle2.exchange"]}.webp`}
                    alt={exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle2.exchange"])}
                    width={"15"}
                  />{" "}
                  Diff: {currencySymbol(dashboardData.lastDiscrepancy["Pair.target"])}
                  {formatNumber(Web3.utils.fromWei(dashboardData.lastDiscrepancy.diff))}
                </h5>
              </Card.Header>
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
                      <h3>Exchanges&apos; Latest Submissions</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Exchange</th>
                      <th>Pair</th>
                      <th>Price</th>
                      <th>Tx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.latestExchangeUpdates.map((item) => (
                      <tr key={item.txHash}>
                        <td>
                          <DateTime datetime={item.timestamp} withTime={true} />{" "}
                        </td>
                        <td>
                          <Link
                            href={`/exchange/${item["ExchangeOracle.exchange"]}`}
                            as={`/exchange/${item["ExchangeOracle.exchange"]}`}
                          >
                            <img
                              src={`/img/${item["ExchangeOracle.exchange"]}.webp`}
                              alt={exchangeLookup(item["ExchangeOracle.exchange"])}
                              width={"15"}
                            />
                          </Link>{" "}
                          <Link
                            href={`/exchange/${item["ExchangeOracle.exchange"]}`}
                            as={`/exchange/${item["ExchangeOracle.exchange"]}`}
                          >
                            {exchangeLookup(item["ExchangeOracle.exchange"])}
                          </Link>
                        </td>
                        <td>
                          <Link href={`/history/${item["Pair.name"]}`} as={`/history/${item["Pair.name"]}`}>
                            {item["Pair.name"]}
                          </Link>
                        </td>
                        <td>
                          {currencySymbol(item["Pair.target"])}
                          {formatNumber(item.priceRaw)}
                        </td>
                        <td>
                          <EthTx txHash={item.txHash} trim={true} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

Home.propTypes = {
  dashboardData: PropTypes.object,
  bases: PropTypes.array,
  targets: PropTypes.array,
  exchanges: PropTypes.array,
}
