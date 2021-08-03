const { ApolloClient, createHttpLink, InMemoryCache, gql } = require("@apollo/client")
const Web3 = require("web3")
const { unwrapToken, trimDecimals, scientificToDecimal } = require("../../../utils")

class DexSubgraph {
  constructor(queryUrl, queryEndpoint, token0, token0Price, token1, token1Price, queryAtOnce = true) {
    this.queryEndpoint = queryEndpoint
    this.token0 = token0
    this.token0Price = token0Price
    this.token1 = token1
    this.token1Price = token1Price

    this.query = null
    this.queryAtOnce = queryAtOnce

    this.client = new ApolloClient({
      link: createHttpLink({
        uri: queryUrl,
      }),
      cache: new InMemoryCache(),
    })
  }

  setGqlQuery(query) {
    if (this.queryAtOnce) {
      this.query = gql`
{
 ${this.queryEndpoint}(where: { id_in: ${JSON.stringify( query )} }){
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
    } else {
      this.query = gql`
{
 ${this.queryEndpoint}(id: "${query}" ){
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
  }

  static extractData(pairData, baseKey, targetKey, priceKey) {
    const base = unwrapToken(pairData[baseKey].symbol)
    const target = unwrapToken(pairData[targetKey].symbol)
    const pair = `${base}/${target}`
    const price = trimDecimals(scientificToDecimal(pairData[priceKey]).toString())
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

  async getData(query) {
    const pairs = []
    const pairData = []

    if (this.queryAtOnce) {
      this.setGqlQuery(query)
      const retData = await this.client.query({ query: this.query, fetchPolicy: "no-cache" })

      for (let i = 0; i < retData.data[this.queryEndpoint].length; i += 1) {
        pairData.push(retData.data[this.queryEndpoint][i])
      }
    } else {
      const retAwaits = []
      for (let i = 0; i < query.length; i += 1) {
        this.setGqlQuery(query[i])
        retAwaits.push(this.client.query({ query: this.query, fetchPolicy: "no-cache" }))
      }
      const retData = await Promise.all(retAwaits)
      for (let i = 0; i < retData.length; i += 1) {
        pairData.push(retData[i].data[this.queryEndpoint])
      }
    }

    for (let i = 0; i < pairData.length; i += 1) {
      const td0 = DexSubgraph.extractData(pairData[i], this.token0, this.token1, this.token1Price)
      const td1 = DexSubgraph.extractData(pairData[i], this.token1, this.token0, this.token0Price)
      pairs.push(td0)
      pairs.push(td1)
    }

    return new Promise((resolve, reject) => {
      if (pairs.length > 0) {
        resolve(pairs)
      } else {
        reject(Error(`no data found for ${JSON.stringify(query)}`))
      }
    })
  }
}

module.exports = {
  DexSubgraph,
}
