// Import the necessary models
const Boravak = require("./boravakModel");
const Stanar = require("./stanarModel");
const Korisnik = require("./korisnikModel");
const Krevet = require("./krevetModel");
const Kvar = require("./kvarModel");
const Objekt = require("./objektModel");
const Soba = require("./sobaModel");

// Define the associations

// Boravak associations
Boravak.belongsTo(Stanar, { foreignKey: "oib" });
Boravak.belongsTo(Krevet, { foreignKey: "id_kreveta" });
Boravak.belongsTo(Korisnik, { foreignKey: "id_korisnika" });

// Stanar associations
Stanar.hasMany(Boravak, { foreignKey: "oib" });
Stanar.belongsTo(Korisnik, { foreignKey: "id_korisnika" });

// Krevet associations
Krevet.belongsTo(Soba, { foreignKey: "id_sobe" });

// Kvar associations
Kvar.belongsTo(Soba, { foreignKey: "id_sobe" });
Kvar.belongsTo(Korisnik, { foreignKey: "id_korisnika" });
Kvar.belongsTo(Stanar, { foreignKey: "oib" });

// Soba associations
Soba.belongsTo(Objekt, { foreignKey: "broj_objekta" });

// Export the models so they can be used in other parts of your application
module.exports = {
  Boravak,
  Stanar,
  Korisnik,
  Krevet,
  Kvar,
  Objekt,
  Soba,
};
