import initialCategories from "../assets/data/category_candidate";

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