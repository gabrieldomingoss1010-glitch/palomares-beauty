import { initDb, getDb, saveDb } from './server/db.js';

function queryAll(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

async function run() {
  await initDb();
  const db = getDb();
  
  db.run('INSERT INTO files (name, type, size, path) VALUES (?, ?, ?, ?)', ['test.pdf', 'pdf', 1234, 'path/test.pdf']);
  saveDb();
  
  const newFile = queryOne('SELECT * FROM files ORDER BY id DESC LIMIT 1');
  
  console.log('newFile:', newFile);
}

run();
