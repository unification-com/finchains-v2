import React from "react"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"
import Layout from "../../layouts/layout"
import WrkChainBlock from "../../components/WrkChain/WrkChainBlock"

export async function getServerSideProps({ query }) {
  const { height } = query

  let wrkchainData = {}
  const wrkchainApiUrl = `http://localhost:3000/api/wrkchain/${height}`
  const wrkchainDataRes = await fetch(wrkchainApiUrl)
  if (wrkchainDataRes.ok && wrkchainDataRes.status === 200) {
    wrkchainData = await wrkchainDataRes.json()
  }

  return {
    props: {
      wrkchainData,
    },
  }
}

export default function WrkChainHeight({ wrkchainData }) {
  return (
    <Layout>
      <div className="content">
        <WrkChainBlock data={wrkchainData} />
      </div>
    </Layout>
  )
}

WrkChainHeight.propTypes = {
  wrkchainData: PropTypes.object,
}
