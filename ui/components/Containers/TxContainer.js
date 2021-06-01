import React from "react"
import fetch from "isomorphic-unfetch"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import PropTypes from "prop-types"
import Table from "react-bootstrap/Table"
import Link from "next/link"
import Web3 from "web3"
import styles from "../CurrencyUpdateTable.module.css"
import { exchangeLookup } from "../../utils/exchange"
import DateTime from "../DateTime"
import Currency from "../Currency"
import EthTx from "../EthTx"

export default class TxContainer extends React.Component {
  constructor(props) {
    super(props)

    const { txHash } = this.props

    this.fetchTxData = this.fetchTxData.bind(this)

    this.state = {
      txHash,
      discrepancies: [],
      pair: "",
      base: "",
      target: "",
      exchange: "",
      submissionTime: 0,
      submissionPrice: "",
      tx: {},
      txDataLoading: true,
    }
  }

  async fetchTxData() {
    const { txHash } = this.state
    let txData = {}
    let discrepancies = []
    let tx = {}
    let pair = ""
    let exchange = ""
    let base = ""
    let target = ""
    let submissionTime = 0
    let submissionPrice = ""
    const txDataApiUrl = `/api/tx/${txHash}`
    const txDataRes = await fetch(txDataApiUrl)
    if (txDataRes.ok && txDataRes.status === 200) {
      txData = await txDataRes.json()
      discrepancies = txData.discrepancies
      tx = txData.tx
      if (txData.submissions.length > 0) {
        pair = txData.submissions[0]["Pair.name"]
        base = txData.submissions[0]["Pair.base"]
        target = txData.submissions[0]["Pair.target"]
        exchange = txData.submissions[0]["ExchangeOracle.exchange"]
        submissionTime = txData.submissions[0].timestamp
        submissionPrice = String(txData.submissions[0].priceRaw)
      }
    }

    await this.setState({
      discrepancies,
      tx,
      pair,
      base,
      target,
      exchange,
      submissionTime,
      submissionPrice,
      txDataLoading: false,
    })
  }

  componentDidMount() {
    this.fetchTxData()
  }

  render() {
    const {
      txHash,
      discrepancies,
      pair,
      exchange,
      submissionTime,
      target,
      submissionPrice,
      txDataLoading,
    } = this.state

    return (
      <>
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h4>
                        Tx <EthTx txHash={txHash} explorerOnly={true} />
                      </h4>
                    </Card.Title>
                  </Col>
                </Row>
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
                      {txDataLoading ? (
                        <h4>Loading</h4>
                      ) : (
                        <h3>
                          <Link href={`/exchange/${exchange}/${pair}`} as={`/exchange/${exchange}/${pair}`}>
                            <img src={`/assets/img/${exchange}.webp`} alt={exchangeLookup(exchange)} width={"30"} />
                          </Link>{" "}
                          <Link href={`/exchange/${exchange}/${pair}`} as={`/exchange/${exchange}/${pair}`}>
                            {exchangeLookup(exchange)}
                          </Link>
                          <br />
                          <DateTime datetime={submissionTime} withTime={true} />
                          <br />
                          <Link href={`/history/${pair}`} as={`/history/${pair}`}>
                            {pair}
                          </Link>
                          <br />
                          <Currency currency={target} price={submissionPrice} displaySymbol />
                        </h3>
                      )}
                    </Card.Title>
                  </Col>
                </Row>
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
                      <h3>Discrepancies</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {txDataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <div className={`table-full-width table-responsive ${styles.dataTable}`}>
                    <Table>
                      <thead>
                        <tr>
                          <th>Exchange</th>
                          <th>Time</th>
                          <th>{exchange} Price</th>
                          <th>Price 2</th>
                          <th>Diff</th>
                          <th>Threshold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {discrepancies.map((item) => (
                          <tr key={item["TxHash.txHash"]}>
                            <td>
                              <img
                                src={`/assets/img/${item["ExchangeOracle2.exchange"]}.webp`}
                                alt={exchangeLookup(item["ExchangeOracle2.exchange"])}
                                width={"15"}
                              />{" "}
                              {exchangeLookup(item["ExchangeOracle2.exchange"])}
                            </td>
                            <td>
                              <DateTime datetime={item.timestamp2} withTime={true} />{" "}
                            </td>
                            <td>
                              <Currency
                                currency={item["Pair.target"]}
                                price={Web3.utils.fromWei(item.price1)}
                                displaySymbol={true}
                              />
                            </td>
                            <td>
                              <Currency
                                currency={item["Pair.target"]}
                                price={Web3.utils.fromWei(item.price2)}
                                displaySymbol={true}
                              />
                            </td>
                            <td>
                              <Currency
                                currency={item["Pair.target"]}
                                price={Web3.utils.fromWei(item.diff)}
                                displaySymbol={true}
                              />
                            </td>
                            <td>
                              <Currency
                                currency={item["Pair.target"]}
                                price={Web3.utils.fromWei(item.threshold)}
                                displaySymbol={true}
                              />
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

TxContainer.propTypes = {
  txHash: PropTypes.string,
}
