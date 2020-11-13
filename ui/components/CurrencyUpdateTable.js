import Link from "next/link"
import React from "react"
import PropTypes from "prop-types"
import Table from "react-bootstrap/Table"
import DateTime from "./DateTime"
import EthTx from "./EthTx"
import styles from "./CurrencyUpdateTable.module.css"

import { exchangeLookup } from "../utils/exchange"
import { formatNumber } from "../utils/format"

export default function CurrencyUpdateTable({ data, base, target }) {
  if (data.results.length > 0) {
    return (
      <div className={`table-full-width table-responsive ${styles.dataTable}`}>
        <Table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Exchange</th>
              <th>Price ({target})</th>
              <th>Tx</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((item) => (
              <tr key={item.txHash}>
                <td>
                  <DateTime datetime={item.timestamp} withTime={true} />{" "}
                </td>
                <td>
                  <img
                    src={`/img/${item["ExchangeOracle.exchange"]}.webp`}
                    alt={exchangeLookup(item["ExchangeOracle.exchange"])}
                    width={"15"}
                  />{" "}
                  {exchangeLookup(item["ExchangeOracle.exchange"])}
                </td>
                <td>{formatNumber(item.priceRaw)}</td>
                <td>
                  <EthTx txHash={item.txHash} trim={true} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
  return <></>
}

CurrencyUpdateTable.propTypes = {
  data: PropTypes.object,
  base: PropTypes.string,
  target: PropTypes.string,
}
