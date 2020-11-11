module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("CurrencyUpdates", {
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
        txHash: {
          type: Sequelize.STRING,
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
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["exchangeOracleId"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["pairId"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["exchangeOracleId", "pairId"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["txHash"], { unique: true }))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["pairId", "timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["pairId", "exchangeOracleId", "timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["exchangeOracleId", "timestamp"]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CurrencyUpdates")
  },
}
