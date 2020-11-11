import React from "react"
import Link from "next/link"
import PropTypes from "prop-types"

export default function EthTx({ txHash, trim }) {
  const txHashDisp = (trim) ? `${txHash.substr(0, 16)}...` : txHash
  return (
    <Link href="/">
      {txHashDisp}
    </Link>
  )
}

EthTx.propTypes = {
  txHash: PropTypes.string,
  trim: PropTypes.bool,
}
