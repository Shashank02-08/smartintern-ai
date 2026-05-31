import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ResumeUpload from './pages/ResumeUpload'
import Search from './pages/Search'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import { useEffect } from 'react'

const BACKEND = 'https://smartintern-backend-j6gf.onrender.com'

function App() {
  useEffect(() => {
    fetch(`${BACKEND}/api/internships`).catch(() => {})
  }, [])

  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/resume" element={<ResumeUpload />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App