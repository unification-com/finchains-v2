const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Discrepancies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discrepancies.belongsTo(models.ExchangeOracles, {
        as: "ExchangeOracle1",
        foreignKey: "exchangeOracle1Id",
        onDelete: "CASCADE",
      })
      Discrepancies.belongsTo(models.ExchangeOracles, {
        as: "ExchangeOracle2",
        foreignKey: "exchangeOracle2Id",
        onDelete: "CASCADE",
      })
      Discrepancies.belongsTo(models.Pairs, {
        foreignKey: "pairId",
        onDelete: "CASCADE",
      })
    }
  }
  Discrepancies.init(
    {
      pairId: DataTypes.INTEGER,
      exchangeOracle1Id: DataTypes.INTEGER,
      exchangeOracle2Id: DataTypes.INTEGER,
      price1: DataTypes.STRING,
      price2: DataTypes.STRING,
      diff: DataTypes.STRING,
      timestamp1: DataTypes.INTEGER,
      timestamp2: DataTypes.INTEGER,
      txHash: DataTypes.STRING,
      threshold: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Discrepancies",
    },
  )
  return Discrepancies
}
