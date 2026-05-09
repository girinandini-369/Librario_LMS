import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'MEMBER' })
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/auth/register', formData)
      alert('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 shadow p-4 rounded">
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <input type="text" placeholder="Name" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="mb-3">
              <input type="email" placeholder="Email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="mb-3">
              <input type="password" placeholder="Password" className="form-control" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            </div>
            <div className="mb-3 text-start">
          <label className="form-label text-secondary small">ACCOUNT TYPE</label>
          <select 
            className="form-control" 
            value={formData.role} 
            onChange={e => setFormData({...formData, role: e.target.value})}
          >
            <option value="MEMBER">MEMBER (Student)</option>
            <option value="ADMIN">ADMIN (Librarian)</option>
          </select>
        </div>
        <button type="submit" className="btn-register">CREATE ACCOUNT</button>
          </form>
          <p className="mt-3 text-center">Already have an account? <Link to="/login">Login</Link></p>
          <div className="text-center mt-2">
            <Link to="/" className="text-muted small">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
