const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class WrkchainBlocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WrkchainBlocks.init(
    {
      height: DataTypes.INTEGER,
      mainchainTx: DataTypes.STRING,
      timestamp: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "WrkchainBlocks",
    },
  )
  return WrkchainBlocks
}
