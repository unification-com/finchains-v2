import Link from "next/link"
import React from "react"
import PropTypes from "prop-types"
import Table from "react-bootstrap/Table"
import Web3 from "web3"
import DateTime from "./DateTime"
import styles from "./DiscrepancyTable.module.css"

import { exchangeLookup } from "../utils/exchange"
import { formatNumber } from "../utils/format"
import EthTx from "./EthTx"

export default function DiscrepancyTable({ data, base, target }) {
  if (data.results.length > 0) {
    return (
      <div className={`table-full-width table-responsive ${styles.dataTable}`}>
        <Table>
          <thead>
            <tr>
              <th>Exchange 1</th>
              <th>Time 1</th>
              <th>Exchange 2</th>
              <th>Time 2</th>
              <th>Price 1 ({target})</th>
              <th>Price 2 ({target})</th>
              <th>Diff ({target})</th>
              <th>Tx</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((item) => (
              <tr key={item.txHash}>
                <td>
                  <img
                    src={`/img/${item["ExchangeOracle1.exchange"]}.webp`}
                    alt={exchangeLookup(item["ExchangeOracle1.exchange"])}
                    width={"15"}
                  />{" "}
                  {exchangeLookup(item["ExchangeOracle1.exchange"])}
                </td>
                <td>
                  <DateTime datetime={item.timestamp1} withTime={true} />{" "}
                </td>
                <td>
                  <img
                    src={`/img/${item["ExchangeOracle2.exchange"]}.webp`}
                    alt={exchangeLookup(item["ExchangeOracle2.exchange"])}
                    width={"15"}
                  />{" "}
                  {exchangeLookup(item["ExchangeOracle2.exchange"])}
                </td>
                <td>
                  <DateTime datetime={item.timestamp2} withTime={true} />{" "}
                </td>
                <td>{formatNumber(Web3.utils.fromWei(item.price1))}</td>
                <td>{formatNumber(Web3.utils.fromWei(item.price2))}</td>
                <td>{formatNumber(Web3.utils.fromWei(item.diff))}</td>
                <td> <EthTx txHash={item.txHash} trim={true} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
  return <></>
}

DiscrepancyTable.propTypes = {
  data: PropTypes.object,
  base: PropTypes.string,
  target: PropTypes.string,
}
