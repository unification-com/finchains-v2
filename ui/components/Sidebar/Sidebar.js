import React from "react"
import Link from "next/link"
import Nav from "react-bootstrap/Nav"
import NavLink from "react-bootstrap/NavLink"

import { PieChart, Compass, Bezier2, HourglassSplit } from "react-bootstrap-icons"
import PropTypes from "prop-types"
import styles from "./Sidebar.module.css"

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.state = {
      sidebarOpened: false,
    }
  }

  toggleSidebar() {
    this.setState({ sidebarOpened: !this.state.sidebarOpened })
  }

  render() {
    const { bgColor } = this.props
    const { sidebarOpened } = this.state

    const opennedClass = sidebarOpened ? "sidebar_open" : "sidebar_closed"
    const whichButton = sidebarOpened ? styles.close_button : ""

    const logoImg = (
      <Link href={"/"}>
        <a>
          <div className="logo-img">
            <img src="/img/finchains_logo3.png" alt="Finchains" />
          </div>
        </a>
      </Link>
    )

    const logoText = null

    return (
      <>
        <button className={`${styles.toggle_button} ${whichButton}`} onClick={this.toggleSidebar}>
          <div />
          <div />
          <div />
        </button>

        <div className={`sidebar ${opennedClass}`} data={bgColor}>
          <div className="sidebar-wrapper">
            {logoImg !== null || logoText !== null ? (
              <div className="logo">
                {logoImg}
                {logoText}
              </div>
            ) : null}
            <Nav>
              <li key="sidebar-link-1">
                <NavLink to="/" href="/" className="nav-link">
                  <h4>
                    <PieChart /> Dashboard
                  </h4>
                </NavLink>
              </li>
              <li key="sidebar-link-2">
                <NavLink to="/oracle/default" href="/oracle/default" className="nav-link">
                  <h4>
                    <Compass /> Oracles
                  </h4>
                </NavLink>
              </li>
              <li key="sidebar-link-3">
                <NavLink to="/history/BTC/USD" href="/history/BTC/USD" className="nav-link">
                  <h4>
                    <HourglassSplit /> Pair History
                  </h4>
                </NavLink>
              </li>
              <li key="sidebar-link-4">
                <NavLink to="/wrkchain" href="/wrkchain" className="nav-link">
                  <h4>
                    <Bezier2 /> WRKChain
                  </h4>
                </NavLink>
              </li>
              <li className={styles.powered_by}>
                <NavLink to="https://unification.com" href="https://unification.com" target="_blank">
                  <img
                    src="/img/POWERED_BY_UNIFICATION.png"
                    title={"Powered by Unification"}
                    alt={"Powered by Unification"}
                  />
                </NavLink>
              </li>
            </Nav>
          </div>
        </div>
      </>
    )
  }
}

Sidebar.propTypes = {
  bgColor: PropTypes.string,
}