import React from "react"
import PropTypes from "prop-types"
import Layout from "../../../layouts/layout"
import CurrencyHistoryContainer from "../../../components/Containers/CurrencyHistoryContainer"

export async function getServerSideProps({ query }) {
  const { base, target } = query

  const currentBase = base
  const currentTarget = target

  return {
    props: {
      currentBase,
      currentTarget,
    },
  }
}

export default function PairHistory({ currentBase, currentTarget }) {
  return (
    <Layout>
      <div className="content">
        <CurrencyHistoryContainer currentBase={currentBase} currentTarget={currentTarget} />
      </div>
    </Layout>
  )
}

PairHistory.propTypes = {
  currentBase: PropTypes.string,
  currentTarget: PropTypes.string,
}
