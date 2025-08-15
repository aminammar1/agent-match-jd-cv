// Centralized Axios client
// Reads base URL from Vite env variable VITE_API_BASE_URL
// Falls back to localhost for local development if not set.
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL,
})

export function getApiBaseUrl() {
  return baseURL
}
