"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UsersDonate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UsersDonate.belongsTo(models.Fund, {
        as: "fund",
        foreignKey: {
          name: "fundId",
        },
      });
      UsersDonate.belongsTo(models.User, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  UsersDonate.init(
    {
      title: DataTypes.STRING,
      donateAmount: DataTypes.INTEGER,
      status: DataTypes.STRING,
      proofAttachment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UsersDonate",
    }
  );
  return UsersDonate;
};
