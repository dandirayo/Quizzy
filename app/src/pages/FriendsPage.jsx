import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFriendships, sendFriendRequest, respondFriendRequest, removeFriend, searchUsers } from '../services/db';
import styles from './FriendsPage.module.css';

const FriendsPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'incoming', 'outgoing'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [friendships, setFriendships] = useState({ friends: [], incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Suggestions for community members to add
  const [suggestions, setSuggestions] = useState([]);

  const loadData = async () => {
    if (!user) return;
    try {
      const data = await getFriendships(user.id);
      setFriendships(data);

      // Load sample users for community suggestions
      const allFound = await searchUsers('a', user.id);
      const notFriends = allFound.filter(u => 
        !data.friends.some(f => f.id === u.id) &&
        !data.incoming.some(f => f.id === u.id) &&
        !data.outgoing.some(f => f.id === u.id)
      );
      setSuggestions(notFriends.slice(0, 4));
    } catch (err) {
      console.error('Failed to load friendships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery, user.id);
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
      // Remove from search results or mark as pending
      setSearchResults(prev => prev.map(u => u.id === targetId ? { ...u, isPending: true } : u));
    } catch (err) {
      alert(err.message || 'Gagal mengirim permintaan');
    }
  };

  const handleRespondRequest = async (friendshipId, status) => {
    try {
      await respondFriendRequest(friendshipId, status);
      setMsg(status === 'accepted' ? 'Permintaan pertemanan diterima! 🎉' : 'Permintaan ditolak.');
      setTimeout(() => setMsg(''), 3000);
      loadData();
    } catch (err) {
      alert('Gagal memproses permintaan: ' + err.message);
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    if (!window.confirm('Yakin ingin menghapus teman ini?')) return;
    try {
      await removeFriend(friendshipId);
      setMsg('Teman berhasil dihapus.');
      setTimeout(() => setMsg(''), 3000);
      loadData();
    } catch (err) {
      alert('Gagal menghapus teman: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={`card ${styles.authPrompt} fade-up`}>
          <div className={styles.promptIcon}>🤝</div>
          <h2 className={styles.promptTitle}>Teman di Quizzy</h2>
          <p className={styles.promptDesc}>
            Masuk atau daftar untuk mencari teman, saling terhubung, melihat hasil kuis mereka, dan membandingkan kecocokan kepribadian kalian!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-primary">Masuk Sekarang</Link>
            <Link to="/register" className="btn btn-secondary">Daftar Akun</Link>
          </div>
        </div>
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

      {/* Search Input */}
      <form onSubmit={handleSearch} className={styles.searchSection}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari username (contoh: maya, budi)..."
          className={styles.searchInput}
        />
        <button type="submit" className={`btn btn-primary ${styles.searchBtn}`} disabled={isSearching}>
          {isSearching ? 'Mencari...' : 'Cari Teman 🔍'}
        </button>
      </form>

      {/* Search Results Display */}
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
                    <span style={{ fontSize: '0.8rem', color: '#4ade80' }}>✓ Berteman</span>
                  ) : isOutgoing ? (
                    <span style={{ fontSize: '0.8rem', color: '#eab308' }}>⏳ Terkirim</span>
                  ) : isIncoming ? (
                    <button
                      type="button"
                      onClick={() => handleRespondRequest(friendships.incoming.find(f => f.id === target.id)?.friendshipId, 'accepted')}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      Terima
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendRequest(target.id)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      ➕ Tambah
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'friends' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Daftar Teman
          <span className={styles.tabBadge}>{friendships.friends.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'incoming' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          Permintaan Masuk
          {friendships.incoming.length > 0 && (
            <span className={styles.tabBadge} style={{ background: '#ec4899' }}>
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
              <p>Cari teman menggunakan kolom pencarian di atas atau tambahkan anggota rekomendasi di bawah!</p>
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
                  >
                    ✓ Terima
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRespondRequest(req.friendshipId, 'declined')}
                    className="btn btn-secondary"
                  >
                    ✕ Tolak
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📬</div>
              <h3>Tidak Ada Permintaan Masuk</h3>
              <p>Saat seseorang mengirimimu permintaan pertemanan, permintaan itu akan muncul di sini.</p>
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
          <h2 className={styles.suggestionsTitle}>✨ Anggota Komunitas yang Mungkin Kamu Kenal</h2>
          <div className={styles.friendsGrid}>
            {suggestions.map((member) => (
              <div key={member.id} className={styles.friendCard}>
                <div className={styles.friendCardHeader}>
                  <img
                    src={member.avatar_url}
                    alt={member.display_name}
                    className={styles.friendAvatar}
                  />
                  <div>
                    <h3 className={styles.displayName}>{member.display_name}</h3>
                    <span className={styles.username}>@{member.username}</span>
                  </div>
                </div>
                <p className={styles.friendBio}>{member.bio}</p>
                <div className={styles.friendActions}>
                  <Link to={`/profile/${member.username}`} className="btn btn-secondary">
                    Lihat Profil
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleSendRequest(member.id)}
                    className="btn btn-primary"
                  >
                    ➕ Tambah Teman
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
