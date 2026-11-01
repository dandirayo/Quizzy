import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GuessPersonalityPage.module.css';
import { GUESS_SCENARIOS } from '../data/gamesData';
import { useAuth } from '../contexts/AuthContext';
import { saveUserQuizResult } from '../services/db';

export default function GuessPersonalityPage() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const hasSavedRef = React.useRef(false);

  const currentScenario = GUESS_SCENARIOS?.[currentIndex];

  useEffect(() => {
    if (showResultScreen && !hasSavedRef.current) {
      hasSavedRef.current = true;
      let title = "Pengamat Pemula";
      let emoji = "🌱";
      if (score === GUESS_SCENARIOS.length) {
        title = "Master Psikologi 🧠";
        emoji = "🧠";
      } else if (score >= GUESS_SCENARIOS.length / 2) {
        title = "Detektif Kepribadian 🕵️";
        emoji = "🕵️";
      }

      // Save to localStorage
      try {
        localStorage.setItem('quizzy_guess', JSON.stringify({
          title,
          emoji,
          score,
          total: GUESS_SCENARIOS.length,
          date: new Date().toISOString()
        }));
      } catch (e) {
        console.error(e);
      }

      // Save to database / profile if logged in
      if (user?.id) {
        saveUserQuizResult(user.id, {
          quizId: 'guess',
          dominantResult: `${title} (${score}/${GUESS_SCENARIOS.length})`,
          dominantEmoji: emoji,
          scores: { score, total: GUESS_SCENARIOS.length },
          isPublic: true
        })
          .then(() => setIsSaved(true))
          .catch(err => console.error('Save result failed', err));
      } else {
        setIsSaved(true);
      }
    }
  }, [showResultScreen, score, user]);

  const handleOptionClick = (option) => {
    if (answered || !currentScenario) return;

    setSelectedOption(option);
    setAnswered(true);

    if (option === currentScenario.correctAnswer) {
      setScore(s => s + 1);
    }

    // Auto-advance after showing explanation for a bit
    setTimeout(() => {
      if (currentIndex < GUESS_SCENARIOS.length - 1) {
        setCurrentIndex(i => i + 1);
        setAnswered(false);
        setSelectedOption(null);
      } else {
        setShowResultScreen(true);
      }
    }, 2000); // Wait 2 seconds to show result and explanation
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(null);
    setShowResultScreen(false);
    setIsSaved(false);
    hasSavedRef.current = false;
  };

  if (!GUESS_SCENARIOS || GUESS_SCENARIOS.length === 0) {
    return <div className={styles.loading}>Memuat data...</div>;
  }

  if (showResultScreen) {
    let title = "Pengamat Pemula";
    if (score === GUESS_SCENARIOS.length) title = "Master Psikologi 🧠";
    else if (score >= GUESS_SCENARIOS.length / 2) title = "Detektif Kepribadian 🕵️";

    return (
      <div className={styles.container}>
        <div className={styles.resultScreen}>
          <h2>Kuis Selesai!</h2>
          <div className={styles.scoreCircle}>
            {score} / {GUESS_SCENARIOS.length}
          </div>
          <h3>Pencapaian: {title}</h3>
          {isSaved && (
            <div style={{
              margin: '0.75rem auto 1rem',
              padding: '0.5rem 1rem',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              color: '#4ade80',
              fontSize: '0.85rem',
              maxWidth: '320px'
            }}>
              ✓ Pencapaian tersimpan di Profil ({user ? `@${user.username}` : 'Browser'})
            </div>
          )}
          <p>Terima kasih sudah bermain Tebak Kepribadian.</p>
          <div className={styles.resultActions}>
            <button className={styles.playAgainBtn} onClick={resetGame}>Main Lagi</button>
            <Link to={user ? "/profile" : "/dashboard"} className={styles.backBtn}>
              {user ? "Lihat di Profil" : "Ke Dashboard"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = selectedOption === currentScenario.correctAnswer;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/games" className={styles.headerBack}>&larr; Mini Games</Link>
        <div className={styles.headerInfo}>
          <h2>Tebak Kepribadian</h2>
          <span className={styles.scoreBadge}>Skor: {score}/{GUESS_SCENARIOS.length}</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.scenarioCard}>
          <h3 className={styles.scenarioTitle}>Kasus {currentIndex + 1}: {currentScenario.title}</h3>
          <ul className={styles.behaviorList}>
            {currentScenario.descriptions.map((desc, idx) => (
              <li key={idx} className={styles.behaviorItem}>{desc}</li>
            ))}
          </ul>
        </div>

        <div className={styles.optionsGrid}>
          {currentScenario.options.map(option => {
            let optionClass = styles.optionBtn;
            if (answered) {
              if (option === currentScenario.correctAnswer) optionClass += ` ${styles.correct}`;
              else if (option === selectedOption) optionClass += ` ${styles.wrong}`;
              else optionClass += ` ${styles.disabled}`;
            }

            return (
              <button
                key={option}
                className={optionClass}
                onClick={() => handleOptionClick(option)}
                disabled={answered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`${styles.feedbackCard} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
            <h4 className={styles.feedbackTitle}>
              {isCorrect ? "Benar! 🎉" : "Hmm, kurang tepat!"} 
              {!isCorrect && ` Jawabannya adalah ${currentScenario.correctAnswer}`}
            </h4>
            <p className={styles.feedbackText}>{currentScenario.explanation}</p>
          </div>
        )}
        <div className={styles.progress}>
          Skenario {currentIndex + 1} dari {GUESS_SCENARIOS.length}
        </div>
      </main>
    </div>
  );
}
