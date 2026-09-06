import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserQuizResults, sendFriendRequest, getFriendships, updateUserProfile } from '../services/db';
import { QUIZ_CATALOG } from '../data/quizCatalog';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { username: routeUsername } = useParams();
  const { user: currentUser, isAuthenticated, updateProfile } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState('none'); // 'none', 'friends', 'outgoing', 'incoming'
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarSeed, setEditAvatarSeed] = useState('');
  const [msg, setMsg] = useState('');

  const isOwnProfile = !routeUsername || (currentUser && currentUser.username.toLowerCase() === routeUsername.toLowerCase());

  useEffect(() => {
    let active = true;

    async function fetchProfileData() {
      setLoading(true);
      try {
        let targetUser = null;
        if (isOwnProfile) {
          targetUser = currentUser;
        } else {
          targetUser = await getUserProfile(routeUsername);
        }

        if (!targetUser && isOwnProfile && !isAuthenticated) {
          setLoading(false);
          return;
        }

        if (active) {
          setProfileUser(targetUser);
          if (targetUser) {
            setEditDisplayName(targetUser.display_name || '');
            setEditBio(targetUser.bio || '');
            setEditAvatarSeed(targetUser.username || '');

            const results = await getUserQuizResults(targetUser.id);
            setQuizResults(results);

            // If viewing someone else and logged in, check friendship status
            if (currentUser && !isOwnProfile) {
              const { friends, incoming, outgoing } = await getFriendships(currentUser.id);
              if (friends.some(f => f.id === targetUser.id)) {
                setFriendStatus('friends');
              } else if (outgoing.some(f => f.id === targetUser.id)) {
                setFriendStatus('outgoing');
              } else if (incoming.some(f => f.id === targetUser.id)) {
                setFriendStatus('incoming');
              } else {
                setFriendStatus('none');
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProfileData();
    return () => { active = false; };
  }, [routeUsername, currentUser, isOwnProfile, isAuthenticated]);

  const handleSendFriendRequest = async () => {
    if (!currentUser) return;
    try {
      await sendFriendRequest(currentUser.id, profileUser.id);
      setFriendStatus('outgoing');
      setMsg('Permintaan pertemanan terkirim! 🤝');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Gagal mengirim permintaan pertemanan');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        display_name: editDisplayName,
        bio: editBio,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${editAvatarSeed}`
      };
      await updateUserProfile(currentUser.id, updates);
      updateProfile(updates);
      setProfileUser(prev => ({ ...prev, ...updates }));
      setIsEditing(false);
      setMsg('Profil berhasil diperbarui! ✨');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert('Gagal memperbarui profil: ' + err.message);
    }
  };

  if (!isAuthenticated && isOwnProfile) {
    return (
      <div className={styles.container}>
        <div className={`card ${styles.authPrompt} fade-up`}>
          <div className={styles.promptIcon}>📇</div>
          <h2 className={styles.promptTitle}>Kartu Identitas Psikologis</h2>
          <p className={styles.promptDesc}>
            Masuk atau daftar untuk melihat profil kepribadian lengkapmu, mengumpulkan lencana kuis, dan saling terhubung dengan teman-temanmu.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-primary">Masuk Sekarang</Link>
            <Link to="/register" className="btn btn-secondary">Daftar Akun</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3>Pengguna Tidak Ditemukan</h3>
          <p>Pengguna dengan username "@{routeUsername}" belum terdaftar di Quizzy.</p>
          <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  // Extract core DNA results
  const mbtiResult = quizResults.find(r => r.quiz_id === 'mbti');
  const attachmentResult = quizResults.find(r => r.quiz_id === 'attachment');
  const bigFiveResult = quizResults.find(r => r.quiz_id === 'bigfive');
  const riasecResult = quizResults.find(r => r.quiz_id === 'riasec');

  return (
    <div className={styles.container}>
      {msg && (
        <div className="fade-up" style={{
          padding: '0.75rem 1.25rem',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '10px',
          color: '#4ade80',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {msg}
        </div>
      )}

      {/* Profile Header Card */}
      <div className={`card ${styles.profileCard} fade-up`}>
        <div className={styles.cardGlow}></div>
        <div className={styles.headerMain}>
          <div className={styles.userInfo}>
            <div className={styles.avatarWrap}>
              <img
                src={profileUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profileUser.username}`}
                alt={profileUser.display_name}
                className={styles.avatar}
              />
            </div>
            <div className={styles.userMeta}>
              <h1 className={styles.displayName}>{profileUser.display_name}</h1>
              <span className={styles.username}>@{profileUser.username}</span>
              <p className={styles.bio}>{profileUser.bio || 'Penggemar refleksi diri di Quizzy 🌱'}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {isOwnProfile ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                ✏️ Edit Profil
              </button>
            ) : (
              <>
                {currentUser && (
                  <Link
                    to={`/compare/${profileUser.username}`}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    ⚡ Bandingkan Hasil
                  </Link>
                )}

                {friendStatus === 'friends' && (
                  <span style={{ fontSize: '0.85rem', color: '#4ade80', padding: '8px 12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                    ✓ Berteman
                  </span>
                )}
                {friendStatus === 'outgoing' && (
                  <span style={{ fontSize: '0.85rem', color: '#eab308', padding: '8px 12px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px' }}>
                    ⏳ Permintaan Dikirim
                  </span>
                )}
                {friendStatus === 'incoming' && (
                  <Link to="/friends" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                    Konfirmasi Pertemanan
                  </Link>
                )}
                {friendStatus === 'none' && currentUser && (
                  <button
                    type="button"
                    onClick={handleSendFriendRequest}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    ➕ Tambah Teman
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Core Personality DNA */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>🧬 Karakteristik & Personality DNA</h2>
            <span className={styles.sectionSubtitle}>Ringkasan profil kepribadian utama dari kuis yang telah diselesaikan</span>
          </div>
        </div>

        <div className={styles.dnaGrid}>
          {/* MBTI Card */}
          <div className={styles.dnaCard}>
            <div className={styles.dnaHeader}>
              <span className={styles.dnaEmoji}>{mbtiResult?.dominant_emoji || '🦉'}</span>
              <div>
                <span className={styles.dnaCategory}>Tipe Kepribadian</span>
                <h3 className={styles.dnaBadgeTitle}>
                  {mbtiResult ? mbtiResult.dominant_result : 'Belum Tes MBTI'}
                </h3>
              </div>
            </div>
            {mbtiResult ? (
              <>
                <p className={styles.dnaTagline}>
                  {QUIZ_CATALOG.mbti?.profiles[mbtiResult.dominant_result]?.tagline || 'Pola unik interaksi dan keputusanmu.'}
                </p>
                {mbtiResult.scores && (
                  <div className={styles.dnaDetails}>
                    {Object.entries(mbtiResult.scores).map(([dim, score]) => (
                      <div key={dim} className={styles.traitItem}>
                        <span>{dim}</span>
                        <div className={styles.traitBarWrap}>
                          <div className={styles.traitBarFill} style={{ width: `${score}%` }}></div>
                        </div>
                        <span style={{ color: 'var(--muted)' }}>{score}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              isOwnProfile && (
                <Link to="/quiz/mbti" className="btn btn-primary" style={{ marginTop: 'auto', fontSize: '0.85rem' }}>
                  Ambil Tes MBTI →
                </Link>
              )
            )}
          </div>

          {/* Attachment Style Card */}
          <div className={styles.dnaCard}>
            <div className={styles.dnaHeader}>
              <span className={styles.dnaEmoji}>{attachmentResult?.dominant_emoji || '💗'}</span>
              <div>
                <span className={styles.dnaCategory}>Gaya Kelekatan Emosional</span>
                <h3 className={styles.dnaBadgeTitle}>
                  {attachmentResult ? attachmentResult.dominant_result : 'Belum Tes Attachment'}
                </h3>
              </div>
            </div>
            {attachmentResult ? (
              <>
                <p className={styles.dnaTagline}>
                  Pola rasa aman dan kenyamanan dalam kedekatan hubungan interpersonal.
                </p>
                {attachmentResult.scores && (
                  <div className={styles.dnaDetails}>
                    {Object.entries(attachmentResult.scores).map(([dim, score]) => (
                      <div key={dim} className={styles.traitItem}>
                        <span>{dim}</span>
                        <div className={styles.traitBarWrap}>
                          <div className={styles.traitBarFill} style={{ width: `${score}%` }}></div>
                        </div>
                        <span style={{ color: 'var(--muted)' }}>{score}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              isOwnProfile && (
                <Link to="/quiz/attachment" className="btn btn-primary" style={{ marginTop: 'auto', fontSize: '0.85rem' }}>
                  Ambil Tes Attachment →
                </Link>
              )
            )}
          </div>

          {/* Big Five Card */}
          <div className={styles.dnaCard}>
            <div className={styles.dnaHeader}>
              <span className={styles.dnaEmoji}>{bigFiveResult?.dominant_emoji || '🧭'}</span>
              <div>
                <span className={styles.dnaCategory}>Spektrum Kepribadian</span>
                <h3 className={styles.dnaBadgeTitle}>
                  {bigFiveResult ? bigFiveResult.dominant_result : 'Belum Tes Big Five'}
                </h3>
              </div>
            </div>
            {bigFiveResult ? (
              <>
                <p className={styles.dnaTagline}>Lima spektrum faktor kepribadian universal.</p>
                {bigFiveResult.scores && (
                  <div className={styles.dnaDetails}>
                    {Object.entries(bigFiveResult.scores).map(([trait, score]) => (
                      <div key={trait} className={styles.traitItem}>
                        <span>{trait}</span>
                        <div className={styles.traitBarWrap}>
                          <div className={styles.traitBarFill} style={{ width: `${score}%` }}></div>
                        </div>
                        <span style={{ color: 'var(--muted)' }}>{score}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              isOwnProfile && (
                <Link to="/quiz/bigfive" className="btn btn-primary" style={{ marginTop: 'auto', fontSize: '0.85rem' }}>
                  Ambil Tes Big Five →
                </Link>
              )
            )}
          </div>

          {/* RIASEC Career Card */}
          <div className={styles.dnaCard}>
            <div className={styles.dnaHeader}>
              <span className={styles.dnaEmoji}>{riasecResult?.dominant_emoji || '🧩'}</span>
              <div>
                <span className={styles.dnaCategory}>Minat Karier</span>
                <h3 className={styles.dnaBadgeTitle}>
                  {riasecResult ? riasecResult.dominant_result : 'Belum Tes Karier'}
                </h3>
              </div>
            </div>
            {riasecResult ? (
              <p className={styles.dnaTagline}>
                Lingkungan kerja dan aktivitas yang paling memicu antusiasme alami.
              </p>
            ) : (
              isOwnProfile && (
                <Link to="/quiz/riasec" className="btn btn-primary" style={{ marginTop: 'auto', fontSize: '0.85rem' }}>
                  Ambil Tes RIASEC →
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Semua Lencana / Riwayat Kuis */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>🏆 Koleksi Lencana Kuis ({quizResults.length})</h2>
            <span className={styles.sectionSubtitle}>Riwayat seluruh kuis yang pernah diselesaikan</span>
          </div>
        </div>

        {quizResults.length > 0 ? (
          <div className={styles.badgesGrid}>
            {quizResults.map((item) => {
              const quizDef = QUIZ_CATALOG[item.quiz_id];
              return (
                <div key={item.id} className={styles.quizHistoryCard}>
                  <div className={styles.historyTop}>
                    <span className={styles.historyEmoji}>{item.dominant_emoji || '✨'}</span>
                    <div>
                      <h4 className={styles.historyTitle}>{quizDef?.title || item.quiz_id}</h4>
                      <span className={styles.historyResult}>{item.dominant_result}</span>
                    </div>
                  </div>
                  <div className={styles.historyFooter}>
                    <span>{new Date(item.taken_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <Link to={`/quiz/${item.quiz_id}`} className={styles.retakeLink}>
                      Ulangi Kuis ↗
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎮</div>
            <h3>Belum Ada Lencana Kuis</h3>
            <p>Selesaikan kuis interaktif untuk membuka lencana kepribadianmu!</p>
            {isOwnProfile && <Link to="/" className="btn btn-primary">Mulai Kuis Pertama</Link>}
          </div>
        )}
      </section>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Edit Profil</h2>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--soft)' }}>Nama Tampilan</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  required
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--soft)' }}>Bio / Status</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="Ceritakan sedikit tentang dirimu..."
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--soft)' }}>Seed Avatar (Ganti teks untuk avatar baru)</label>
                <input
                  type="text"
                  value={editAvatarSeed}
                  onChange={(e) => setEditAvatarSeed(e.target.value)}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
