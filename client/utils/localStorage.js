const CATEGORIES_CACHE_KEY = "award_categories_cache";
const HISTORY_CACHE_KEY_PREFIX = "user_history_cache_";

export function getCachedCategories() {
  const stored = localStorage.getItem(CATEGORIES_CACHE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function cacheCategories(categoriesData) {
  localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(categoriesData));
}

export function getCachedUserHistory(email) {
  if (!email) return null;
  const stored = localStorage.getItem(HISTORY_CACHE_KEY_PREFIX + email);
  return stored ? JSON.parse(stored) : null;
}

export function cacheUserHistory(email, historyData) {
  if (!email) return;
  localStorage.setItem(HISTORY_CACHE_KEY_PREFIX + email, JSON.stringify(historyData));
}


const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

export function saveAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function removeAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function saveUserData(userData) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

export function getUserData() {
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
}

export function removeUserData() {
  localStorage.removeItem(USER_DATA_KEY);
}