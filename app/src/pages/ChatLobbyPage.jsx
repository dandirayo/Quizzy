import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatLobbyPage.module.css';

export default function ChatLobbyPage() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [targetMbti, setTargetMbti] = useState('ANY');
  const [searchTime, setSearchTime] = useState(0);

  // Simulasi Matchmaking dengan AI Bot interaktif
  useEffect(() => {
    let timer;
    let matchTimer;

    if (isSearching) {
      timer = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);

      const randomMatchTime = Math.floor(Math.random() * 2000) + 1200;
      matchTimer = setTimeout(() => {
        const fakeRoomId = 'sim-' + Math.random().toString(36).substring(2, 9);
        const randomMbti = ['INTJ', 'ENFP', 'INFJ', 'ENTP', 'INFP', 'ISFJ'][Math.floor(Math.random() * 6)];
        const partnerMbti = targetMbti === 'ANY' ? randomMbti : targetMbti;
        
        navigate(`/chat/${fakeRoomId}`, { 
          state: { 
            partnerMbti, 
            partnerName: 'Anonim (' + partnerMbti + ')',
            revealedName: `Quizzy Bot ${partnerMbti}`,
            revealedUsername: `quizzy_bot_${partnerMbti.toLowerCase()}`,
            revealedAvatar: '🤖',
            isSimulation: true
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
          <p>Temukan teman ngobrol baru berdasarkan kecocokan kepribadian!</p>
        </div>

        {/* Notice of Experimental / Simulation Mode */}
        <div style={{
          background: 'rgba(124, 58, 237, 0.1)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          fontSize: '0.85rem',
          color: '#c4b5fd',
          marginBottom: '1.25rem',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          💡 <strong>Mode Simulasi AI Bot:</strong> Fitur obrolan saat ini menjalankan simulasi interaktif untuk menguji alur percakapan sebelum server real-time multiplayer diluncurkan.
        </div>

        {!isSearching ? (
          <div className={`${styles.searchSetup} fade-up`}>
            <div className={styles.formGroup}>
              <label htmlFor="targetMbti">Pilih target kepribadian:</label>
              <select 
                id="targetMbti"
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
              type="button"
              className={styles.btnSearch} 
              onClick={handleStartSearch}
            >
              🔍 Mulai Pencarian
            </button>
            <p className={styles.onlineCount}>🤖 AI Bot Simulator Aktif</p>
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
              type="button"
              className={styles.btnCancel} 
              onClick={handleCancelSearch}
            >
              Batal
            </button>
          </div>
        )}

        <div className={styles.rules}>
          <h3>Aturan Main Blind Chat 🎭</h3>
          <ul>
            <li>Identitasmu dirahasiakan di awal obrolan.</li>
            <li>Hanya tipe MBTI yang terlihat oleh lawan bicara.</li>
            <li>Setelah nyaman mengobrol, klik tombol "Buka Kartu" untuk saling mengungkap profil!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
