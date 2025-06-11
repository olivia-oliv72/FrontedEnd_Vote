import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { roleUsers, initialCategories, history as votingHistory } from './data.js';
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { fileURLToPath } from 'url';
import multer from 'multer';

// Configure multer storage for photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'photo-candidates'));
  },
  filename: function (req, file, cb) {
    // Use original filename or generate unique name if needed
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const app = express();
const PORT = 8080;
const secret = 'frontedEnd_Vote'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'data.js');

app.use(cors());
// Use express.json only for non-multipart requests
app.use(express.json());

function verify(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const plain = parts[0];
  const receivedSig = parts[1];

  const recalculatedSig = crypto
    .createHmac('sha512', secret)
    .update(plain)
    .digest('base64');

  if (receivedSig === recalculatedSig) {
    return JSON.parse(Buffer.from(plain, 'base64').toString());
  }

  return null;
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const user = verify(token);

  if (!user) {
    return res.status(403).json({ message: 'Unauthorized - please log in first' })
  }

  req.user = user;
  next();
}

app.get('/api/categories', (req, res) => {
  res.json(initialCategories);
});

app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = roleUsers.map(user => {
    const { password, ...userSafeData } = user;
    return userSafeData;
  });
  res.json(usersWithoutPasswords);
});

function sign(data) {
  const plain = Buffer.from(JSON.stringify(data)).toString('base64');
  const sig = crypto.createHmac('sha512', secret).update(plain).digest('base64');
  return `${plain}.${sig}`;
}

app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = roleUsers.map(user => {
    const { password, ...userSafeData } = user;
    return userSafeData;
  });
  res.json(usersWithoutPasswords);
});

const saltRounds = 10;
const users = [...roleUsers]

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Semua informasi harus diisi' })
  }

  const existingEmail = users.find(u => u.email === email);
  if (existingEmail) {
    return res.status(400).json({ success: false, message: 'Email sudah dipakai pengguna lain' })
  }
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email sudah dipakai pengguna lain' })
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role: 'user'
    };
    users.push(newUser);

    // simpan ke data.js
    const newData = `
export const roleUsers = ${JSON.stringify(users, null, 2)};
export const initialCategories = ${JSON.stringify(initialCategories, null, 2)};
export const history = ${JSON.stringify(votingHistory, null, 2)};
  `;
    fs.writeFileSync(dataPath, newData);

    const { password: _, ...userData } = newUser;
    res.status(201).json({ success: true, user: userData, message: 'Register berhasil' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Register gagal' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
  }

  const user = roleUsers.find(u => u.username === username);

  if (user) {
    const { password: _, ...userData } = user;
    const token = sign(userData);
    res.json({ success: true, message: 'Login berhasil', token });
  } else {
    if (!user) {
      return res.status(401).json({ success: false, message: 'Username tidak ditemukan' });
    }

    // cocokkan password dengan hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password salah' });
    }

  }
});

app.get('/api/history/:email', authMiddleware, (req, res) => {
  const userEmail = req.params.email;
  const userHistory = votingHistory.find(h => h.email === userEmail);

  if (userHistory) {
    res.json({ success: true, history: userHistory });
  } else {
    res.status(404).json({ success: false, message: 'Riwayat voting tidak ditemukan' });
  }
});

app.post('/api/categories', (req, res) => {
  const { id, name, candidates } = req.body;
  if (!id || !name) {
    return res.status(400).json({ message: 'ID dan Nama kategori dibutuhkan' });
  }
  if (initialCategories.find(cat => cat.id === id)) {
    return res.status(409).json({ message: 'Kategori dengan ID tersebut sudah ada' });
  }
  const newCategory = { id, name, candidates: candidates || [] };
  initialCategories.push(newCategory);
  res.status(201).json({ message: 'Kategori berhasil ditambahkan', category: newCategory });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { username } = req.body;

  const user = roleUsers.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  user.username = username;

  saveDataToFile();

  res.json({ message: "Username berhasil diubah", user });
});

app.put('/api/categories/:id', (req, res) => {
  const categoryId = req.params.id;

  // ambil name and candidates from request body
  const { name, candidates } = req.body;

  // cari category by id
  const category = initialCategories.find(cat => cat.id === categoryId);

  // If category not found, return 404 error
  if (!category) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan' });
  }

  // Validasi nama
  if (!name) {
    return res.status(400).json({ message: 'Nama kategori dibutuhkan' });
  }

  // Update category name and candidates
  category.name = name;
  category.candidates = candidates || [];

  // Persist updated categories to data.js file
  saveDataToFile();

  // Respond with success message and updated category
  res.json({ message: 'Kategori berhasil diperbarui', category });
});

function saveDataToFile() {
  const dataFilePath = path.join(path.resolve(), 'data.js');

  const fileContent =
    `export const roleUsers = ${JSON.stringify(roleUsers, null, 2)};

    export const initialCategories = ${JSON.stringify(initialCategories, null, 2)};

    export const history = ${JSON.stringify(votingHistory, null, 2)};
    `;

  fs.writeFileSync(dataFilePath, fileContent, 'utf-8');
}