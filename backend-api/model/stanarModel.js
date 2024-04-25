const sequelize = require("../sequelizeInstance");
const { Sequelize, DataTypes } = require("sequelize");

const Stanar = sequelize.define(
  "stanar",
  {
    oib: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      //defaultValue: "value"
      //allowNull: false
    },
    jmbag: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    ime: {
      type: DataTypes.STRING,
    },
    prezime: {
      type: DataTypes.STRING,
    },
    datum_rodenja: {
      type: DataTypes.DATEONLY,
    },
    adresa_prebivalista: {
      type: DataTypes.STRING,
    },
    subvencioniranost: {
      type: DataTypes.BOOLEAN,
    },
    uciliste: {
      type: DataTypes.STRING,
    },
    uplata_teretane: {
      type: DataTypes.BOOLEAN,
    },
    komentar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_korisnika: {
      type: DataTypes.INTEGER,
    },
  },
  { tableName: "stanar", timestamps: false }
);

const Korisnik = require("./korisnikModel");
Stanar.belongsTo(Korisnik, { foreignKey: "id_korisnika" });

module.exports = Stanar;
