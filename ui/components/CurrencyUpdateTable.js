import React from "react"
import PropTypes from "prop-types"
import Table from "react-bootstrap/Table"
import fetch from "isomorphic-unfetch"
import DateTime from "./DateTime"
import EthTx from "./EthTx"
import PaginationWrapper from "./PaginationWrapper"
import Currency from "./Currency"
import styles from "./CurrencyUpdateTable.module.css"

import { exchangeLookup } from "../utils/exchange"

export default class CurrencyUpdateTable extends React.Component {
  constructor(props) {
    super(props)
    const { data, base, target, paginate } = this.props

    this.fetchData = this.fetchData.bind(this)

    this.state = {
      data,
      base,
      target,
      paginate,
      dataLoading: false,
    }
  }

  async fetchData(pageNum) {
    const { apiUrl } = this.props
    const dataApiUrl = `${apiUrl}?page=${pageNum}`
    let data = {}
    await this.setState({ dataLoading: true })
    const currencyDataRes = await fetch(dataApiUrl)
    if (currencyDataRes.ok && currencyDataRes.status === 200) {
      data = await currencyDataRes.json()
    }

    await this.setState({ data, dataLoading: false })
  }

  render() {
    const { data, base, target, paginate, dataLoading } = this.state
    if (dataLoading) {
      return (
        <>
          <h3>Loading...</h3>
        </>
      )
    }

    let pagination
    if (paginate === true) {
      pagination = (
        <PaginationWrapper
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          cbFunc={this.fetchData}
        />
      )
    }
    if (data.results.length > 0) {
      return (
        <div className={`table-full-width table-responsive ${styles.dataTable}`}>
          <Table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Exchange</th>
                <th>Price ({target})</th>
                <th>Tx</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((item) => (
                <tr key={item["TxHash.txHash"]}>
                  <td>
                    <DateTime datetime={item.timestamp} withTime={true} />{" "}
                  </td>
                  <td>
                    <img
                      src={`/assets/img/${item["ExchangeOracle.exchange"]}.webp`}
                      alt={exchangeLookup(item["ExchangeOracle.exchange"])}
                      width={"15"}
                    />{" "}
                    {exchangeLookup(item["ExchangeOracle.exchange"])}
                  </td>
                  <td>
                    <Currency currency={target} price={item.priceRaw} />
                  </td>
                  <td>
                    <EthTx txHash={item["TxHash.txHash"]} trim={true} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {pagination}
        </div>
      )
    }
    return <></>
  }
}

CurrencyUpdateTable.propTypes = {
  data: PropTypes.object,
  base: PropTypes.string,
  target: PropTypes.string,
  paginate: PropTypes.bool,
  apiUrl: PropTypes.string,
}
