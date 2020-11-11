import nextConnect from "next-connect"

const { sequelize, Sequelize } = require("../../common/db/models")

const ExchangeOracles = require("../../common/db/models/exchangeoracles")(sequelize, Sequelize.DataTypes)
const CurrencyUpdates = require("../../common/db/models/currencyupdates")(sequelize, Sequelize.DataTypes)
const Discrepancies = require("../../common/db/models/discrepancies")(sequelize, Sequelize.DataTypes)
const LastGethBlock = require("../../common/db/models/lastgethblock")(sequelize, Sequelize.DataTypes)
const Pairs = require("../../common/db/models/pairs")(sequelize, Sequelize.DataTypes)
const WrkchainBlocks = require("../../common/db/models/wrkchainblocks")(sequelize, Sequelize.DataTypes)

const dbModels = {
  CurrencyUpdates,
  Discrepancies,
  ExchangeOracles,
  Pairs,
  WrkchainBlocks,
  LastGethBlock,
}

Object.keys(dbModels).forEach((modelName) => {
  if (dbModels[modelName].associate) {
    dbModels[modelName].associate(dbModels)
  }
})

async function db(req, res, next) {
  req.dbModels = dbModels
  return next()
}

const middleware = nextConnect()

middleware.use(db)

export default middleware
