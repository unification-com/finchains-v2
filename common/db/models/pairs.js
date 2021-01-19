const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Pairs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pairs.hasMany(models.CurrencyUpdates, {
        foreignKey: "pairId",
      })
      Pairs.hasMany(models.CurrencyUpdates7Days, {
        foreignKey: "pairId",
      })
      Pairs.hasMany(models.Discrepancies, {
        foreignKey: "pairId",
      })
      Pairs.hasMany(models.Discrepancies7Days, {
        foreignKey: "pairId",
      })
    }
  }
  Pairs.init(
    {
      name: DataTypes.STRING,
      base: DataTypes.STRING,
      target: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Pairs",
    },
  )
  return Pairs
}
