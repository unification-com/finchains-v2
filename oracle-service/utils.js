const fetch = require("isomorphic-unfetch")

const scientificToDecimal = function (_num) {
  const nsign = Math.sign(_num)
  // remove the sign
  let num = Math.abs(_num)
  // if the number is in scientific notation remove it
  if (/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    const zero = "0"
    const parts = String(num).toLowerCase().split("e") // split into coeff and exponent
    const e = parts.pop() // store the exponential part
    let l = Math.abs(e) // get the number of zeros
    const sign = e / l
    const coeff_array = parts[0].split(".")
    if (sign === -1) {
      l -= coeff_array[0].length
      if (l < 0) {
        num = `${coeff_array[0].slice(0, l)}.${coeff_array[0].slice(l)}${
          coeff_array.length === 2 ? coeff_array[1] : ""
        }`
      } else {
        num = `${zero}.${new Array(l + 1).join(zero)}${coeff_array.join("")}`
      }
    } else {
      const dec = coeff_array[1]
      if (dec) l -= dec.length
      if (l < 0) {
        num = `${coeff_array[0] + dec.slice(0, l)}.${dec.slice(l)}`
      } else {
        num = coeff_array.join("") + new Array(l + 1).join(zero)
      }
    }
  }

  return nsign < 0 ? `-${num}` : num
}

const fetcher = (url) => {
  console.log(new Date(), "fetch", url)
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(async (r) => {
        const json = await r.json()
        const retData = {
          json,
          date: r.headers.get("date"),
        }
        return retData
      })
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const trimDecimals = function (p) {
  const pA = p.split(".")
  let pDec = pA[1]
  if (pDec.length > 18) {
    pDec = pDec.substr(0, 18)
  }
  const pConv = `${pA[0]}.${pDec}`
  return pConv
}

const unwrapToken = function (wrapped) {
  let unwrapped
  switch (wrapped) {
    case "WETH":
      unwrapped = "ETH"
      break
    case "WBTC":
      unwrapped = "BTC"
      break
    case "WBNB":
      unwrapped = "BNB"
      break
    default:
      unwrapped = wrapped
      break
  }
  return unwrapped
}

const sleepFor = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = {
  scientificToDecimal,
  fetcher,
  sleepFor,
  trimDecimals,
  unwrapToken,
}
