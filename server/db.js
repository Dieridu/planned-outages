// ===== server/db.js =====
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./outages.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS outages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area TEXT,
    date TEXT,
    reason TEXT
  )`);
});

module.exports = {
  all: (sql) => new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  })
};
