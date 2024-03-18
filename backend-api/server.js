const express = require("express");
const app = express();
const mysql = require("mysql");
app.use(express.json());
var cors = require("cors");
app.use(cors());
var fs = require("fs"); //require file system object

const connection = mysql.createConnection({
  host: "student.veleri.hr",
  user: "mfeltrin",
  password: "11",
  database: "mfeltrin",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});

app.get("/status", (request, response) => {
  const status = {
    Status: "Running",
  };
  response.send(status);
});

app.get("/api/all-stanar", (req, res) => {
  connection.query("SELECT * FROM `stanar` RIGHT JOIN `boravak` ON `boravak`.`oib` = `stanar`.`oib` WHERE `boravak`.`datum_iseljenja` IS NULL", (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});
