import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password })
      localStorage.setItem('user', JSON.stringify(response.data))
      setUser(response.data)
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 shadow p-4 rounded">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input type="email" placeholder="Email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <input type="password" placeholder="Password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <p className="mt-3 text-center">Don't have an account? <Link to="/register">Register</Link></p>
          <div className="text-center mt-2">
            <Link to="/" className="text-muted small">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
