import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFriendships, sendFriendRequest, respondFriendRequest, removeFriend, searchUsers, getAllUsers, getStorageMode } from '../services/db';
import styles from './FriendsPage.module.css';

const FriendsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const storageMode = getStorageMode();

  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'incoming', 'outgoing'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [friendships, setFriendships] = useState({ friends: [], incoming: [], outgoing: [] });
  const [msg, setMsg] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [publicMembers, setPublicMembers] = useState([]);

  const loadData = async () => {
    if (!user) return;
    try {
      const data = await getFriendships(user.id);
      setFriendships(data);

      // Load all other registered community members
      const allCommunity = await getAllUsers(user.id);
      const notConnected = allCommunity.filter(u => 
        !data.friends.some(f => f.id === u.id) &&
        !data.incoming.some(f => f.id === u.id) &&
        !data.outgoing.some(f => f.id === u.id)
      );
      setSuggestions(notConnected);
    } catch (err) {
      console.error('Failed to load friendships', err);
    }
  };

  // For guests: load registered community members dynamically
  useEffect(() => {
    if (!isAuthenticated) {
      getAllUsers(null).then(users => {
        setPublicMembers(users.slice(0, 6));
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    }
  }, [isAuthenticated, user]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchUsers(searchQuery, user?.id);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (targetId) => {
    try {
      await sendFriendRequest(user.id, targetId);
      setMsg('Permintaan pertemanan berhasil dikirim! 🤝');
      setTimeout(() => setMsg(''), 3000);
      loadData();
      setSearchResults(prev => prev.map(u => u.id === targetId ? { ...u, isPending: true } : u));
    } catch (err) {
      setMsg('⚠️ ' + (err.message || 'Gagal mengirim permintaan'));
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleRespondRequest = async (friendshipId, status) => {
    try {
      await respondFriendRequest(friendshipId, status);
      setMsg(status === 'accepted' ? 'Permintaan pertemanan diterima! 🎉' : 'Permintaan ditolak.');
      setTimeout(() => setMsg(''), 3000);
      loadData();
    } catch (err) {
      setMsg('⚠️ Gagal memproses permintaan: ' + err.message);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    try {
      await removeFriend(friendshipId);
      setMsg('Teman berhasil dihapus.');
      setTimeout(() => setMsg(''), 3000);
      loadData();
    } catch (err) {
      setMsg('⚠️ Gagal menghapus teman: ' + err.message);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={`card ${styles.authPrompt} fade-up`}>
          <div className={styles.promptIcon}>🤝</div>
          <h2 className={styles.promptTitle}>Teman & Komunitas di Quizzy</h2>
          <p className={styles.promptDesc}>
            Masuk atau daftar untuk mencari teman, saling terhubung, melihat hasil kuis mereka, dan membandingkan kecocokan kepribadian kalian!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary">Masuk Sekarang</Link>
            <Link to="/register" className="btn btn-secondary">Daftar Akun</Link>
          </div>
        </div>

        {/* Dynamic preview of actual registered community members */}
        {publicMembers.length > 0 ? (
          <section className={styles.suggestionsSection} style={{ marginTop: '2.5rem', width: '100%', maxWidth: '720px', marginInline: 'auto' }}>
            <h3 className={styles.suggestionsTitle}>👀 Profil Anggota Komunitas Terdaftar</h3>
            <div className={styles.friendsGrid}>
              {publicMembers.map((member) => (
                <div key={member.id} className={styles.friendCard}>
                  <div className={styles.friendCardHeader}>
                    <img
                      src={member.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.username}`}
                      alt={member.display_name}
                      className={styles.friendAvatar}
                      loading="lazy"
                    />
                    <div>
                      <h3 className={styles.displayName}>{member.display_name}</h3>
                      <span className={styles.username}>@{member.username}</span>
                    </div>
                  </div>
                  <p className={styles.friendBio}>{member.bio || 'Penggemar refleksi diri Quizzy 🌱'}</p>
                  <div className={styles.friendActions}>
                    <Link to={`/profile/${member.username}`} className="btn btn-secondary" style={{ flex: 1 }}>
                      Lihat Profil 📇
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            ✨ Jadilah anggota pertama yang mendaftar dan membagikan profil kepribadianmu di Quizzy!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Teman & Komunitas</h1>
        <p className={styles.subtitle}>
          Saling add, bagikan kartu kepribadian, dan bandingkan hasil kuis bersama teman!
        </p>
      </header>

      {/* Storage Mode Information Banner */}
      {!storageMode.isCloud && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          fontSize: '0.85rem',
          color: '#93c5fd',
          marginBottom: '1.5rem',
          textAlign: 'center',
          lineHeight: '1.45'
        }}>
          💾 <strong>Mode Penyimpanan Browser:</strong> Akun dan hasil kuis tersimpan di browser perangkat ini. Untuk menghubungkan antar teman di berbagai perangkat secara online, Anda dapat menyambungkan Supabase.
        </div>
      )}

      {msg && (
        <div className="fade-up" style={{
          padding: '0.75rem 1.25rem',
          background: msg.startsWith('⚠️') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          border: msg.startsWith('⚠️') ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '10px',
          color: msg.startsWith('⚠️') ? '#f87171' : '#4ade80',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {msg}
        </div>
      )}

      {/* Search Input */}
      <form onSubmit={handleSearch} className={styles.searchSection}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value.trim()) {
              setSearchResults([]);
              setHasSearched(false);
            }
          }}
          placeholder="Cari username atau nama teman..."
          className={styles.searchInput}
        />
        <button type="submit" className={`btn btn-primary ${styles.searchBtn}`} disabled={isSearching}>
          {isSearching ? 'Mencari...' : 'Cari Teman 🔍'}
        </button>
      </form>

      {/* Search Results Display */}
      {hasSearched && searchResults.length === 0 && (
        <div className={`${styles.searchResultsBox} fade-up`} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>🔍</div>
          <div>Tidak ditemukan pengguna dengan kata kunci "<strong>{searchQuery}</strong>".</div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Coba cari nama tampilan atau username yang sesuai.</div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className={`${styles.searchResultsBox} fade-up`}>
          <div className={styles.resultsTitle}>Hasil Pencarian ({searchResults.length})</div>
          {searchResults.map((target) => {
            const isFriend = friendships.friends.some(f => f.id === target.id);
            const isOutgoing = friendships.outgoing.some(f => f.id === target.id) || target.isPending;
            const isIncoming = friendships.incoming.some(f => f.id === target.id);

            return (
              <div key={target.id} className={styles.userResultItem}>
                <div className={styles.userInfo}>
                  <img
                    src={target.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${target.username}`}
                    alt={target.display_name}
                    className={styles.avatar}
                    loading="lazy"
                  />
                  <div className={styles.userNames}>
                    <span className={styles.displayName}>{target.display_name}</span>
                    <span className={styles.username}>@{target.username}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Link to={`/profile/${target.username}`} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    Lihat Profil
                  </Link>

                  {isFriend ? (
                    <span className={styles.friendStatusBadge}>✓ Teman</span>
                  ) : isOutgoing ? (
                    <span className={styles.pendingBadge}>⏳ Menunggu Konfirmasi</span>
                  ) : isIncoming ? (
                    <button
                      type="button"
                      onClick={() => {
                        const inc = friendships.incoming.find(f => f.id === target.id);
                        if (inc) handleRespondRequest(inc.friendshipId, 'accepted');
                      }}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      Terima Permintaan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendRequest(target.id)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      + Tambah Teman
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'friends' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Teman Saya
          <span className={styles.tabBadge}>{friendships.friends.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'incoming' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          Permintaan Masuk
          {friendships.incoming.length > 0 && (
            <span className={`${styles.tabBadge} ${styles.alertBadge}`}>
              {friendships.incoming.length}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'outgoing' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('outgoing')}
        >
          Terkirim
          <span className={styles.tabBadge} style={{ background: 'var(--card2)' }}>
            {friendships.outgoing.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Friends List */}
      {activeTab === 'friends' && (
        <>
          {friendships.friends.length > 0 ? (
            <div className={styles.friendsGrid}>
              {friendships.friends.map((friend) => (
                <div key={friend.id} className={`${styles.friendCard} fade-up`}>
                  <div className={styles.friendCardHeader}>
                    <img
                      src={friend.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${friend.username}`}
                      alt={friend.display_name}
                      className={styles.friendAvatar}
                      loading="lazy"
                    />
                    <div>
                      <h3 className={styles.displayName}>{friend.display_name}</h3>
                      <span className={styles.username}>@{friend.username}</span>
                    </div>
                  </div>

                  <p className={styles.friendBio}>{friend.bio || 'Penggemar refleksi diri Quizzy'}</p>

                  <div className={styles.friendActions}>
                    <Link to={`/profile/${friend.username}`} className="btn btn-secondary">
                      Profil 📇
                    </Link>
                    <Link to={`/compare/${friend.username}`} className="btn btn-primary">
                      Bandingkan ⚡
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemoveFriend(friend.friendshipId)}
                      className="btn btn-secondary"
                      style={{ color: '#f87171' }}
                      title="Hapus teman"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🤝</div>
              <h3>Belum Ada Teman</h3>
              <p>Cari teman di atas atau tambahkan rekomendasi pengguna lain di bawah!</p>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Incoming Requests */}
      {activeTab === 'incoming' && (
        <div className={styles.requestsList}>
          {friendships.incoming.length > 0 ? (
            friendships.incoming.map((req) => (
              <div key={req.friendshipId} className={`${styles.requestItem} fade-up`}>
                <div className={styles.userInfo}>
                  <img
                    src={req.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.username}`}
                    alt={req.display_name}
                    className={styles.avatar}
                    loading="lazy"
                  />
                  <div className={styles.userNames}>
                    <span className={styles.displayName}>{req.display_name}</span>
                    <span className={styles.username}>@{req.username}</span>
                  </div>
                </div>

                <div className={styles.requestActions}>
                  <button
                    type="button"
                    onClick={() => handleRespondRequest(req.friendshipId, 'accepted')}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Terima
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRespondRequest(req.friendshipId, 'declined')}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📬</div>
              <h3>Kotak Masuk Bersih</h3>
              <p>Tidak ada permintaan pertemanan baru yang sedang menunggu persetujuanmu.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Outgoing Requests */}
      {activeTab === 'outgoing' && (
        <div className={styles.requestsList}>
          {friendships.outgoing.length > 0 ? (
            friendships.outgoing.map((req) => (
              <div key={req.friendshipId} className={`${styles.requestItem} fade-up`}>
                <div className={styles.userInfo}>
                  <img
                    src={req.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.username}`}
                    alt={req.display_name}
                    className={styles.avatar}
                    loading="lazy"
                  />
                  <div className={styles.userNames}>
                    <span className={styles.displayName}>{req.display_name}</span>
                    <span className={styles.username}>@{req.username}</span>
                  </div>
                </div>

                <div className={styles.requestActions}>
                  <button
                    type="button"
                    onClick={() => handleRemoveFriend(req.friendshipId)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Batalkan Permintaan
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📤</div>
              <h3>Tidak Ada Permintaan Terkirim</h3>
              <p>Kamu belum memiliki permintaan pertemanan yang sedang menunggu konfirmasi.</p>
            </div>
          )}
        </div>
      )}

      {/* Community Recommendations / Suggestions */}
      {suggestions.length > 0 && (
        <section className={styles.suggestionsSection}>
          <h2 className={styles.suggestionsTitle}>✨ Pengguna Terdaftar Lain di Quizzy ({suggestions.length})</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '-0.5rem', marginBottom: '1.25rem' }}>
            Temukan sesama penjelajah Quizzy, cek profil kartu kepribadian mereka, dan saling terhubung!
          </p>
          <div className={styles.friendsGrid}>
            {suggestions.map((member) => (
              <div key={member.id} className={styles.friendCard}>
                <div className={styles.friendCardHeader}>
                  <img
                    src={member.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.username}`}
                    alt={member.display_name}
                    className={styles.friendAvatar}
                    loading="lazy"
                  />
                  <div>
                    <h3 className={styles.displayName}>{member.display_name}</h3>
                    <span className={styles.username}>@{member.username}</span>
                  </div>
                </div>
                <p className={styles.friendBio}>{member.bio || 'Penggemar refleksi diri Quizzy 🌱'}</p>
                <div className={styles.friendActions}>
                  <Link to={`/profile/${member.username}`} className="btn btn-secondary" style={{ flex: 1 }}>
                    Profil 📇
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleSendRequest(member.id)}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    ➕ Tambah
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FriendsPage;
