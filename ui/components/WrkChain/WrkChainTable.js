import Link from "next/link"
import React from "react"
import PropTypes from "prop-types"
import Table from "react-bootstrap/Table"
import fetch from "isomorphic-unfetch"
import DateTime from "../DateTime"
import PaginationWrapper from "../PaginationWrapper"

export default class WrkChainTable extends React.Component {
  constructor(props) {
    super(props)
    const { data, paginate } = this.props

    this.fetchData = this.fetchData.bind(this)

    this.state = {
      data,
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
    const { data, paginate, dataLoading } = this.state
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
        <div className={`table-full-width table-responsive dataTable`}>
          <Table>
            <thead>
              <tr>
                <th>Height</th>
                <th>Submission Time</th>
                <th>Mainchain Tx: Explorer</th>
                <th>Mainchain Tx: REST</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((item) => (
                <tr key={`wc_${item.height}`}>
                  <td>
                    <Link href={`/wrkchain/${item.height}`} as={`/wrkchain/${item.height}`}>
                      <a>{item.height}</a>
                    </Link>
                  </td>
                  <td>
                    <DateTime datetime={item.timestamp} withTime={true} />{" "}
                  </td>
                  <td>
                    <Link
                      href={`${process.env.MAINCHAIN_EXPLORER}/transactions/${item.mainchainTx}`}
                      as={`${process.env.MAINCHAIN_EXPLORER}/transactions/${item.mainchainTx}`}
                    >
                      <a target="_blank">{item.mainchainTx.substr(0, 16)}...</a>
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`${process.env.MAINCHAIN_REST_URL}/txs/${item.mainchainTx}`}
                      as={`${process.env.MAINCHAIN_REST_URL}/txs/${item.mainchainTx}`}
                    >
                      <a target="_blank">{item.mainchainTx.substr(0, 16)}...</a>
                    </Link>
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

WrkChainTable.propTypes = {
  data: PropTypes.object,
  paginate: PropTypes.bool,
  apiUrl: PropTypes.string,
}
