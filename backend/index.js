require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Sukuriame "uploads" katalogą, jei jis neegzistuoja
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(uploadsPath));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

// Duomenų bazės sujungimo baseinas
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Multer konfigūracija
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

// Centralizuotas klaidų tvarkymas
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Kažkas negerai!' });
});

//Registracijos maršrutas
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)';
    const [results] = await pool.query(query, [username, hashedPassword, true]); // true - admin
    res.status(201).json({ message: 'Vartotojas sukurtas sėkmingai' });
  } catch (err) {
    res.status(500).json({ error: 'Registracijos klaida' });
  }
});

//Prisijungimo maršrutas
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    const [results] = await pool.query(query, [username]);
    if (results.length === 0) {
      return res.status(401).json({ error: 'Neteisingas prisijungimo vardas ar slaptažodis' });
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Neteisingas prisijungimo vardas ar slaptažodis' });
    }
    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Prisijungimo klaida' });
  }
});

// Middleware funkcija autentiškumui patikrinti
const authenticatecdToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) res.status(401).json ({ error: 'Neteisėta prieiga' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Neteisėta prieiga' });
    req.user = user;
    next();
  });
};

// Maršrutai
app.post('/works', authenticateToken, upload.single('photo'), async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const photo = req.file ? req.file.filename : null;
    const query = 'INSERT INTO works (title, description, photo) VALUES (?, ?, ?)';
    const [results] = await pool.query(query, [title, description, photo]);
    res.status(200).json({ message: 'Duomenys sėkmingai įrašyti.', insertId: results.insertId });
  } catch (err) {
    next(err);
  }
});

app.get('/works', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM works';
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
});

app.put('/works/:id', authenticateToken, upload.single('photo'), async (req, res, next) => {
  if(!req.user.isAdmin) return res.status(403).json({ error: 'Neteisėta prieiga' });
  try {
    const workId = req.params.id;
    const { title, description } = req.body;
    const photo = req.file ? req.file.filename : req.body.existingPhoto;
    if (!photo) {
      return res.status(400).json({ error: 'Nuotrauka privaloma' });
    }
    const query = 'UPDATE works SET title = ?, description = ?, photo = ? WHERE id = ?';
    const [results] = await pool.query(query, [title, description, photo, workId]);
    res.status(200).json({ message: 'Įrašas sėkmingai atnaujintas.', affectedRows: results.affectedRows });
  } catch (err) {
    next(err);
  }
});

app.delete('/works/:id', authenticateToken, async (req, res, next) => {
  if(!req.user.isAdmin) return res.status(403).json({ error: 'Neteisėta prieiga' });
  try {
    const workId = req.params.id;
    const getPhotoQuery = 'SELECT photo FROM works WHERE id = ?';
    const [results] = await pool.query(getPhotoQuery, [workId]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Įrašas nerastas.' });
    }
    const photo = results[0].photo;
    const photoPath = path.join(uploadsPath, photo);
    fs.unlink(photoPath, async (err) => {
      if (err) {
        return next(err);
      }
      const deleteQuery = 'DELETE FROM works WHERE id = ?';
      const [results] = await pool.query(deleteQuery, [workId]);
      res.status(200).json({ message: 'Įrašas sėkmingai ištrintas.', affectedRows: results.affectedRows });
    });
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Serveris veikia ant porto ${port}`);
});
