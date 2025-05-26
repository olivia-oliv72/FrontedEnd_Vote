import initialCategories from "../assets/data/category_candidate";
import initialHistory from "../assets/data/history";

const STORAGE_KEY = "award_categories";
const HISTORY_KEY = "user_history";

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

/* untuk mengambil history akun pengguna */
export function loadHistory(){
  const history = localStorage.getItem(HISTORY_KEY);
  if (history) return JSON.parse(history);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(initialHistory));
  return initialHistory;
}