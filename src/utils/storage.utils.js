export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  ALL_EVENTS: "all_events",
  ALL_REGISTRATIONS: "all_registrations",
  MY_REGISTRATIONS: "my_registrations",
};

function getStorageJson(key, fallbackValue) {
  const raw = localStorage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") {
    localStorage.removeItem(key);
    return fallbackValue;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(key);
    return fallbackValue;
  }
}

function setStorageJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key) {
  localStorage.removeItem(key);
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setToken(token) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

export function getStoredUser() {
  return getStorageJson(STORAGE_KEYS.USER, null);
}

export function setStoredUser(user) {
  setStorageJson(STORAGE_KEYS.USER, user);
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getStoredEvents() {
  return getStorageJson(STORAGE_KEYS.ALL_EVENTS, []);
}

export function setStoredEvents(events) {
  setStorageJson(STORAGE_KEYS.ALL_EVENTS, events);
}

export function getStoredRegistrations() {
  return getStorageJson(STORAGE_KEYS.ALL_REGISTRATIONS, []);
}

export function setStoredRegistrations(registrations) {
  setStorageJson(STORAGE_KEYS.ALL_REGISTRATIONS, registrations);
}

export function setMyRegistrations(registrations) {
  setStorageJson(STORAGE_KEYS.MY_REGISTRATIONS, registrations);
}
