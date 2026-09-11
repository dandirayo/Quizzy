import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SWIPE_CARDS } from '../data/gamesData';
import styles from './SwipeGamePage.module.css';

export default function SwipeGamePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null); // 'left' or 'right'
  const [likes, setLikes] = useState([]);

  const isGameOver = currentIndex >= SWIPE_CARDS.length;

  const handleSwipe = (direction) => {
    if (swipeDir) return; // Prevent double click while animating
    
    setSwipeDir(direction);
    
    if (direction === 'right') {
      setLikes([...likes, SWIPE_CARDS[currentIndex].type]);
    }

    // Wait for animation to finish before moving to next card
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDir(null);
    }, 400);
  };

  const getVibeResult = () => {
    if (likes.length === 0) return { title: 'The Observer', desc: 'Kamu lagi nggak mood ngapa-ngapain ya hari ini? Chill banget.', emoji: '🧊' };
    
    const extrovertCount = likes.filter(t => t === 'extrovert' || t === 'feeling' || t === 'sensing').length;
    const introvertCount = likes.filter(t => t === 'introvert' || t === 'thinking' || t === 'intuitive').length;

    if (extrovertCount > introvertCount) {
      return { title: 'Social Butterfly', desc: 'Vibe kamu lagi ceria, enerjik, dan siap berinteraksi dengan dunia!', emoji: '✨' };
    } else {
      return { title: 'Cozy Thinker', desc: 'Vibe kamu lagi pengen tenang, reflektif, dan menikmati waktu sendiri.', emoji: '☕' };
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.header} fade-up`}>
        <h1>Swipe Vibe</h1>
        <p>Suka atau lewati? Temukan vibe-mu hari ini.</p>
      </div>

      {!isGameOver ? (
        <>
          <div className={`${styles.cardContainer} fade-up`} style={{ animationDelay: '0.1s' }}>
            {/* Show only current card */}
            <div 
              className={`${styles.card} ${swipeDir === 'left' ? styles.swipeLeft : ''} ${swipeDir === 'right' ? styles.swipeRight : ''}`}
            >
              <div className={styles.cardEmoji}>{SWIPE_CARDS[currentIndex].emoji}</div>
              <div className={styles.cardTitle}>{SWIPE_CARDS[currentIndex].title}</div>
            </div>
          </div>

          <div className={`${styles.controls} fade-up`} style={{ animationDelay: '0.2s' }}>
            <button 
              className={styles.btnNope} 
              onClick={() => handleSwipe('left')}
              disabled={swipeDir !== null}
              aria-label="Tidak Suka"
            >
              ✕
            </button>
            <button 
              className={styles.btnLike} 
              onClick={() => handleSwipe('right')}
              disabled={swipeDir !== null}
              aria-label="Suka"
            >
              ♥
            </button>
          </div>
        </>
      ) : (
        <div className={`${styles.resultCard} fade-up`}>
          <div className={styles.resultEmoji}>{getVibeResult().emoji}</div>
          <h2 className={styles.resultTitle}>{getVibeResult().title}</h2>
          <p className={styles.resultDesc}>{getVibeResult().desc}</p>
          <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>
            Kembali ke Beranda
          </Link>
        </div>
      )}

      {!isGameOver && (
        <Link to="/" style={{ marginTop: '2rem', color: 'var(--muted)', fontWeight: 600, textDecoration: 'none' }}>
          &larr; Keluar Game
        </Link>
      )}
    </div>
  );
}
