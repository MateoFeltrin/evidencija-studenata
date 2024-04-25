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

// Import the Stanar model and set up associations
const Stanar = require("./stanarModel");
Boravak.belongsTo(Stanar, { foreignKey: "oib" });

const Krevet = require("./krevetMode");
Boravak.belongsTo(Krevet, { foreignKey: "id_kreveta" });

const Korisnik = require("./korisnikModel");
Boravak.belongsTo(Korisnik, { foreignKey: "id_korisnika" });

module.exports = Boravak;
