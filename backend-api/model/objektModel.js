const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelizeInstance"); // Import the sequelize instance you created

const Objekt = sequelize.define(
  "objekt",
  {
    broj_objekta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { tableName: "objekt", timestamps: false }
);

module.exports = Objekt;
