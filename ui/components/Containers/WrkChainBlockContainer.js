import React from "react"
import fetch from "isomorphic-unfetch"
import PropTypes from "prop-types"
import WrkChainBlock from "../WrkChain/WrkChainBlock"

export default class WrkChainBlockContainer extends React.Component {
  constructor(props) {
    super(props)

    const { height } = this.props

    this.fetchData = this.fetchData.bind(this)

    this.state = {
      height,
      wrkchainData: {},
      dataLoading: true,
    }
  }

  async fetchData() {
    const { height } = this.state
    let wrkchainData = {}
    const wrkchainApiUrl = `/api/wrkchain/${height}`
    const wrkchainDataRes = await fetch(wrkchainApiUrl)
    if (wrkchainDataRes.ok && wrkchainDataRes.status === 200) {
      wrkchainData = await wrkchainDataRes.json()
    }

    await this.setState({
      wrkchainData,
      dataLoading: false,
    })
  }

  async componentDidMount() {
    await this.fetchData()
  }

  render() {
    const { height, wrkchainData, dataLoading } = this.state

    return <>
      {dataLoading && wrkchainData ? <h4>Loading</h4> : <WrkChainBlock data={wrkchainData} height={height} />}
      </>
  }
}

WrkChainBlockContainer.propTypes = {
  height: PropTypes.number,
}
