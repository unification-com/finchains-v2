require("dotenv").config()
const arg = require("arg")
const { getBlockNumber, getPastEvents, watchBlocks, watchEvent } = require("../common/ethereum")
const { LastGethBlock } = require("../common/db/models")
const { processCurrencyUpdate } = require("./currencyUpdates")
const { processDiscrepancy } = require("./discrepancies")
const { processWrkchainBlock } = require("./wrkchain")

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

  let lastGethBlock = await getBlockNumber()

  let fromBlockRes
  let fromBlock = 0

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
    case "populate-db":
      fromBlockRes = await LastGethBlock.findOne({ where: { event: eventToGet } })
      if (fromBlockRes) {
        fromBlock = parseInt(fromBlockRes.height, 10)
      }

      let blocksToProcess = 1000

      for (let toBlock = fromBlock + blocksToProcess; toBlock <= lastGethBlock; toBlock += blocksToProcess) {
        lastGethBlock = await getBlockNumber()
        if (lastGethBlock - toBlock <= 2000) {
          blocksToProcess = 100
        }
        if (lastGethBlock - toBlock <= 200) {
          blocksToProcess = 10
        }
        if (lastGethBlock - toBlock <= 20) {
          blocksToProcess = 1
        }
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
              await l.update({ height: toBlock })
            }
            fromBlock = toBlock
          }
        } catch (e) {
          console.log(e)
          process.exit(0)
        }
      }
      process.exit(0)
      break
    default:
      console.log(new Date(), "nothing to do")
      break
  }
}

run()
