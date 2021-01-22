const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class TxHashes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TxHashes.hasMany(models.CurrencyUpdates, {
        foreignKey: "txHashId",
      })
      TxHashes.hasMany(models.CurrencyUpdates7Days, {
        foreignKey: "txHashId",
      })
      TxHashes.hasMany(models.Discrepancies, {
        foreignKey: "txHashId",
      })
      TxHashes.hasMany(models.Discrepancies7Days, {
        foreignKey: "txHashId",
      })
    }
  }
  TxHashes.init(
    {
      txHash: DataTypes.STRING,
      height: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TxHashes",
    },
  )
  return TxHashes
}
