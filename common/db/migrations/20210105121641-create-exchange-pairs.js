module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("ExchangePairs", {
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
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => queryInterface.addIndex("ExchangePairs", ["exchangeOracleId"]))
      .then(() => queryInterface.addIndex("ExchangePairs", ["pairId"]))
      .then(() => queryInterface.addIndex("ExchangePairs", ["exchangeOracleId", "pairId"], { unique: true }))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ExchangePairs")
  },
}
