import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { roleUsers, initialCategories, history as initialHistoryData } from './data.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 8080;
const secret = 'frontedEnd_Vote';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'data.js');

let usersData = [...roleUsers];
let categoriesData = [...initialCategories];
let historyData = [...initialHistoryData];

app.use(cors());
app.use(express.json());

function saveDataToFile() {
  const fileContent = `
export const roleUsers = ${JSON.stringify(usersData, null, 2)};

export const initialCategories = ${JSON.stringify(categoriesData, null, 2)};

export const history = ${JSON.stringify(historyData, null, 2)};
`;
  try {
    fs.writeFileSync(dataPath, fileContent, 'utf-8');
    console.log('Data berhasil disimpan ke data.js');
  } catch (error) {
    console.error('Gagal menyimpan data ke file:', error);
  }
}

function sign(data) {
  const plain = Buffer.from(JSON.stringify(data)).toString('base64');
  const sig = crypto.createHmac('sha512', secret).update(plain).digest('base64');
  return `${plain}.${sig}`;
}
function verify(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const plain = parts[0];
  const receivedSig = parts[1];
  const recalculatedSig = crypto.createHmac('sha512', secret).update(plain).digest('base64');
  if (receivedSig === recalculatedSig) {
    return JSON.parse(Buffer.from(plain, 'base64').toString());
  }
  return null;
}
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Handle "Bearer <token>"
  const user = verify(token);
  if (!user) {
    return res.status(403).json({ message: 'Unauthorized - please log in first' });
  }
  req.user = user;
  next();
}

//API Endpoints

app.get('/api/categories', (req, res) => {
  res.json(categoriesData);
});

app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = usersData.map(user => {
    const { password, ...userSafeData } = user;
    return userSafeData;
  });
  res.json(usersWithoutPasswords);
});

app.get('/api/history/:email', (req, res) => {
  const userEmail = req.params.email;
  const userHistory = historyData.find(h => h.email === userEmail);
  if (userHistory) {
    res.json({ success: true, history: userHistory });
  } else {
    res.status(404).json({ success: false, message: 'Riwayat voting tidak ditemukan' });
  }
});

const saltRounds = 10;

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Semua informasi harus diisi' });
  }
  if (usersData.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ success: false, message: 'Username atau email sudah dipakai' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { id: usersData.length + 1, username, email, password: hashedPassword, role: 'user' };
    usersData.push(newUser);
    saveDataToFile();
    const { password: _, ...userData } = newUser;
    res.status(201).json({ success: true, user: userData, message: 'Register berhasil' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Register gagal' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
  }
  const user = usersData.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Username tidak ditemukan' });
  }
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password salah' });
    }
    const { password: _, ...userData } = user;
    const token = sign(userData);
    res.json({ success: true, message: 'Login berhasil', user: userData, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login gagal karena error server' });
  }
});

app.post('/api/categories', (req, res) => {
  const { id, name, candidates } = req.body;
  if (!id || !name) {
    return res.status(400).json({ message: 'ID dan Nama kategori dibutuhkan' });
  }
  if (categoriesData.find(cat => cat.id === id)) {
    return res.status(409).json({ message: 'Kategori dengan ID tersebut sudah ada' });
  }
  const newCategory = { id, name, candidates: candidates || [] };
  categoriesData.push(newCategory);
  saveDataToFile();
  res.status(201).json({ message: 'Kategori berhasil ditambahkan', category: newCategory });
});

app.put('/api/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  const { name, candidates } = req.body;
  const categoryIndex = categoriesData.findIndex(cat => cat.id === categoryId);
  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan' });
  }
  if (!name) {
    return res.status(400).json({ message: 'Nama kategori dibutuhkan' });
  }
  categoriesData[categoryIndex].name = name;
  categoriesData[categoryIndex].candidates = candidates || [];
  saveDataToFile();
  res.json({ message: 'Kategori berhasil diperbarui', category: categoriesData[categoryIndex] });
});

app.delete('/api/categories/:categoryId/candidates/:candidateId', (req, res) => {
  const { categoryId, candidateId } = req.params;
  const categoryIndex = categoriesData.findIndex(cat => cat.id === categoryId);
  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan' });
  }
  const candidates = categoriesData[categoryIndex].candidates;
  const candidateIndex = candidates.findIndex(cand => cand.id === candidateId);
  if (candidateIndex === -1) {
    return res.status(404).json({ message: 'Kandidat tidak ditemukan di dalam kategori ini' });
  }
  const deletedCandidate = candidates.splice(candidateIndex, 1);
  saveDataToFile();
  res.json({ success: true, message: `Kandidat "${deletedCandidate[0].name}" berhasil dihapus.` });
});


app.listen(PORT, () => {
  console.log(`Server Express berjalan di http://localhost:${PORT}`);
});