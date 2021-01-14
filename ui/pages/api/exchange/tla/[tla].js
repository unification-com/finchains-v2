import nextConnect from "next-connect"
import { tlaToExchange } from "../../../../utils/exchange"

const handler = nextConnect()

handler.get(async (req, res) => {
  const {
    query: { tla },
  } = req

  let exchange = tlaToExchange(tla)
  if (!exchange) exchange = ""
  res.json({ exchange })
})

export default handler
