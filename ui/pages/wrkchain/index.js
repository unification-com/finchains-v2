import React from "react"
import PropTypes from "prop-types"
import fetch from "isomorphic-unfetch"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Layout from "../../layouts/layout"
import WrkChainTable from "../../components/WrkChain/WrkChainTable"

export async function getServerSideProps() {
  let wrkchainData = {}
  const wrkchainApiUrl = "http://localhost:3000/api/wrkchain"
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

export default function WrkChain({ wrkchainData }) {
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
                      <h3>WRKChain Submissions</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <WrkChainTable data={wrkchainData} paginate={true} apiUrl={"/api/WrkChain"} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

WrkChain.propTypes = {
  wrkchainData: PropTypes.object,
}
