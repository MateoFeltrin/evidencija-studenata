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

const { Boravak, Stanar, Korisnik, Krevet, Kvar, Objekt, Soba } = require("./model/associations.js");

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

app.get("/verify-token", async (req, res) => {
  // Retrieve the desired roles from the query parameters
  const roles = req.query.roles;

  // Check if roles were specified
  if (!roles) {
    return res.status(400).json({ error: true, message: "Roles are required." });
  }

  // Split the roles string by commas and trim whitespace
  const rolesArray = roles.split(",").map((role) => role.trim());

  // Use a function that verifies the token and checks if the user's role matches any of the specified roles
  authJwt.verifyToken(rolesArray)(req, res, () => {
    // If the token is verified and the user has one of the specified roles, send a 200 OK response
    res.sendStatus(200);
  });
});

app.get("/api/svi-radnici1/:id_korisnika", authJwt.verifyToken("admin, domar"), async (req, res) => {
  try {
    const id_korisnika = req.params.id_korisnika;

    // Fetch the korisnik record using Sequelize findOne method
    const korisnik = await Korisnik.findOne({
      where: { id_korisnika },
    });

    // Check if the korisnik record is found
    if (!korisnik) {
      return res.status(404).json({ error: true, message: "Korisnik not found." });
    }

    // Respond with the korisnik data
    res.json(korisnik);
  } catch (error) {
    console.error("Error fetching korisnici:", error);
    res.status(500).json({ error: true, message: "Failed to fetch korisnici." });
  }
});

app.get("/api/trenutni-stanari1/:id", authJwt.verifyToken("recepcionar, admin, domar"), async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch the stanar record using Sequelize findOne method
    const stanar = await Stanar.findOne({
      where: { oib: id },
    });

    // Check if the stanar record is found
    if (!stanar) {
      return res.status(404).json({ error: true, message: "Stanar not found." });
    }

    // Respond with the stanar data
    res.json(stanar);
  } catch (error) {
    console.error("Error fetching stanar:", error);
    res.status(500).json({ error: true, message: "Failed to fetch stanar." });
  }
});

app.get("/api/trenutni-stanari", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || "";

    let whereClause = { datum_iseljenja: null }; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        datum_iseljenja: null,
        [Op.or]: [Sequelize.literal(`stanar.uciliste LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.ime LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.prezime LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.oib LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.jmbag LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.adresa_prebivalista LIKE '%${searchQuery}%'`)],
      };
    }

    const { rows: sviStanari, count: totalCount } = await Boravak.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Stanar, // Include the associated Stanar model
          required: true,
        },
      ],
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      stanari: sviStanari,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.error("Error fetching trenutni stanari:", error);
    res.status(500).send({ error: true, message: "Failed to fetch trenutni stanari." });
  }
});

app.get("/api/sviupisani-stanari", authJwt.verifyToken("recepcionar, admin, domar"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || "";

    let whereClause = {}; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        [Op.or]: [
          Sequelize.literal(`korisnik.email_korisnika LIKE '%${searchQuery}%'`),
          Sequelize.literal(`stanar.uciliste LIKE '%${searchQuery}%'`),
          Sequelize.literal(`stanar.ime LIKE '%${searchQuery}%'`),
          Sequelize.literal(`stanar.prezime LIKE '%${searchQuery}%'`),
          Sequelize.literal(`stanar.oib LIKE '%${searchQuery}%'`),
          Sequelize.literal(`stanar.jmbag LIKE '%${searchQuery}%'`),
          Sequelize.literal(`stanar.adresa_prebivalista LIKE '%${searchQuery}%'`),
        ],
      };
    }

    const { rows: sviStanari, count: totalCount } = await Stanar.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Korisnik, // Include the associated Stanar model
          required: true,
        },
      ],
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      stanari: sviStanari,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.error("Error fetching all stanari:", error);
    res.status(500).send({ error: true, message: "Failed to fetch all stanari." });
  }
});

app.get("/api/aktivni-kvarovi", authJwt.verifyToken("domar, admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || "";

    let whereClause = { stanje_kvara: 0 }; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        stanje_kvara: 0,
        [Op.or]: [Sequelize.literal(`stanar.ime LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.prezime LIKE '%${searchQuery}%'`), Sequelize.literal(`kvar.opis_kvara LIKE '%${searchQuery}%'`), Sequelize.literal(`soba.broj_sobe LIKE '%${searchQuery}%'`), Sequelize.literal(`soba.broj_objekta LIKE '%${searchQuery}%'`)],
      };
    }

    const { rows: sviKvarovi, count: totalCount } = await Kvar.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Stanar,
          attributes: ["ime", "prezime"],
        },
        {
          model: Soba,
          attributes: ["broj_sobe", "broj_objekta"],
        },
        {
          model: Korisnik,
          attributes: ["email_korisnika"],
        },
      ],
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      kvarovi: sviKvarovi,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.log("Error fetching Kvarovi: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi kvarovi." });
  }
});

app.get("/api/aktivni-kvarovi/:id", authJwt.verifyToken("domar, admin"), async (req, res) => {
  try {
    // Fetch the active faults (kvarovi) with related Soba and Stanar models
    const kvarovi = await Kvar.findAll({
      where: {
        stanje_kvara: false, // stanje_kvara = 0 in the original query
      },
      include: [
        {
          model: Soba,
          attributes: ["broj_objekta", "broj_sobe"],
        },
        {
          model: Stanar,
          attributes: ["ime", "prezime"],
        },
      ],
    });

    // Respond with the fetched kvarovi data
    res.json(kvarovi);
  } catch (error) {
    console.error("Error fetching kvarovi:", error);
    res.status(500).json({ error: true, message: "Failed to fetch kvarovi." });
  }
});

app.get("/api/svi-radnici", authJwt.verifyToken("admin, domar"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";
    const offset = (page - 1) * limit;

    let whereClause = {
      uloga: {
        [Sequelize.Op.in]: ["admin", "recepcionar", "domar"],
      },
    }; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        uloga: {
          [Sequelize.Op.in]: ["admin", "recepcionar", "domar"],
        },
        [Op.or]: [Sequelize.literal(`korisnik.email_korisnika LIKE '%${searchQuery}%'`), Sequelize.literal(`korisnik.uloga LIKE '%${searchQuery}%'`)],
      };
    }
    const { rows: sviKorisnici, count: totalCount } = await Korisnik.findAndCountAll({
      where: whereClause,
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      korisnici: sviKorisnici,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.log("Error fetching Korisnici: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi korisnici." });
  }
});

app.get("/api/svi-boravci", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";
    const offset = (page - 1) * limit;

    let whereClause = {}; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        [Op.or]: [
          Sequelize.literal(`stanar.oib LIKE '%${searchQuery}%'`),
          Sequelize.literal(`korisnik.email_korisnika LIKE '%${searchQuery}%'`),
          Sequelize.literal(`stanar.ime LIKE '%${searchQuery}%'`),
          Sequelize.literal(`stanar.prezime LIKE '%${searchQuery}%'`),
          { "$krevet.soba.broj_sobe$": { [Op.like]: `%${searchQuery}%` } }, //Ovako kada se hvata preko vanjskog kljuca u trecu tablicu
          { "$krevet.soba.broj_objekta$": { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    const { rows: sviBoravci, count: totalCount } = await Boravak.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Stanar,
          attributes: ["ime", "prezime", "oib"],
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
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      boravci: sviBoravci,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.log("Error fetching Boravci: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi boravci." });
  }
});

app.get("/api/svi-kvarovi1/:id_kvara", authJwt.verifyToken("domar, admin"), async (req, res) => {
  const { id_kvara } = req.params;
  try {
    const sviKvarovi = await Kvar.findByPk(id_kvara, {
      include: [
        {
          model: Stanar,
          attributes: ["ime", "prezime"],
        },
        {
          model: Soba,
          attributes: ["broj_sobe", "broj_objekta"],
        },
        {
          model: Korisnik,
          attributes: ["email_korisnika"],
        },
      ],
    });
    if (!sviKvarovi) {
      return res.status(404).json({ error: true, message: "Kvar not found." });
    }
    res.json(sviKvarovi);
  } catch (error) {
    console.log("Error fetching Kvarovi: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi kvarovi." });
  }
});

app.get("/api/svi-kvarovi", authJwt.verifyToken("domar, admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";

    const offset = (page - 1) * limit;

    let whereClause = ""; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        [Op.or]: [Sequelize.literal(`korisnik.email_korisnika LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.ime LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.prezime LIKE '%${searchQuery}%'`), Sequelize.literal(`kvar.opis_kvara LIKE '%${searchQuery}%'`), Sequelize.literal(`soba.broj_sobe LIKE '%${searchQuery}%'`), Sequelize.literal(`soba.broj_objekta LIKE '%${searchQuery}%'`)],
      };
    }

    const { rows: sviKvarovi, count: totalCount } = await Kvar.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Stanar,
          attributes: ["ime", "prezime"],
        },
        {
          model: Soba,
          attributes: ["broj_sobe", "broj_objekta"],
        },
        {
          model: Korisnik,
          attributes: ["email_korisnika"],
        },
      ],
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      kvarovi: sviKvarovi,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.log("Error fetching Kvarovi: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi kvarovi." });
  }
});

app.get("/api/svi-kreveti", authJwt.verifyToken("admin, recepcionar"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";

    const offset = (page - 1) * limit;

    let whereClause = ""; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        [Op.or]: [Sequelize.literal(`krevet.broj_kreveta LIKE '%${searchQuery}%'`), Sequelize.literal(`soba.broj_sobe LIKE '%${searchQuery}%'`), Sequelize.literal(`soba.broj_objekta LIKE '%${searchQuery}%'`), Sequelize.literal(`krevet.id_kreveta LIKE '%${searchQuery}%'`)],
      };
    }

    const { rows: sviKreveti, count: totalCount } = await Krevet.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Soba,
          attributes: ["broj_sobe", "broj_objekta"],
        },
      ],
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      kreveti: sviKreveti,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.log("Error fetching Kreveti: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi kreveti." });
  }
});

app.get("/api/svi-kreveti-dropdown", authJwt.verifyToken("admin, recepcionar"), async (req, res) => {
  try {
    const sviKreveti = await Krevet.findAll({});

    res.json(sviKreveti);
  } catch (error) {
    console.log("Error fetching Kreveti: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi kreveti." });
  }
});

app.get("/api/svi-objekti", authJwt.verifyToken("admin, recepcionar"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const searchQuery = req.query.search || "";

    const offset = (page - 1) * limit;

    let whereClause = ""; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        [Op.or]: [Sequelize.literal(`objekt.broj_objekta LIKE '%${searchQuery}%'`)],
      };
    }

    const { rows: sviObjekti, count: totalCount } = await Objekt.findAndCountAll({
      where: whereClause,
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      objekti: sviObjekti,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.log("Error fetching Objekti: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi objekti." });
  }
});

app.get("/api/svi-objekti-dropdown", authJwt.verifyToken("admin, recepcionar"), async (req, res) => {
  try {
    const sviObjekti = await Objekt.findAll({});

    res.json(sviObjekti);
  } catch (error) {
    console.log("Error fetching Objekti: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch svi objekti." });
  }
});

app.get("/api/objekt/:broj_objekta", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
  const { broj_objekta } = req.params;

  try {
    // Fetch the objekt with the given broj_objekta using Sequelize's findOne method
    const objekt = await Objekt.findOne({
      where: {
        broj_objekta, // Condition to find the objekt with the specified broj_objekta
      },
    });

    if (!objekt) {
      // If no objekt is found, return a 404 status with an error message
      return res.status(404).json({ error: true, message: "Objekt not found." });
    }

    // If the objekt is found, return it as a JSON response
    res.json(objekt);
  } catch (error) {
    // Log any errors and return a 500 status with an error message
    console.error("Error fetching objekt:", error);
    res.status(500).json({ error: true, message: "Failed to fetch objekt." });
  }
});

app.get("/api/sve-sobe", authJwt.verifyToken("admin, domar"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";

    const offset = (page - 1) * limit;

    let whereClause = ""; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        [Op.or]: [Sequelize.literal(`soba.id_sobe LIKE '%${searchQuery}%'`), Sequelize.literal(`soba.broj_sobe LIKE '%${searchQuery}%'`), Sequelize.literal(`soba.broj_objekta LIKE '%${searchQuery}%'`), Sequelize.literal(`soba.kat_sobe LIKE '%${searchQuery}%'`)],
      };
    }

    const { rows: sveSobe, count: totalCount } = await Soba.findAndCountAll({
      where: whereClause,
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      sveSobe,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.log("Error fetching Sobe: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch sve Sobe." });
  }
});

app.get("/api/sve-sobe-dropdown", authJwt.verifyToken("admin, recepcionar"), async (req, res) => {
  try {
    const sveSobe = await Soba.findAll({});

    res.json(sveSobe);
  } catch (error) {
    console.log("Error fetching Sobe: ", error);
    res.status(500).send({ error: true, message: "Failed to fetch sve sobe." });
  }
});

app.get("/api/boravci-u-vremenskom-periodu/:datum_useljenja/:datum_iseljenja", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
  try {
    const { datum_useljenja, datum_iseljenja } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || "";

    let whereClause = {
      datum_useljenja: {
        [Op.gte]: datum_useljenja,
        [Op.lte]: datum_iseljenja,
      },
    }; // Default where clause

    if (searchQuery) {
      const { Op } = require("sequelize");
      whereClause = {
        datum_useljenja: {
          [Op.gte]: datum_useljenja,
          [Op.lte]: datum_iseljenja,
        },
        [Op.or]: [Sequelize.literal(`stanar.ime LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.prezime LIKE '%${searchQuery}%'`), Sequelize.literal(`stanar.oib LIKE '%${searchQuery}%'`)],
      };
    }

    const { rows: sviStanari, count: totalCount } = await Boravak.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Stanar,
          attributes: ["ime", "prezime"],
        },
      ],
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      stanari: sviStanari,
      currentPage: page,
      totalPages,
      limit,
    });
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
  const { broj_kreveta, broj_sobe, broj_objekta } = req.body;

  if (!broj_kreveta || !broj_sobe || !broj_objekta) {
    return res.status(400).send({ error: true, message: "Broj kreveta i id sobe su obavezni." });
  }
  // Find `id_sobe` using `broj_sobe` and possibly `broj_objekta`
  let id_sobe = null;
  try {
    const soba = await Soba.findOne({
      where: { broj_sobe, broj_objekta },
    });

    if (soba) {
      id_sobe = soba.id_sobe;
    } else {
      return res.status(400).send({ error: true, message: "Soba not found." });
    }
  } catch (error) {
    console.error("Error fetching soba:", error);
    return res.status(500).send({ error: true, message: "Error fetching soba." });
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

app.post("/unos-radnika", authJwt.verifyToken("admin"), async (req, res) => {
  const saltRounds = 10;
  const { email_korisnika, lozinka, uloga } = req.body;

  if (!email_korisnika || !lozinka || !uloga) {
    return res.status(400).send({ error: true, message: "email, lozinka i uloga su obavezni." });
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(lozinka, saltRounds);

  try {
    const newKorisnik = await Korisnik.create({
      email_korisnika: email_korisnika,
      lozinka: hashedPassword,
      uloga: uloga,
    });
    res.status(201).send({ error: false, data: newKorisnik, message: "Korisnik je dodan." });
  } catch (error) {
    console.error("Error inserting korisnik:", error);
    res.status(500).send({ error: true, message: "Neuspjesno dodavanje korisnika." });
  }
});

app.get("/api/slobodni-stanari", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
  try {
    // Fetch Stanar records that meet the specified conditions
    const slobodniStanari = await Stanar.findAll({
      attributes: ["ime", "prezime", "oib"], // Specify the fields to return from Stanar
      include: [
        {
          model: Boravak,
          attributes: [], // Don't return attributes from Boravak
          required: false, // Include Stanar records even if there is no related Boravak
          where: {
            [Op.or]: [
              { datum_useljenja: { [Op.is]: null } }, // Check if datum_useljenja is null
              { datum_iseljenja: { [Op.lte]: new Date() } }, // Check if datum_iseljenja is earlier than or equal to the current date
            ],
          },
        },
      ],
    });

    // Send the results as the response
    res.json(slobodniStanari);
  } catch (error) {
    // Log the error and send an error response
    console.error("Error fetching slobodni stanari:", error);
    res.status(500).json({ error: true, message: "Failed to fetch slobodni stanari." });
  }
});

app.get("/api/sve-sobe1/:id_sobe", authJwt.verifyToken("recepcionar, domar, admin"), async (req, res) => {
  try {
    const id_sobe = req.params.id_sobe;

    // Fetch the soba record using Sequelize's findOne method
    const soba = await Soba.findOne({
      where: { id_sobe },
    });

    // Check if the soba record is found
    if (!soba) {
      return res.status(404).json({ error: true, message: "Soba not found." });
    }

    // Respond with the soba data
    res.json(soba);
  } catch (error) {
    console.error("Error fetching soba:", error);
    res.status(500).json({ error: true, message: "Failed to fetch soba." });
  }
});

app.get("/api/broj-sobe", authJwt.verifyToken("domar, admin, stanar"), async (req, res) => {
  try {
    const { broj_objekta } = req.query;
    if (!broj_objekta) {
      return res.status(400).json({ error: "broj_objekta parameter is required" });
    }

    const sobe = await Soba.findAll({
      attributes: ["broj_sobe", "id_sobe"],
      where: {
        broj_objekta: broj_objekta,
      },
    });

    res.json(sobe);
  } catch (error) {
    console.error("Error fetching sobe:", error);
    res.status(500).json({ error: "Error fetching sobe" });
  }
});

app.get("/api/broj-objekta", authJwt.verifyToken("domar, admin, stanar"), async (req, res) => {
  try {
    // Fetch all room numbers (broj_sobe) from the Soba table
    const objekti = await Objekt.findAll({
      attributes: ["broj_objekta"], // Specify the attributes to return
    });

    // Send the list of room numbers as a JSON response
    res.json(objekti);
  } catch (error) {
    // Log any errors and return a 500 status with an error message
    console.error("Error fetching objekt:", error);
    res.status(500).json({ error: "Error fetching pbjekt" });
  }
});

app.get("/api/broj-kreveta", authJwt.verifyToken("admin, recepcionar"), async (req, res) => {
  try {
    const { broj_objekta, broj_sobe, broj_kreveta } = req.query;
    let whereClause = "";

    const soba = await Soba.findOne({
      attributes: ["id_sobe"],
      where: {
        broj_objekta: broj_objekta,
        broj_sobe: broj_sobe,
      },
    });

    if (soba) {
      if (broj_kreveta == null) {
        whereClause = {
          id_sobe: soba.id_sobe,
          zauzetost: false,
        };
      } else {
        whereClause = {
          id_sobe: soba.id_sobe,
          [Op.or]: [{ zauzetost: false }, { [Op.and]: [{ broj_kreveta: broj_kreveta }, { zauzetost: true }] }],
        };
      }
      const slobodniKreveti = await Krevet.findAll({
        attributes: ["broj_kreveta"],
        where: whereClause,
      });

      // Send the list of available bed numbers as a JSON response
      res.json(slobodniKreveti);
    } else {
      // Return a 404 error if the room is not found
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    // Log any errors and return a 500 status with an error message
    console.error("Error fetching available beds:", error);
    res.status(500).json({ error: "Error fetching available beds" });
  }
});

app.get("/api/svi-kreveti1/:id_kreveta", authJwt.verifyToken("admin"), async (req, res) => {
  try {
    const id_kreveta = req.params.id_kreveta;

    // Fetch the krevet record using Sequelize's findOne method
    const krevet = await Krevet.findOne({
      where: { id_kreveta },
    });

    // Check if the krevet record is found
    if (!krevet) {
      return res.status(404).json({ error: true, message: "Krevet not found." });
    }

    // Respond with the krevet data
    res.json(krevet);
  } catch (error) {
    console.error("Error fetching krevet:", error);
    res.status(500).json({ error: true, message: "Failed to fetch krevet." });
  }
});

app.get("/api/svi-boravci1/:id_boravka", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
  try {
    const id_boravka = req.params.id_boravka;

    // Fetch the Boravak entry and its related entities using Sequelize's `findOne` method.
    const boravak = await Boravak.findOne({
      where: {
        id_boravka: id_boravka,
      },
      include: [
        {
          model: Stanar,
          attributes: ["ime", "prezime"],
          include: {
            model: Korisnik,
            attributes: ["email_korisnika"],
          },
        },
        {
          model: Krevet,
          attributes: ["broj_kreveta"],
          include: {
            model: Soba,
            attributes: ["broj_sobe"],
            include: {
              model: Objekt,
              attributes: ["broj_objekta"],
            },
          },
        },
      ],
    });

    if (!boravak) {
      return res.status(404).json({ error: true, message: "Boravak not found." });
    }

    // Extract the desired data from the result
    const result = {
      ime: boravak.stanar.ime,
      prezime: boravak.stanar.prezime,
      email_korisnika: boravak.stanar.korisnik.email_korisnika,
      broj_kreveta: boravak.krevet.broj_kreveta,
      id_boravka: boravak.id_boravka,
      datum_useljenja: boravak.datum_useljenja,
      datum_iseljenja: boravak.datum_iseljenja,
      broj_sobe: boravak.krevet.soba.broj_sobe,
      broj_objekta: boravak.krevet.soba.objekt.broj_objekta,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching boravci:", error);
    res.status(500).json({ error: true, message: "Failed to fetch boravci." });
  }
});

app.post("/unos-stanara", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
  const saltRounds = 10;
  const { email_korisnika, lozinka, oib, jmbag, ime, prezime, datum_rodenja, adresa_prebivalista, subvencioniranost, uciliste, uplata_teretane, komentar } = req.body;
  const uloga = "stanar";
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

app.post("/unos-boravka", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
  const { id_kreveta, oib, datum_useljenja } = req.body;

  let id_korisnika = null;

  // Decode the token to access `id_korisnika` and `uloga`
  const token = req.headers.authorization.split(" ")[1]; // Assuming the token is passed as "Bearer <token>"
  const decodedToken = jwt.decode(token);

  if (!decodedToken) {
    return res.status(401).send({ error: true, message: "Invalid token." });
  }

  const uloga = decodedToken.uloga;
  id_korisnika = decodedToken.id;

  if (!id_kreveta || !oib || !datum_useljenja) {
    return res.status(400).send({ error: true, message: "All fields are required." });
  }

  try {
    const newBoravakData = {
      id_kreveta: id_kreveta,
      oib: oib,
      id_korisnika: null, // Initialize id_korisnika as null by default
      datum_useljenja: datum_useljenja,
      datum_iseljenja: null,
    };

    // If the uloga is 'admin' or 'recepcionar', assign id_korisnika
    if (uloga === "admin" || uloga === "recepcionar") {
      newBoravakData.id_korisnika = id_korisnika;
    }

    const newBoravak = await Boravak.create(newBoravakData);
    res.status(201).send({ error: false, data: newBoravak, message: "Boravak je dodan." });
  } catch (error) {
    console.error("Error inserting boravak:", error);
    res.status(500).send({ error: true, message: "Neuspjesno dodavanje boravka." });
  }
});

app.post("/unos-kvara", authJwt.verifyToken("domar, admin, stanar"), async (req, res) => {
  const { datum_prijave_kvara, opis_kvara, broj_sobe, broj_objekta } = req.body;

  let id_korisnika = null;
  let oib = null;
  let stanje_kvara = 0;

  // Decode the token to access `id_korisnika` and `uloga`
  const token = req.headers.authorization.split(" ")[1]; // Assuming the token is passed as "Bearer <token>"
  const decodedToken = jwt.decode(token);

  if (!decodedToken) {
    return res.status(401).send({ error: true, message: "Invalid token." });
  }

  const uloga = decodedToken.uloga;
  id_korisnika = decodedToken.id;

  if (uloga === "domar" || uloga === "admin") {
    oib = null;
  } else if (uloga === "stanar") {
    try {
      const stanar = await Stanar.findOne({ where: { id_korisnika } });
      if (stanar) {
        oib = stanar.oib; // Set `oib` from `stanar`
        id_korisnika = null;
      }
    } catch (error) {
      console.error("Error fetching stanar:", error);
      return res.status(500).send({ error: true, message: "Error fetching stanar." });
    }
  }

  // Find `id_sobe` using `broj_sobe` and possibly `broj_objekta`
  let id_sobe = null;
  try {
    const soba = await Soba.findOne({
      where: { broj_sobe, broj_objekta },
    });

    if (soba) {
      id_sobe = soba.id_sobe;
    } else {
      return res.status(400).send({ error: true, message: "Soba not found." });
    }
  } catch (error) {
    console.error("Error fetching soba:", error);
    return res.status(500).send({ error: true, message: "Error fetching soba." });
  }

  if (!datum_prijave_kvara || !opis_kvara || !id_sobe) {
    return res.status(400).send({ error: true, message: "All fields are required." });
  }
  try {
    const newKvar = await Kvar.create({
      datum_prijave_kvara: datum_prijave_kvara,
      opis_kvara: opis_kvara,
      stanje_kvara: stanje_kvara,
      id_sobe: id_sobe,
      id_korisnika: id_korisnika,
      oib: oib,
    });
    res.status(201).send({ error: false, data: newKvar, message: "Kvar je dodan." });
  } catch (error) {
    console.error("Error inserting kvar:", error);
    res.status(500).send({ error: true, message: "Neuspjesno dodavanje kvara." });
  }
});

app.put("/azuriranje-boravka/:id_boravka", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
  const { id_boravka } = req.params;
  const { datum_iseljenja, broj_kreveta, broj_objekta, broj_sobe, datum_useljenja, id_korisnika, oib } = req.body;
  // Validate the input
  if (!id_boravka || !datum_useljenja || !broj_kreveta || !broj_objekta || !broj_sobe || !id_korisnika || !oib) {
    return res.status(400).json({ error: true, message: "id_boravka and datum_iseljenja are required." });
  }

  try {
    const soba = await Soba.findOne({
      where: {
        broj_objekta: broj_objekta,
        broj_sobe: broj_sobe,
      },
    });
    if (soba) {
      const krevet = await Krevet.findOne({
        where: {
          broj_kreveta: broj_kreveta,
          id_sobe: soba.id_sobe,
        },
      });
      console.log(krevet);
      if (krevet) {
        const updatedBoravak = await Boravak.update(
          { datum_iseljenja: datum_iseljenja, datum_useljenja: datum_useljenja, id_kreveta: krevet.id_kreveta, oib: oib, id_korisnika: id_korisnika },
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
      }
    }
  } catch (error) {
    console.error("Error updating boravak:", error);
    // Return a 500 Internal Server Error response if there's an error
    return res.status(500).json({ error: true, message: "Failed to update boravak." });
  }
});

app.put("/iseljenje/:id_boravka", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
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

app.put("/azuriranje-stanara/:oib", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
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

app.put("/azuriranje-objekta/:id", authJwt.verifyToken("admin"), async (req, res) => {
  const { id } = req.params; // The `id` parameter from the URL
  const updatedObjekt = req.body; // The updated object data from the request body

  try {
    // Use Sequelize's update method to update the objekt where `broj_objekta` matches the given id
    const [affectedRows] = await Objekt.update(updatedObjekt, {
      where: {
        broj_objekta: id, // Filter the objekt by `broj_objekta`
      },
    });

    // Check if any rows were updated
    if (affectedRows === 0) {
      return res.status(404).send({ error: true, message: "Objekt not found." });
    }

    // Send a success message
    res.send({ error: false, message: "Objekt successfully updated." });
  } catch (error) {
    // Log any errors and return a 500 status with an error message
    console.error("Error updating objekt:", error);
    res.status(500).send({ error: true, message: "Failed to update objekt." });
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

app.put("/azuriranje-kreveta/:id_kreveta", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
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

app.put("/azuriranje-kvara/:id_kvara", authJwt.verifyToken("domar, admin"), async (req, res) => {
  const { id_kvara } = req.params;
  const { stanje_kvara } = req.body;

  // Validate input
  if (!id_kvara || stanje_kvara === undefined) {
    return res.status(400).json({ error: true, message: "id_kvara i stanje_kvara su obavezni." });
  }

  // Decode the token to access `id_korisnika` and `uloga`
  const token = req.headers.authorization.split(" ")[1]; // Assuming the token is passed as "Bearer <token>"
  const decodedToken = jwt.decode(token);

  if (!decodedToken) {
    return res.status(401).send({ error: true, message: "Invalid token." });
  }

  const id_korisnika = decodedToken.id; // Retrieve `id_korisnika` from the decoded token

  try {
    // Find the Kvar record by id_kvara
    const kvar = await Kvar.findByPk(id_kvara);

    // Check if the record exists
    if (!kvar) {
      return res.status(404).json({ error: true, message: "Kvar not found." });
    }

    // Update the Kvar record with the provided state and `id_korisnika`
    await kvar.update({ stanje_kvara, id_korisnika });

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

app.delete("/brisanje-stanara/:oib", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
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

app.delete("/brisanje-kvara/:id_kvara", authJwt.verifyToken("domar, admin"), async (req, res) => {
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

app.delete("/brisanje-boravka/:id_boravka", authJwt.verifyToken("recepcionar, admin"), async (req, res) => {
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
