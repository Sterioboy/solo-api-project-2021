'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_ref' });
    }
  };
  Block.init({
    user_ref: DataTypes.INTEGER,
    experienced: DataTypes.BOOLEAN,
    primary_market: DataTypes.STRING,
    trading_style: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Block',
  });
  return Block;
};
