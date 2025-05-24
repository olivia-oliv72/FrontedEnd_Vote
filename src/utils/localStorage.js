// // src/utils/localStorage.js

// // Menyimpan data ke localStorage
// export function saveToLocalStorage(key, value) {
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch (error) {
//     console.error(`Error saving ${key} to localStorage:`, error);
//   }
// }

// // Mengambil data dari localStorage
// export function getFromLocalStorage(key) {
//   try {
//     const value = localStorage.getItem(key);
//     return value ? JSON.parse(value) : null;
//   } catch (error) {
//     console.error(`Error getting ${key} from localStorage:`, error);
//     return null;
//   }
// }

// // Menghapus data dari localStorage
// export function removeFromLocalStorage(key) {
//   try {
//     localStorage.removeItem(key);
//   } catch (error) {
//     console.error(`Error removing ${key} from localStorage:`, error);
//   }
// }

import initialCategories from "../assets/data/dataAwal";

const STORAGE_KEY = "award_categories";

export function loadCategories() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  // kalau belum ada, simpan data awal
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCategories));
  return initialCategories;
}

export function saveCategories(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}