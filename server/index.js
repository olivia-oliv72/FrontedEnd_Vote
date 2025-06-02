import express from 'express';
import cors from 'cors';
import { roleUsers, initialCategories, history as votingHistory } from './data.js'; // kita rename 'history' menjadi 'votingHistory' agar tidak bentrok dengan keyword lain jika ada

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Endpoint untuk mendapatkan semua kategori
app.get('/api/categories', (req, res) => {
  res.json(initialCategories);
});

// Endpoint untuk mendapatkan semua pengguna (sementara, untuk development)
app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = roleUsers.map(user => {
    const { password, ...userSafeData } = user;
    return userSafeData;
  });
  res.json(usersWithoutPasswords);
});

// Endpoint untuk login sederhana
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

// Endpoint untuk mendapatkan riwayat voting berdasarkan email
app.get('/api/history/:email', (req, res) => {
  const userEmail = req.params.email; // Ambil email dari URL parameter
  const userHistory = votingHistory.find(h => h.email === userEmail);

  if (userHistory) {
    res.json({ success: true, history: userHistory });
  } else {
    res.status(404).json({ success: false, message: 'Riwayat voting tidak ditemukan untuk email ini' });
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


// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('Cobalah akses endpoint berikut di browser atau Postman:');
  console.log(`- GET http://localhost:${PORT}/api/categories`);
  console.log(`- GET http://localhost:${PORT}/api/users`);
  console.log(`- GET http://localhost:${PORT}/api/history/user@gmail.com`);
  console.log('- POST http://localhost:${PORT}/api/auth/login (dengan body JSON: {"username": "admin", "password": "admin123"})');
});