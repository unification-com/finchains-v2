import React from "react"
import PropTypes from "prop-types"
import Layout from "../../layouts/layout"
import WrkChainBlockContainer from "../../components/Containers/WrkChainBlockContainer"

export async function getServerSideProps({ query }) {
  const { height } = query

  return {
    props: {
      height,
    },
  }
}

export default function WrkChainHeight({ height }) {
  return (
    <Layout>
      <div className="content">
        <WrkChainBlockContainer height={height} />
      </div>
    </Layout>
  )
}

WrkChainHeight.propTypes = {
  height: PropTypes.number,
}
