import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DAILY_DILEMMAS } from '../data/gamesData';
import styles from './DailyDilemmaPage.module.css';

// Get day of year for rotation
const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export default function DailyDilemmaPage() {
  const todayIndex = getDayOfYear() % DAILY_DILEMMAS.length;
  const [dilemmaIndex, setDilemmaIndex] = useState(todayIndex);
  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('quizzy_dilemma_answers') || '{}');
    } catch { return {}; }
  });

  const dilemma = DAILY_DILEMMAS[dilemmaIndex];
  const savedAnswer = answers[dilemma.id];
  const hasAnswered = !!savedAnswer;

  // Save answers to localStorage
  useEffect(() => {
    localStorage.setItem('quizzy_dilemma_answers', JSON.stringify(answers));
  }, [answers]);

  const handleSelect = (option) => {
    if (hasAnswered) return;
    setAnswers(prev => ({ ...prev, [dilemma.id]: option }));
  };

  const goTo = (index) => {
    const total = DAILY_DILEMMAS.length;
    setDilemmaIndex(((index % total) + total) % total);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.header} fade-up`}>
        <h1>Dilema Harian</h1>
        <p>Pilih jalanmu dan lihat bagaimana orang lain merespons.</p>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.navBtn} onClick={() => goTo(dilemmaIndex - 1)} aria-label="Sebelumnya">
          ←
        </button>
        <div className={styles.navInfo}>
          <span className={styles.navLabel}>
            {dilemmaIndex === todayIndex ? '🔴 Hari Ini' : `Dilema #${dilemmaIndex + 1}`}
          </span>
          <span className={styles.navCount}>{dilemmaIndex + 1} / {DAILY_DILEMMAS.length}</span>
        </div>
        <button className={styles.navBtn} onClick={() => goTo(dilemmaIndex + 1)} aria-label="Selanjutnya">
          →
        </button>
      </div>

      <div className={`${styles.dilemmaCard} fade-up`} style={{ animationDelay: '0.1s' }}>
        <h2 className={styles.question}>"{dilemma.question}"</h2>

        <div className={`${styles.optionsContainer} ${hasAnswered ? styles.answered : ''}`}>
          {/* OPTION A */}
          <button 
            className={`${styles.optionBtn} ${savedAnswer === 'A' ? styles.selectedOption : ''}`}
            onClick={() => handleSelect('A')}
            disabled={hasAnswered}
            style={{
              borderColor: savedAnswer === 'A' ? dilemma.optionA.color : '',
              background: savedAnswer === 'A' ? `${dilemma.optionA.color}15` : ''
            }}
          >
            {hasAnswered && (
              <span className={styles.percentageText} style={{ color: dilemma.optionA.color }}>
                {dilemma.optionA.mockPercentage}%
              </span>
            )}
            <div className={styles.optionEmoji}>{dilemma.optionA.emoji}</div>
            <div className={styles.optionText}>{dilemma.optionA.text}</div>
            <div 
              className={styles.percentageBar} 
              style={{ 
                background: dilemma.optionA.color,
                width: hasAnswered ? `${dilemma.optionA.mockPercentage}%` : '0%' 
              }} 
            />
          </button>

          <div className={styles.vsLabel}>VS</div>

          {/* OPTION B */}
          <button 
            className={`${styles.optionBtn} ${savedAnswer === 'B' ? styles.selectedOption : ''}`}
            onClick={() => handleSelect('B')}
            disabled={hasAnswered}
            style={{
              borderColor: savedAnswer === 'B' ? dilemma.optionB.color : '',
              background: savedAnswer === 'B' ? `${dilemma.optionB.color}15` : ''
            }}
          >
            {hasAnswered && (
              <span className={styles.percentageText} style={{ color: dilemma.optionB.color }}>
                {dilemma.optionB.mockPercentage}%
              </span>
            )}
            <div className={styles.optionEmoji}>{dilemma.optionB.emoji}</div>
            <div className={styles.optionText}>{dilemma.optionB.text}</div>
            <div 
              className={styles.percentageBar} 
              style={{ 
                background: dilemma.optionB.color,
                width: hasAnswered ? `${dilemma.optionB.mockPercentage}%` : '0%' 
              }} 
            />
          </button>
        </div>

        {hasAnswered && (
          <div className={styles.insightBox}>
            <h3>💡 Insight Psikologi</h3>
            <p>{dilemma.insight}</p>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      <div className={styles.dots}>
        {DAILY_DILEMMAS.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === dilemmaIndex ? styles.dotActive : ''} ${answers[DAILY_DILEMMAS[i].id] ? styles.dotAnswered : ''}`}
            onClick={() => setDilemmaIndex(i)}
            aria-label={`Dilema ${i + 1}`}
          />
        ))}
      </div>

      <Link to="/dashboard" className={`${styles.backBtn} fade-up`} style={{ animationDelay: '0.2s' }}>
        &larr; Kembali ke Beranda
      </Link>
    </div>
  );
}
