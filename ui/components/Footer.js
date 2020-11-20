import React from "react"
import Nav from "react-bootstrap/Nav"
import NavLink from "react-bootstrap/NavLink"
import Container from "react-bootstrap/Container"

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <Nav>
            <li>
              <NavLink href="https://github.com/unification-com/finchains-v2" target="_blank">
                <h4>
                  <img src="/img/GitHub-Mark-Light-120px-plus.png" alt="GitHub" width="15" /> Github
                </h4>
              </NavLink>
            </li>
          </Nav>
          <div className="copyright">
            © {new Date().getFullYear()}{" "}
            <a href="https://unification.com" target="_blank">
              Unification
            </a>
          </div>
        </Container>
      </footer>
    )
  }
}
