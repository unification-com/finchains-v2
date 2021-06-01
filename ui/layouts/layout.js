import React from "react"
import Head from "next/head"
import PropTypes from "prop-types"
import classNames from "classnames"
import Sidebar from "../components/Sidebar/Sidebar"
import Footer from "../components/Footer"

export const siteTitle = "Finchains: Crypto"

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta property="og:title" content={siteTitle} key="title" />
        <meta name="keywords" content="Finchains, Crypto, Dashboard, Unification" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/assets/img/favicon.ico" alt="tab-logo" />
        <meta name="description" content={siteTitle} />
        <title>{siteTitle}</title>
      </Head>
      <div className={classNames("wrapper")}>
        <Sidebar bgColor="white" />
        <div className="main-panel">
          <div className={classNames("main-panel")}>{children}</div>
          <Footer fluid />
        </div>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.object,
}
