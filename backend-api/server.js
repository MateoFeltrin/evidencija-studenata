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

app.put("/azuriranje-stanara/:oib", function (req, res) {
  const { oib } = req.params;
  const {
    jmbag,
    ime,
    prezime,
    datum_rodenja,
    adresa_prebivalista,
    subvencioniranost,
    uciliste,
    uplata_teretane,
    komentar,
    id_korisnika
  } = req.body;

  // Check if oib is provided
  if (!oib) {
    return res.status(400).send({ error: true, message: "OIB is required." });
  }

  // Construct the SQL query dynamically based on provided fields
  let updateQuery = "UPDATE `stanar` SET";
  const values = [];
  if (jmbag !== undefined) {
    updateQuery += " `jmbag` = ?,";
    values.push(jmbag);
  }
  if (ime !== undefined) {
    updateQuery += " `ime` = ?,";
    values.push(ime);
  }
  if (prezime !== undefined) {
    updateQuery += " `prezime` = ?,";
    values.push(prezime);
  }
  if (datum_rodenja !== undefined) {
    updateQuery += " `datum_rodenja` = ?,";
    values.push(datum_rodenja);
  }
  if (adresa_prebivalista !== undefined) {
    updateQuery += " `adresa_prebivalista` = ?,";
    values.push(adresa_prebivalista);
  }
  if (subvencioniranost !== undefined) {
    updateQuery += " `subvencioniranost` = ?,";
    values.push(subvencioniranost);
  }
  if (uciliste !== undefined) {
    updateQuery += " `uciliste` = ?,";
    values.push(uciliste);
  }
  if (uplata_teretane !== undefined) {
    updateQuery += " `uplata_teretane` = ?,";
    values.push(uplata_teretane);
  }
  if (komentar !== undefined) {
    updateQuery += " `komentar` = ?,";
    values.push(komentar);
  }
  if (id_korisnika !== undefined) {
    updateQuery += " `id_korisnika` = ?,";
    values.push(id_korisnika);
  }

  // Remove the trailing comma and add WHERE clause
  updateQuery = updateQuery.slice(0, -1) + " WHERE `oib` = ?";
  values.push(oib);

  // Execute the update query
  connection.query(updateQuery, values, function (error, results, fields) {
    if (error) {
      console.error("Error updating stanar:", error);
      return res.status(500).send({ error: true, message: "Failed to update stanar." });
    }
    res.status(200).send({ error: false, data: results, message: "Stanar updated successfully." });
  });
});

app.put("/azuriranje-korisnika/:id_korisnika", function (req, res) {
  const { id_korisnika } = req.params;
  const { email_korisnika, lozinka, uloga } = req.body;

  // Check if all parameters are provided
  if (!id_korisnika || !email_korisnika || !lozinka || !uloga) {
    return res.status(400).send({ error: true, message: "id_korisnika, email_korisnika, lozinka, and uloga are required." });
  }

  // Update the korisnik table
  connection.query("UPDATE `korisnik` SET `email_korisnika` = ?, `lozinka` = ?, `uloga` = ? WHERE `id_korisnika` = ?", [email_korisnika, lozinka, uloga, id_korisnika], function (error, results, fields) {
    if (error) {
      console.error("Error updating korisnik:", error);
      return res.status(500).send({ error: true, message: "Failed to update korisnik." });
    }
    res.status(200).send({ error: false, data: results, message: "Korisnik updated successfully." });
  });
});

app.put("/azuriranje-sobe/:id_sobe", function (req, res) {
  const { id_sobe } = req.params;
  const { broj_objekta, kat_sobe, broj_sobe } = req.body;

  // Check if all parameters are provided
  if (!id_sobe || !broj_objekta || !kat_sobe || !broj_sobe) {
    return res.status(400).send({ error: true, message: "id_sobe, broj_objekta, kat_sobe, and broj_sobe are required." });
  }

  // Update the soba table
  connection.query("UPDATE `soba` SET `broj_objekta` = ?, `kat_sobe` = ?, `broj_sobe` = ? WHERE `id_sobe` = ?", [broj_objekta, kat_sobe, broj_sobe, id_sobe], function (error, results, fields) {
    if (error) {
      console.error("Error updating soba:", error);
      return res.status(500).send({ error: true, message: "Failed to update soba." });
    }
    res.status(200).send({ error: false, data: results, message: "Soba updated successfully." });
  });
});

app.put("/azuriranje-kreveta/:id_kreveta", function (req, res) {
  const { id_kreveta } = req.params;
  const { broj_kreveta, id_sobe, zauzetost } = req.body;

  // Check if all parameters are provided
  if (!id_kreveta || !broj_kreveta || !id_sobe) {
    return res.status(400).send({ error: true, message: "id_kreveta, broj_kreveta, and id_sobe are required." });
  }

  // Update the krevet table
  connection.query("UPDATE `krevet` SET `broj_kreveta` = ?, `id_sobe` = ?, `zauzetost` = ? WHERE `id_kreveta` = ?", [broj_kreveta, id_sobe, zauzetost, id_kreveta], function (error, results, fields) {
    if (error) {
      console.error("Error updating krevet:", error);
      return res.status(500).send({ error: true, message: "Failed to update krevet." });
    }
    res.status(200).send({ error: false, data: results, message: "Krevet updated successfully." });
  });
});

app.put("/azuriranje-kvara/:id_kvara", function (req, res) {
  const { id_kvara } = req.params;
  const { stanje_kvara } = req.body;

  // Check if all parameters are provided
  if (!id_kvara || stanje_kvara === undefined) {
    return res.status(400).send({ error: true, message: "Both id_kvara and stanje_kvara are required." });
  }

  // Update the kvar table
  connection.query("UPDATE `kvar` SET `stanje_kvara` = ? WHERE `id_kvara` = ?", [stanje_kvara, id_kvara], function (error, results, fields) {
    if (error) {
      console.error("Error updating kvar:", error);
      return res.status(500).send({ error: true, message: "Failed to update kvar." });
    }
    res.status(200).send({ error: false, data: results, message: "Kvar updated successfully." });
  });
});

app.delete("/brisanje-korisnika/:id_korisnika", function (req, res) {
  const { id_korisnika } = req.params;

  // Check if id_korisnika is provided
  if (!id_korisnika) {
    return res.status(400).send({ error: true, message: "id_korisnika is required." });
  }

  // Delete the korisnik record
  connection.query("DELETE FROM `korisnik` WHERE `id_korisnika` = ?", [id_korisnika], function (error, results, fields) {
    if (error) {
      console.error("Error deleting korisnik:", error);
      return res.status(500).send({ error: true, message: "Failed to delete korisnik." });
    }
    res.status(200).send({ error: false, data: results, message: "Korisnik deleted successfully." });
  });
});

app.delete("/brisanje-stanara/:oib", function (req, res) {
  const { oib } = req.params;

  // Check if oib is provided
  if (!oib) {
    return res.status(400).send({ error: true, message: "OIB is required." });
  }

  // Delete the record from the stanar table based on the provided oib
  connection.query("DELETE FROM `stanar` WHERE `oib` = ?", [oib], function (error, results, fields) {
    if (error) {
      console.error("Error deleting stanar:", error);
      return res.status(500).send({ error: true, message: "Failed to delete stanar." });
    }
    res.status(200).send({ error: false, data: results, message: "Stanar deleted successfully." });
  });
});

app.delete("/brisanje-objekta/:broj_objekta", function (req, res) {
  const { broj_objekta } = req.params;

  // Check if broj_objekta is provided
  if (!broj_objekta) {
    return res.status(400).send({ error: true, message: "broj_objekta is required." });
  }

  // Delete the record from the objekt table based on the provided broj_objekta
  connection.query("DELETE FROM `objekt` WHERE `broj_objekta` = ?", [broj_objekta], function (error, results, fields) {
    if (error) {
      console.error("Error deleting objekt:", error);
      return res.status(500).send({ error: true, message: "Failed to delete objekt." });
    }
    res.status(200).send({ error: false, data: results, message: "Objekt deleted successfully." });
  });
});

app.delete("/brisanje-sobe/:id_sobe", function (req, res) {
  const { id_sobe } = req.params;

  // Check if id_sobe is provided
  if (!id_sobe) {
    return res.status(400).send({ error: true, message: "id_sobe is required." });
  }

  // Delete the record from the soba table based on the provided id_sobe
  connection.query("DELETE FROM `soba` WHERE `id_sobe` = ?", [id_sobe], function (error, results, fields) {
    if (error) {
      console.error("Error deleting soba:", error);
      return res.status(500).send({ error: true, message: "Failed to delete soba." });
    }
    res.status(200).send({ error: false, data: results, message: "Soba deleted successfully." });
  });
});

app.delete("/brisanje-kreveta/:id_kreveta", function (req, res) {
  const { id_kreveta } = req.params;

  // Check if id_kreveta is provided
  if (!id_kreveta) {
    return res.status(400).send({ error: true, message: "id_kreveta is required." });
  }

  // Delete the record from the krevet table based on the provided id_kreveta
  connection.query("DELETE FROM `krevet` WHERE `id_kreveta` = ?", [id_kreveta], function (error, results, fields) {
    if (error) {
      console.error("Error deleting krevet:", error);
      return res.status(500).send({ error: true, message: "Failed to delete krevet." });
    }
    res.status(200).send({ error: false, data: results, message: "Krevet deleted successfully." });
  });
});

app.delete("/brisanje-kvara/:id_kvara", function (req, res) {
  const { id_kvara } = req.params;

  // Check if id_kvara is provided
  if (!id_kvara) {
    return res.status(400).send({ error: true, message: "id_kvara is required." });
  }

  // Delete the record from the kvar table based on the provided id_kvara
  connection.query("DELETE FROM `kvar` WHERE `id_kvara` = ?", [id_kvara], function (error, results, fields) {
    if (error) {
      console.error("Error deleting kvar:", error);
      return res.status(500).send({ error: true, message: "Failed to delete kvar." });
    }
    res.status(200).send({ error: false, data: results, message: "Kvar deleted successfully." });
  });
});

app.delete("/brisanje-boravka/:id_boravka", function (req, res) {
  const { id_boravka } = req.params;

  // Check if id_boravka is provided
  if (!id_boravka) {
    return res.status(400).send({ error: true, message: "id_boravka is required." });
  }

  // Delete the record from the boravak table based on the provided id_boravka
  connection.query("DELETE FROM `boravak` WHERE `id_boravka` = ?", [id_boravka], function (error, results, fields) {
    if (error) {
      console.error("Error deleting boravak:", error);
      return res.status(500).send({ error: true, message: "Failed to delete boravak." });
    }
    res.status(200).send({ error: false, data: results, message: "Boravak deleted successfully." });
  });
});




