import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="landing-minimalist">
      <style>{`
        .landing-minimalist {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/hero-bg.png');
          background-size: cover;
          background-position: center;
          color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          text-align: center;
        }
        .brand-name {
          font-size: 3.5rem;
          font-weight: 200;
          letter-spacing: 5px;
          margin-bottom: 30px;
          text-transform: uppercase;
        }
        .login-link {
          padding: 12px 60px;
          background: transparent;
          color: #f8fafc;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 2px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 2px;
          transition: all 0.4s ease;
        }
        .login-link:hover {
          background: #f8fafc;
          color: #000;
          border-color: #f8fafc;
        }
      `}</style>
      
      <div className="brand-name">Librario</div>
      <Link to="/login" className="login-link">ACCESS SYSTEM</Link>
    </div>
  )
}

export default Landing
