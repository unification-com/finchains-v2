import React from "react"
import fetch from "isomorphic-unfetch"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Web3 from "web3"
import Table from "react-bootstrap/Table"
import Link from "next/link"
import PairSelect from "../PairSelect"
import ExchangeSelect from "../ExchangeSelect"
import DateTime from "../DateTime"
import { exchangeLookup } from "../../utils/exchange"
import Currency from "../Currency"
import styles from "../CurrencyUpdateTable.module.css"
import EthTx from "../EthTx"

export default class DashboardContainer extends React.Component {
  constructor(props) {
    super(props)

    this.fetchDashboardData = this.fetchDashboardData.bind(this)
    this.emptyDashData = this.emptyDashData.bind(this)

    this.state = {
      dashboardData: this.emptyDashData(),
      bases: [],
      targets: [],
      exchanges: [],
      dataLoading: true,
    }
  }

  emptyDashData() {
    const dashboardData = {
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
    return dashboardData
  }

  async fetchDashboardData() {
    let bases = []
    const basesApiUrl = "/api/pairs/bases"
    const basesDataRes = await fetch(basesApiUrl)
    if (basesDataRes.ok && basesDataRes.status === 200) {
      bases = await basesDataRes.json()
    }

    let targets = []
    const targetsApiUrl = `/api/pairs/${bases[0]}`

    const targetsDataRes = await fetch(targetsApiUrl)
    if (targetsDataRes.ok && targetsDataRes.status === 200) {
      targets = await targetsDataRes.json()
    }

    let exchanges = []
    const exchangesApiUrl = `/api/exchange`
    const exchangesDataRes = await fetch(exchangesApiUrl)
    if (exchangesDataRes.ok && exchangesDataRes.status === 200) {
      exchanges = await exchangesDataRes.json()
    }

    let dashboardData = this.emptyDashData()
    const dashboardApiUrl = "/api/dashboard"
    const dashboardDataRes = await fetch(dashboardApiUrl)
    if (dashboardDataRes.ok && dashboardDataRes.status === 200) {
      dashboardData = await dashboardDataRes.json()
    }
    await this.setState({ dashboardData, bases, targets, exchanges, dataLoading: false })
  }

  async componentDidMount() {
    await this.fetchDashboardData()
  }

  render() {
    const { dashboardData, bases, targets, exchanges, dataLoading } = this.state

    return (
      <>
        <Row>
          <Col lg="3" md="6" sm="12" key="num_pairs">
            <Card className="card-chart">
              <Card.Header>
                <Card.Title>Pairs Tracked</Card.Title>
                {dataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <h4>
                    {dashboardData.pairs.num} Pairs{" "}
                    <PairSelect bases={bases} targets={targets} url={"/history/"} currentBase={bases[0]} />
                  </h4>
                )}
              </Card.Header>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="12" key="num_exchanges">
            <Card className="card-chart">
              <Card.Header>
                <Card.Title>Exchange Oracles</Card.Title>
                {dataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <h4>
                    {dashboardData.exchanges.num} Exchanges{" "}
                    <ExchangeSelect url={"/exchange/"} exchanges={exchanges} />
                  </h4>
                )}
              </Card.Header>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="12" key="latest_submission">
            <Card className="card-chart">
              <Card.Header>
                <Card.Title>
                  Last Submission: <DateTime datetime={dashboardData.lastUpdate.timestamp} withTime={true} />
                </Card.Title>
                {dataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <h4>
                    <img
                      src={`/img/${dashboardData.lastUpdate["ExchangeOracle.exchange"]}.webp`}
                      alt={exchangeLookup(dashboardData.lastUpdate["ExchangeOracle.exchange"])}
                      width={"15"}
                    />{" "}
                    {exchangeLookup(dashboardData.lastUpdate["ExchangeOracle.exchange"])}{" "}
                    {dashboardData.lastUpdate["Pair.name"]}
                    <br />
                    <Currency
                      currency={dashboardData.lastUpdate["Pair.target"]}
                      price={dashboardData.lastUpdate.priceRaw}
                      displaySymbol
                    />
                  </h4>
                )}
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
                {dataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <h5>
                    <img
                      src={`/img/${dashboardData.lastDiscrepancy["ExchangeOracle1.exchange"]}.webp`}
                      alt={exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle1.exchange"])}
                      width={"15"}
                    />{" "}
                    {exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle1.exchange"])}
                    {": "}
                    {dashboardData.lastDiscrepancy["Pair.name"]}{" "}
                    <Currency
                      currency={dashboardData.lastDiscrepancy["Pair.target"]}
                      price={Web3.utils.fromWei(dashboardData.lastDiscrepancy.price1)}
                      displaySymbol
                    />
                    <br />
                    <img
                      src={`/img/${dashboardData.lastDiscrepancy["ExchangeOracle2.exchange"]}.webp`}
                      alt={exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle2.exchange"])}
                      width={"15"}
                    />{" "}
                    {exchangeLookup(dashboardData.lastDiscrepancy["ExchangeOracle2.exchange"])}
                    {": "}
                    {dashboardData.lastDiscrepancy["Pair.name"]}{" "}
                    <Currency
                      currency={dashboardData.lastDiscrepancy["Pair.target"]}
                      price={Web3.utils.fromWei(dashboardData.lastDiscrepancy.price2)}
                      displaySymbol
                    />
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
                    Diff:{" "}
                    <Currency
                      currency={dashboardData.lastDiscrepancy["Pair.target"]}
                      price={Web3.utils.fromWei(dashboardData.lastDiscrepancy.diff)}
                      displaySymbol
                    />
                  </h5>
                )}
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
                {dataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <div className={`table-full-width table-responsive ${styles.dataTable}`}>
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
                                href={`/exchange/${item["ExchangeOracle.exchange"]}/${item["Pair.name"]}`}
                                as={`/exchange/${item["ExchangeOracle.exchange"]}/${item["Pair.name"]}`}
                              >
                                <img
                                  src={`/img/${item["ExchangeOracle.exchange"]}.webp`}
                                  alt={exchangeLookup(item["ExchangeOracle.exchange"])}
                                  width={"15"}
                                />
                              </Link>{" "}
                              <Link
                                href={`/exchange/${item["ExchangeOracle.exchange"]}/${item["Pair.name"]}`}
                                as={`/exchange/${item["ExchangeOracle.exchange"]}/${item["Pair.name"]}`}
                              >
                                {exchangeLookup(item["ExchangeOracle.exchange"])}
                              </Link>
                            </td>
                            <td>
                              <Link
                                href={`/history/${item["Pair.name"]}`}
                                as={`/history/${item["Pair.name"]}`}
                              >
                                {item["Pair.name"]}
                              </Link>
                            </td>
                            <td>
                              <Currency currency={item["Pair.target"]} price={item.priceRaw} displaySymbol />
                            </td>
                            <td>
                              <EthTx txHash={item.txHash} trim={true} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    )
  }
}
