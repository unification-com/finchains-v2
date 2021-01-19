const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class CurrencyUpdates7Days extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CurrencyUpdates7Days.belongsTo(models.ExchangeOracles, {
        foreignKey: "exchangeOracleId",
        onDelete: "CASCADE",
      })
      CurrencyUpdates7Days.belongsTo(models.Pairs, {
        foreignKey: "pairId",
        onDelete: "CASCADE",
      })
    }
  }
  CurrencyUpdates7Days.init(
    {
      exchangeOracleId: DataTypes.INTEGER,
      pairId: DataTypes.INTEGER,
      txHash: DataTypes.STRING,
      price: DataTypes.STRING,
      priceRaw: DataTypes.STRING,
      timestamp: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CurrencyUpdates7Days",
    },
  )
  return CurrencyUpdates7Days
}
