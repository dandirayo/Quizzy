import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QUIZ_CATALOG } from '../../data/quizCatalog';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserQuizResult } from '../../services/db';
import styles from './QuizEngine.module.css';

const LIKERT_OPTIONS = [
  { value: 1, label: 'Sangat tidak sesuai' },
  { value: 2, label: 'Tidak sesuai' },
  { value: 3, label: 'Kadang-kadang' },
  { value: 4, label: 'Sesuai' },
  { value: 5, label: 'Sangat sesuai' }
];

const FOUR_POINT_OPTIONS = [
  { value: 3, label: 'Sangat Setuju' },
  { value: 1, label: 'Setuju' },
  { value: -1, label: 'Tidak Setuju' },
  { value: -3, label: 'Sangat Tidak Setuju' }
];

function calculateQuizResult(quiz, questions, answers) {
  // 1. MBTI Calculation
  if (quiz.type === 'mbti') {
    const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    questions.forEach((q, i) => {
      const ans = answers[i];
      if (ans === null) return;
      const mult = q.dir === 'B' ? -1 : 1;
      scores[q.dimension] += ans * mult;
    });

    const E_vs_I = scores.EI >= 0 ? 'E' : 'I';
    const S_vs_N = scores.SN >= 0 ? 'S' : 'N';
    const T_vs_F = scores.TF >= 0 ? 'T' : 'F';
    const J_vs_P = scores.JP >= 0 ? 'J' : 'P';
    const mbtiCode = `${E_vs_I}${S_vs_N}${T_vs_F}${J_vs_P}`;

    const percentages = {
      'E / I': Math.round((Math.abs(scores.EI) / 21) * 50 + 50),
      'S / N': Math.round((Math.abs(scores.SN) / 21) * 50 + 50),
      'T / F': Math.round((Math.abs(scores.TF) / 21) * 50 + 50),
      'J / P': Math.round((Math.abs(scores.JP) / 21) * 50 + 50)
    };

    const ordered = [
      { key: 'E / I', label: scores.EI >= 0 ? 'Extrovert' : 'Introvert', percentage: percentages['E / I'], color: '#3b82f6' },
      { key: 'S / N', label: scores.SN >= 0 ? 'Sensing' : 'Intuition', percentage: percentages['S / N'], color: '#22c55e' },
      { key: 'T / F', label: scores.TF >= 0 ? 'Thinking' : 'Feeling', percentage: percentages['T / F'], color: '#ef4444' },
      { key: 'J / P', label: scores.JP >= 0 ? 'Judging' : 'Perceiving', percentage: percentages['J / P'], color: '#eab308' }
    ];

    const profile = quiz.profiles[mbtiCode] || {
      title: mbtiCode,
      tagline: 'Kepribadian unik',
      emoji: '🦉',
      insight: 'Kamu memiliki kombinasi sifat yang seimbang.',
      tip: 'Kenali kekuatan dirimu untuk terus bertumbuh.'
    };

    return {
      percentages,
      ordered,
      dominantKey: mbtiCode,
      profileTitle: profile.title,
      profileEmoji: profile.emoji,
      profileTagline: profile.tagline,
      insight: profile.insight,
      tip: profile.tip
    };
  }

  // 2. Attachment Style Calculation
  if (quiz.type === 'attachment') {
    const rawScores = { ANX: 0, AVO: 0 };
    questions.forEach((q, i) => {
      const ans = answers[i];
      if (ans === null) return;
      const mult = q.dir === 'B' ? -1 : 1;
      rawScores[q.dimension] += ans * mult;
    });

    // 12 questions per dim, max = 36, min = -36
    const anxPct = Math.min(100, Math.max(0, Math.round(((rawScores.ANX + 36) / 72) * 100)));
    const avoPct = Math.min(100, Math.max(0, Math.round(((rawScores.AVO + 36) / 72) * 100)));

    let styleKey = 'secure';
    if (anxPct >= 50 && avoPct < 50) styleKey = 'anxious';
    else if (anxPct < 50 && avoPct >= 50) styleKey = 'avoidant';
    else if (anxPct >= 50 && avoPct >= 50) styleKey = 'fearful';

    const profile = quiz.profiles[styleKey];
    const percentages = { Anxiety: anxPct, Avoidance: avoPct };
    const ordered = [
      { key: 'Anxiety', label: 'Anxiety (Kecemasan)', percentage: anxPct, color: '#ec4899' },
      { key: 'Avoidance', label: 'Avoidance (Jarak Emosional)', percentage: avoPct, color: '#8b5cf6' }
    ];

    return {
      percentages,
      ordered,
      dominantKey: styleKey,
      profileTitle: profile.title,
      profileEmoji: profile.emoji,
      profileTagline: profile.tagline,
      insight: profile.insight,
      tip: profile.tip
    };
  }

  // 3. Standard Likert (1-5 point) Calculation
  const totals = {};
  const counts = {};

  questions.forEach(q => {
    totals[q.dimension] = 0;
    counts[q.dimension] = 0;
  });

  questions.forEach((q, i) => {
    const answer = answers[i];
    if (answer === null) return;
    const value = q.reverse ? 6 - answer : answer;
    totals[q.dimension] += value;
    counts[q.dimension] += 1;
  });

  const percentages = {};
  let maxScore = -1;
  let dominantKey = null;

  Object.keys(totals).forEach(dim => {
    if (counts[dim] === 0) return;
    const average = totals[dim] / counts[dim];
    const percentage = Math.round(((average - 1) / 4) * 100);
    percentages[dim] = percentage;

    if (percentage > maxScore) {
      maxScore = percentage;
      dominantKey = dim;
    }
  });

  const ordered = Object.keys(percentages)
    .map(key => ({
      key,
      label: quiz.dimensions[key]?.name || key,
      color: quiz.dimensions[key]?.color || quiz.colors[0],
      percentage: percentages[key]
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const profile = quiz.profiles[dominantKey] || {
    title: quiz.dimensions[dominantKey]?.name || 'Hasil Quiz',
    tagline: 'Karakteristik dominan dari jawabanmu',
    emoji: quiz.emoji,
    insight: 'Dimensi ini menunjukkan preferensi alamimu.',
    tip: 'Latih konsistensi untuk memperkuat potensi ini.'
  };

  return {
    percentages,
    ordered,
    dominantKey,
    profileTitle: profile.title,
    profileEmoji: profile.emoji || quiz.emoji,
    profileTagline: profile.tagline,
    insight: profile.insight,
    tip: profile.tip
  };
}

export default function QuizEngine({ quizId, onComplete }) {
  const quiz = QUIZ_CATALOG[quizId];
  const { user, isAuthenticated } = useAuth();

  const [screen, setScreen] = useState('intro'); // 'intro', 'quiz', 'result'
  const [answers, setAnswers] = useState(Array(quiz?.questions?.length || 0).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [savedToDb, setSavedToDb] = useState(false);

  useEffect(() => {
    if (quiz) {
      setScreen('intro');
      setAnswers(Array(quiz.questions.length).fill(null));
      setCurrentQuestion(0);
      setResult(null);
      setSavedToDb(false);
    }
  }, [quizId, quiz]);

  if (!quiz) {
    return (
      <div className={styles.errorCard}>
        <h2>🧭 Quiz Tidak Ditemukan</h2>
        <p>Quiz dengan ID "{quizId}" tidak tersedia.</p>
        <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
      </div>
    );
  }

  const isFourPoint = quiz.type === 'mbti' || quiz.type === 'attachment';
  const options = isFourPoint ? FOUR_POINT_OPTIONS : LIKERT_OPTIONS;

  const handleStart = () => {
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const res = calculateQuizResult(quiz, quiz.questions, answers);
      setResult(res);
      setScreen('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Save to localStorage
      try {
        const localData = {
          quizId,
          dominant: res.profileTitle,
          emoji: res.profileEmoji,
          score: res.ordered[0]?.percentage || 0,
          date: new Date().toISOString(),
          percentages: res.percentages
        };
        localStorage.setItem(`quizzy_${quizId}`, JSON.stringify(localData));
      } catch (e) {
        console.error('LocalStorage error', e);
      }

      // If user logged in, save to backend DB
      if (isAuthenticated && user?.id) {
        try {
          await saveUserQuizResult(user.id, {
            quizId,
            dominantResult: res.profileTitle,
            dominantEmoji: res.profileEmoji,
            scores: res.percentages,
            isPublic: true
          });
          setSavedToDb(true);
        } catch (err) {
          console.error('Failed to auto-save to DB', err);
        }
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
    const shareText = `Hasil ${quiz.title} saya: ${result.profileTitle}. Coba quiznya di Quizzy!`;
    if (navigator.share) {
      navigator.share({
        title: `Hasil ${quiz.title}`,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert('Tautan dan hasil disalin ke clipboard!');
    }
  };

  const handleRetry = () => {
    setAnswers(Array(quiz.questions.length).fill(null));
    setCurrentQuestion(0);
    setResult(null);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Screen Intro
  const renderIntro = () => (
    <div className={`${styles.screen} ${styles.introScreen} fade-up`}>
      <div
        className={styles.headerBox}
        style={{ background: `linear-gradient(135deg, ${quiz.colors[0]}, ${quiz.colors[1]})` }}
      >
        <div className={styles.emoji}>{quiz.emoji}</div>
        <h1 className={styles.title}>{quiz.title}</h1>
        <p className={styles.subtitle}>{quiz.subtitle}</p>
      </div>

      <div className={styles.dimensionsPreview}>
        <h3 className={styles.sectionTitle}>Aspek yang dinilai:</h3>
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

      {quiz.note && (
        <div className={styles.noteBox}>
          <strong>Catatan:</strong> {quiz.note}
        </div>
      )}

      <button className={styles.primaryButton} onClick={handleStart}>
        Mulai {quiz.shortTitle} ({quiz.questions.length} Soal) 🚀
      </button>
    </div>
  );

  // 2. Screen Quiz
  const renderQuiz = () => {
    const question = quiz.questions[currentQuestion];
    const dimension = quiz.dimensions[question.dimension];
    const progress = Math.round(((currentQuestion + 1) / quiz.questions.length) * 100);

    return (
      <div className={`${styles.screen} ${styles.quizScreen} fade-up`}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%`, backgroundColor: quiz.colors[0] }}
            ></div>
          </div>
          <div className={styles.progressText}>
            Pertanyaan {currentQuestion + 1} dari {quiz.questions.length} ({progress}%)
          </div>
        </div>

        <div className={styles.questionCard}>
          {dimension && (
            <div
              className={styles.questionBadge}
              style={{ backgroundColor: `${dimension.color}20`, color: dimension.color, borderColor: dimension.color }}
            >
              {dimension.name}
            </div>
          )}
          <h2 className={styles.questionText}>{question.text}</h2>

          <div className={styles.optionsList}>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.optionButton} ${answers[currentQuestion] === opt.value ? styles.selected : ''}`}
                onClick={() => handleAnswer(opt.value)}
              >
                <div className={styles.radioCircle}>
                  {answers[currentQuestion] === opt.value && <div className={styles.radioDot}></div>}
                </div>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.navButtons}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            ← Kembali
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleNext}
            disabled={answers[currentQuestion] === null}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Lihat Hasil 🎉' : 'Selanjutnya →'}
          </button>
        </div>
      </div>
    );
  };

  // 3. Screen Result
  const renderResult = () => {
    return (
      <div className={`${styles.screen} ${styles.resultScreen} fade-up`}>
        <div
          className={styles.resultHeader}
          style={{ background: `linear-gradient(135deg, ${quiz.colors[0]}22, ${quiz.colors[1]}22)` }}
        >
          <div className={styles.resultEmoji}>{result.profileEmoji}</div>
          <div className={styles.resultPretitle}>Profil Dominan Kamu:</div>
          <h1 className={styles.resultTitle} style={{ color: quiz.colors[0] }}>
            {result.profileTitle}
          </h1>
          {result.profileTagline && (
            <p className={styles.resultTagline}>"{result.profileTagline}"</p>
          )}
        </div>

        {/* Sync / Save notification */}
        {isAuthenticated ? (
          <div className={styles.savedBanner}>
            ✓ Hasil kuis berhasil disimpan ke profil <strong>@{user.username}</strong>
          </div>
        ) : (
          <div className={styles.guestBanner}>
            <span>💡 <strong>Ingin menyimpan hasil ini?</strong></span>
            <p>Hasil saat ini hanya tersimpan di browser ini. Masuk atau daftar akun agar hasil ini menjadi bagian dari Kartu Identitas Psikologismu dan bisa dilihat teman.</p>
            <div className={styles.guestBannerActions}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                Masuk / Daftar Akun
              </Link>
            </div>
          </div>
        )}

        <div className={styles.resultSection}>
          <h3 className={styles.sectionTitle}>Distribusi Skor</h3>
          <div className={styles.barsContainer}>
            {result.ordered.map((item) => (
              <div key={item.key} className={styles.barItem}>
                <div className={styles.barHeader}>
                  <span className={styles.barLabel}>{item.label}</span>
                  <span className={styles.barValue}>{item.percentage}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color || quiz.colors[0]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.insightCards}>
          {result.insight && (
            <div className={styles.insightCard}>
              <h4>💡 Insight</h4>
              <p>{result.insight}</p>
            </div>
          )}
          {result.tip && (
            <div className={styles.insightCard}>
              <h4>🎯 Tips Praktis</h4>
              <p>{result.tip}</p>
            </div>
          )}
        </div>

        {quiz.sources && quiz.sources.length > 0 && (
          <div className={styles.sourcesBox}>
            <h4>Dasar Teori & Referensi:</h4>
            <ul>
              {quiz.sources.map((src, idx) => (
                <li key={idx}>
                  {src.url ? (
                    <a href={src.url} target="_blank" rel="noreferrer">
                      {src.label} ↗
                    </a>
                  ) : (
                    src.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.actionButtons}>
          <button type="button" className={styles.primaryButton} onClick={handleShare}>
            📤 Bagikan Hasil
          </button>
          <button type="button" className={styles.secondaryButton} onClick={handleRetry}>
            🔄 Ulangi Quiz
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
