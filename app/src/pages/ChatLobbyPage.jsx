import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './ChatLobbyPage.module.css';

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export default function ChatLobbyPage() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [targetMbti, setTargetMbti] = useState('ANY');
  const [searchTime, setSearchTime] = useState(0);

  // Simulasi Matchmaking (Dummy dengan user contoh dendiz7 & dea33)
  useEffect(() => {
    let timer;
    let matchTimer;

    if (isSearching) {
      // Counter waktu pencarian
      timer = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);

      // Simulasi ketemu jodoh chat setelah 2-4 detik
      const randomMatchTime = Math.floor(Math.random() * 2500) + 1500;
      matchTimer = setTimeout(() => {
        const fakeRoomId = 'room-' + Math.random().toString(36).substr(2, 9);
        const isDendi = currentUser?.username?.toLowerCase() === 'dendiz7';
        
        // Partner contoh: dendiz7 (cowo) vs dea33 (cewe)
        const demoPartner = isDendi
          ? { name: 'Dea Anindita', username: 'dea33', mbti: 'ENFP', avatar: '👩' }
          : { name: 'Dendi Pratama', username: 'dendiz7', mbti: 'INTJ', avatar: '👨' };

        const partnerMbti = targetMbti === 'ANY' ? demoPartner.mbti : targetMbti;
        
        // Arahkan ke chat room dengan data partner
        navigate(`/chat/${fakeRoomId}`, { 
          state: { 
            partnerMbti, 
            partnerName: 'Anonim',
            revealedName: demoPartner.name,
            revealedUsername: demoPartner.username,
            revealedAvatar: demoPartner.avatar
          } 
        });
      }, randomMatchTime);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimer);
    };
  }, [isSearching, targetMbti, navigate]);

  const handleStartSearch = () => {
    setIsSearching(true);
    setSearchTime(0);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchTime(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.lobbyCard}>
        <div className={styles.header}>
          <h1>Blind Chat 💬</h1>
          <p>Temukan teman ngobrol baru berdasarkan kepribadian!</p>
        </div>

        {!isSearching ? (
          <div className={`${styles.searchSetup} fade-up`}>
            <div className={styles.formGroup}>
              <label>Pilih target kepribadian:</label>
              <select 
                value={targetMbti} 
                onChange={(e) => setTargetMbti(e.target.value)}
                className={styles.selectInput}
              >
                <option value="ANY">🎲 Siapa Saja (Acak)</option>
                <optgroup label="Analysts (Purple)">
                  <option value="INTJ">INTJ - Architect</option>
                  <option value="INTP">INTP - Logician</option>
                  <option value="ENTJ">ENTJ - Commander</option>
                  <option value="ENTP">ENTP - Debater</option>
                </optgroup>
                <optgroup label="Diplomats (Green)">
                  <option value="INFJ">INFJ - Advocate</option>
                  <option value="INFP">INFP - Mediator</option>
                  <option value="ENFJ">ENFJ - Protagonist</option>
                  <option value="ENFP">ENFP - Campaigner</option>
                </optgroup>
                <optgroup label="Sentinels (Blue)">
                  <option value="ISTJ">ISTJ - Logistician</option>
                  <option value="ISFJ">ISFJ - Defender</option>
                  <option value="ESTJ">ESTJ - Executive</option>
                  <option value="ESFJ">ESFJ - Consul</option>
                </optgroup>
                <optgroup label="Explorers (Yellow)">
                  <option value="ISTP">ISTP - Virtuoso</option>
                  <option value="ISFP">ISFP - Adventurer</option>
                  <option value="ESTP">ESTP - Entrepreneur</option>
                  <option value="ESFP">ESFP - Entertainer</option>
                </optgroup>
              </select>
            </div>

            <button 
              className={styles.btnSearch} 
              onClick={handleStartSearch}
            >
              🔍 Mulai Pencarian
            </button>
            <p className={styles.onlineCount}>🟢 24 orang sedang online</p>
          </div>
        ) : (
          <div className={`${styles.searchingState} fade-up`}>
            <div className={styles.radar}>
              <div className={styles.radarSweep}></div>
              <div className={styles.radarCenter}>📡</div>
            </div>
            <h2>Mencari Kecocokan...</h2>
            <p>Target: {targetMbti === 'ANY' ? 'Siapa Saja' : targetMbti}</p>
            <p className={styles.timer}>Waktu mencari: {searchTime} detik</p>
            
            <button 
              className={styles.btnCancel} 
              onClick={handleCancelSearch}
            >
              Batalkan Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
