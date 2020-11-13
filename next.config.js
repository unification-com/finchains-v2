module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/BTC/USD",
        permanent: false,
      },
      {
        source: "/exchange/default",
        destination: "/exchange/gdax/BTC/USD",
        permanent: false,
      },
    ]
  },
}
