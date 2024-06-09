const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdminUser() {
  const username = 'admin';
  const password = 'Makaronas30';
  const hashedPassword = await bcrypt.hash(password, 10);

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

  const query = 'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)';
  const [results] = await pool.query(query, [username, hashedPassword, true]);

  console.log('Administratorius vartotojas sukurtas sėkmingai');
  pool.end();
}

createAdminUser().catch(err => {
  console.error('Klaida kuriant administratoriaus vartotoją:', err);
});
