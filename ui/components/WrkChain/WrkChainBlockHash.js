import React from "react"
import PropTypes from "prop-types"
import Web3 from "web3"
import Link from "next/link"

export default class WrkChainBlockHash extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      blockData: {},
      dataLoaded: false,
    }
  }

  async componentDidMount() {
    const web3 = await new Web3(process.env.WEB3_PROVIDER_HTTP)
    const { data } = this.props

    const blockData = await web3.eth.getBlock(data.height)

    if ("hash" in blockData) {
      await this.setState({ blockData, dataLoaded: true })
    }
  }

  render() {
    const { dataLoaded, blockData } = this.state
    if (dataLoaded) {
      return (
        <div>
          <h3>
            Block{" #"}
            <Link
              href={`${process.env.ETH_EXPLORER}/block/${blockData.number}`}
              as={`${process.env.ETH_EXPLORER}/block/${blockData.number}`}
            >
              <a target="_blank">{blockData.number}</a>
            </Link>
          </h3>
          <h4>Hash: {blockData.hash}</h4>
          <h4>Parent Hash: {blockData.parentHash}</h4>
          <h4>Raw Block</h4>
          <pre className={"pre-wrap"}>{JSON.stringify(blockData, null, 2)}</pre>
        </div>
      )
    }
    return <>Loading...</>
  }
}

WrkChainBlockHash.propTypes = {
  data: PropTypes.object,
}
