const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelizeInstance"); // Import the sequelize instance you created

const Korisnik = sequelize.define(
  "korisnik",
  {
    id_korisnika: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email_korisnika: {
      type: DataTypes.STRING,
    },
    lozinka: {
      type: DataTypes.STRING,
    },
    uloga: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "korisnik", timestamps: false }
);

module.exports = Korisnik;
