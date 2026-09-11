import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DAILY_DILEMMAS } from '../data/gamesData';
import styles from './DailyDilemmaPage.module.css';

export default function DailyDilemmaPage() {
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Ambil dilema hari ini (mock: ambil yang pertama)
  const dilemma = DAILY_DILEMMAS[0];

  const handleSelect = (option) => {
    if (hasAnswered) return;
    setSelectedOption(option);
    setHasAnswered(true);
    // TODO: Save to DB via db.js if needed
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.header} fade-up`}>
        <h1>Dilema Harian</h1>
        <p>Pilih jalanmu dan lihat bagaimana orang lain merespons.</p>
      </div>

      <div className={`${styles.dilemmaCard} fade-up`} style={{ animationDelay: '0.1s' }}>
        <h2 className={styles.question}>"{dilemma.question}"</h2>

        <div className={`${styles.optionsContainer} ${hasAnswered ? styles.answered : ''}`}>
          {/* OPTION A */}
          <button 
            className={styles.optionBtn}
            onClick={() => handleSelect('A')}
            disabled={hasAnswered}
            style={{
              borderColor: selectedOption === 'A' ? dilemma.optionA.color : '',
              background: selectedOption === 'A' ? `${dilemma.optionA.color}15` : ''
            }}
          >
            <span className={styles.percentageText} style={{ color: dilemma.optionA.color }}>
              {dilemma.optionA.mockPercentage}%
            </span>
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

          {/* OPTION B */}
          <button 
            className={styles.optionBtn}
            onClick={() => handleSelect('B')}
            disabled={hasAnswered}
            style={{
              borderColor: selectedOption === 'B' ? dilemma.optionB.color : '',
              background: selectedOption === 'B' ? `${dilemma.optionB.color}15` : ''
            }}
          >
            <span className={styles.percentageText} style={{ color: dilemma.optionB.color }}>
              {dilemma.optionB.mockPercentage}%
            </span>
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

      <Link to="/" className={`${styles.backBtn} fade-up`} style={{ animationDelay: '0.2s' }}>
        &larr; Kembali ke Beranda
      </Link>
    </div>
  );
}
