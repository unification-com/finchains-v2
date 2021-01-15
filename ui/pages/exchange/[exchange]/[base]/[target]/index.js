import React from "react"
import PropTypes from "prop-types"
import Layout from "../../../../../layouts/layout"
import ExchangeContainer from "../../../../../components/Containers/ExchangeContainer"

export async function getServerSideProps({ query }) {
  const { base, exchange, target } = query

  const currentBase = base
  const currentTarget = target

  return {
    props: {
      currentBase,
      currentTarget,
      exchange,
    },
  }
}

export default function Exchange({ currentBase, currentTarget, exchange }) {
  return (
    <Layout>
      <div className="content">
        <ExchangeContainer currentTarget={currentTarget} currentBase={currentBase} exchange={exchange} />
      </div>
    </Layout>
  )
}

Exchange.propTypes = {
  chartData: PropTypes.array,
  currencyData: PropTypes.object,
  disrepancyData: PropTypes.object,
  currentPair: PropTypes.string,
  currentBase: PropTypes.string,
  currentTarget: PropTypes.string,
  latestPriceData: PropTypes.array,
  bases: PropTypes.array,
  targets: PropTypes.array,
  exchange: PropTypes.string,
  exchanges: PropTypes.array,
}
