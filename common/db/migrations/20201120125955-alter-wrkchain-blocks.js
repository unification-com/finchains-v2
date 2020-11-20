module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize
      .transaction((t) => {
        return Promise.all([
          queryInterface.addColumn(
            "WrkchainBlocks",
            "timestamp",
            {
              type: Sequelize.DataTypes.INTEGER,
            },
            { transaction: t },
          ),
        ])
      })
      .then(() => queryInterface.addIndex("WrkchainBlocks", ["height"], { unique: true }))
      .then(() => queryInterface.addIndex("WrkchainBlocks", ["mainchainTx"], { unique: true }))
      .then(() => queryInterface.addIndex("WrkchainBlocks", ["timestamp"]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn("WrkchainBlocks", "timestamp", { transaction: t })])
    })
  },
}
