import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizPlayPage from './pages/QuizPlayPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import ComparePage from './pages/ComparePage';
import DailyDilemmaPage from './pages/DailyDilemmaPage';
import SwipeGamePage from './pages/SwipeGamePage';
import WouldYouRatherPage from './pages/WouldYouRatherPage';
import GuessPersonalityPage from './pages/GuessPersonalityPage';
import ChatLobbyPage from './pages/ChatLobbyPage';
import ChatRoomPage from './pages/ChatRoomPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizPlayPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
          <Route path="/compare/:username" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
          <Route path="/games/dilemma" element={<ProtectedRoute><DailyDilemmaPage /></ProtectedRoute>} />
          <Route path="/games/swipe" element={<ProtectedRoute><SwipeGamePage /></ProtectedRoute>} />
          <Route path="/games/would-you-rather" element={<ProtectedRoute><WouldYouRatherPage /></ProtectedRoute>} />
          <Route path="/games/guess" element={<ProtectedRoute><GuessPersonalityPage /></ProtectedRoute>} />
          
          {/* Chat Routes */}
          <Route path="/chat" element={<ProtectedRoute><ChatLobbyPage /></ProtectedRoute>} />
          <Route path="/chat/:roomId" element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
