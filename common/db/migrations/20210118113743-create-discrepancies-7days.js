module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("Discrepancies7Days", {
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
        txHashId: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "TxHashes",
            key: "id",
            as: "txHashId",
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
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["pairId"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["timestamp1"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["timestamp2"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["threshold"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["exchangeOracle1Id"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["exchangeOracle2Id"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["diff"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["txHashId"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["pairId", "threshold"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["pairId", "timestamp1"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["pairId", "timestamp2"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["pairId", "timestamp1", "timestamp2"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["pairId", "exchangeOracle1Id"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["pairId", "exchangeOracle2Id"]))
      .then(() => queryInterface.addIndex("Discrepancies7Days", ["exchangeOracle1Id", "exchangeOracle2Id"]))
      .then(() =>
        queryInterface.addIndex("Discrepancies7Days", ["pairId", "exchangeOracle1Id", "exchangeOracle2Id"]),
      )
      .then(() =>
        queryInterface.addIndex(
          "Discrepancies7Days",
          ["txHashId", "pairId", "exchangeOracle1Id", "exchangeOracle2Id"],
          { unique: true },
        ),
      )
      .then(() =>
        queryInterface.addIndex("Discrepancies7Days", [
          "exchangeOracle1Id",
          "exchangeOracle2Id",
          "timestamp1",
          "timestamp2",
        ]),
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Discrepancies7Days")
  },
}
