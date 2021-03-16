module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn("CurrencyUpdates", "timestamp", {
          type: Sequelize.BIGINT,
        }),
      ])
    })
  },
  down: async (queryInterface, Sequelize) => {},
}
