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
import MiniGamesPage from './pages/MiniGamesPage';
import DailyDilemmaPage from './pages/DailyDilemmaPage';
import SwipeGamePage from './pages/SwipeGamePage';
import WouldYouRatherPage from './pages/WouldYouRatherPage';
import GuessPersonalityPage from './pages/GuessPersonalityPage';
import ChatLobbyPage from './pages/ChatLobbyPage';
import ChatRoomPage from './pages/ChatRoomPage';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public & Explore Routes (Bisa di-peek sebelum login) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/quiz/:quizId" element={<QuizPlayPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/compare/:username" element={<ComparePage />} />
          <Route path="/games" element={<MiniGamesPage />} />
          <Route path="/games/dilemma" element={<DailyDilemmaPage />} />
          <Route path="/games/swipe" element={<SwipeGamePage />} />
          <Route path="/games/would-you-rather" element={<WouldYouRatherPage />} />
          <Route path="/games/guess" element={<GuessPersonalityPage />} />
          <Route path="/chat" element={<ChatLobbyPage />} />
          <Route path="/chat/:roomId" element={<ChatRoomPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
