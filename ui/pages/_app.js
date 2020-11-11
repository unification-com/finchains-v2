import React from "react"
import PropTypes from "prop-types"
import "../styles/black-dashboard/scss/black-dashboard-react.scss"
import "../styles/global.css"

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

App.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.object,
}
