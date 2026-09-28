import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SWIPE_CARDS, VIBE_ARCHETYPES } from '../data/gamesData';
import { useAuth } from '../contexts/AuthContext';
import { saveUserQuizResult } from '../services/db';
import styles from './SwipeGamePage.module.css';

export default function SwipeGamePage() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const [likes, setLikes] = useState([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const isGameOver = currentIndex >= SWIPE_CARDS.length;

  // ---- TOUCH / DRAG HANDLERS ----
  const handleDragStart = useCallback((clientX, clientY) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  }, []);

  const handleDragMove = useCallback((clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - startPos.current.x;
    const dy = (clientY - startPos.current.y) * 0.3;
    setDragOffset({ x: dx, y: dy });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 80;

    if (dragOffset.x > threshold) {
      handleSwipe('right');
    } else if (dragOffset.x < -threshold) {
      handleSwipe('left');
    }
    setDragOffset({ x: 0, y: 0 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragOffset]);

  // Mouse events
  const onMouseDown = (e) => handleDragStart(e.clientX, e.clientY);
  const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
  const onMouseUp = () => handleDragEnd();

  // Touch events
  const onTouchStart = (e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchMove = (e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchEnd = () => handleDragEnd();

  const handleSwipe = (direction) => {
    if (swipeDir) return;
    setSwipeDir(direction);

    if (direction === 'right') {
      setLikes(prev => [...prev, SWIPE_CARDS[currentIndex].type]);
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDir(null);
      setDragOffset({ x: 0, y: 0 });
    }, 400);
  };

  const getVibeResult = () => {
    if (likes.length === 0) return VIBE_ARCHETYPES['observer'];

    // Count all 4 MBTI axes
    const counts = {
      extrovert: 0, introvert: 0,
      intuitive: 0, sensing: 0,
      thinking: 0, feeling: 0,
      judging: 0, perceiving: 0
    };
    likes.forEach(t => { if (counts[t] !== undefined) counts[t]++; });

    // Determine dominant traits
    const dominantTraits = [];
    dominantTraits.push(counts.extrovert >= counts.introvert ? 'extrovert' : 'introvert');
    dominantTraits.push(counts.intuitive >= counts.sensing ? 'intuitive' : 'sensing');
    dominantTraits.push(counts.thinking >= counts.feeling ? 'thinking' : 'feeling');
    dominantTraits.push(counts.judging >= counts.perceiving ? 'judging' : 'perceiving');

    // Find best matching archetype
    let bestMatch = null;
    let bestScore = -1;
    for (const [key, arch] of Object.entries(VIBE_ARCHETYPES)) {
      if (key === 'observer') continue;
      const score = arch.traits.filter(t => dominantTraits.includes(t)).length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = arch;
      }
    }
    return bestMatch || VIBE_ARCHETYPES['observer'];
  };

  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (isGameOver && !hasSavedRef.current) {
      hasSavedRef.current = true;
      const vibe = getVibeResult();
      try {
        localStorage.setItem('quizzy_swipe', JSON.stringify({
          title: vibe.title,
          emoji: vibe.emoji,
          date: new Date().toISOString()
        }));
      } catch (e) {}

      if (user?.id) {
        saveUserQuizResult(user.id, {
          quizId: 'swipe',
          dominantResult: vibe.title,
          dominantEmoji: vibe.emoji,
          scores: { likes: likes.length },
          isPublic: true
        })
          .then(() => setIsSaved(true))
          .catch(err => console.error(err));
      } else {
        setIsSaved(true);
      }
    }
  }, [isGameOver, user]);

  const handlePlayAgain = () => {
    setCurrentIndex(0);
    setSwipeDir(null);
    setLikes([]);
    setDragOffset({ x: 0, y: 0 });
    setIsSaved(false);
    hasSavedRef.current = false;
  };

  // Dynamic card style during drag
  const dragStyle = isDragging && !swipeDir ? {
    transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${dragOffset.x * 0.08}deg)`,
    transition: 'none',
    cursor: 'grabbing'
  } : {};

  // Drag indicator opacity
  const likeOpacity = Math.min(Math.max(dragOffset.x / 80, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragOffset.x / 80, 0), 1);

  return (
    <div className={styles.container}>
      <div className={`${styles.header} fade-up`}>
        <h1>Swipe Vibe</h1>
        <p>Geser kartu atau tekan tombol. Temukan vibe-mu hari ini.</p>
      </div>

      {!isGameOver ? (
        <>
          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(currentIndex / SWIPE_CARDS.length) * 100}%` }} 
              />
            </div>
            <span className={styles.progressText}>Kartu {currentIndex + 1} dari {SWIPE_CARDS.length}</span>
          </div>

          {/* Card Stack */}
          <div 
            className={`${styles.cardContainer} fade-up`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Next card preview (behind current) */}
            {currentIndex + 1 < SWIPE_CARDS.length && (
              <div className={`${styles.card} ${styles.cardBehind}`}>
                <div className={styles.cardEmoji}>{SWIPE_CARDS[currentIndex + 1].emoji}</div>
                <div className={styles.cardTitle}>{SWIPE_CARDS[currentIndex + 1].title}</div>
              </div>
            )}

            {/* Current card */}
            <div 
              ref={cardRef}
              className={`${styles.card} ${swipeDir === 'left' ? styles.swipeLeft : ''} ${swipeDir === 'right' ? styles.swipeRight : ''}`}
              style={dragStyle}
            >
              {/* Drag indicators */}
              <div className={styles.dragIndicatorLike} style={{ opacity: likeOpacity }}>SUKA ♥</div>
              <div className={styles.dragIndicatorNope} style={{ opacity: nopeOpacity }}>LEWATI ✕</div>

              <div className={styles.cardEmoji}>{SWIPE_CARDS[currentIndex].emoji}</div>
              <div className={styles.cardTitle}>{SWIPE_CARDS[currentIndex].title}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`${styles.controls} fade-up`}>
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
          {getVibeResult().tip && (
            <div className={styles.resultTip}>
              <span>💡</span> {getVibeResult().tip}
            </div>
          )}
          <div className={styles.resultStats}>
            <span>❤️ {likes.length} disukai</span>
            <span>✕ {SWIPE_CARDS.length - likes.length} dilewati</span>
          </div>
          {isSaved && (
            <div style={{
              margin: '0.5rem auto 1.25rem',
              padding: '0.4rem 0.8rem',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              color: '#4ade80',
              fontSize: '0.85rem'
            }}>
              ✓ Vibe tersimpan di Profil ({user ? `@${user.username}` : 'Browser'})
            </div>
          )}
          <div className={styles.resultActions}>
            <button onClick={handlePlayAgain} className="btn btn-secondary">
              🔄 Main Lagi
            </button>
            <Link to={user ? "/profile" : "/dashboard"} className="btn btn-primary">
              {user ? "Lihat di Profil" : "Kembali ke Beranda"}
            </Link>
          </div>
        </div>
      )}

      {!isGameOver && (
        <Link to="/dashboard" className={styles.exitLink}>
          &larr; Keluar Game
        </Link>
      )}
    </div>
  );
}
