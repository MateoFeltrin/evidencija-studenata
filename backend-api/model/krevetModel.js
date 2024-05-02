const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelizeInstance"); // Import the sequelize instance you created

const Krevet = sequelize.define(
  "krevet",
  {
    id_kreveta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    broj_kreveta: {
      type: DataTypes.INTEGER,
    },
    id_sobe: {
      type: DataTypes.INTEGER,
    },
    zauzetost: {
      type: DataTypes.BOOLEAN,
    },
  },
  { tableName: "krevet", timestamps: false }
);

module.exports = Krevet;
