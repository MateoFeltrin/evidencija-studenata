const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelizeInstance"); // Import the sequelize instance you created

const Boravak = sequelize.define(
  "boravak",
  {
    oib: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_boravka: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_kreveta: {
      type: DataTypes.INTEGER,
    },
    id_korisnika: {
      type: DataTypes.INTEGER,
    },
    datum_useljenja: {
      type: DataTypes.DATE,
    },
    datum_iseljenja: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  { tableName: "boravak", timestamps: false }
);

module.exports = Boravak;
