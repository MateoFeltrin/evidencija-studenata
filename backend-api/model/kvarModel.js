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
    },
    oib: {
      type: DataTypes.INTEGER,
    },
  },
  { tableName: "kvar", timestamps: false }
);

// Import the Stanar model and set up associations
const Soba = require("./sobaModel");
Kvar.belongsTo(Soba, { foreignKey: "id_sobe" });

const Korisnik = require("./korisnikModel");
Kvar.belongsTo(Korisnik, { foreignKey: "id_korisnika" });

const Stanar = require("./stanarModel");
Kvar.belongsTo(Stanar, { foreignKey: "oib" });

module.exports = Kvar;
