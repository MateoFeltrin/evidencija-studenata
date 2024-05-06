const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelizeInstance"); // Import the sequelize instance you created

const Kvar = sequelize.define(
  "kvar",
  {
    id_kvara: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    datum_prijave_kvara: {
      type: DataTypes.DATE,
    },
    opis_kvara: {
      type: DataTypes.STRING,
    },
    stanje_kvara: {
      type: DataTypes.BOOLEAN,
    },
    id_sobe: {
      type: DataTypes.INTEGER,
    },
    id_korisnika: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oib: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { tableName: "kvar", timestamps: false }
);

module.exports = Kvar;
