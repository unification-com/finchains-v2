require("dotenv").config()
const arg = require("arg")
const { getBlockNumber, getPastEvents, watchBlocks, watchEvent } = require("../common/ethereum")
const { LastGethBlock } = require("../common/db/models")
const { cleanCurrencyUpdate7Day, processCurrencyUpdate } = require("./currencyUpdates")
const { cleanDiscrepancy7Day, processDiscrepancy } = require("./discrepancies")
const { processWrkchainBlock } = require("./wrkchain")
const { calculateThresholds } = require("./thresholds")
const { cleanTxHash7Day } = require("./txHashes")

const args = arg({
  // Types
  "--run": String,
  "--event": String,
  "--height": Number,
  "--num-blocks": Number,

  // Aliases
  "-r": "--run",
  "-e": "--event",
  "-h": "--height",
  "-n": "--num-blocks",
})

const run = async () => {
  const startTime = Math.floor(new Date() / 1000)
  let endTime = 0
  const doWhat = args["--run"]
  const eventToGet = args["--event"]
  const height = args["--height"] || 0
  let blocksToProcess = args["--num-blocks"] || 250
  if (blocksToProcess > 1000) {
    blocksToProcess = 1000
  }

  const lastGethBlock = await getBlockNumber()

  let fromBlockRes
  let fromBlock = 0
  let toBlock = 0

  switch (doWhat) {
    case "WrkChain":
      watchBlocks(async function processBlock(data, err) {
        if (err) {
          console.error(new Date(), "ERROR:")
          console.error(err)
        }
        if (data) {
          await processWrkchainBlock(data)
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
    case "clean-7days":
      await cleanCurrencyUpdate7Day()
      await cleanDiscrepancy7Day()
      await cleanTxHash7Day()
      process.exit(0)
      break
    case "iterations":
      fromBlockRes = await LastGethBlock.findOne({ where: { event: eventToGet } })
      if (fromBlockRes) {
        fromBlock = parseInt(fromBlockRes.height, 10)
      }
      console.log(Math.round((lastGethBlock - fromBlock) / blocksToProcess))
      process.exit(0)
      break
    case "populate-db":
      fromBlockRes = await LastGethBlock.findOne({ where: { event: eventToGet } })
      if (fromBlockRes) {
        fromBlock = parseInt(fromBlockRes.height, 10)
      }

      toBlock = fromBlock + blocksToProcess

      console.log(new Date(), "lastGethBlock", lastGethBlock)
      console.log(new Date(), "eventToGet", eventToGet)
      console.log(new Date(), "blocksToProcess", blocksToProcess)
      console.log(new Date(), "fromBlock", fromBlock)
      console.log(new Date(), "toBlock", toBlock)
      try {
        const events = await getPastEvents(fromBlock, toBlock, eventToGet)
        console.log(new Date(), "process", events.length, eventToGet, "events")
        if (events) {
          for (let i = 0; i < events.length; i += 1) {
            console.log(new Date(), "process", i, "/", events.length)
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
            if (toBlock > l.height) {
              await l.update({ height: toBlock })
            }
          }

          endTime = Math.floor(new Date() / 1000)
          console.log(new Date(), "processed", events.length, "events in", endTime - startTime, "seconds")
        }
      } catch (e) {
        console.log(e)
        process.exit(0)
      }
      process.exit(0)
      break
    case "thresholds":
      await calculateThresholds()
      process.exit(0)
      break
    default:
      console.log(new Date(), "nothing to do")
      break
  }
}

run()
