require("dotenv").config()
const arg = require("arg")
const { getBlockNumber, getPastEvents, watchBlocks, watchEvent } = require("../common/ethereum")
const { LastGethBlock } = require("../common/db/models")
const { processCurrencyUpdate } = require("./currencyUpdates")
const { processDiscrepancy } = require("./discrepancies")

const args = arg({
  // Types
  "--run": String,
  "--event": String,
  "--height": Number,
  "--to-process": Number,

  // Aliases
  "-r": "--run",
  "-e": "--event",
  "-h": "--height",
  "-n": "--to-process",
})

const run = async () => {
  const doWhat = args["--run"]
  const eventToGet = args["--event"]
  const height = args["--height"] || 0
  const blocksToProcess = args["--to-process"] || 1000

  const lastGethBlock = await getBlockNumber()

  let fromBlockRes
  let fromBlock = 0
  let toBlock = 0

  switch (doWhat) {
    case "wrkchain":
      watchBlocks(function processBlock(data, err) {
        if (err) {
          console.error(new Date(), "ERROR:")
          console.error(err)
        }
        if (data) {
          console.log(new Date(), data)
          // submit WRKChain hashes
        }
      })
      break
    case "watch-event":
      console.log(new Date(), "watching", eventToGet)
      fromBlockRes = await LastGethBlock.findOne({ where: { event: eventToGet } })
      if (fromBlockRes) {
        fromBlock = parseInt(fromBlockRes.height, 10)
      }
      watchEvent(eventToGet, fromBlock, async function processEvent(data, err) {
        if (err) {
          console.error(new Date(), "ERROR:")
          console.error(err)
        }
        if (data) {
          switch (eventToGet) {
            case "CurrencyUpdate":
              await processCurrencyUpdate(data)
              break
            case "Discrepancy":
              await processDiscrepancy(data)
              break
            default:
              break
          }
        }
      })
      break
    case "set-contract-height":
      await LastGethBlock.findOrCreate({
        where: {
          event: "CurrencyUpdate",
        },
        defaults: {
          event: "CurrencyUpdate",
          height,
        },
      })

      await LastGethBlock.findOrCreate({
        where: {
          event: "Discrepancy",
        },
        defaults: {
          event: "Discrepancy",
          height,
        },
      })
      break
    case "populate-db":
      fromBlockRes = await LastGethBlock.findOne({ where: { event: eventToGet } })
      if (fromBlockRes) {
        fromBlock = parseInt(fromBlockRes.height, 10)
      }

      toBlock = fromBlock + blocksToProcess
      if (toBlock > lastGethBlock) {
        toBlock = lastGethBlock
      }

      getPastEvents(fromBlock, toBlock, eventToGet, async function processEvent(events, err) {
        if (err) {
          console.error(new Date(), "ERROR:")
          console.error(err)
        }
        if (events) {
          for (let i = 0; i < events.length; i += 1) {
            switch (eventToGet) {
              case "CurrencyUpdate":
                await processCurrencyUpdate(events[i])
                break
              case "Discrepancy":
                await processDiscrepancy(events[i])
                break
              default:
                break
            }
          }
          console.log(new Date(), "lastGethBlock", lastGethBlock)
          console.log(new Date(), "eventToGet", eventToGet)
          console.log(new Date(), "fromBlock", fromBlock)
          console.log(new Date(), "blocksToProcess", blocksToProcess)
          console.log(new Date(), "toBlock", toBlock)

          const [l, lCreated] = await LastGethBlock.findOrCreate({
            where: {
              event: eventToGet,
            },
            defaults: {
              event: eventToGet,
              height: toBlock,
            },
          })

          if (!lCreated) {
            await l.update({ height: toBlock })
          }
          process.exit(0)
        }
      })
      break
    default:
      console.log(new Date(), "nothing to do")
      break
  }
}

run()
