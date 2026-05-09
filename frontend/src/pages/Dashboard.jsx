import { useState, useEffect } from 'react'
import axios from 'axios'

const Dashboard = ({ user }) => {
  const [books, setBooks] = useState([])
  const [myBooks, setMyBooks] = useState([])
  const [usersList, setUsersList] = useState([])
  
  // States for forms
  const [newBook, setNewBook] = useState({ title: '', author: '', availableCopies: 1 })
  const [editingBook, setEditingBook] = useState(null)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'MEMBER' })

  useEffect(() => {
    fetchBooks(); fetchMyBooks(); fetchUsers();
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/books', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setBooks(response.data)
    } catch (err) { console.error(err) }
  }

  const fetchMyBooks = async () => {
    if (user.role !== 'MEMBER') return;
    try {
      const response = await axios.get('http://localhost:8080/api/transactions/my-books', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setMyBooks(response.data)
    } catch (err) { console.error(err) }
  }

  const fetchUsers = async () => {
    if (user.role !== 'ADMIN') return;
    try {
      const response = await axios.get('http://localhost:8080/api/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setUsersList(response.data)
    } catch (err) { console.error(err) }
  }

  // BOOK ACTIONS
  const handleBookSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBook) {
        await axios.put(`http://localhost:8080/api/books/${editingBook.id}`, newBook, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setEditingBook(null)
      } else {
        await axios.post('http://localhost:8080/api/books', newBook, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      }
      setNewBook({ title: '', author: '', availableCopies: 1 })
      fetchBooks()
    } catch (err) { alert('Error saving book') }
  }

  const handleDeleteBook = async (id) => {
    if (window.confirm('Delete this book?')) {
      try {
        await axios.delete(`http://localhost:8080/api/books/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        fetchBooks()
      } catch (err) { alert('Error deleting book') }
    }
  }

  // USER ACTIONS
  const handleUserSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8080/api/auth/admin/add-member', newUser, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setNewUser({ name: '', email: '', password: '', role: 'MEMBER' })
      fetchUsers()
    } catch (err) { alert('Error registering user') }
  }

  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === user.email) return;
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`http://localhost:8080/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        fetchUsers()
      } catch (err) { alert('Error deleting user') }
    }
  }

  // TRANSACTION ACTIONS
  const handleIssue = async (id) => {
    try {
      await axios.post('http://localhost:8080/api/transactions/issue', { bookId: id }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      fetchBooks(); fetchMyBooks();
    } catch (err) { alert('Stock not available') }
  }

  const handleReturn = async (id) => {
    try {
      const res = await axios.post('http://localhost:8080/api/transactions/return', { bookId: id }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      alert(`Returned. Fine: ₹${res.data.fine}`); fetchBooks(); fetchMyBooks();
    } catch (err) { alert('Error') }
  }

  return (
    <div className="container py-4">
      
      {/* SECTION 1: INVENTORY */}
      <div className="card shadow-sm mb-5">
        <div className="card-header bg-primary text-white py-3">
          <h5 className="mb-0">📚 Inventory Management</h5>
        </div>
        <div className="card-body">
          {user.role === 'ADMIN' && (
            <div className="bg-light p-3 rounded mb-4 border">
              <h6 className="fw-bold mb-3">{editingBook ? '✏️ Update Book Details' : '✨ Register New Book'}</h6>
              <form onSubmit={handleBookSubmit} className="row g-2">
                <div className="col-md-5">
                  <input type="text" className="form-control" placeholder="Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} required />
                </div>
                <div className="col-md-2">
                  <input type="number" className="form-control" placeholder="Copies" value={newBook.availableCopies} onChange={e => setNewBook({...newBook, availableCopies: e.target.value})} required />
                </div>
                <div className="col-md-1">
                  <button type="submit" className="btn btn-primary w-100">{editingBook ? 'Save' : 'Add'}</button>
                </div>
              </form>
              {editingBook && <button className="btn btn-link btn-sm text-secondary p-0 mt-2" onClick={() => {setEditingBook(null); setNewBook({title:'',author:'',availableCopies:1})}}>Cancel</button>}
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="small text-muted">
                  <th>TITLE</th>
                  <th>AUTHOR</th>
                  <th>AVAILABILITY</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.id}>
                    <td className="fw-bold">{b.title}</td>
                    <td>{b.author}</td>
                    <td>
                      <span className={`badge ${b.availableCopies > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {b.availableCopies} in stock
                      </span>
                    </td>
                    <td className="text-end">
                      {user.role === 'MEMBER' && (
                        <button className="btn btn-sm btn-primary px-3" onClick={() => handleIssue(b.id)} disabled={b.availableCopies === 0}>Issue</button>
                      )}
                      {user.role === 'ADMIN' && (
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => {setEditingBook(b); setNewBook(b)}}>Update</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBook(b.id)}>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: MEMBERS (Admin Only) */}
      {user.role === 'ADMIN' && (
        <div className="card shadow-sm mb-5">
          <div className="card-header bg-dark text-white py-3">
            <h5 className="mb-0">👥 Member Management</h5>
          </div>
          <div className="card-body">
            <div className="bg-light p-3 rounded mb-4 border">
              <h6 className="fw-bold mb-3">👤 Register New Member</h6>
              <form onSubmit={handleUserSubmit} className="row g-2">
                <div className="col-md-3">
                  <input type="text" className="form-control" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <input type="email" className="form-control" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <input type="password" placeholder="Password" className="form-control" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-dark w-100">Register</button>
                </div>
              </form>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="small text-muted">
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                    <th className="text-end">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-info'}`}>{u.role}</span></td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.id, u.email)} disabled={u.email === user.email}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: MY SHELF (Member Only) */}
      {user.role === 'MEMBER' && (
        <div className="card shadow-sm mb-5">
          <div className="card-header bg-success text-white py-3">
            <h5 className="mb-0">📖 My Borrowed Books</h5>
          </div>
          <div className="card-body">
            {myBooks.length === 0 ? <p className="text-muted text-center py-4">No active borrowings.</p> : (
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>TITLE</th>
                    <th>ISSUED DATE</th>
                    <th className="text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {myBooks.map(tx => (
                    <tr key={tx.id}>
                      <td className="fw-bold">{tx.book.title}</td>
                      <td>{new Date(tx.issueDate).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-success px-4" onClick={() => handleReturn(tx.book.id)}>Return</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
