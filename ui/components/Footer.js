import React from "react"
import Nav from "react-bootstrap/Nav"
import NavLink from "react-bootstrap/NavLink"
import Container from "react-bootstrap/Container"
import { InfoCircle } from "react-bootstrap-icons"

export default function Footer() {
  return (
    <footer className="footer">
      <Container fluid>
        <Nav>
          <li>
            <NavLink href="https://github.com/unification-com/finchains-v2" target="_blank">
              <h4>
                <img src="/assets/img/GitHub-Mark-Light-120px-plus.png" alt="GitHub" width="15" /> Github
              </h4>
            </NavLink>
          </li>
          <li>
            <NavLink href="/about">
              <h4>
                <InfoCircle /> About
              </h4>
            </NavLink>
          </li>
        </Nav>
        <div className="copyright">
          © {new Date().getFullYear()}{" "}
          <a href="https://unification.com" rel="noreferrer" target="_blank">
            Unification
          </a>
        </div>
      </Container>
    </footer>
  )
}
