"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.User, { foreignKey: 'playerOne'});
      History.belongsTo(models.User, { foreignKey: 'playerTwo'});
    }
  }
  History.init(
    {
      playerOne: {
        type: DataTypes.INTEGER,
      },
      playerTwo: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            args: true,
            msg: "Status cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "History",
    }
  );
  return History;
};
