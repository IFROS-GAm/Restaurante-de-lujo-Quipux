// Pequeño cliente para consumir el backend
// Centraliza baseURL y Authorization con el JWT almacenado en LocalStorage.

const baseURL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'jwt';

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const token = getToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader, ...headers },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || 'Error de API');
    err.code = data?.code;
    err.status = res.status;
    throw err;
  }
  return data;
}

// Variante para FormData (no establecer Content-Type manualmente)
async function requestForm(path, { method = 'POST', headers = {}, formData } = {}) {
  const token = getToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers: { ...authHeader, ...headers },
    body: formData
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || 'Error de API');
    err.code = data?.code;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  upload: (path, formData, method = 'PUT') => requestForm(path, { method, formData })
};

// Ejemplos de uso:
// const { ok, items } = await api.get('/menu');
// const { token } = await api.post('/auth/login', { email, password });
// setToken(token);