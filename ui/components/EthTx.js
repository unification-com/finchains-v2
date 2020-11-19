import React from "react"
import Link from "next/link"
import PropTypes from "prop-types"

export default function EthTx({ txHash, trim }) {
  const txHashDisp = trim ? `${txHash.substr(0, 16)}...` : txHash
  return (
    <Link href={`${process.env.ETH_EXPLORER}/tx/${txHash}`} as={`${process.env.ETH_EXPLORER}/tx/${txHash}`}>
      <a target="_blank">{txHashDisp}</a>
    </Link>
  )
}

EthTx.propTypes = {
  txHash: PropTypes.string,
  trim: PropTypes.bool,
}
