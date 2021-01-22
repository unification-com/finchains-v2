import React from "react"
import Link from "next/link"
import PropTypes from "prop-types"

export default function EthTx({ txHash, trim, explorerOnly }) {
  if(explorerOnly) {
    const txHashDisp = trim ? `${txHash.substr(0, 16)}...` : txHash
    return (
      <>
        <Link
          href={`${process.env.ETH_EXPLORER}/tx/${txHash}`}
          as={`${process.env.ETH_EXPLORER}/tx/${txHash}`}
        >
          <a target="_blank">{txHashDisp}</a>
        </Link>
      </>
    )
  }

  return (
    <>
      <Link href={`/tx/${txHash}`} as={`/tx/${txHash}`}>
        <a>Info</a>
      </Link>{" "}
      {" | "}
      <Link href={`${process.env.ETH_EXPLORER}/tx/${txHash}`} as={`${process.env.ETH_EXPLORER}/tx/${txHash}`}>
        <a target="_blank">Explorer</a>
      </Link>
    </>
  )
}

EthTx.propTypes = {
  txHash: PropTypes.string,
  trim: PropTypes.bool,
  explorerOnly: PropTypes.bool,
}
