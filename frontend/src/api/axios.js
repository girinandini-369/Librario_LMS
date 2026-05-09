import axios from 'axios'

// Hardcoded for production to ensure it NEVER uses localhost
const API_BASE_URL = 'https://librario-backend-fhmy.onrender.com'

const instance = axios.create({
  baseURL: API_BASE_URL
})

export default instance
