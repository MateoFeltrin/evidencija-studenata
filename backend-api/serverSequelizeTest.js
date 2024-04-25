const express = require("express");
const app = express();
const { Sequelize } = require("sequelize");
const sequelize = require("./sequelizeInstance");
const { Op } = require("sequelize");
const config = require("../backend-api/auth.config");
const authJwt = require("../backend-api/authJwt");
const jwt = require("jsonwebtoken");
app.use(express.json());
var cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
// Parser za JSON podatke
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const Stanar = require("./model/stanarModel");
const Boravak = require("./model/boravakModel");
const Kvar = require("./model/kvarModel");
const Korisnik = require("./model/korisnikModel");
const Soba = require("./model/sobaModel");
const Objekt = require("./model/objektMode");
const Krevet = require("./model/krevetMode");

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

app.post("/register", async (request, response) => {
  const data = request.body;
  const saltRounds = 10;

  try {
    const emailExists = await Korisnik.findOne({
      where: {
        email_korisnika: data.email_korisnika,
      },
    });
    if (!emailExists) {
      // Hash the password using bcrypt
      const hash = await bcrypt.hash(data.lozinka, saltRounds);

      // Create a new korisnik using the Korisnik model
      const newKorisnik = await Korisnik.create({
        email_korisnika: data.email_korisnika,
        lozinka: hash,
        uloga: data.uloga,
      });

      // Return the newly created korisnik
      response.status(201).json({ error: false, data: newKorisnik, message: "Uspješna registracija!" });
    } else {
      response.status(500).json({ error: true, message: "Registracija korisnika neuspješna, email se već koristi!" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    response.status(500).json({ error: true, message: "Registracija korisnika neuspješna." });
  }
});

app.post("/login", async (req, res) => {
  const { email_korisnika, lozinka } = req.body;

  try {
    // Find the user by email
    const korisnik = await Korisnik.findOne({
      where: {
        email_korisnika: email_korisnika,
      },
    });

    if (!korisnik) {
      // If the user is not found
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare passwords using bcrypt
    const bcryptRes = await bcrypt.compare(lozinka, korisnik.lozinka);
    if (!bcryptRes) {
      // If the password comparison fails
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: korisnik.id_korisnika, uloga: korisnik.uloga }, config.secret);

    // Send back a success response with the token
    return res.status(200).json({ success: true, message: "Login successful", token: token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/trenutni-stanari", async (req, res) => {
  try {
    // Fetching the residents and their current stay details
    const trenutniStanari = await Boravak.findAll({
      where: {
        datum_iseljenja: null, // Filter for current residents
      },
      include: [
        {
          model: Stanar, // Include the associated Stanar model
          required: true,
        },
      ],
    });

    // Sending the results as a JSON response
    res.json(trenutniStanari);
  } catch (error) {
    console.error("Error fetching trenutni stanari:", error);
    res.status(500).send({ error: true, message: "Failed to fetch trenutni stanari." });
  }
});

app.get("/api/aktivni-kvarovi", async (req, res) => {
  try {
    const aktivniKvarovi = await Kvar.findAll({
      where: {
        stanje_kvara: 0,
      },
    });
    res.json(aktivniKvarovi);
  } catch (error) {
    console.log("Error fetching Kvarovi: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch trenutni kvarovi." });
  }
});

app.get("/api/svi-radnici", async (req, res) => {
  try {
    const sviKorisnici = await Korisnik.findAll({
      where: {
        uloga: {
          [Sequelize.Op.in]: ["admin", "recepcionar", "domar"],
        },
      },
    });
    res.json(sviKorisnici);
  } catch (error) {
    console.log("Error fetching Korisnici: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi korisnici." });
  }
});

app.get("/api/svi-boravci", async (req, res) => {
  try {
    const sviBoravci = await Boravak.findAll({
      include: [
        {
          model: Stanar,
          attributes: ["ime", "prezime"],
        },
        {
          model: Krevet,
          attributes: ["broj_kreveta"],
          include: [
            {
              model: Soba,
              attributes: ["broj_objekta", "broj_sobe"],
            },
          ],
        },
        {
          model: Korisnik,
          attributes: ["email_korisnika"],
        },
      ],
    });

    res.json(sviBoravci);
  } catch (error) {
    console.log("Error fetching boravci: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi boravci." });
  }
});

app.get("/api/svi-kvarovi", async (req, res) => {
  try {
    const aktivniKvarovi = await Kvar.findAll({});
    res.json(aktivniKvarovi);
  } catch (error) {
    console.log("Error fetching Kvarovi: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi kvarovi." });
  }
});

app.get("/api/svi-kreveti", async (req, res) => {
  try {
    const sviKreveti = await Krevet.findAll({});
    res.json(sviKreveti);
  } catch (error) {
    console.log("Error fetching Kreveti: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi kreveti." });
  }
});

app.get("/api/svi-objekti", async (req, res) => {
  try {
    const sviObjekti = await Objekt.findAll({});
    res.json(sviObjekti);
  } catch (error) {
    console.log("Error fetching Objekti: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi objekti." });
  }
});

app.get("/api/sve-sobe", async (req, res) => {
  try {
    const sveSobe = await Soba.findAll({});
    res.json(sveSobe);
  } catch (error) {
    console.log("Error fetching Sobe: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch sve Sobe." });
  }
});

app.get("/api/boravci-u-vremenskom-periodu/:datum_useljenja/:datum_iseljenja", async (req, res) => {
  const { datum_useljenja, datum_iseljenja } = req.params;
  try {
    const boravciPerioda = await Boravak.findAll({
      where: {
        datum_useljenja: {
          [Op.gte]: datum_useljenja,
          [Op.lte]: datum_iseljenja,
        },
      },
    });
    res.json(boravciPerioda);
  } catch (error) {
    console.log("Error fetching Boravci: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi Boravci." });
  }
});

app.post("/unos-objekta", authJwt.verifyToken("admin"), async (req, res) => {
  const broj_objekta = req.body.broj_objekta;

  if (!broj_objekta) {
    return res.status(400).send({ error: true, message: "Broj objekta je obavezan." });
  }

  try {
    const newObjekt = await Objekt.create({
      broj_objekta,
    });
    res.status(201).send({ error: false, data: newObjekt, message: "Objekt je dodan." });
  } catch (error) {
    console.error("Error inserting objekt:", error);
    res.status(500).send({ error: true, message: "Neuspjesno dodavanje objekta." });
  }
});

app.post("/unos-sobe", authJwt.verifyToken("admin"), async (req, res) => {
  const { broj_objekta, kat_sobe, broj_sobe } = req.body;

  if (!broj_objekta || !kat_sobe || !broj_sobe) {
    return res.status(400).send({ error: true, message: "Broj objekta, kat sobe, i broj sobe su obavezni." });
  }
  try {
    const newSoba = await Soba.create({
      broj_sobe: broj_sobe,
      kat_sobe: kat_sobe,
      broj_objekta: broj_objekta,
    });
    res.status(201).send({ error: false, data: newSoba, message: "Soba je dodana." });
  } catch (error) {
    console.error("Error inserting soba:", error);
    res.status(500).send({ error: true, message: "Neuspjesno dodavanje sobe." });
  }
});

app.post("/unos-kreveta", authJwt.verifyToken("admin"), async (req, res) => {
  const { broj_kreveta, id_sobe } = req.body;

  if (!broj_kreveta || !id_sobe) {
    return res.status(400).send({ error: true, message: "Broj kreveta i id sobe su obavezni." });
  }

  try {
    const newKrevet = await Krevet.create({
      broj_kreveta: broj_kreveta,
      id_sobe: id_sobe,
      zauzetost: 0,
    });
    res.status(201).send({ error: false, data: newKrevet, message: "Krevet je dodan." });
  } catch (error) {
    console.error("Error inserting krevet:", error);
    res.status(500).send({ error: true, message: "Neuspjesno dodavanje kreveta." });
  }
});

app.post("/unos-korisnika", authJwt.verifyToken("admin"), async (req, res) => {
  const { email_korisnika, lozinka, uloga } = req.body;

  if (!email_korisnika || !lozinka || !uloga) {
    return res.status(400).send({ error: true, message: "email, lozinka i uloga su obavezni." });
  }

  try {
    const newKorisnik = await Korisnik.create({
      email_korisnika: email_korisnika,
      lozinka: lozinka,
      uloga: uloga,
    });
    res.status(201).send({ error: false, data: newKorisnik, message: "Korisnik je dodan." });
  } catch (error) {
    console.error("Error inserting korisnik:", error);
    res.status(500).send({ error: true, message: "Neuspjesno dodavanje korisnika." });
  }
});

app.post("/unos-stanara", authJwt.verifyToken("recepcionar"), async (req, res) => {
  const saltRounds = 10;
  const { email_korisnika, lozinka, uloga, oib, jmbag, ime, prezime, datum_rodenja, adresa_prebivalista, subvencioniranost, uciliste, uplata_teretane, komentar } = req.body;

  // Validate input
  const requiredFields = [email_korisnika, lozinka, uloga, oib, jmbag, ime, prezime, datum_rodenja, adresa_prebivalista, subvencioniranost, uciliste, uplata_teretane];
  if (requiredFields.includes(undefined)) {
    return res.status(400).json({ error: true, message: "All fields are required." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if the email is already used
    const existingKorisnik = await Korisnik.findOne({
      where: { email_korisnika },
      transaction,
    });

    if (existingKorisnik) {
      await transaction.rollback();
      return res.status(400).json({ error: true, message: "Email already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(lozinka, saltRounds);

    // Create new korisnik
    const newKorisnik = await Korisnik.create(
      {
        email_korisnika,
        lozinka: hashedPassword,
        uloga,
      },
      { transaction }
    );

    // Create new stanar
    await Stanar.create(
      {
        oib,
        jmbag,
        ime,
        prezime,
        datum_rodenja,
        adresa_prebivalista,
        subvencioniranost,
        uciliste,
        uplata_teretane,
        komentar,
        id_korisnika: newKorisnik.id_korisnika, // Assign id_korisnika from new korisnik
      },
      { transaction }
    );

    // Commit the transaction if everything went well
    await transaction.commit();
    return res.status(201).json({ error: false, message: "Stanar je dodan." });
  } catch (error) {
    // Rollback the transaction if there was an error
    await transaction.rollback();
    console.error("Error adding stanar:", error);
    return res.status(500).json({ error: true, message: "Neuspješno dodavanje stanara." });
  }
});

app.post("/unos-boravka", authJwt.verifyToken("recepcionar"), async (req, res) => {
  const { id_kreveta, oib, id_korisnika, datum_useljenja } = req.body;

  if (!id_kreveta || !oib || !id_korisnika || !datum_useljenja) {
    return res.status(400).send({ error: true, message: "All fields are required." });
  }
  try {
    const newBoravak = await Boravak.create({
      id_kreveta: id_kreveta,
      oib: oib,
      id_korisnika: id_korisnika,
      datum_useljenja: datum_useljenja,
      datum_iseljenja: null,
    });
    res.status(201).send({ error: false, data: newBoravak, message: "Boravak je dodan." });
  } catch (error) {
    console.error("Error inserting boravak:", error);
    res.status(500).send({ error: true, message: "Neuspjesno dodavanje boravka." });
  }
});

app.put("/azuriranje-boravka/:id_boravka", authJwt.verifyToken("recepcionar"), async (req, res) => {
  const { id_boravka } = req.params;
  const { datum_iseljenja } = req.body;

  // Validate the input
  if (!id_boravka || !datum_iseljenja) {
    return res.status(400).json({ error: true, message: "id_boravka and datum_iseljenja are required." });
  }

  try {
    // Find the boravak by id_boravka and update the datum_iseljenja
    const updatedBoravak = await Boravak.update(
      { datum_iseljenja },
      {
        where: { id_boravka },
        returning: true, // This option returns the updated rows
      }
    );

    if (updatedBoravak[0] === 0) {
      // No rows were updated
      return res.status(404).json({ error: true, message: "Boravak not found." });
    }

    // Successful update
    return res.status(200).json({
      error: false,
      data: updatedBoravak[1][0],
      message: "Successfully updated boravak.",
    });
  } catch (error) {
    console.error("Error updating boravak:", error);
    // Return a 500 Internal Server Error response if there's an error
    return res.status(500).json({ error: true, message: "Failed to update boravak." });
  }
});

app.put("/azuriranje-stanara/:oib", authJwt.verifyToken("recepcionar"), async (req, res) => {
  const { oib } = req.params;
  const { jmbag, ime, prezime, datum_rodenja, adresa_prebivalista, subvencioniranost, uciliste, uplata_teretane, komentar, id_korisnika } = req.body;

  // Validate the input
  if (!oib) {
    return res.status(400).json({ error: true, message: "OIB je obavezan podatak." });
  }

  try {
    // Update the stanar record using the OIB as the identifier
    const [updatedRowsCount, updatedRows] = await Stanar.update(
      {
        jmbag,
        ime,
        prezime,
        datum_rodenja,
        adresa_prebivalista,
        subvencioniranost,
        uciliste,
        uplata_teretane,
        komentar,
        id_korisnika,
      },
      {
        where: { oib },
        returning: true, // This option returns the updated rows
      }
    );

    if (updatedRowsCount === 0) {
      // No rows were updated
      return res.status(404).json({ error: true, message: "Stanar not found." });
    }

    // Successful update
    return res.status(200).json({
      error: false,
      data: updatedRows[0],
      message: "Uspješno ažuriran stanar.",
    });
  } catch (error) {
    console.error("Error updating stanar:", error);
    // Return a 500 Internal Server Error response if there's an error
    return res.status(500).json({ error: true, message: "Neuspješno ažuriranje stanara." });
  }
});

app.put("/azuriranje-korisnika/:id_korisnika", authJwt.verifyToken("admin"), async (req, res) => {
  const { id_korisnika } = req.params;
  const { email_korisnika, lozinka, uloga } = req.body;

  try {
    const updateData = {};

    // Add provided fields to the update data object
    if (email_korisnika) {
      updateData.email_korisnika = email_korisnika;
    }

    if (lozinka) {
      // Hash the password using bcrypt if a new password is provided
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(lozinka, saltRounds);
      updateData.lozinka = hashedPassword;
    }

    if (uloga) {
      updateData.uloga = uloga;
    }

    // Update the korisnik record using the update data
    const [rowsUpdated] = await Korisnik.update(updateData, {
      where: { id_korisnika },
    });

    // Check if any rows were updated
    if (rowsUpdated === 0) {
      return res.status(404).json({ error: true, message: "Korisnik not found." });
    }

    // Return a success response
    res.status(200).json({ error: false, message: "Azuriranje uspjesno." });
  } catch (error) {
    console.error("Error updating korisnik:", error);
    return res.status(500).json({ error: true, message: "Azuriranje neuspjesno." });
  }
});

app.put("/azuriranje-sobe/:id_sobe", authJwt.verifyToken("admin"), async (req, res) => {
  const { id_sobe } = req.params;
  const { broj_objekta, kat_sobe, broj_sobe } = req.body;

  try {
    // Find the Soba record by id_sobe and update it
    const soba = await Soba.findByPk(id_sobe);

    // Check if the record exists
    if (!soba) {
      return res.status(404).json({ error: true, message: "Soba not found." });
    }

    // Update the Soba record with provided data
    await soba.update({
      broj_objekta,
      kat_sobe,
      broj_sobe,
    });

    // Send a success response
    res.status(200).json({ error: false, message: "Azuriranje uspjesno." });
  } catch (error) {
    console.error("Error updating soba:", error);
    return res.status(500).json({ error: true, message: "Azuriranje neuspjesno." });
  }
});

app.put("/azuriranje-kreveta/:id_kreveta", authJwt.verifyToken("recepcionar"), async (req, res) => {
  const { id_kreveta } = req.params;
  const { broj_kreveta, id_sobe, zauzetost } = req.body;

  try {
    // Find the Krevet record by id_kreveta and update it
    const krevet = await Krevet.findByPk(id_kreveta);

    // Check if the record exists
    if (!krevet) {
      return res.status(404).json({ error: true, message: "Krevet not found." });
    }

    // Update the Krevet record with provided data
    await krevet.update({
      broj_kreveta,
      id_sobe,
      zauzetost,
    });

    // Send a success response
    res.status(200).json({ error: false, message: "Azuriranje uspjesno." });
  } catch (error) {
    console.error("Error updating krevet:", error);
    return res.status(500).json({ error: true, message: "Azuriranje neuspjesno." });
  }
});

app.put("/azuriranje-kvara/:id_kvara", authJwt.verifyToken("domar"), async (req, res) => {
  const { id_kvara } = req.params;
  const { stanje_kvara } = req.body;

  // Validate input
  if (!id_kvara || stanje_kvara === undefined) {
    return res.status(400).json({ error: true, message: "id_kvara i stanje_kvara su obavezni." });
  }

  try {
    // Find the Kvar record by id_kvara
    const kvar = await Kvar.findByPk(id_kvara);

    // Check if the record exists
    if (!kvar) {
      return res.status(404).json({ error: true, message: "Kvar not found." });
    }

    // Update the Kvar record with the provided state
    await kvar.update({ stanje_kvara });

    // Send a success response
    res.status(200).json({ error: false, message: "Uspjesno azuriranje." });
  } catch (error) {
    console.error("Error updating kvar:", error);
    return res.status(500).json({ error: true, message: "Neuspjesno azuriranje." });
  }
});

app.delete("/brisanje-korisnika/:id_korisnika", authJwt.verifyToken("admin"), async (req, res) => {
  const { id_korisnika } = req.params;

  // Validate input
  if (!id_korisnika) {
    return res.status(400).json({ error: true, message: "id_korisnika je obavezan." });
  }

  try {
    // Delete the Korisnik record by id_korisnika
    const deletedCount = await Korisnik.destroy({
      where: {
        id_korisnika: id_korisnika,
      },
    });

    // Check if any record was deleted
    if (deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Korisnik not found." });
    }

    // Send a success response
    res.status(200).json({ error: false, message: "Uspjesno brisanje korisnika" });
  } catch (error) {
    console.error("Error deleting korisnik:", error);

    // Check if the error is a foreign key constraint violation
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({ error: true, message: "Ne može se obrisati korisnik pošto je on useljavo, odnosno riješavo kvarove." });
    }
    return res.status(500).json({ error: true, message: "Neuspjesno brisanje korisnika." });
  }
});

app.delete("/brisanje-stanara/:oib", authJwt.verifyToken("recepcionar"), async (req, res) => {
  const { oib } = req.params;

  // Validate input
  if (!oib) {
    return res.status(400).json({ error: true, message: "OIB is required." });
  }

  try {
    // Delete the Stanar record by oib
    const deletedCount = await Stanar.destroy({
      where: {
        oib: oib,
      },
    });

    // Check if any record was deleted
    if (deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Stanar not found." });
    }

    // Send a success response
    res.status(200).json({ error: false, message: "Uspjesno brisanje stanara." });
  } catch (error) {
    console.error("Error deleting stanar:", error);

    // Check if the error is a foreign key constraint violation
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({ error: true, message: "Ne može se obrisati stanar pošto je on boravio u domu." });
    }

    return res.status(500).json({ error: true, message: "Neuspjesno brisanje stanara." });
  }
});

app.delete("/brisanje-objekta/:broj_objekta", authJwt.verifyToken("admin"), async (req, res) => {
  const { broj_objekta } = req.params;

  // Validate input
  if (!broj_objekta) {
    return res.status(400).json({ error: true, message: "broj_objekta je obavezan." });
  }

  try {
    // Delete the Objekt record by broj_objekta
    const deletedCount = await Objekt.destroy({
      where: {
        broj_objekta: broj_objekta,
      },
    });

    // Check if any record was deleted
    if (deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Objekt not found." });
    }

    // Send a success response
    res.status(200).json({ error: false, message: "Uspjesno brisanje objekta." });
  } catch (error) {
    console.error("Error deleting objekt:", error);

    // Check if the error is a foreign key constraint violation
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({ error: true, message: "Ne može se obrisati objekt pošto ima soba u njemu, prvo obrište sobe." });
    }
    return res.status(500).json({ error: true, message: "Neuspjesno brisanje objekta." });
  }
});

app.delete("/brisanje-sobe/:id_sobe", authJwt.verifyToken("admin"), async (req, res) => {
  const { id_sobe } = req.params;

  if (!id_sobe) {
    return res.status(400).json({ error: true, message: "id_sobe je obavezan." });
  }

  try {
    const deletedCount = await Soba.destroy({
      where: {
        id_sobe: id_sobe,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Soba not found." });
    }

    res.status(200).json({ error: false, message: "Soba uspjesno izbrisana." });
  } catch (error) {
    console.error("Error deleting soba:", error);

    // Check if the error is a foreign key constraint violation
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({ error: true, message: "Ne može se obrisati soba pošto ima kreveta u njemoj, prvo obrište krevete." });
    }
    res.status(500).json({ error: true, message: "Neuspjesno brisanje soba." });
  }
});

app.delete("/brisanje-kreveta/:id_kreveta", authJwt.verifyToken("admin"), async (req, res) => {
  const { id_kreveta } = req.params;

  if (!id_kreveta) {
    return res.status(400).json({ error: true, message: "id_kreveta je obavezan." });
  }

  try {
    const deletedCount = await Krevet.destroy({
      where: {
        id_kreveta: id_kreveta,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Krevet not found." });
    }

    res.status(200).json({ error: false, message: "Uspjesno brisanje kreveta." });
  } catch (error) {
    console.error("Error deleting krevet:", error);

    // Check if the error is a foreign key constraint violation
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({ error: true, message: "Ne može se obrisati krevet pošto je stanar boravio u njemu." });
    }
    res.status(500).json({ error: true, message: "Neuspjesno brisanje kreveta." });
  }
});

app.delete("/brisanje-kvara/:id_kvara", authJwt.verifyToken("admin"), async (req, res) => {
  const { id_kvara } = req.params;

  if (!id_kvara) {
    return res.status(400).json({ error: true, message: "id_kvara je obavezan." });
  }

  try {
    const deletedCount = await Kvar.destroy({
      where: {
        id_kvara: id_kvara,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Kvar not found." });
    }

    res.status(200).json({ error: false, message: "Uspjesno brisanje kvara." });
  } catch (error) {
    console.error("Error deleting kvar:", error);
    res.status(500).json({ error: true, message: "Neuspjesno brisanje kvara." });
  }
});

app.delete("/brisanje-boravka/:id_boravka", authJwt.verifyToken("recepcionar"), async (req, res) => {
  const { id_boravka } = req.params;

  if (!id_boravka) {
    return res.status(400).json({ error: true, message: "id_boravka je obavezan." });
  }

  try {
    const deletedCount = await Boravak.destroy({
      where: {
        id_boravka: id_boravka,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: true, message: "Boravak not found." });
    }

    res.status(200).json({ error: false, message: "Uspjesno brisanje boravka." });
  } catch (error) {
    console.error("Error deleting boravak:", error);
    res.status(500).json({ error: true, message: "Neuspjesno brisanje boravka." });
  }
});
