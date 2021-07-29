const { ApolloClient, createHttpLink, InMemoryCache, gql } = require("@apollo/client")
const Web3 = require("web3")
const { unwrapToken, trimDecimals, scientificToDecimal } = require("../../../utils")

class DexSubgraph {
  constructor(queryUrl, queryEndpoint, token0, token0Price, token1, token1Price) {
    this.queryEndpoint = queryEndpoint
    this.token0 = token0
    this.token0Price = token0Price
    this.token1 = token1
    this.token1Price = token1Price

    this.query = null

    this.client = new ApolloClient({
      link: createHttpLink({
        uri: queryUrl,
      }),
      cache: new InMemoryCache(),
    })
  }

  setGqlQuery(pairAddress) {
    this.query = gql`
{
 ${this.queryEndpoint}(id: "${pairAddress}"){
     ${this.token0} {
       symbol
     }
     ${this.token1} {
       symbol
     }
     ${this.token0Price}
     ${this.token1Price}
 }
}
`
  }

  extractData(baseKey, targetKey, priceKey) {
    if (!this.retData) {
      return null
    }
    const base = unwrapToken(this.retData.data[this.queryEndpoint][baseKey].symbol)
    const target = unwrapToken(this.retData.data[this.queryEndpoint][targetKey].symbol)
    const pair = `${base}/${target}`
    const price = trimDecimals(
      scientificToDecimal(this.retData.data[this.queryEndpoint][priceKey]).toString(),
    )
    const priceInt = Web3.utils.toWei(price, "ether")
    const timestamp = Math.floor(new Date() / 1000)

    return {
      base,
      target,
      pair,
      price,
      priceInt,
      timestamp,
    }
  }

  async getData(pairAddress) {
    const self = this
    self.setGqlQuery(pairAddress)
    self.retData = await self.client.query({ query: self.query, fetchPolicy: "no-cache" })
    return new Promise((resolve, reject) => {
      const td0 = self.extractData(self.token0, self.token1, self.token1Price)
      const td1 = self.extractData(self.token1, self.token0, self.token0Price)
      if (td0 && td1) {
        resolve({ td0, td1 })
      } else {
        reject(Error(`no data found for ${pairAddress}`))
      }
    })
  }
}

const getDexPrices = async (pairs, queryUrl, queryEndpoint, token0, token0Price, token1, token1Price) => {
  const awaitRes = []
  const subql = new DexSubgraph(queryUrl, queryEndpoint, token0, token0Price, token1, token1Price)

  for (let i = 0; i < pairs.length; i += 1) {
    awaitRes.push(subql.getData(pairs[i]))
  }

  return new Promise((resolve, reject) => {
    const final = []
    Promise.all(awaitRes)
      .then((response) => {
        for (let i = 0; i < response.length; i += 1) {
          const { td0, td1 } = response[i]
          if (td0) {
            final.push(td0)
          }

          if (td1) {
            final.push(td1)
          }
        }
        resolve(final)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

module.exports = {
  DexSubgraph,
  getDexPrices,
}
