const USER_KEY = "logged_user";

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function getUserRole() {
  const user = getUser();
  return user?.role || null;
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
}
