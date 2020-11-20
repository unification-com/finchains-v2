import React from "react"
import PropTypes from "prop-types"
import Web3 from "web3"
import fetch from "isomorphic-unfetch"
import { CheckCircle, DashCircle } from "react-bootstrap-icons"
import styles from "./Validate.module.css"

export default class Validate extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      blockData: {},
      mainchainData: {},
      dataLoaded: false,
    }
  }

  async componentDidMount() {
    const web3 = await new Web3(process.env.WEB3_PROVIDER_HTTP)
    const { data } = this.props
    const blockData = await web3.eth.getBlock(data.height)
    if ("hash" in blockData) {
      await this.setState({ blockData })
    }
    const url = `${process.env.MAINCHAIN_REST_URL}/wrkchain/${process.env.WRKCHAIN_ID}/block/${data.height}`

    let mainchainData = {}
    const mainchainDataRes = await fetch(url)
    if (mainchainDataRes.ok && mainchainDataRes.status === 200) {
      mainchainData = await mainchainDataRes.json()
    }
    await this.setState({ mainchainData, dataLoaded: true })
  }

  render() {
    const { dataLoaded, blockData, mainchainData } = this.state

    if (dataLoaded) {
      const hashMatch =
        blockData.hash === mainchainData.result.blockhash ? (
          <span className={styles.hashMatch}>
            <CheckCircle />
          </span>
        ) : (
          <span className={styles.hashNotMatch}>
            <DashCircle />
          </span>
        )
      const parentHashMatch =
        blockData.parentHash === mainchainData.result.parenthash ? (
          <span className={styles.hashMatch}>
            <CheckCircle />
          </span>
        ) : (
          <span className={styles.hashNotMatch}>
            <DashCircle />
          </span>
        )

      return (
        <div>
          <h4>Hash from WrkChain: {blockData.hash}</h4>
          <h4>Hash from Mainchain: {mainchainData.result.blockhash}</h4>
          <h4>Match: {hashMatch}</h4>
          <h4>Parent Hash from WrkChain: {blockData.parentHash}</h4>
          <h4>Parent Hash from Mainchain: {mainchainData.result.parenthash}</h4>
          <h4>Match: {parentHashMatch}</h4>
        </div>
      )
    }
    return <>Loading...</>
  }
}

Validate.propTypes = {
  data: PropTypes.object,
}
