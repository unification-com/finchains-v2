import React from "react"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"
import Link from "next/link"

export default class MainchainData extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mainchainData: {},
      dataLoaded: false,
    }
  }

  async componentDidMount() {
    const { data } = this.props

    const url = `${process.env.MAINCHAIN_REST_URL}/wrkchain/${process.env.WRKCHAIN_ID}/block/${data.height}`

    let mainchainData = {}
    const mainchainDataRes = await fetch(url)
    if (mainchainDataRes.ok && mainchainDataRes.status === 200) {
      mainchainData = await mainchainDataRes.json()
    }
    await this.setState({ mainchainData, dataLoaded: true })
  }

  render() {
    const { dataLoaded, mainchainData } = this.state
    if(dataLoaded) {
      return (
        <div>
          <h3>
            Block{" #"}
            <Link
              href={`${process.env.MAINCHAIN_REST_URL}/wrkchain/${process.env.WRKCHAIN_ID}/block/${mainchainData.result.height}`}
              as={`${process.env.MAINCHAIN_REST_URL}/wrkchain/${process.env.WRKCHAIN_ID}/block/${mainchainData.result.height}`}
            >
              <a target="_blank">{mainchainData.result.height}</a>
            </Link>
          </h3>
          <h4>Hash: {mainchainData.result.blockhash}</h4>
          <h4>Parent Hash: {mainchainData.result.parenthash}</h4>
          <h4>Raw data</h4>
          <pre className={"pre-wrap"}>{JSON.stringify(mainchainData, null, 2)}</pre>
        </div>
      )
    }
    return <>Loading...</>
  }
}

MainchainData.propTypes = {
  data: PropTypes.object,
}
