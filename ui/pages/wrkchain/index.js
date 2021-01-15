import React from "react"
import PropTypes from "prop-types"
import Layout from "../../layouts/layout"
import WrkChainContainer from "../../components/Containers/WrkChainContainer"

export default function WrkChain() {
  return (
    <Layout>
      <div className="content">
        <WrkChainContainer />
      </div>
    </Layout>
  )
}

WrkChain.propTypes = {
  wrkchainData: PropTypes.object,
}
