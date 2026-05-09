import { Link } from 'react-router-dom'

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Librario</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center text-white">
            <span className="me-3">{user.name} ({user.role})</span>
            <button className="btn btn-outline-light btn-sm" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
