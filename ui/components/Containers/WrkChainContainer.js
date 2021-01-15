import React from "react"
import fetch from "isomorphic-unfetch"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import WrkChainTable from "../WrkChain/WrkChainTable"

export default class WrkChainContainer extends React.Component {
  constructor(props) {
    super(props)

    this.fetchData = this.fetchData.bind(this)

    this.state = {
      wrkchainData: {},
      dataLoading: true,
    }
  }

  async fetchData() {
    let wrkchainData = {}
    const wrkchainApiUrl = "/api/wrkchain"
    const wrkchainDataRes = await fetch(wrkchainApiUrl)
    if (wrkchainDataRes.ok && wrkchainDataRes.status === 200) {
      wrkchainData = await wrkchainDataRes.json()
    }

    await this.setState({
      wrkchainData,
      dataLoading: false,
    })
  }

  async componentDidMount() {
    await this.fetchData()
  }

  render() {
    const { wrkchainData, dataLoading } = this.state

    return (
      <>
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
                {dataLoading ? (
                  <h4>Loading</h4>
                ) : (
                  <WrkChainTable data={wrkchainData} paginate={true} apiUrl={"/api/WrkChain"} />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    )
  }
}
