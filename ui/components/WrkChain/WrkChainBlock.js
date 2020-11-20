import React from "react"
import PropTypes from "prop-types"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import MainchainTx from "./MainchainTx"
import MainchainData from "./MainchainData"
import WrkChainBlockHash from "./WrkChainBlockHash"
import Validate from "./Validate"

export default class WrkChainBlock extends React.Component {
  render() {
    const { data } = this.props
    return (
      <>
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h3>WrkChain Validation</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Validate data={data} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h3>WrkChain Block</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <WrkChainBlockHash data={data} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h3>Mainchain Data</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <MainchainData data={data} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="card-chart">
              <Card.Header>
                <Row>
                  <Col className="text-left">
                    <Card.Title tag="h3">
                      <h3>Mainchain Tx</h3>
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <MainchainTx data={data} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    )
  }
}

WrkChainBlock.propTypes = {
  data: PropTypes.object,
}
