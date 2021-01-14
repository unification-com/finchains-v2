import nextConnect from "next-connect"
import { exchangeToTla } from "../../../../utils/exchange"

const handler = nextConnect()

handler.get(async (req, res) => {
  const {
    query: { exchange },
  } = req

  let tla = exchangeToTla(exchange)
  if (!tla) tla = ""
  res.json({ tla })
})

export default handler
