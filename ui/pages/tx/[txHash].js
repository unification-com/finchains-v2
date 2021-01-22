import React from "react"
import PropTypes from "prop-types"
import Layout from "../../layouts/layout"
import TxContainer from "../../components/Containers/TxContainer"

export async function getServerSideProps({ query }) {
  const { txHash } = query

  return {
    props: {
      txHash,
    },
  }
}

export default function PairHistory({ txHash }) {
  return (
    <Layout>
      <div className="content">
        <TxContainer txHash={txHash} />
      </div>
    </Layout>
  )
}

PairHistory.propTypes = {
  txHash: PropTypes.string,
}
