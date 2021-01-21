module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("Discrepancies", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
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
        exchangeOracle1Id: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "ExchangeOracles",
            key: "id",
            as: "exchangeOracle1Id",
          },
        },
        exchangeOracle2Id: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "ExchangeOracles",
            key: "id",
            as: "exchangeOracle2Id",
          },
        },
        price1: {
          type: Sequelize.STRING,
        },
        price2: {
          type: Sequelize.STRING,
        },
        diff: {
          type: Sequelize.STRING,
        },
        timestamp1: {
          type: Sequelize.INTEGER,
        },
        timestamp2: {
          type: Sequelize.INTEGER,
        },
        threshold: {
          type: Sequelize.STRING,
        },
        txHash: {
          type: Sequelize.STRING,
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
      .then(() => queryInterface.addIndex("Discrepancies", ["pairId"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["timestamp1"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["timestamp2"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["threshold"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["exchangeOracle1Id"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["exchangeOracle2Id"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["diff"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["txHash"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["pairId", "threshold"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["pairId", "exchangeOracle1Id"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["pairId", "exchangeOracle2Id"]))
      .then(() => queryInterface.addIndex("Discrepancies", ["exchangeOracle1Id", "exchangeOracle2Id"]))
      .then(() =>
        queryInterface.addIndex("Discrepancies", ["pairId", "exchangeOracle1Id", "exchangeOracle2Id"]),
      )
      .then(() =>
        queryInterface.addIndex(
          "Discrepancies",
          ["txHash", "pairId", "exchangeOracle1Id", "exchangeOracle2Id"],
          { unique: true },
        ),
      )
      .then(() =>
        queryInterface.addIndex("Discrepancies", [
          "exchangeOracle1Id",
          "exchangeOracle2Id",
          "timestamp1",
          "timestamp2",
        ]),
      )
      .then(() =>
        queryInterface.addIndex("Discrepancies", [
          "pairId",
          "exchangeOracle1Id",
          "exchangeOracle2Id",
          "timestamp1",
          "timestamp2",
        ]),
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Discrepancies")
  },
}
