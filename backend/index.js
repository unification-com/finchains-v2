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
          console.error(err)
        }
        if (data) {
          console.log(data)
          // submit WRKChain hashes
        }
      })
      break
    case "watch-event":
      console.log("watching", eventToGet)
      fromBlockRes = await LastGethBlock.findOne({ where: { event: eventToGet } })
      if (fromBlockRes) {
        fromBlock = parseInt(fromBlockRes.height, 10)
      }
      watchEvent(eventToGet, fromBlock, async function processEvent(data, err) {
        if (err) {
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
          console.error(err)
        }
        if (events) {
          const addTasks = []
          for (let i = 0; i < events.length; i += 1) {
            switch (eventToGet) {
              case "CurrencyUpdate":
                addTasks.push(processCurrencyUpdate(events[i]))
                break
              case "Discrepancy":
                addTasks.push(processDiscrepancy(events[i]))
                break
              default:
                break
            }
          }
          await Promise.all(addTasks)
          console.log("lastGethBlock", lastGethBlock)
          console.log("eventToGet", eventToGet)
          console.log("fromBlock", fromBlock)
          console.log("blocksToProcess", blocksToProcess)
          console.log("toBlock", toBlock)
          process.exit(0)
        }
      })
      break
    default:
      console.log("nothing to do")
      break
  }
}

run()
