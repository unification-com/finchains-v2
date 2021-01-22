module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("CurrencyUpdates7Days", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        exchangeOracleId: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "ExchangeOracles",
            key: "id",
            as: "exchangeOracleId",
          },
        },
        pairId: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "Pairs",
            key: "id",
            as: "pairId",
          },
        },
        txHashId: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "TxHashes",
            key: "id",
            as: "txHashId",
          },
        },
        price: {
          type: Sequelize.STRING,
        },
        priceRaw: {
          type: Sequelize.STRING,
        },
        timestamp: {
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => queryInterface.addIndex("CurrencyUpdates7Days", ["exchangeOracleId"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates7Days", ["pairId"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates7Days", ["exchangeOracleId", "pairId"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates7Days", ["txHashId"], { unique: true }))
      .then(() => queryInterface.addIndex("CurrencyUpdates7Days", ["timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates7Days", ["pairId", "timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates7Days", ["pairId", "exchangeOracleId", "timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates7Days", ["exchangeOracleId", "timestamp"]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CurrencyUpdates7Days")
  },
}
