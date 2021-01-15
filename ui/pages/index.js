import React from "react"
import PropTypes from "prop-types"
import Layout from "../layouts/layout"
import DashboardContainer from "../components/Containers/DashboardContainer"

export default function Home() {
  return (
    <Layout>
      <div className="content">
        <DashboardContainer />
      </div>
    </Layout>
  )
}
