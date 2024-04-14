const express = require("express");
const app = express();
const mysql = require("mysql");
app.use(express.json());
var cors = require("cors");
app.use(cors());
var fs = require("fs"); //require file system object
const bodyParser = require("body-parser");

// Parser za JSON podatke
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/api/trenutni-stanari", (req, res) => {
  connection.query("SELECT * FROM `stanar` RIGHT JOIN `boravak` ON `boravak`.`oib` = `stanar`.`oib` WHERE `boravak`.`datum_iseljenja` IS NULL", (error, results) => {
    if (error) {
      console.error("Error fetching trenutni stanari:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch trenutni stanari." });
    }

    res.send(results);
  });
});

app.get("/api/aktivni-kvarovi", (req, res) => {
  connection.query("SELECT `id_kvara`,`datum_prijave_kvara`,`opis_kvara`,`soba`.`broj_objekta`,`soba`.`broj_sobe`, `stanar`.`ime`, `stanar`.`prezime` FROM `kvar` RIGHT JOIN `soba` ON `soba`.`id_sobe`= `kvar`.`id_sobe` RIGHT JOIN `stanar` ON `stanar`.`oib`= `kvar`.`oib` WHERE `stanje_kvara`=0;", (error, results) => {
    if (error) {
      console.error("Error fetching kvarovi:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch kvarovi." });
    }

    res.send(results);
  });
});

app.get("/api/svi-kvarovi", (req, res) => {
  connection.query("SELECT `id_kvara`,`datum_prijave_kvara`,`opis_kvara`,`soba`.`broj_objekta`,`soba`.`broj_sobe`, `stanar`.`ime`, `stanar`.`prezime` FROM `kvar` RIGHT JOIN `soba` ON `soba`.`id_sobe`= `kvar`.`id_sobe` RIGHT JOIN `stanar` ON `stanar`.`oib`= `kvar`.`oib`", (error, results) => {
    if (error) {
      console.error("Error fetching kvarovi:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch kvarovi." });
    }

    res.send(results);
  });
});

app.get("/api/svi-kreveti", (req, res) => {
  connection.query("SELECT * FROM `krevet`", (error, results) => {
    if (error) {
      console.error("Error fetching kreveti:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch kreveti." });
    }

    res.send(results);
  });
});

app.get("/api/svi-objekti", (req, res) => {
  connection.query("SELECT * FROM `objekt`", (error, results) => {
    if (error) {
      console.error("Error fetching objekti:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch objekti." });
    }

    res.send(results);
  });
});

app.get("/api/sve-sobe:", (req, res) => {
  connection.query("SELECT * FROM `soba`", (error, results) => {
    if (error) {
      console.error("Error fetching sobe:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch sobe." });
    }

    res.send(results);
  });
});

app.get("/api/boravci-u-vremenskom-periodu/:datum_useljenja/:datum_iseljenja", (req, res) => {
  const { datum_useljenja, datum_iseljenja } = req.params;
  connection.query("SELECT * FROM `stanar` RIGHT JOIN `boravak` ON `boravak`.`oib` = `stanar`.`oib` WHERE `boravak`.`datum_useljenja` >= ? AND `boravak`.`datum_iseljenja` <= ? ", [datum_useljenja, datum_iseljenja], (error, results) => {
    if (error) {
      console.error("Error fetching stanari:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch stanari." });
    }

    res.send(results);
  });
});

app.post("/unos-objekta", function (req, res) {
  const broj_objekta = req.body.broj_objekta;

  // Check if broj_objekta is provided
  if (!broj_objekta) {
    return res.status(400).send({ error: true, message: "Broj objekta is required." });
  }

  // Insert the broj_objekta into the objekt table
  connection.query("INSERT INTO `objekt` (`broj_objekta`) VALUES (?)", [broj_objekta], function (error, results, fields) {
    if (error) {
      console.error("Error inserting objekt:", error);
      return res.status(500).send({ error: true, message: "Failed to insert objekt." });
    }
    res.status(201).send({ error: false, data: results, message: "Objekt je dodan." });
  });
});

app.post("/unos-sobe", function (req, res) {
  const { broj_objekta, kat_sobe, broj_sobe } = req.body;

  // Check if all parameters are provided
  if (!broj_objekta || !kat_sobe || !broj_sobe) {
    return res.status(400).send({ error: true, message: "Broj objekta, kat sobe, and broj sobe are required." });
  }

  // Insert the values into the soba table
  connection.query("INSERT INTO `soba` (`broj_objekta`, `kat_sobe`, `broj_sobe`) VALUES (?, ?, ?)", [broj_objekta, kat_sobe, broj_sobe], function (error, results, fields) {
    if (error) {
      console.error("Error inserting soba:", error);
      return res.status(500).send({ error: true, message: "Failed to insert soba." });
    }
    res.status(201).send({ error: false, data: results, message: "Soba je dodana." });
  });
});

app.post("/unos-kreveta", function (req, res) {
  const { broj_kreveta, id_sobe } = req.body;

  // Check if all parameters are provided
  if (!broj_kreveta || !id_sobe) {
    return res.status(400).send({ error: true, message: "Broj kreveta and id sobe are required." });
  }

  // Insert the values into the soba table
  connection.query("INSERT INTO `krevet` (`broj_kreveta`, `id_sobe`, `zauzetost`) VALUES (?, ?, 0)", [broj_kreveta, id_sobe], function (error, results, fields) {
    if (error) {
      console.error("Error inserting krevet:", error);
      return res.status(500).send({ error: true, message: "Failed to insert krevet." });
    }
    res.status(201).send({ error: false, data: results, message: "krevet je dodan." });
  });
});

app.post("/unos-radnika", function (req, res) {
  const { email_korisnika, lozinka, uloga } = req.body;

  // Check if all parameters are provided
  if (!email_korisnika || !lozinka || !uloga) {
    return res.status(400).send({ error: true, message: "email, lozinka and uloga are required." });
  }

  // Insert the values into the soba table
  connection.query("INSERT INTO `korisnik` (`email_korisnika`, `lozinka`, `uloga`) VALUES (?, ?, ?)", [email_korisnika, lozinka, uloga], function (error, results, fields) {
    if (error) {
      console.error("Error inserting korisnik:", error);
      return res.status(500).send({ error: true, message: "Failed to insert korisnik." });
    }
    res.status(201).send({ error: false, data: results, message: "Korisnik je dodan." });
  });
});

app.post("/unos-stanara", function (req, res) {
  const { email_korisnika, lozinka, uloga, oib, jmbag, ime, prezime, datum_rodenja, adresa_prebivalista, subvencioniranost, uciliste, uplata_teretane, komentar } = req.body;

  // Check if all parameters are provided
  if (!email_korisnika || !lozinka || !uloga || !oib || !jmbag || !ime || !prezime || !datum_rodenja || !adresa_prebivalista || !subvencioniranost || !uciliste || !uplata_teretane || !komentar) {
    return res.status(400).send({ error: true, message: "All fields are required." });
  }

  // Start a transaction
  connection.beginTransaction(function (err) {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).send({ error: true, message: "Failed to start transaction." });
    }

    // Insert into korisnik table
    connection.query("INSERT INTO `korisnik` (`email_korisnika`, `lozinka`, `uloga`) VALUES (?, ?, ?)", [email_korisnika, lozinka, uloga], function (error, korisnikResults, fields) {
      if (error) {
        console.error("Error inserting korisnik:", error);
        return connection.rollback(function () {
          res.status(500).send({ error: true, message: "Failed to insert korisnik." });
        });
      }

      // Insert into stanar table
      connection.query("INSERT INTO `stanar` (`oib`, `jmbag`, `ime`, `prezime`, `datum_rodenja`, `adresa_prebivalista`, `subvencioniranost`, `uciliste`, `uplata_teretane`, `komentar`, `id_korisnika`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [oib, jmbag, ime, prezime, datum_rodenja, adresa_prebivalista, subvencioniranost, uciliste, uplata_teretane, komentar, korisnikResults.insertId], function (error, stanarResults, fields) {
        if (error) {
          console.error("Error inserting stanar:", error);
          return connection.rollback(function () {
            res.status(500).send({ error: true, message: "Failed to insert stanar." });
          });
        }

        // Commit the transaction
        connection.commit(function (err) {
          if (err) {
            console.error("Error committing transaction:", err);
            return connection.rollback(function () {
              res.status(500).send({ error: true, message: "Failed to commit transaction." });
            });
          }

          // Success
          res.status(201).send({ error: false, message: "Stanar je dodan." });
        });
      });
    });
  });
});

app.post("/unos-boravka", function (req, res) {
  const { id_kreveta, oib, id_korisnika, datum_useljenja } = req.body;

  // Check if all parameters are provided
  if (!id_kreveta || !oib || !id_korisnika || !datum_useljenja) {
    return res.status(400).send({ error: true, message: "All fields are required." });
  }

  // Insert the values into the soba table
  connection.query("INSERT INTO `boravak` (`id_kreveta`, `oib`, `id_korisnika`, `datum_useljenja`, `datum_iseljenja`) VALUES (?, ?, ?, ?, NULL)", [id_kreveta, oib, id_korisnika, datum_useljenja], function (error, results, fields) {
    if (error) {
      console.error("Error inserting boravak:", error);
      return res.status(500).send({ error: true, message: "Failed to insert boravak." });
    }
    res.status(201).send({ error: false, data: results, message: "Boravak je dodan." });
  });
});

app.put("/azuriranje-boravka/:id_boravka", function (req, res) {
  const { id_boravka } = req.params;
  const { datum_iseljenja } = req.body;

  // Check if all parameters are provided
  if (!id_boravka || !datum_iseljenja) {
    return res.status(400).send({ error: true, message: "Both id_boravka and datum_iseljenja are required." });
  }

  // Update the boravak table
  connection.query("UPDATE `boravak` SET `datum_iseljenja` = ? WHERE `id_boravka` = ?", [datum_iseljenja, id_boravka], function (error, results, fields) {
    if (error) {
      console.error("Error updating boravak:", error);
      return res.status(500).send({ error: true, message: "Failed to update boravak." });
    }
    res.status(200).send({ error: false, data: results, message: "Boravak updated successfully." });
  });
});
