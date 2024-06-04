require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const compression = require("compression");

const app = express();
const port = process.env.PORT || 3000;

// Sukuriame "uploads" katalogą, jei jis neegzistuoja
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(uploadsPath));
app.use(compression()); //Įjungia kompresiją visoms HTTP užklausoms

//Duomenų bazės sujungimas
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4'
});

db.connect((err) => {
  if (err) {
    console.error("Klaida jungiantis prie duomenų bazės:", err);
    return;
  }
  console.log("Sėkmingai prisijungta prie MariaDB duomenų bazės.");
});

//Multer konfigūracija
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `photo-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage: storage });

//Maršrutai
app.post("/works", upload.single("photo"), (req, res) => {
  const { title, description } = req.body;
  const photo = req.file ? req.file.filename : null;

  const query = 'INSERT INTO works (title, description, photo) VALUES (?, ?, ?)';

  db.query(query, [title, description, photo], (err, results) => {
    if (err) {
      console.error('Klaida įkeliant duomenis:', err);
      return res.status(500).json({ error: 'Nepavyko įkelti į duomenų bazę.' });
    }
    
    res.status(200).json({
      message: 'Duomenys sėkmingai įrašyti.',
      insertId: results.insertId,
    });
  });
});

app.get("/works", (req, res) => {
  const query = "SELECT * FROM works";

  db.query(query, (err, results) => {
    if (err) {
      console.error('Klaida gaunant duomenis:', err);
      return res.status(500).json({ error: "Nepavyko gauti duomenų." });
    }
    res.status(200).json(results);
  });
});

app.put("/works/:id", upload.single("photo"), (req, res) => {
  const workId = req.params.id;
  const { title, description } = req.body;
  const photo = req.file ? req.file.filename : req.body.existingPhoto;

  if (!photo) {
    return res.status(400).json({ error: 'Nuotrauka privaloma' });
  }

  const query = "UPDATE works SET title = ?, description = ?, photo = ? WHERE id = ?";

  db.query(query, [title, description, photo, workId], (err, results) => {
    if (err) {
      console.error('Klaida atnaujinant duomenis:', err);
      return res.status(500).json({ error: 'Nepavyko atnaujinti įrašo.' });
    }
    res.status(200).json({
      message: 'Įrašas sėkmingai atnaujintas.',
      affectedRows: results.affectedRows,
    });
  });
});


app.delete("/works/:id", (req, res) => {
  const workId = req.params.id;
  const query = "DELETE FROM works WHERE id = ?";
  db.query(query, [workId], (err, results) => {
    if (err) {
      console.error('Klaida trinant duomenis:', err);
      return res.status(500).json({ error: "Nepavyko ištrinti duomenų." });
    }
    res.status(200).json({
      message: 'Įrašas sėkmingai ištrintas.',
      affectedRows: results.affectedRows,
    });
  });
});
  
app.listen(port, () => {
  console.log(`Serveris veikia ant porto ${port}`);
});
