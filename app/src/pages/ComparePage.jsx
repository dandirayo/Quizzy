import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserQuizResults } from '../services/db';
import styles from './ComparePage.module.css';

const ComparePage = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [friendUser, setFriendUser] = useState(null);
  const [myResults, setMyResults] = useState([]);
  const [friendResults, setFriendResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      if (!currentUser || !username) {
        setLoading(false);
        return;
      }

      try {
        const friend = await getUserProfile(username);
        if (active && friend) {
          setFriendUser(friend);
          const [myRes, friendRes] = await Promise.all([
            getUserQuizResults(currentUser.id),
            getUserQuizResults(friend.id)
          ]);
          if (active) {
            setMyResults(myRes);
            setFriendResults(friendRes);
          }
        }
      } catch (err) {
        console.error('Error loading compare data:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => { active = false; };
  }, [currentUser, username]);

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Masuk untuk Membandingkan</h2>
          <p style={{ color: 'var(--muted)', margin: '1rem 0' }}>
            Kamu harus masuk terlebih dahulu untuk membandingkan kepribadian dengan @{username}.
          </p>
          <Link to="/login" className="btn btn-primary">Masuk</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>Menganalisis kecocokan karakter...</p>
        </div>
      </div>
    );
  }

  if (!friendUser) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3>Pengguna Tidak Ditemukan</h3>
          <p>Pengguna @{username} tidak ditemukan.</p>
          <Link to="/friends" className="btn btn-primary">Kembali ke Daftar Teman</Link>
        </div>
      </div>
    );
  }

  // Find overlapping quizzes
  const myMbti = myResults.find(r => r.quiz_id === 'mbti');
  const friendMbti = friendResults.find(r => r.quiz_id === 'mbti');

  const myAttachment = myResults.find(r => r.quiz_id === 'attachment');
  const friendAttachment = friendResults.find(r => r.quiz_id === 'attachment');

  const myBigFive = myResults.find(r => r.quiz_id === 'bigfive');
  const friendBigFive = friendResults.find(r => r.quiz_id === 'bigfive');

  const myRiasec = myResults.find(r => r.quiz_id === 'riasec');
  const friendRiasec = friendResults.find(r => r.quiz_id === 'riasec');

  // Dynamic compatibility estimation
  let score = 75; // base score
  if (myMbti && friendMbti) {
    // Check overlapping letters
    const overlap = [...myMbti.dominant_result].filter(c => friendMbti.dominant_result.includes(c)).length;
    score += (overlap * 4);
  }
  if (myAttachment && friendAttachment) {
    if (myAttachment.dominant_result.includes('Secure') || friendAttachment.dominant_result.includes('Secure')) {
      score += 6;
    }
  }
  const compScore = Math.min(96, Math.max(68, score));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Analisis Kecocokan Karakter</h1>
        <p className={styles.subtitle}>
          Eksplorasi sinergi, kekuatan kolaborasi, dan sudut pandang saling melengkapi antara kamu dan @{friendUser.username}.
        </p>
      </header>

      {/* Versus Card */}
      <div className={`${styles.versusCard} fade-up`}>
        <div className={styles.userColumn}>
          <img
            src={currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`}
            alt={currentUser.display_name}
            className={styles.avatar}
          />
          <div>
            <div className={styles.userName}>{currentUser.display_name}</div>
            <div className={styles.userHandle}>@{currentUser.username}</div>
          </div>
        </div>

        <div className={styles.vsBadge}>VS</div>

        <div className={styles.userColumn}>
          <img
            src={friendUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${friendUser.username}`}
            alt={friendUser.display_name}
            className={styles.avatar}
          />
          <div>
            <div className={styles.userName}>{friendUser.display_name}</div>
            <div className={styles.userHandle}>@{friendUser.username}</div>
          </div>
        </div>
      </div>

      {/* Compatibility Box */}
      <div className={`${styles.compatibilityBox} fade-up`}>
        <div className={styles.scoreNumber}>{compScore}%</div>
        <div className={styles.scoreLabel}>Sinergi & Kecocokan Komunikasi Tinggi</div>
        <p className={styles.scoreDesc}>
          Kalian memiliki kombinasi karakteristik yang saling memperkaya. Perbedaan cara pandang dapat menjadi pemicu pertumbuhan, sementara kesamaan nilai menciptakan kenyamanan berkomunikasi.
        </p>
      </div>

      {/* Comparisons */}
      <div className={styles.comparisonSection}>
        {/* MBTI Comparison */}
        <div className={`${styles.dimensionCard} fade-up`}>
          <div className={styles.dimensionCardTitle}>
            <span>🦉</span> Tipe Kepribadian (MBTI)
          </div>

          <div className={styles.comparisonColumns}>
            <div className={styles.userAnswerBox}>
              <span className={styles.userAnswerHeader}>Kamu ({currentUser.display_name})</span>
              <div className={styles.answerHighlight}>
                {myMbti ? `${myMbti.dominant_emoji} ${myMbti.dominant_result}` : 'Belum mengambil kuis'}
              </div>
              <p className={styles.answerDesc}>
                {myMbti ? 'Pola pemikiran dan keputusan dominanmu.' : 'Ikuti kuis MBTI untuk melihat perbandingan mendalam.'}
              </p>
            </div>

            <div className={styles.userAnswerBox}>
              <span className={styles.userAnswerHeader}>{friendUser.display_name}</span>
              <div className={styles.answerHighlight}>
                {friendMbti ? `${friendMbti.dominant_emoji} ${friendMbti.dominant_result}` : 'Belum mengambil kuis'}
              </div>
              <p className={styles.answerDesc}>
                {friendMbti ? 'Pola pemikiran dan gaya komunikasi rekanmu.' : 'Temanmu belum menyelesaikan kuis ini.'}
              </p>
            </div>
          </div>

          {myMbti && friendMbti && (
            <div className={styles.harmonyTip}>
              💡 <strong>Tips Sinergi:</strong> {myMbti.dominant_result} dan {friendMbti.dominant_result} sering kali menjadi rekan diskusi yang dinamis karena memadukan perspektif yang kaya. Saling beri waktu jeda untuk menyerap sudut pandang masing-masing.
            </div>
          )}
        </div>

        {/* Attachment Comparison */}
        <div className={`${styles.dimensionCard} fade-up`}>
          <div className={styles.dimensionCardTitle}>
            <span>💗</span> Gaya Kelekatan Hubungan (Attachment Style)
          </div>

          <div className={styles.comparisonColumns}>
            <div className={styles.userAnswerBox}>
              <span className={styles.userAnswerHeader}>Kamu ({currentUser.display_name})</span>
              <div className={styles.answerHighlight}>
                {myAttachment ? `${myAttachment.dominant_emoji} ${myAttachment.dominant_result}` : 'Belum mengambil kuis'}
              </div>
            </div>

            <div className={styles.userAnswerBox}>
              <span className={styles.userAnswerHeader}>{friendUser.display_name}</span>
              <div className={styles.answerHighlight}>
                {friendAttachment ? `${friendAttachment.dominant_emoji} ${friendAttachment.dominant_result}` : 'Belum mengambil kuis'}
              </div>
            </div>
          </div>

          {myAttachment && friendAttachment && (
            <div className={styles.harmonyTip}>
              🌱 <strong>Kunci Keharmonisan:</strong> Mengetahui gaya kedekatan emosional teman membantu kalian saling memahami saat salah satu sedang butuh ruang sendiri atau kepastian komunikasi.
            </div>
          )}
        </div>

        {/* Big Five / Career */}
        {(myBigFive || friendBigFive || myRiasec || friendRiasec) && (
          <div className={`${styles.dimensionCard} fade-up`}>
            <div className={styles.dimensionCardTitle}>
              <span>🧭</span> Minat & Spektrum Kepribadian Lainnya
            </div>

            <div className={styles.comparisonColumns}>
              <div className={styles.userAnswerBox}>
                <span className={styles.userAnswerHeader}>{currentUser.display_name}</span>
                <div className={styles.answerHighlight}>
                  {myRiasec ? `${myRiasec.dominant_emoji} ${myRiasec.dominant_result}` : 'Minat Karier Belum Diisi'}
                </div>
              </div>

              <div className={styles.userAnswerBox}>
                <span className={styles.userAnswerHeader}>{friendUser.display_name}</span>
                <div className={styles.answerHighlight}>
                  {friendRiasec ? `${friendRiasec.dominant_emoji} ${friendRiasec.dominant_result}` : 'Minat Karier Belum Diisi'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link to="/friends" className="btn btn-secondary">
          ← Kembali ke Daftar Teman
        </Link>
      </div>
    </div>
  );
};

export default ComparePage;
