import express from 'express';
import cors from 'cors';
import { roleUsers, initialCategories, history as votingHistory } from './data.js';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

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

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
  }

  const user = roleUsers.find(u => u.username === username && u.password === password);

  if (user) {
    const { password: _, ...userData } = user; 
    res.json({ success: true, message: 'Login berhasil', user: userData });
  } else {
    res.status(401).json({ success: false, message: 'Username atau password salah' });
  }
});

app.get('/api/history/:email', (req, res) => {
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