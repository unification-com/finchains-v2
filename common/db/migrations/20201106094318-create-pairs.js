module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("Pairs", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        base: {
          type: Sequelize.STRING,
        },
        target: {
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
      .then(() => queryInterface.addIndex("Pairs", ["name"], { unique: true }))
      .then(() => queryInterface.addIndex("Pairs", ["base"]))
      .then(() => queryInterface.addIndex("Pairs", ["target"]))
      .then(() => queryInterface.addIndex("Pairs", ["base", "target"], { unique: true }))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Pairs")
  },
}
