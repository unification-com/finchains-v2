import React from "react"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import PropTypes from "prop-types"
import { exchangeLookup } from "../utils/exchange"
import DateTime from "./DateTime"
import Currency from "./Currency"

export default function LatestPrices({ latestPrices }) {
  return (
    <Row>
      {latestPrices.map((item) => (
        <Col lg="3" md="6" sm="12" key={`latest-${item["ExchangeOracle.exchange"]}`}>
          <Card className="card-chart">
            <Card.Header>
              <Card.Title>
                <img
                  src={`/assets/img/${item["ExchangeOracle.exchange"]}.webp`}
                  alt={exchangeLookup(item["ExchangeOracle.exchange"])}
                  width={"20"}
                />{" "}
                {exchangeLookup(item["ExchangeOracle.exchange"])}
                : <DateTime datetime={item.timestamp} withTime={true} />
              </Card.Title>
              <h3>
                <Currency currency={item["Pair.target"]} price={item.priceRaw} displaySymbol={true} />
              </h3>
            </Card.Header>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

LatestPrices.propTypes = {
  latestPrices: PropTypes.array,
}
