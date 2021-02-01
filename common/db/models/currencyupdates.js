const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class CurrencyUpdates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CurrencyUpdates.belongsTo(models.ExchangeOracles, {
        foreignKey: "exchangeOracleId",
        onDelete: "CASCADE",
      })
      CurrencyUpdates.belongsTo(models.Pairs, {
        foreignKey: "pairId",
        onDelete: "CASCADE",
      })
      CurrencyUpdates.belongsTo(models.TxHashes, {
        foreignKey: "txHashId",
        onDelete: "CASCADE",
      })
    }
  }
  CurrencyUpdates.init(
    {
      exchangeOracleId: DataTypes.INTEGER,
      pairId: DataTypes.INTEGER,
      txHashId: DataTypes.INTEGER,
      price: DataTypes.STRING,
      priceRaw: DataTypes.STRING,
      timestamp: DataTypes.INTEGER,
      height: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "CurrencyUpdates",
    },
  )
  return CurrencyUpdates
}
