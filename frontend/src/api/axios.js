import axios from 'axios'

// Dynamically use the environment variable, or fall back to your correct production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://librario-lms.onrender.com'


const instance = axios.create({
  baseURL: API_BASE_URL
})

export default instance
