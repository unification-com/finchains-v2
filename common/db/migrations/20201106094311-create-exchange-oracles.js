module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("ExchangeOracles", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        address: {
          type: Sequelize.STRING,
        },
        exchange: {
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
      .then(() => queryInterface.addIndex("ExchangeOracles", ["exchange"]))
      .then(() => queryInterface.addIndex("ExchangeOracles", ["address"]))
      .then(() => queryInterface.addIndex("ExchangeOracles", ["exchange", "address"], { unique: true }))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ExchangeOracles")
  },
}
