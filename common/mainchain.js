require("dotenv").config()
const fetch = require("isomorphic-unfetch")

const { MAINCHAIN_REST_URL } = process.env

const getUndClient = async () => {
  const UndClient = await import("@unification-com/und-js-v2")
  return UndClient.default
}

const checkStatus = (res) => {
  if (res.ok && res.status === 200) {
    return res
  }
  throw Error(res.statusText)
}

const submitWrkChainHash = async (height, blockHash, parentHash) => {
  const { WRKCHAIN_ID, WRKCHAIN_OWNER_ADDRESS, WRKCHAIN_PK } = process.env

  const undC = await getUndClient()
  const undClient = new undC.UndClient(MAINCHAIN_REST_URL)
  await undClient.initChain()
  await undClient.setPrivateKey(WRKCHAIN_PK)

  try {
    const subRes = await undClient.recordWRKChainBlock(
      WRKCHAIN_ID,
      height,
      blockHash,
      parentHash,
      "",
      "",
      "",
      WRKCHAIN_OWNER_ADDRESS,
      250000,
    )

    if (subRes.tx_response) {
      if(parseInt(subRes.tx_response.code, 10) === 0) {
        return subRes.tx_response.txhash
      }
    }
    
    console.log("WRKCHAIN ERROR")
    console.log(subRes)
    return ""
  } catch (err) {
    console.log("FAILED TO SUBMIT WRKCHAIN HASH")
    console.log(err.toString())
    throw err
  }
}

const getTx = async (txHash) => {
  const url = new URL(`${MAINCHAIN_REST_URL}/cosmos/tx/v1beta1/txs/${txHash}`)
  try {
    const response = checkStatus(await fetch(url))
    return await response.json()
  } catch (err) {
    console.error("Error in getTx:", "err=", err)
    throw new Error(`Fetch tx ${txHash} error. Could not connect to Mainchain RPC service `)
  }
}

const getWrkChainInfo = async () => {
  const { WRKCHAIN_ID } = process.env
  const url = new URL(`${MAINCHAIN_REST_URL}/mainchain/wrkchain/v1/wrkchain/${WRKCHAIN_ID}`)
  try {
    const response = checkStatus(await fetch(url))
    return await response.json()
  } catch (err) {
    console.error("Error in getWrkChainInfo:", "err=", err)
    throw new Error(`Fetch wrkchain ${WRKCHAIN_ID} error. Could not connect to Mainchain RPC service `)
  }
}

module.exports = { getTx, submitWrkChainHash, getWrkChainInfo }
