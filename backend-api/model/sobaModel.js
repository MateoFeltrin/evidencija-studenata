const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelizeInstance"); // Import the sequelize instance you created

const Soba = sequelize.define(
  "soba",
  {
    id_sobe: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    broj_objekta: {
      type: DataTypes.INTEGER,
    },
    kat_sobe: {
      type: DataTypes.INTEGER,
    },
    broj_sobe: {
      type: DataTypes.INTEGER,
    },
  },
  { tableName: "soba", timestamps: false }
);

module.exports = Soba;
