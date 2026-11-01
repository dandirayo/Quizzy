import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './WouldYouRatherPage.module.css';
import { WOULD_YOU_RATHER } from '../data/gamesData';

export default function WouldYouRatherPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Load saved answers
    const saved = localStorage.getItem('quizzy_wyr_answers');
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // Set initial index based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    if (WOULD_YOU_RATHER && WOULD_YOU_RATHER.length > 0) {
      setCurrentIndex(dayOfYear % WOULD_YOU_RATHER.length);
    }
  }, []);

  const handleAnswer = (option) => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    if (answers[qId]) return;

    const newAnswers = { ...answers, [qId]: option };
    setAnswers(newAnswers);
    localStorage.setItem('quizzy_wyr_answers', JSON.stringify(newAnswers));
  };

  const handleNext = () => {
    if (WOULD_YOU_RATHER && currentIndex < WOULD_YOU_RATHER.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!WOULD_YOU_RATHER || WOULD_YOU_RATHER.length === 0) {
    return <div className={styles.loading}>Memuat data...</div>;
  }

  const currentQuestion = WOULD_YOU_RATHER[currentIndex];
  const answered = answers[currentQuestion.id];

  // Mock percentages based on id just to be deterministic but fun
  const getPercentages = (id) => {
    const p1 = (Number(id) * 37) % 100;
    const pA = p1 < 20 ? p1 + 30 : p1; // ensure not too low
    return { a: pA, b: 100 - pA };
  };

  const percentages = getPercentages(currentQuestion.id);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/games" className={styles.backButton}>&larr; Mini Games</Link>
        <h1 className={styles.title}>Mending Mana?</h1>
        <p className={styles.subtitle}>Pilih yang menurutmu paling menarik!</p>
      </header>

      <main className={styles.main}>
        <div className={styles.questionCard}>
          <h2 className={styles.questionText}>{currentQuestion.question}</h2>

          <div className={styles.optionsContainer}>
            <button
              className={`${styles.optionBtn} ${styles.optionA} ${answered === 'A' ? styles.selected : ''} ${answered ? styles.answered : ''}`}
              onClick={() => handleAnswer('A')}
              disabled={!!answered}
            >
              <span className={styles.emoji}>{currentQuestion.optionA.emoji}</span>
              <span className={styles.optionText}>{currentQuestion.optionA.text}</span>
              {answered && <div className={styles.percentageBar} style={{ width: `${percentages.a}%` }}>
                <span className={styles.percentageText}>{percentages.a}%</span>
              </div>}
            </button>

            <div className={styles.vsCircle}>VS</div>

            <button
              className={`${styles.optionBtn} ${styles.optionB} ${answered === 'B' ? styles.selected : ''} ${answered ? styles.answered : ''}`}
              onClick={() => handleAnswer('B')}
              disabled={!!answered}
            >
              <span className={styles.emoji}>{currentQuestion.optionB.emoji}</span>
              <span className={styles.optionText}>{currentQuestion.optionB.text}</span>
              {answered && <div className={styles.percentageBar} style={{ width: `${percentages.b}%` }}>
                <span className={styles.percentageText}>{percentages.b}%</span>
              </div>}
            </button>
          </div>

          {answered && (
            <div className={styles.funFact}>
              <h3>Tahukah kamu? 💡</h3>
              <p>{currentQuestion.funFact}</p>
            </div>
          )}
        </div>

        <div className={styles.navigation}>
          <button onClick={handlePrev} disabled={currentIndex === 0} className={styles.navBtn}>
            &larr; Prev
          </button>
          <div className={styles.dots}>
            {WOULD_YOU_RATHER.map((q, idx) => (
              <span
                key={q.id}
                className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''} ${answers[q.id] ? styles.answeredDot : ''}`}
              />
            ))}
          </div>
          <button onClick={handleNext} disabled={currentIndex === WOULD_YOU_RATHER.length - 1} className={styles.navBtn}>
            Next &rarr;
          </button>
        </div>
      </main>
    </div>
  );
}
