// sequelizeInstance.js

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mfeltrin", "mfeltrin", "11", {
  host: "student.veleri.hr",
  dialect: "mysql",
  dialectModule: require("mysql2"), // Optional, Sequelize should auto-detect the module
});

// Authenticate the connection
try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
