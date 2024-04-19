const express = require("express");
const app = express();
const mysql = require("mysql");
app.use(express.json());
var cors = require("cors");
app.use(cors());
var fs = require("fs"); //require file system object
const bodyParser = require("body-parser");
//probat koristit sequalizer
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

app.get("/api/svi-boravci", (req, res) => {
  connection.query(`
    SELECT 
      s.ime, 
      s.prezime, 
      k.email_korisnika, 
      kr.broj_kreveta, 
      b.datum_useljenja, 
      b.datum_iseljenja, 
      soba.broj_sobe, 
      objekt.broj_objekta
    FROM boravak b
    INNER JOIN krevet kr ON b.id_kreveta = kr.id_kreveta
    INNER JOIN soba ON kr.id_sobe = soba.id_sobe
    INNER JOIN objekt ON soba.broj_objekta = objekt.broj_objekta
    INNER JOIN stanar s ON b.oib = s.oib
    INNER JOIN korisnik k ON s.id_korisnika = k.id_korisnika
  `, (error, results) => {
    if (error) {
      console.error("Error fetching boravci:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch boravci." });
    }

    res.send(results);
  });
});


app.get("/api/svi-radnici", (req, res) => {
  connection.query("SELECT * FROM `korisnik` WHERE uloga IN ('recepcionar', 'domar', 'admin')", (error, results) => {
    if (error) {
      console.error("Error fetching korisnici:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch korisnici." });
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
  connection.query(`
    SELECT 
      k.id_kvara,
      k.datum_prijave_kvara,
      k.opis_kvara,
      s.broj_objekta,
      s.broj_sobe,
      st.ime,
      st.prezime,
      kn.email_korisnika
    FROM kvar k
    INNER JOIN soba s ON s.id_sobe = k.id_sobe
    INNER JOIN stanar st ON st.oib = k.oib
    LEFT JOIN korisnik kn ON kn.id_korisnika = k.id_korisnika
  `, (error, results) => {
    if (error) {
      console.error("Error fetching kvarovi:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch kvarovi." });
    }

    res.send(results);
  });
});


app.get("/api/svi-kreveti", (req, res) => {
  connection.query("SELECT krevet.id_kreveta, krevet.broj_kreveta, krevet.zauzetost, soba.broj_sobe, objekt.broj_objekta FROM krevet JOIN soba ON krevet.id_sobe = soba.id_sobe JOIN objekt ON soba.broj_objekta = objekt.broj_objekta", (error, results) => {
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

app.get("/api/sve-sobe", (req, res) => {
  connection.query("SELECT * FROM `soba`", (error, results) => {
    if (error) {
      console.error("Error fetching sobe:", error);
      return res.status(500).send({ error: true, message: "Failed to fetch sobe." });
    }

    res.send(results);
  });
});

app.get('/api/broj-sobe', (req, res) => { 
  connection.query('SELECT broj_sobe FROM soba', (error, results) => {
    if (error) {
      console.error('Error fetching sobe:', error);
      res.status(500).json({ error: 'Error fetching sobe' });
      return;
    }
    res.json(results);
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

  if (!broj_objekta) {
    return res.status(400).send({ error: true, message: "Broj objekta je obavezan." });
  }

  // Insert the broj_objekta into the objekt table
  connection.query("INSERT INTO `objekt` (`broj_objekta`) VALUES (?)", [broj_objekta], function (error, results, fields) {
    if (error) {
      console.error("Error inserting objekt:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno dodavanje objekta." });
    }
    res.status(201).send({ error: false, data: results, message: "Objekt je dodan." });
  });
});

app.post("/unos-sobe", function (req, res) {
  const { broj_objekta, kat_sobe, broj_sobe } = req.body;

  if (!broj_objekta || !kat_sobe || !broj_sobe) {
    return res.status(400).send({ error: true, message: "Broj objekta, kat sobe, i broj sobe su obavezni." });
  }

  connection.query("INSERT INTO `soba` (`broj_objekta`, `kat_sobe`, `broj_sobe`) VALUES (?, ?, ?)", [broj_objekta, kat_sobe, broj_sobe], function (error, results, fields) {
    if (error) {
      console.error("Error inserting soba:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno dodavanje sobe." });
    }
    res.status(201).send({ error: false, data: results, message: "Soba je dodana." });
  });
});

app.post("/unos-kreveta", function (req, res) {
  const { broj_kreveta, id_sobe } = req.body;

  if (!broj_kreveta || !id_sobe) {
    return res.status(400).send({ error: true, message: "Broj kreveta i id sobe su obavezni." });
  }

  connection.query("INSERT INTO `krevet` (`broj_kreveta`, `id_sobe`, `zauzetost`) VALUES (?, ?, 0)", [broj_kreveta, id_sobe], function (error, results, fields) {
    if (error) {
      console.error("Error inserting krevet:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno dodavanje kreveta." });
    }
    res.status(201).send({ error: false, data: results, message: "krevet je dodan." });
  });
});

app.post("/unos-radnika", function (req, res) {
  const { email_korisnika, lozinka, uloga } = req.body;

  if (!email_korisnika || !lozinka || !uloga) {
    return res.status(400).send({ error: true, message: "email, lozinka i uloga su obavezni." });
  }

  connection.query("INSERT INTO `korisnik` (`email_korisnika`, `lozinka`, `uloga`) VALUES (?, ?, ?)", [email_korisnika, lozinka, uloga], function (error, results, fields) {
    if (error) {
      console.error("Error inserting korisnik:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno dodavanje korisnika." });
    }
    res.status(201).send({ error: false, data: results, message: "Korisnik je dodan." });
  });
});

app.post("/unos-stanara", function (req, res) {
  const { email_korisnika, lozinka, uloga, oib, jmbag, ime, prezime, datum_rodenja, adresa_prebivalista, subvencioniranost, uciliste, uplata_teretane, komentar } = req.body;

  if (!email_korisnika || !lozinka || !uloga || !oib || !jmbag || !ime || !prezime || !datum_rodenja || !adresa_prebivalista || !subvencioniranost || !uciliste || !uplata_teretane || !komentar) {
    return res.status(400).send({ error: true, message: "All fields are required." });
  }

  connection.beginTransaction(function (err) {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).send({ error: true, message: "Failed to start transaction." });
    }

    connection.query("INSERT INTO `korisnik` (`email_korisnika`, `lozinka`, `uloga`) VALUES (?, ?, ?)", [email_korisnika, lozinka, uloga], function (error, korisnikResults, fields) {
      if (error) {
        console.error("Error inserting korisnik:", error);
        return connection.rollback(function () {
          res.status(500).send({ error: true, message: "Neuspjesno dodavanje korisnika." });
        });
      }

      connection.query("INSERT INTO `stanar` (`oib`, `jmbag`, `ime`, `prezime`, `datum_rodenja`, `adresa_prebivalista`, `subvencioniranost`, `uciliste`, `uplata_teretane`, `komentar`, `id_korisnika`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [oib, jmbag, ime, prezime, datum_rodenja, adresa_prebivalista, subvencioniranost, uciliste, uplata_teretane, komentar, korisnikResults.insertId], function (error, stanarResults, fields) {
        if (error) {
          console.error("Error inserting stanar:", error);
          return connection.rollback(function () {
            res.status(500).send({ error: true, message: "Neuspjesno dodavanje stanara." });
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

  if (!id_kreveta || !oib || !id_korisnika || !datum_useljenja) {
    return res.status(400).send({ error: true, message: "All fields are required." });
  }

  connection.query("INSERT INTO `boravak` (`id_kreveta`, `oib`, `id_korisnika`, `datum_useljenja`, `datum_iseljenja`) VALUES (?, ?, ?, ?, NULL)", [id_kreveta, oib, id_korisnika, datum_useljenja], function (error, results, fields) {
    if (error) {
      console.error("Error inserting boravak:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno dodavanje boravka." });
    }
    res.status(201).send({ error: false, data: results, message: "Boravak je dodan." });
  });
});

app.put("/azuriranje-boravka/:id_boravka", function (req, res) {
  const { id_boravka } = req.params;
  const { datum_iseljenja } = req.body;

  // Check if all parameters are provided
  if (!id_boravka || !datum_iseljenja) {
    return res.status(400).send({ error: true, message: " id_boravka i datum_iseljenja su obavezni." });
  }

  // Update the boravak table
  connection.query("UPDATE `boravak` SET `datum_iseljenja` = ? WHERE `id_boravka` = ?", [datum_iseljenja, id_boravka], function (error, results, fields) {
    if (error) {
      console.error("Error updating boravak:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno azuriranje boravka." });
    }
    res.status(200).send({ error: false, data: results, message: "Uspjesno azuriranje boravka." });
  });
});

app.put("/azuriranje-stanara/:oib", function (req, res) {
  const { oib } = req.params;
  const { jmbag, ime, prezime, datum_rodenja, adresa_prebivalista, subvencioniranost, uciliste, uplata_teretane, komentar, id_korisnika } = req.body;

  if (!oib) {
    return res.status(400).send({ error: true, message: "OIB je obavezan podatak." });
  }

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

  connection.query(updateQuery, values, function (error, results, fields) {
    if (error) {
      console.error("Error updating stanar:", error);
      return res.status(500).send({ error: true, message: "Azuriranje stanara neuspjesno." });
    }
    res.status(200).send({ error: false, data: results, message: "Azuriranje uspjesno." });
  });
});

app.put("/azuriranje-korisnika/:id_korisnika", function (req, res) {
  const { id_korisnika } = req.params;
  const { email_korisnika, lozinka, uloga } = req.body;

  if (!id_korisnika || !email_korisnika || !lozinka || !uloga) {
    return res.status(400).send({ error: true, message: "id_korisnika, email_korisnika, lozinka, i uloga su obavezni." });
  }

  connection.query("UPDATE `korisnik` SET `email_korisnika` = ?, `lozinka` = ?, `uloga` = ? WHERE `id_korisnika` = ?", [email_korisnika, lozinka, uloga, id_korisnika], function (error, results, fields) {
    if (error) {
      console.error("Error updating korisnik:", error);
      return res.status(500).send({ error: true, message: "Azuriranje neuspjesno." });
    }
    res.status(200).send({ error: false, data: results, message: "Azuriranje uspjesno." });
  });
});

app.put("/azuriranje-sobe/:id_sobe", function (req, res) {
  const { id_sobe } = req.params;
  const { broj_objekta, kat_sobe, broj_sobe } = req.body;

  if (!id_sobe || !broj_objekta || !kat_sobe || !broj_sobe) {
    return res.status(400).send({ error: true, message: "id_sobe, broj_objekta, kat_sobe, i broj_sobe su obavezni." });
  }

  connection.query("UPDATE `soba` SET `broj_objekta` = ?, `kat_sobe` = ?, `broj_sobe` = ? WHERE `id_sobe` = ?", [broj_objekta, kat_sobe, broj_sobe, id_sobe], function (error, results, fields) {
    if (error) {
      console.error("Error updating soba:", error);
      return res.status(500).send({ error: true, message: "Azuriranje neuspjesno." });
    }
    res.status(200).send({ error: false, data: results, message: "Azuriranje uspjesno." });
  });
});

app.put("/azuriranje-kreveta/:id_kreveta", function (req, res) {
  const { id_kreveta } = req.params;
  const { broj_kreveta, id_sobe, zauzetost } = req.body;

  if (!id_kreveta || !broj_kreveta || !id_sobe) {
    return res.status(400).send({ error: true, message: "id_kreveta, broj_kreveta, i id_sobe su obavezni." });
  }

  connection.query("UPDATE `krevet` SET `broj_kreveta` = ?, `id_sobe` = ?, `zauzetost` = ? WHERE `id_kreveta` = ?", [broj_kreveta, id_sobe, zauzetost, id_kreveta], function (error, results, fields) {
    if (error) {
      console.error("Error updating krevet:", error);
      return res.status(500).send({ error: true, message: "Azuriranje neuspjesno." });
    }
    res.status(200).send({ error: false, data: results, message: "Azuriranje uspjesno." });
  });
});

app.put("/azuriranje-kvara/:id_kvara", function (req, res) {
  const { id_kvara } = req.params;
  const { stanje_kvara } = req.body;

  if (!id_kvara || stanje_kvara === undefined) {
    return res.status(400).send({ error: true, message: " id_kvara i stanje_kvara su obavezni." });
  }

  connection.query("UPDATE `kvar` SET `stanje_kvara` = ? WHERE `id_kvara` = ?", [stanje_kvara, id_kvara], function (error, results, fields) {
    if (error) {
      console.error("Error updating kvar:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno azuriranje." });
    }
    res.status(200).send({ error: false, data: results, message: "Uspjesno azuriranje." });
  });
});

app.delete("/brisanje-korisnika/:id_korisnika", function (req, res) {
  const { id_korisnika } = req.params;

  if (!id_korisnika) {
    return res.status(400).send({ error: true, message: "id_korisnika je obavezan." });
  }

  connection.query("DELETE FROM `korisnik` WHERE `id_korisnika` = ?", [id_korisnika], function (error, results, fields) {
    if (error) {
      console.error("Error deleting korisnik:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno brisanje korisnika." });
    }
    res.status(200).send({ error: false, data: results, message: "Uspjesno brisanje korisnika" });
  });
});

app.delete("/brisanje-stanara/:oib", function (req, res) {
  const { oib } = req.params;

  if (!oib) {
    return res.status(400).send({ error: true, message: "OIB is required." });
  }

  connection.query("DELETE FROM `stanar` WHERE `oib` = ?", [oib], function (error, results, fields) {
    if (error) {
      console.error("Error deleting stanar:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno brisanje stanara." });
    }
    res.status(200).send({ error: false, data: results, message: "Uspjesno brisanje stanara." });
  });
});

app.delete("/brisanje-objekta/:broj_objekta", function (req, res) {
  const { broj_objekta } = req.params;

  if (!broj_objekta) {
    return res.status(400).send({ error: true, message: "broj_objekta je obavezan." });
  }

  connection.query("DELETE FROM `objekt` WHERE `broj_objekta` = ?", [broj_objekta], function (error, results, fields) {
    if (error) {
      console.error("Error deleting objekt:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno brisanje objekta." });
    }
    res.status(200).send({ error: false, data: results, message: "Uspjesno brisanje objekta." });
  });
});

app.delete("/brisanje-sobe/:id_sobe", function (req, res) {
  const { id_sobe } = req.params;

  if (!id_sobe) {
    return res.status(400).send({ error: true, message: "id_sobe je obavezan." });
  }

  connection.query("DELETE FROM `soba` WHERE `id_sobe` = ?", [id_sobe], function (error, results, fields) {
    if (error) {
      console.error("Error deleting soba:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno brisanje soba." });
    }
    res.status(200).send({ error: false, data: results, message: "Soba uspjesno izbrisana." });
  });
});

app.delete("/brisanje-kreveta/:id_kreveta", function (req, res) {
  const { id_kreveta } = req.params;

  if (!id_kreveta) {
    return res.status(400).send({ error: true, message: "id_kreveta je obavezan." });
  }

  connection.query("DELETE FROM `krevet` WHERE `id_kreveta` = ?", [id_kreveta], function (error, results, fields) {
    if (error) {
      console.error("Error deleting krevet:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno brisanje kreveta." });
    }
    res.status(200).send({ error: false, data: results, message: "Uspjesno brisanje kreveta." });
  });
});

app.delete("/brisanje-kvara/:id_kvara", function (req, res) {
  const { id_kvara } = req.params;

  if (!id_kvara) {
    return res.status(400).send({ error: true, message: "id_kvara je obavezan." });
  }

  connection.query("DELETE FROM `kvar` WHERE `id_kvara` = ?", [id_kvara], function (error, results, fields) {
    if (error) {
      console.error("Error deleting kvar:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno brisanje kvara." });
    }
    res.status(200).send({ error: false, data: results, message: "Uspjesno brisanje kvara." });
  });
});

app.delete("/brisanje-boravka/:id_boravka", function (req, res) {
  const { id_boravka } = req.params;

  if (!id_boravka) {
    return res.status(400).send({ error: true, message: "id_boravka je obavezan." });
  }

  connection.query("DELETE FROM `boravak` WHERE `id_boravka` = ?", [id_boravka], function (error, results, fields) {
    if (error) {
      console.error("Error deleting boravak:", error);
      return res.status(500).send({ error: true, message: "Neuspjesno brisanje boravka." });
    }
    res.status(200).send({ error: false, data: results, message: "Uspjesno brisanje boravka" });
  });
});
