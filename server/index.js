import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { roleUsers, initialCategories, history as votingHistory } from './data.js';
import crypto from 'crypto'

const app = express();
const PORT = 8080;
const secret = 'frontedEnd_Vote'

app.use(cors());
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
    return res.status(403).json({ message: 'Unauthorized - please log in first'})
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

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
  }

  const user = roleUsers.find(u => u.username === username && u.password === password);

  if (user) {
    const { password: _, ...userData } = user; 
    const token = sign(userData);
    res.json({ success: true, message: 'Login berhasil', token });
  } else {
    res.status(401).json({ success: false, message: 'Username atau password salah' });
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

function saveDataToFile() {
    const dataFilePath = path.join(path.resolve(), 'data.js');

    const fileContent =
    `export const roleUsers = ${JSON.stringify(roleUsers, null, 2)};

    export const initialCategories = ${JSON.stringify(initialCategories, null, 2)};

    export const history = ${JSON.stringify(votingHistory, null, 2)};
    `;

    fs.writeFileSync(dataFilePath, fileContent, 'utf-8');
}