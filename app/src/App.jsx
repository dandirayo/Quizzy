import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import QuizPlayPage from './pages/QuizPlayPage'
import ProfilePage from './pages/ProfilePage'
import FriendsPage from './pages/FriendsPage'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/quiz/:quizId" element={<QuizPlayPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
