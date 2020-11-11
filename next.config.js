module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/BTC/USD",
        permanent: false,
      },
    ]
  },
}
