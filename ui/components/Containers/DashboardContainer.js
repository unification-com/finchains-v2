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

    this.fetchPairData = this.fetchPairData.bind(this)
    this.fetchExchangeData = this.fetchExchangeData.bind(this)
    this.fetchLatestExchangeUpdates = this.fetchLatestExchangeUpdates.bind(this)
    this.fetchLastUpdate = this.fetchLastUpdate.bind(this)
    this.fetchLastDiscrepancy = this.fetchLastDiscrepancy.bind(this)

    this.state = {
      latestExchangeUpdates: [],
      lastUpdate: {},
      lastDiscrepancy: {},
      bases: [],
      targets: [],
      exchanges: [],
      numPairs: 0,
      numExchanges: 0,
      pairDataLoading: true,
      exchangeDataLoading: true,
      dashDataLoading: true,
      latestExchangeUpdatesDataLoading: true,
      lastUpdateDataLoading: true,
      lastDiscrepancyDataLoading: true,
    }
  }

  async fetchPairData() {
    let pairs = []
    const bases = []
    const targets = []
    const pairRes = await fetch("/api/pairs")
    if (pairRes.ok && pairRes.status === 200) {
      pairs = await pairRes.json()
    }

    for (let i = 0; i < pairs.length; i += 1) {
      if (!bases.includes(pairs[i].base)) {
        bases.push(pairs[i].base)
      }
      const defaultBase = bases[0]
      if (pairs[i].base === defaultBase) {
        if (!targets.includes(pairs[i].target)) {
          targets.push(pairs[i].target)
        }
      }
    }

    await this.setState({ bases, targets, numPairs: pairs.length, pairDataLoading: false })
  }

  async fetchExchangeData() {
    let exchanges = []
    const exchangesApiUrl = `/api/exchange`
    const exchangesDataRes = await fetch(exchangesApiUrl)
    if (exchangesDataRes.ok && exchangesDataRes.status === 200) {
      exchanges = await exchangesDataRes.json()
    }
    await this.setState({ exchanges, numExchanges: exchanges.length, exchangeDataLoading: false })
  }

  async fetchLatestExchangeUpdates() {
    let latestExchangeUpdates = []
    const dashboardApiUrl = "/api/dashboard/submissions"
    const dashboardDataRes = await fetch(dashboardApiUrl)
    if (dashboardDataRes.ok && dashboardDataRes.status === 200) {
      latestExchangeUpdates = await dashboardDataRes.json()
    }
    await this.setState({ latestExchangeUpdates, latestExchangeUpdatesDataLoading: false })
  }

  async fetchLastUpdate() {
    let lastUpdate = {}
    const dashboardApiUrl = "/api/dashboard/last_update"
    const dashboardDataRes = await fetch(dashboardApiUrl)
    if (dashboardDataRes.ok && dashboardDataRes.status === 200) {
      lastUpdate = await dashboardDataRes.json()
    }
    await this.setState({ lastUpdate, lastUpdateDataLoading: false })
  }

  async fetchLastDiscrepancy() {
    let lastDiscrepancy = {}
    const dashboardApiUrl = "/api/dashboard/last_discrepancy"
    const dashboardDataRes = await fetch(dashboardApiUrl)
    if (dashboardDataRes.ok && dashboardDataRes.status === 200) {
      lastDiscrepancy = await dashboardDataRes.json()
    }
    await this.setState({ lastDiscrepancy, lastDiscrepancyDataLoading: false })
  }

  componentDidMount() {
    this.fetchExchangeData()
    this.fetchPairData()
    this.fetchLatestExchangeUpdates()
    this.fetchLastUpdate()
    this.fetchLastDiscrepancy()
  }

  render() {
    const {
      bases,
      targets,
      exchanges,
      latestExchangeUpdates,
      lastUpdate,
      lastDiscrepancy,
      numPairs,
      numExchanges,
      pairDataLoading,
      exchangeDataLoading,
      latestExchangeUpdatesDataLoading,
      lastUpdateDataLoading,
      lastDiscrepancyDataLoading,
    } = this.state

    return (
      <>
        <Row>
          <Col lg="3" md="6" sm="12" key="num_pairs">
            <Card className="card-chart">
              <Card.Header>
                <Card.Title>{numPairs} Pairs Tracked</Card.Title>
                {pairDataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <h4>
                    <PairSelect bases={bases} targets={targets} url={"/history/"} currentBase={bases[0]} />
                  </h4>
                )}
              </Card.Header>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="12" key="num_exchanges">
            <Card className="card-chart">
              <Card.Header>
                <Card.Title>{numExchanges} Exchange Oracles</Card.Title>
                {exchangeDataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <h4>
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
                  Last Submission:
                  {lastUpdateDataLoading ? (
                    <></>
                  ) : (
                    <DateTime datetime={lastUpdate.timestamp} withTime={true} />
                  )}
                </Card.Title>
                {lastUpdateDataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <h4>
                    <img
                      src={`/assets/img/${lastUpdate["ExchangeOracle.exchange"]}.webp`}
                      alt={exchangeLookup(lastUpdate["ExchangeOracle.exchange"])}
                      width={"15"}
                    />{" "}
                    {exchangeLookup(lastUpdate["ExchangeOracle.exchange"])} {lastUpdate["Pair.name"]}
                    <br />
                    <Currency
                      currency={lastUpdate["Pair.target"]}
                      price={lastUpdate.priceRaw}
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
                  {lastDiscrepancyDataLoading ? (
                    <></>
                  ) : (
                    <DateTime datetime={lastDiscrepancy.timestamp1} withTime={true} />
                  )}
                </Card.Title>
                {lastDiscrepancyDataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <h5>
                    <img
                      src={`/assets/img/${lastDiscrepancy["ExchangeOracle1.exchange"]}.webp`}
                      alt={exchangeLookup(lastDiscrepancy["ExchangeOracle1.exchange"])}
                      width={"15"}
                    />{" "}
                    {exchangeLookup(lastDiscrepancy["ExchangeOracle1.exchange"])}
                    {": "}
                    {lastDiscrepancy["Pair.name"]}{" "}
                    {lastDiscrepancy.price1 && (
                      <Currency
                        currency={lastDiscrepancy["Pair.target"]}
                        price={Web3.utils.fromWei(lastDiscrepancy.price1)}
                        displaySymbol
                      />
                    )}
                    <br />
                    <img
                      src={`/assets/img/${lastDiscrepancy["ExchangeOracle2.exchange"]}.webp`}
                      alt={exchangeLookup(lastDiscrepancy["ExchangeOracle2.exchange"])}
                      width={"15"}
                    />{" "}
                    {exchangeLookup(lastDiscrepancy["ExchangeOracle2.exchange"])}
                    {": "}
                    {lastDiscrepancy["Pair.name"]}{" "}
                    {lastDiscrepancy.price2 && (
                      <Currency
                        currency={lastDiscrepancy["Pair.target"]}
                        price={Web3.utils.fromWei(lastDiscrepancy.price2)}
                        displaySymbol
                      />
                    )}
                    <br />
                    <img
                      src={`/assets/img/${lastDiscrepancy["ExchangeOracle1.exchange"]}.webp`}
                      alt={exchangeLookup(lastDiscrepancy["ExchangeOracle1.exchange"])}
                      width={"15"}
                    />
                    {" / "}
                    <img
                      src={`/assets/img/${lastDiscrepancy["ExchangeOracle2.exchange"]}.webp`}
                      alt={exchangeLookup(lastDiscrepancy["ExchangeOracle2.exchange"])}
                      width={"15"}
                    />{" "}
                    Diff:{" "}
                    {lastDiscrepancy.diff && (
                      <Currency
                        currency={lastDiscrepancy["Pair.target"]}
                        price={Web3.utils.fromWei(lastDiscrepancy.diff)}
                        displaySymbol
                      />
                    )}
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
                {latestExchangeUpdatesDataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <div className={`table-full-width table-responsive ${styles.dataTable}`}>
                    <Table>
                      <thead>
                        <tr>
                          <th>Exchange</th>
                          <th>Timestamp</th>
                          <th>Pair</th>
                          <th>Price</th>
                          <th>Tx</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestExchangeUpdates.map((item) => (
                          <tr key={item["TxHash.txHash"]}>
                            <td>
                              <Link
                                href={`/exchange/${item["ExchangeOracle.exchange"]}/${item["Pair.name"]}`}
                                as={`/exchange/${item["ExchangeOracle.exchange"]}/${item["Pair.name"]}`}
                              >
                                <img
                                  src={`/assets/img/${item["ExchangeOracle.exchange"]}.webp`}
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
                              <DateTime datetime={item.timestamp} withTime={true} />{" "}
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
                              <EthTx txHash={item["TxHash.txHash"]} trim={true} />
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
