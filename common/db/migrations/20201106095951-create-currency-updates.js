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
        height: {
          type: Sequelize.BIGINT,
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
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["txHashId"], { unique: true }))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["pairId", "timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["pairId", "exchangeOracleId", "timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["exchangeOracleId", "timestamp"]))
      .then(() => queryInterface.addIndex("CurrencyUpdates", ["height"]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CurrencyUpdates")
  },
}
