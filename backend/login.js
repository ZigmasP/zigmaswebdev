const fetch = require('node-fetch');
const fs = require ('fs');
const path = require('path');

const username = 'admin';
const password = 'Makaronas30';
const loginUrl = 'http://localhost:3000/login';

async function login() {
 const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'aplication/json'
    },
    body: JSON.stringify({ username, password })
 });

 const data = await response.json();
 if (response.ok) {
    console.log('Prisijungimas sėkmingas!');
    fs.writeFileSync(path.json(__dirname, 'token.txt'), data.token);
  } else {
    console.error('Prisijungimo klaida:', data.error);
  }
}

login();