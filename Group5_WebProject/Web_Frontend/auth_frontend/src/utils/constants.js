export const USER_ROLES = {
  RESIDENT: 'user',
  STAFF: 'staff',
  ADMIN: 'admin'
}

export const API_ENDPOINTS = {
  AUTH: import.meta.env.VITE_AUTH_URL || 'http://localhost:4001/auth',
  API: import.meta.env.VITE_API_URL || 'http://localhost:4001'
}

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
}
