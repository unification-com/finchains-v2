const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class ExchangeOracles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ExchangeOracles.hasMany(models.CurrencyUpdates, {
        foreignKey: "exchangeOracleId",
      })
      ExchangeOracles.hasMany(models.CurrencyUpdates7Days, {
        foreignKey: "exchangeOracleId",
      })
      ExchangeOracles.hasMany(models.Discrepancies, {
        foreignKey: "exchangeOracle1Id",
      })
      ExchangeOracles.hasMany(models.Discrepancies, {
        foreignKey: "exchangeOracle2Id",
      })
      ExchangeOracles.hasMany(models.Discrepancies7Days, {
        foreignKey: "exchangeOracle1Id",
      })
      ExchangeOracles.hasMany(models.Discrepancies7Days, {
        foreignKey: "exchangeOracle2Id",
      })
    }
  }
  ExchangeOracles.init(
    {
      address: DataTypes.STRING,
      exchange: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ExchangeOracles",
    },
  )
  return ExchangeOracles
}
