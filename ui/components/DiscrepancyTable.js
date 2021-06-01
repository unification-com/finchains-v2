import React from "react"
import PropTypes from "prop-types"
import Table from "react-bootstrap/Table"
import Web3 from "web3"
import fetch from "isomorphic-unfetch"
import DateTime from "./DateTime"
import styles from "./DiscrepancyTable.module.css"

import { exchangeLookup } from "../utils/exchange"
import EthTx from "./EthTx"
import PaginationWrapper from "./PaginationWrapper"
import Currency from "./Currency"

export default class DiscrepancyTable extends React.Component {
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
    const { data, target, paginate, dataLoading } = this.state
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
                <th>Exchange 1</th>
                <th>Time 1</th>
                <th>Exchange 2</th>
                <th>Time 2</th>
                <th>Price 1 ({target})</th>
                <th>Price 2 ({target})</th>
                <th>Diff ({target})</th>
                <th>Threshold ({target})</th>
                <th>Tx</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((item) => (
                <tr key={item["TxHash.txHash"]}>
                  <td>
                    <img
                      src={`/assets/img/${item["ExchangeOracle1.exchange"]}.webp`}
                      alt={exchangeLookup(item["ExchangeOracle1.exchange"])}
                      width={"15"}
                    />{" "}
                    {exchangeLookup(item["ExchangeOracle1.exchange"])}
                  </td>
                  <td>
                    <DateTime datetime={item.timestamp1} withTime={true} />{" "}
                  </td>
                  <td>
                    <img
                      src={`/assets/img/${item["ExchangeOracle2.exchange"]}.webp`}
                      alt={exchangeLookup(item["ExchangeOracle2.exchange"])}
                      width={"15"}
                    />{" "}
                    {exchangeLookup(item["ExchangeOracle2.exchange"])}
                  </td>
                  <td>
                    <DateTime datetime={item.timestamp2} withTime={false} />{" "}
                  </td>
                  <td>
                    <Currency currency={target} price={Web3.utils.fromWei(item.price1)} />
                  </td>
                  <td>
                    <Currency currency={target} price={Web3.utils.fromWei(item.price2)} />
                  </td>
                  <td>
                    <Currency currency={target} price={Web3.utils.fromWei(item.diff)} displaySymbol={false} />
                  </td>
                  <td>
                    <Currency currency={target} price={Web3.utils.fromWei(item.threshold)} />
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

DiscrepancyTable.propTypes = {
  data: PropTypes.object,
  base: PropTypes.string,
  target: PropTypes.string,
  paginate: PropTypes.bool,
  apiUrl: PropTypes.string,
}
