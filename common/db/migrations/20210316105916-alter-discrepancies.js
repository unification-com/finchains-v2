module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn("Discrepancies", "timestamp1", {
          type: Sequelize.BIGINT,
        }),
        queryInterface.changeColumn("Discrepancies", "timestamp2", {
          type: Sequelize.BIGINT,
        }),
      ])
    })
  },
  down: async (queryInterface, Sequelize) => {},
}
