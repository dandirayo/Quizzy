import React, { useState, useEffect } from 'react';
import { QUIZ_CATALOG } from '../../data/quizCatalog';
import styles from './QuizEngine.module.css';

const LIKERT_OPTIONS = [
  { value: 1, label: 'Sangat tidak sesuai' },
  { value: 2, label: 'Tidak sesuai' },
  { value: 3, label: 'Kadang-kadang' },
  { value: 4, label: 'Sesuai' },
  { value: 5, label: 'Sangat sesuai' }
];

function calculateResult(questions, answers) {
  const totals = {};
  const counts = {};

  // Initialize totals for each dimension
  questions.forEach(q => {
    totals[q.dimension] = 0;
    counts[q.dimension] = 0;
  });

  // Calculate scores
  questions.forEach((q, i) => {
    const answer = answers[i];
    if (answer === null) return;
    
    // Reverse score if needed
    const value = q.reverse ? 6 - answer : answer;
    
    totals[q.dimension] += value;
    counts[q.dimension] += 1;
  });

  // Calculate percentages
  const percentages = {};
  let maxScore = -1;
  let dominantKey = null;

  Object.keys(totals).forEach(dim => {
    if (counts[dim] === 0) return;
    
    const average = totals[dim] / counts[dim];
    // Normalize to 0-100%: Math.round(((average - 1) / 4) * 100)
    const percentage = Math.round(((average - 1) / 4) * 100);
    percentages[dim] = percentage;
    
    if (percentage > maxScore) {
      maxScore = percentage;
      dominantKey = dim;
    }
  });

  // Sort dimensions by percentage descending
  const ordered = Object.keys(percentages).map(key => ({
    key,
    percentage: percentages[key]
  })).sort((a, b) => b.percentage - a.percentage);

  return { percentages, ordered, dominantKey };
}

export default function QuizEngine({ quizId, onComplete }) {
  const quiz = QUIZ_CATALOG[quizId];
  
  const [screen, setScreen] = useState('intro'); // 'intro', 'quiz', 'result'
  const [answers, setAnswers] = useState(Array(quiz?.questions?.length || 0).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);

  // Reset state when quizId changes
  useEffect(() => {
    if (quiz) {
      setScreen('intro');
      setAnswers(Array(quiz.questions.length).fill(null));
      setCurrentQuestion(0);
      setResult(null);
    }
  }, [quizId, quiz]);

  if (!quiz) {
    return <div className={styles.error}>Quiz not found</div>;
  }

  const handleStart = () => {
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Calculate results
      const res = calculateResult(quiz.questions, answers);
      setResult(res);
      setScreen('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Save to localStorage
      try {
        const historyData = {
          quizId,
          date: new Date().toISOString(),
          result: res
        };
        localStorage.setItem(`quizzy_${quizId}`, JSON.stringify(historyData));
      } catch (e) {
        console.error("Could not save to localStorage", e);
      }
      
      if (onComplete) {
        onComplete(res);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Hasil ${quiz.title}`,
        text: `Saya mendapat profil ${quiz.profiles[result.dominantKey].title} di ${quiz.title}. Coba quiznya di Quizzy!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${window.location.href}`);
      alert('Link disalin ke clipboard!');
    }
  };

  const handleRetry = () => {
    setAnswers(Array(quiz.questions.length).fill(null));
    setCurrentQuestion(0);
    setResult(null);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderIntro = () => (
    <div className={`${styles.screen} ${styles.introScreen}`}>
      <div className={styles.headerBox} style={{ background: `linear-gradient(135deg, ${quiz.colors[0]}, ${quiz.colors[1]})` }}>
        <div className={styles.emoji}>{quiz.emoji}</div>
        <h1 className={styles.title}>{quiz.title}</h1>
        <p className={styles.subtitle}>{quiz.subtitle}</p>
      </div>

      <div className={styles.dimensionsPreview}>
        <h3 className={styles.sectionTitle}>Yang akan diukur:</h3>
        <div className={styles.dimensionsGrid}>
          {Object.entries(quiz.dimensions).map(([key, dim]) => (
            <div key={key} className={styles.dimensionCard}>
              <div className={styles.dimColor} style={{ backgroundColor: dim.color }}></div>
              <div>
                <div className={styles.dimName}>{dim.name}</div>
                <div className={styles.dimDesc}>{dim.preview}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.noteBox}>
        <strong>Note:</strong> {quiz.note}
      </div>

      <button className={styles.primaryButton} onClick={handleStart}>
        Mulai {quiz.shortTitle}
      </button>
    </div>
  );

  const renderQuiz = () => {
    const question = quiz.questions[currentQuestion];
    const dimension = quiz.dimensions[question.dimension];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
    
    return (
      <div className={`${styles.screen} ${styles.quizScreen}`}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%`, backgroundColor: quiz.colors[0] }}></div>
          </div>
          <div className={styles.progressText}>Pertanyaan {currentQuestion + 1} / {quiz.questions.length}</div>
        </div>

        <div className={styles.questionCard}>
          <div className={styles.questionBadge} style={{ backgroundColor: `${dimension.color}20`, color: dimension.color }}>
            {dimension.name}
          </div>
          <h2 className={styles.questionText}>{question.text}</h2>
          
          <div className={styles.optionsList}>
            {LIKERT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.optionButton} ${answers[currentQuestion] === opt.value ? styles.selected : ''}`}
                onClick={() => handleAnswer(opt.value)}
              >
                <div className={styles.radioCircle}>
                  {answers[currentQuestion] === opt.value && <div className={styles.radioDot}></div>}
                </div>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.navButtons}>
          <button 
            className={styles.secondaryButton} 
            onClick={handleBack} 
            disabled={currentQuestion === 0}
          >
            Kembali
          </button>
          <button 
            className={styles.primaryButton} 
            onClick={handleNext} 
            disabled={answers[currentQuestion] === null}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Lihat Hasil' : 'Selanjutnya'}
          </button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const profile = quiz.profiles[result.dominantKey];
    
    return (
      <div className={`${styles.screen} ${styles.resultScreen}`}>
        <div className={styles.resultHeader} style={{ background: `linear-gradient(135deg, ${quiz.colors[0]}20, ${quiz.colors[1]}20)` }}>
          <div className={styles.resultEmoji}>{profile.emoji}</div>
          <div className={styles.resultPretitle}>Profil Dominan Anda:</div>
          <h1 className={styles.resultTitle} style={{ color: quiz.colors[0] }}>{profile.title}</h1>
          <p className={styles.resultTagline}>"{profile.tagline}"</p>
        </div>

        <div className={styles.resultSection}>
          <h3 className={styles.sectionTitle}>Distribusi Skor</h3>
          <div className={styles.barsContainer}>
            {result.ordered.map((item) => {
              const dim = quiz.dimensions[item.key];
              return (
                <div key={item.key} className={styles.barItem}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>{dim.name}</span>
                    <span className={styles.barValue}>{item.percentage}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div 
                      className={styles.barFill} 
                      style={{ 
                        width: `${item.percentage}%`, 
                        backgroundColor: dim.color 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.insightCards}>
          <div className={styles.insightCard}>
            <h4>💡 Insight</h4>
            <p>{profile.insight}</p>
          </div>
          <div className={styles.insightCard}>
            <h4>🎯 Tips Praktis</h4>
            <p>{profile.tip}</p>
          </div>
        </div>

        <div className={styles.sourcesBox}>
          <h4>Referensi & Catatan:</h4>
          <ul>
            {quiz.sources.map((src, idx) => (
              <li key={idx}>
                {src.url ? <a href={src.url} target="_blank" rel="noreferrer">{src.label}</a> : src.label}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.primaryButton} onClick={handleShare}>
            Bagikan Hasil
          </button>
          <button className={styles.secondaryButton} onClick={handleRetry}>
            Ulangi Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.engineContainer}>
      {screen === 'intro' && renderIntro()}
      {screen === 'quiz' && renderQuiz()}
      {screen === 'result' && renderResult()}
    </div>
  );
}
