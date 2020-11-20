import React from "react"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"
import Link from "next/link"

export default class MainchainTx extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mainchainTx: {},
      dataLoaded: false,
    }
  }

  async componentDidMount() {
    const { data } = this.props
    const url = `${process.env.MAINCHAIN_REST_URL}/txs/${data.mainchainTx}`

    let mainchainTx = {}
    const mainchainTxRes = await fetch(url)
    if (mainchainTxRes.ok && mainchainTxRes.status === 200) {
      mainchainTx = await mainchainTxRes.json()
    }
    await this.setState({ mainchainTx, dataLoaded: true })
  }

  render() {
    const { dataLoaded, mainchainTx } = this.state
    if (dataLoaded) {
      return (
        <div>
          <h4>
            View in Explorer:{" "}
            <Link
              href={`${process.env.MAINCHAIN_EXPLORER}/transactions/${mainchainTx.txhash}`}
              as={`${process.env.MAINCHAIN_EXPLORER}/transactions/${mainchainTx.txhash}`}
            >
              <a target="_blank">{mainchainTx.txhash}</a>
            </Link>
          </h4>
          <h4>
            View via REST:{" "}
            <Link
              href={`${process.env.MAINCHAIN_REST_URL}/txs/${mainchainTx.txhash}`}
              as={`${process.env.MAINCHAIN_REST_URL}/txs/${mainchainTx.txhash}`}
            >
              <a target="_blank">{mainchainTx.txhash}</a>
            </Link>
          </h4>
          <h4>Raw Transaction</h4>
          <pre className={"pre-wrap"}>{JSON.stringify(mainchainTx, null, 2)}</pre>
        </div>
      )
    }
    return <>Loading...</>
  }
}

MainchainTx.propTypes = {
  data: PropTypes.object,
}
