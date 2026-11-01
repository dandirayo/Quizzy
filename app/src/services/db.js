import { supabase, isSupabaseConfigured } from './supabase';

// Local storage keys for fallback/standalone mode
const LS_USERS_KEY = 'quizzy_db_users';
const LS_RESULTS_KEY = 'quizzy_db_quiz_results';
const LS_FRIENDSHIPS_KEY = 'quizzy_db_friendships';

// Seed initial users for immediate social testing if empty (dendiz7 = cowo, dea33 = cewe)
const SEED_USERS = [
  {
    id: 'seed-user-1',
    username: 'dendiz7',
    display_name: 'Dendi Pratama',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=dendiz7',
    bio: 'Thinker & Strategist. Cowo yang suka logika, teknologi, dan eksplorasi diri ⚡🎮',
    gender: 'male',
    password: 'demo123',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'seed-user-2',
    username: 'dea33',
    display_name: 'Dea Anindita',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=dea33',
    bio: 'Creative & Empathetic Soul. Cewe yang suka kopi, journaling, dan ngobrol mendalam 🌸✨',
    gender: 'female',
    password: 'demo123',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_RESULTS = [
  {
    id: 'res-seed-1',
    user_id: 'seed-user-1',
    quiz_id: 'mbti',
    dominant_result: 'INTJ',
    dominant_emoji: '🏛️',
    scores: { EI: -18, SN: -14, TF: -20, JP: -16 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'res-seed-2',
    user_id: 'seed-user-1',
    quiz_id: 'riasec',
    dominant_result: 'Practical Builder',
    dominant_emoji: '🛠️',
    scores: { R: 92, I: 85, A: 40, S: 45, E: 65, C: 80 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'res-seed-3',
    user_id: 'seed-user-1',
    quiz_id: 'guess',
    dominant_result: 'Master Psikologi 🧠 (6/6)',
    dominant_emoji: '🧠',
    scores: { score: 6, total: 6 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'res-seed-4',
    user_id: 'seed-user-2',
    quiz_id: 'mbti',
    dominant_result: 'ENFP',
    dominant_emoji: '✨',
    scores: { EI: 18, SN: -16, TF: 18, JP: 16 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'res-seed-5',
    user_id: 'seed-user-2',
    quiz_id: 'attachment',
    dominant_result: 'Secure Attachment',
    dominant_emoji: '💗',
    scores: { ANX: 20, AVO: 15 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'res-seed-6',
    user_id: 'seed-user-2',
    quiz_id: 'guess',
    dominant_result: 'Detektif Kepribadian 🕵️ (5/6)',
    dominant_emoji: '🕵️',
    scores: { score: 5, total: 6 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const SEED_FRIENDSHIPS = [
  {
    id: 'friendship-seed-1',
    requester_id: 'seed-user-1',
    addressee_id: 'seed-user-2',
    status: 'accepted',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper to initialize local storage & auto-migrate to dendiz7 and dea33
export function initLocalDb() {
  const currentUsers = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
  
  // Clean up any invalid or legacy users (including phantom 'user')
  const cleanedUsers = currentUsers.filter(u => 
    u && 
    u.username && 
    u.username !== 'user' && 
    u.username !== 'maya_infj' && 
    u.username !== 'budi_builder' && 
    u.username !== 'dina_creative'
  );

  const hasDendiz7 = cleanedUsers.some(u => u.username === 'dendiz7');
  const finalUsers = hasDendiz7 ? cleanedUsers : [...SEED_USERS, ...cleanedUsers];

  // Ensure seed users have password defined
  finalUsers.forEach(u => {
    if ((u.username === 'dendiz7' || u.username === 'dea33') && !u.password) {
      u.password = 'demo123';
    }
  });

  localStorage.setItem(LS_USERS_KEY, JSON.stringify(finalUsers));

  const currentResults = JSON.parse(localStorage.getItem(LS_RESULTS_KEY) || '[]');
  const hasDendizResults = currentResults.some(r => r.user_id === 'seed-user-1' || r.user_id === 'seed-user-2');
  if (!localStorage.getItem(LS_RESULTS_KEY) || !hasDendizResults) {
    const otherResults = currentResults.filter(r => r.user_id !== 'seed-user-1' && r.user_id !== 'seed-user-2' && r.user_id !== 'seed-user-3');
    localStorage.setItem(LS_RESULTS_KEY, JSON.stringify([...SEED_RESULTS, ...otherResults]));
  }

  // Cleanup friendships: remove any record with invalid IDs or ghost references
  const validUserIds = new Set(finalUsers.map(u => u.id));
  const rawFriendships = JSON.parse(localStorage.getItem(LS_FRIENDSHIPS_KEY) || '[]');
  const validFriendships = rawFriendships.filter(f => 
    f && 
    f.requester_id && 
    f.addressee_id && 
    validUserIds.has(f.requester_id) && 
    validUserIds.has(f.addressee_id)
  );

  if (validFriendships.length === 0 && !localStorage.getItem(LS_FRIENDSHIPS_KEY)) {
    localStorage.setItem(LS_FRIENDSHIPS_KEY, JSON.stringify(SEED_FRIENDSHIPS));
  } else {
    localStorage.setItem(LS_FRIENDSHIPS_KEY, JSON.stringify(validFriendships));
  }
}

// ----------------------------------------------------
// USER / PROFILE METHODS
// ----------------------------------------------------

export async function getUserProfile(identifier) {
  if (isSupabaseConfigured) {
    const query = identifier.includes('-') && identifier.length > 20
      ? supabase.from('profiles').select('*').eq('id', identifier).single()
      : supabase.from('profiles').select('*').eq('username', identifier).single();
    
    const { data, error } = await query;
    if (error) return null;
    return data;
  }

  // Local fallback
  initLocalDb();
  const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
  return users.find(u => u.id === identifier || u.username.toLowerCase() === identifier.toLowerCase()) || null;
}

export async function updateUserProfile(userId, updates) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  initLocalDb();
  const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
    return users[idx];
  }
  return null;
}

export async function getAllUsers(currentUserId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, gender')
      .neq('id', currentUserId)
      .limit(50);
    if (error) return [];
    return data || [];
  }

  initLocalDb();
  const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
  return users.filter(u => 
    u && 
    u.id !== currentUserId && 
    u.username && 
    u.username !== 'user'
  );
}

export async function searchUsers(queryStr, currentUserId) {
  if (!queryStr || queryStr.trim().length === 0) {
    return getAllUsers(currentUserId);
  }
  const q = queryStr.trim().toLowerCase().replace('@', '');

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, gender')
      .neq('id', currentUserId)
      .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
      .limit(25);
    if (error) return [];
    return data || [];
  }

  initLocalDb();
  const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
  return users.filter(u => 
    u && 
    u.id !== currentUserId && 
    u.username && 
    u.username !== 'user' && 
    (
      (u.username && u.username.toLowerCase().includes(q)) || 
      (u.display_name && u.display_name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    )
  );
}

// ----------------------------------------------------
// QUIZ RESULTS METHODS
// ----------------------------------------------------

export async function getUserQuizResults(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });
    if (error) return [];
    
    // Deduplicate by quiz_id
    const seen = new Set();
    return (data || []).filter(r => {
      if (seen.has(r.quiz_id)) return false;
      seen.add(r.quiz_id);
      return true;
    });
  }

  initLocalDb();
  const allResults = JSON.parse(localStorage.getItem(LS_RESULTS_KEY) || '[]');
  const userResults = allResults
    .filter(r => r.user_id === userId)
    .sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at));

  // Deduplicate by quiz_id (keep latest)
  const seen = new Set();
  const uniqueUserResults = [];
  for (const r of userResults) {
    if (!seen.has(r.quiz_id)) {
      seen.add(r.quiz_id);
      uniqueUserResults.push(r);
    }
  }

  // Auto-clean storage if duplicates existed
  if (uniqueUserResults.length < userResults.length) {
    const otherUsersResults = allResults.filter(r => r.user_id !== userId);
    localStorage.setItem(LS_RESULTS_KEY, JSON.stringify([...uniqueUserResults, ...otherUsersResults]));
  }

  return uniqueUserResults;
}

export async function saveUserQuizResult(userId, resultData) {
  const newRecord = {
    id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    user_id: userId,
    quiz_id: resultData.quizId,
    dominant_result: resultData.dominantResult || resultData.title || '',
    dominant_emoji: resultData.dominantEmoji || resultData.emoji || '✨',
    scores: resultData.scores || {},
    is_public: resultData.isPublic !== undefined ? resultData.isPublic : true,
    taken_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([newRecord])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  initLocalDb();
  let results = JSON.parse(localStorage.getItem(LS_RESULTS_KEY) || '[]');

  // Check if user already has a result for this quiz_id -> UPDATE (upsert) to prevent doubles
  const existingIdx = results.findIndex(r => r.user_id === userId && r.quiz_id === resultData.quizId);
  if (existingIdx !== -1) {
    results[existingIdx] = {
      ...results[existingIdx],
      dominant_result: newRecord.dominant_result,
      dominant_emoji: newRecord.dominant_emoji,
      scores: newRecord.scores,
      taken_at: newRecord.taken_at
    };
    localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(results));
    return results[existingIdx];
  } else {
    results.unshift(newRecord);
    localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(results));
    return newRecord;
  }
}

// ----------------------------------------------------
// FRIENDSHIPS METHODS
// ----------------------------------------------------

export async function getFriendships(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        status,
        created_at,
        requester:requester_id (id, username, display_name, avatar_url, bio),
        addressee:addressee_id (id, username, display_name, avatar_url, bio)
      `)
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
    if (error) return { friends: [], incoming: [], outgoing: [] };
    
    return formatFriendships(data || [], userId);
  }

  initLocalDb();
  const rawFriendships = JSON.parse(localStorage.getItem(LS_FRIENDSHIPS_KEY) || '[]');
  const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');

  // Only keep friendships where both requester and addressee exist and are not ghost users
  const populated = [];
  rawFriendships.forEach(f => {
    const requester = users.find(u => u.id === f.requester_id);
    const addressee = users.find(u => u.id === f.addressee_id);
    if (requester && addressee && requester.username !== 'user' && addressee.username !== 'user') {
      populated.push({
        ...f,
        requester,
        addressee
      });
    }
  });

  return formatFriendships(populated, userId);
}

function formatFriendships(list, currentUserId) {
  const friends = [];
  const incoming = [];
  const outgoing = [];

  list.forEach(f => {
    const isRequester = (f.requester?.id || f.requester_id) === currentUserId;
    const isAddressee = (f.addressee?.id || f.addressee_id) === currentUserId;

    // Must be either requester or addressee of this friendship
    if (!isRequester && !isAddressee) return;

    const friend = isRequester ? f.addressee : f.requester;
    if (!friend || !friend.id || !friend.username || friend.username === 'user') return;

    if (f.status === 'accepted') {
      friends.push({ friendshipId: f.id, ...friend });
    } else if (f.status === 'pending') {
      if (isRequester) {
        outgoing.push({ friendshipId: f.id, ...friend });
      } else {
        incoming.push({ friendshipId: f.id, ...friend });
      }
    }
  });

  return { friends, incoming, outgoing };
}

export async function sendFriendRequest(requesterId, addresseeId) {
  if (requesterId === addresseeId) throw new Error('Tidak bisa menambahkan diri sendiri');

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('friendships')
      .insert([{ requester_id: requesterId, addressee_id: addresseeId, status: 'pending' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  initLocalDb();
  const friendships = JSON.parse(localStorage.getItem(LS_FRIENDSHIPS_KEY) || '[]');
  
  // Check if exists
  const existing = friendships.find(f => 
    (f.requester_id === requesterId && f.addressee_id === addresseeId) ||
    (f.requester_id === addresseeId && f.addressee_id === requesterId)
  );
  if (existing) {
    if (existing.status === 'accepted') throw new Error('Sudah berteman');
    throw new Error('Permintaan pertemanan sudah ada');
  }

  const newFriendship = {
    id: `friendship-${Date.now()}`,
    requester_id: requesterId,
    addressee_id: addresseeId,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  friendships.push(newFriendship);
  localStorage.setItem(LS_FRIENDSHIPS_KEY, JSON.stringify(friendships));
  return newFriendship;
}

export async function respondFriendRequest(friendshipId, status) {
  // status: 'accepted' | 'declined'
  if (isSupabaseConfigured) {
    if (status === 'declined') {
      const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);
      if (error) throw error;
      return true;
    }
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', friendshipId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  initLocalDb();
  let friendships = JSON.parse(localStorage.getItem(LS_FRIENDSHIPS_KEY) || '[]');
  const idx = friendships.findIndex(f => f.id === friendshipId);
  if (idx !== -1) {
    if (status === 'declined') {
      friendships.splice(idx, 1);
    } else {
      friendships[idx].status = 'accepted';
      friendships[idx].updated_at = new Date().toISOString();
    }
    localStorage.setItem(LS_FRIENDSHIPS_KEY, JSON.stringify(friendships));
    return true;
  }
  return false;
}

export async function removeFriend(friendshipId) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);
    if (error) throw error;
    return true;
  }

  initLocalDb();
  let friendships = JSON.parse(localStorage.getItem(LS_FRIENDSHIPS_KEY) || '[]');
  friendships = friendships.filter(f => f.id !== friendshipId);
  localStorage.setItem(LS_FRIENDSHIPS_KEY, JSON.stringify(friendships));
  return true;
}
