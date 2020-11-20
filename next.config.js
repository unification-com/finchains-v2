module.exports = {
  async redirects() {
    return [
      {
        source: "/exchange/default",
        destination: "/exchange/gdax/BTC/USD",
        permanent: false,
      },
    ]
  },
  env: {
    MAINCHAIN_EXPLORER: process.env.MAINCHAIN_EXPLORER,
    MAINCHAIN_REST_URL: process.env.MAINCHAIN_REST_URL,
    WRKCHAIN_ID: process.env.WRKCHAIN_ID,
    ETH_EXPLORER: process.env.ETH_EXPLORER,
    WEB3_PROVIDER_HTTP: process.env.WEB3_PROVIDER_HTTP,
  },
}
