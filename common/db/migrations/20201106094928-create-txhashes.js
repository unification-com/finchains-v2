module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("TxHashes", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        txHash: {
          type: Sequelize.STRING,
        },
        height: {
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
      .then(() => queryInterface.addIndex("TxHashes", ["txHash"], { unique: true }))
      .then(() => queryInterface.addIndex("TxHashes", ["height"]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("TxHashes")
  },
}
