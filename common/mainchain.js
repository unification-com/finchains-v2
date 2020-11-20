require("dotenv").config()
const fetch = require("isomorphic-unfetch")
const UndClient = require("@unification-com/und-js")

const { MAINCHAIN_REST_URL } = process.env

const checkStatus = (res) => {
  if (res.ok && res.status === 200) {
    return res
  }
  throw Error(res.statusText)
}

const submitWrkChainHash = async (height, blockHash, parentHash) => {
  const { WRKCHAIN_ID, WRKCHAIN_OWNER_ADDRESS, WRKCHAIN_PK } = process.env

  const undClient = new UndClient(MAINCHAIN_REST_URL)
  await undClient.initChain()
  undClient.setBroadcastMode("sync")
  await undClient.setPrivateKey(WRKCHAIN_PK)
  undClient.useDefaultSigningDelegate()
  undClient.useDefaultBroadcastDelegate()

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

    if (subRes.status === 200) {
      return subRes.result.txhash
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
  const url = new URL(`${MAINCHAIN_REST_URL}/txs/${txHash}`)
  try {
    const response = checkStatus(await fetch(url))
    return await response.json()
  } catch (err) {
    console.error("Error in getTx:", "err=", err)
    throw new Error(`Fetch tx ${txHash} error.`)
  }
}

const getWrkChainInfo = async () => {
  const { WRKCHAIN_ID } = process.env
  const url = new URL(`${MAINCHAIN_REST_URL}/wrkchain/${WRKCHAIN_ID}`)
  try {
    const response = checkStatus(await fetch(url))
    return await response.json()
  } catch (err) {
    console.error("Error in getWrkChainInfo:", "err=", err)
    throw new Error(`Fetch wrkchain ${WRKCHAIN_ID} error. Could not connect to Mainchain RPC service `)
  }
}

module.exports = { getTx, submitWrkChainHash, getWrkChainInfo }
