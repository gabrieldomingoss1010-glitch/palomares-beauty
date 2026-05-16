import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb, getDb, saveDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'palomares-beauty-secret-key-2026';

// Ensure upload directories exist
const uploadsBase = path.join(__dirname, 'uploads');
const pdfDir = path.join(uploadsBase, 'pdfs');
const videoDir = path.join(uploadsBase, 'videos');
fs.mkdirSync(pdfDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins in production, or configure properly
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsBase));

// Serve React frontend statically in production
const frontendDist = path.join(__dirname, '../dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf';
    cb(null, isPdf ? pdfDir : videoDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    // Keep original name but make it filesystem-safe
    const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8')
      .replace(/[<>:"/\\|?*]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Envie PDF ou vídeo.'));
    }
  }
});

// Helper: convert sql.js rows to objects
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

function runSql(sql, params = []) {
  const db = getDb();
  db.run(sql, params);
  saveDb();
}

// ─── AUTH MIDDLEWARE ────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

// ─── AUTH ROUTES (public) ──────────────────────────────

// POST /api/login — authenticate user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  const user = queryOne('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username }
  });
});

// ─── PROTECTED ROUTES ──────────────────────────────────

// GET /api/files — list all files
app.get('/api/files', authenticateToken, (req, res) => {
  const files = queryAll('SELECT * FROM files ORDER BY createdAt DESC');
  res.json(files);
});

// GET /api/files/:id — get single file
app.get('/api/files/:id', authenticateToken, (req, res) => {
  const file = queryOne('SELECT * FROM files WHERE id = ?', [Number(req.params.id)]);
  if (!file) return res.status(404).json({ error: 'Arquivo não encontrado' });
  res.json(file);
});

// POST /api/upload — upload a file
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const isPdf = req.file.mimetype === 'application/pdf';
  const type = isPdf ? 'pdf' : 'video';
  const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
  const relativePath = isPdf
    ? `uploads/pdfs/${req.file.filename}`
    : `uploads/videos/${req.file.filename}`;

  const db = getDb();
  db.run(
    'INSERT INTO files (name, type, size, path) VALUES (?, ?, ?, ?)',
    [originalName, type, req.file.size, relativePath]
  );
  saveDb();

  // Get the inserted row
  const newFile = queryOne('SELECT * FROM files ORDER BY id DESC LIMIT 1');

  res.status(201).json(newFile);
});

// DELETE /api/files/:id — delete a file
app.delete('/api/files/:id', authenticateToken, (req, res) => {
  const file = queryOne('SELECT * FROM files WHERE id = ?', [Number(req.params.id)]);
  if (!file) return res.status(404).json({ error: 'Arquivo não encontrado' });

  // Delete physical file
  const filePath = path.join(__dirname, file.path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Delete from database
  runSql('DELETE FROM files WHERE id = ?', [Number(req.params.id)]);
  res.json({ message: 'Arquivo deletado com sucesso' });
});

// GET /api/stats — storage statistics
app.get('/api/stats', authenticateToken, (req, res) => {
  const total = queryOne('SELECT COUNT(*) as count FROM files');
  const pdfs = queryOne("SELECT COUNT(*) as count FROM files WHERE type = 'pdf'");
  const videos = queryOne("SELECT COUNT(*) as count FROM files WHERE type = 'video'");
  const totalSize = queryOne('SELECT COALESCE(SUM(size), 0) as total FROM files');

  const storageBytes = totalSize ? totalSize.total : 0;

  res.json({
    total: total ? total.count : 0,
    pdfs: pdfs ? pdfs.count : 0,
    videos: videos ? videos.count : 0,
    storageBytes,
    storage: formatBytes(storageBytes),
    storagePercentage: Math.min(Math.round((storageBytes / (10 * 1024 * 1024 * 1024)) * 100), 100)
  });
});

// Error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Erro de upload: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// CATCH-ALL ROUTE FOR REACT ROUTER
app.get(/(.*)/, (req, res) => {
  if (fs.existsSync(frontendDist)) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  } else {
    res.status(404).send('Frontend not built. Run npm run build.');
  }
});

// Initialize DB then start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🌹 Palomares Beauty API rodando em http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Falha ao inicializar banco de dados:', err);
  process.exit(1);
});
