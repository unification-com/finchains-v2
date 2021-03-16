const { exchangeApis: exchangeApisV1 } = require("./v1.legacy")
const { exchangeApis: exchangeApisV2 } = require("./v2")

const exchangeApiLoader = (v) => {
  switch (v) {
    case "v1.legacy":
      return exchangeApisV1
    case "v2":
    default:
      return exchangeApisV2
  }
}

module.exports = {
  exchangeApiLoader,
}
