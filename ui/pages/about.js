import React from "react"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Layout from "../layouts/layout"

export default function About() {
  return (
    <Layout>
      <div className="content">
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h3>About</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <p>
                  Finchains is an open source project. The source code is available on{" "}
                  <a href="https://github.com/unification-com/finchains-v2" rel="noreferrer" target="_blank">
                    Github
                  </a>
                  .
                </p>

                <p>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSe0ra5Pm4XJ-gLMTSUD4A93JnWiVnBogT_i0KOyXi5xPcLKbQ/viewform"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Request Asset Addition
                  </a>
                </p>

                <p>
                  Crypto data{" "}
                  <a href="https://www.coingecko.com/api" rel="noreferrer" target="_blank">
                    Powered by CoinGecko
                  </a>
                  .
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}
