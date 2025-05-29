// ===== client/script.js =====
function loadOutages() {
  fetch('/api/outages')
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById('outages');
      data.forEach(item => {
        div.innerHTML += `<p><b>${item.date}</b> – ${item.area} (${item.reason})</p>`;
      });
    });
}

function subscribe() {
  const email = document.getElementById('email').value;
  fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(res => res.ok ? alert('Zapisano!') : alert('Błąd przy zapisie.'));
}

loadOutages();

// ===== server/index.js =====
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db');
const nodemailer = require('nodemailer');
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

app.get('/api/outages', async (req, res) => {
  const data = await db.all('SELECT * FROM outages');
  res.json(data);
});

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Nowa przerwa w dostawie',
    text: 'Dodano nową przerwę w Twoim regionie!'
  }, (err, info) => {
    if (err) return res.status(500).send('error');
    res.send('OK');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
