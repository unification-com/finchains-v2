const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class ExchangePairs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExchangePairs.belongsTo(models.ExchangeOracles, {
        foreignKey: "exchangeOracleId",
        onDelete: "CASCADE",
      })
      ExchangePairs.belongsTo(models.Pairs, {
        foreignKey: "pairId",
        onDelete: "CASCADE",
      })
    }
  }
  ExchangePairs.init(
    {
      exchangeOracleId: DataTypes.INTEGER,
      pairId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ExchangePairs",
    },
  )
  return ExchangePairs
}
