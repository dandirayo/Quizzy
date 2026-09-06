import { supabase, isSupabaseConfigured } from './supabase';

// Local storage keys for fallback/standalone mode
const LS_USERS_KEY = 'quizzy_db_users';
const LS_RESULTS_KEY = 'quizzy_db_quiz_results';
const LS_FRIENDSHIPS_KEY = 'quizzy_db_friendships';

// Seed initial users for immediate social testing if empty
const SEED_USERS = [
  {
    id: 'seed-user-1',
    username: 'maya_infj',
    display_name: 'Maya Putri',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=maya',
    bio: 'Advocate (INFJ). Suka obrolan mendalam di kedai kopi sunyi. ☕🌿',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'seed-user-2',
    username: 'budi_builder',
    display_name: 'Budi Santoso',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=budi',
    bio: 'Practical Builder (RIASEC: R). Penggemar teknologi, kopi, dan hal konkret.',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'seed-user-3',
    username: 'dina_creative',
    display_name: 'Dina Pratiwi',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=dina',
    bio: 'Growth Mindset & Creative Explorer. Selalu ingin belajar hal baru! 🎨✨',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_RESULTS = [
  {
    id: 'res-seed-1',
    user_id: 'seed-user-1',
    quiz_id: 'mbti',
    dominant_result: 'INFJ',
    dominant_emoji: '🦉',
    scores: { EI: -14, SN: 16, TF: 18, JP: 12 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'res-seed-2',
    user_id: 'seed-user-1',
    quiz_id: 'attachment',
    dominant_result: 'Secure Attachment',
    dominant_emoji: '💗',
    scores: { ANX: 25, AVO: 20 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'res-seed-3',
    user_id: 'seed-user-2',
    quiz_id: 'riasec',
    dominant_result: 'Practical Builder',
    dominant_emoji: '🛠️',
    scores: { R: 92, I: 75, A: 40, S: 45, E: 60, C: 80 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'res-seed-4',
    user_id: 'seed-user-3',
    quiz_id: 'growth',
    dominant_result: 'Brave Beginner',
    dominant_emoji: '🧗',
    scores: { CH: 95, FB: 85, ER: 88, PR: 90 },
    is_public: true,
    taken_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// Helper to initialize local storage
function initLocalDb() {
  if (!localStorage.getItem(LS_USERS_KEY)) {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(LS_RESULTS_KEY)) {
    localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(SEED_RESULTS));
  }
  if (!localStorage.getItem(LS_FRIENDSHIPS_KEY)) {
    localStorage.setItem(LS_FRIENDSHIPS_KEY, JSON.stringify([]));
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

export async function searchUsers(queryStr, currentUserId) {
  if (!queryStr || queryStr.trim().length === 0) return [];
  const q = queryStr.trim().toLowerCase().replace('@', '');

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio')
      .neq('id', currentUserId)
      .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
      .limit(15);
    if (error) return [];
    return data || [];
  }

  initLocalDb();
  const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
  return users.filter(u => 
    u.id !== currentUserId && 
    (u.username.toLowerCase().includes(q) || u.display_name.toLowerCase().includes(q))
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
    return data || [];
  }

  initLocalDb();
  const results = JSON.parse(localStorage.getItem(LS_RESULTS_KEY) || '[]');
  return results.filter(r => r.user_id === userId).sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at));
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
  const results = JSON.parse(localStorage.getItem(LS_RESULTS_KEY) || '[]');
  results.unshift(newRecord);
  localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(results));
  return newRecord;
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

  const populated = rawFriendships.map(f => ({
    ...f,
    requester: users.find(u => u.id === f.requester_id) || { id: f.requester_id, username: 'user' },
    addressee: users.find(u => u.id === f.addressee_id) || { id: f.addressee_id, username: 'user' }
  }));

  return formatFriendships(populated, userId);
}

function formatFriendships(list, currentUserId) {
  const friends = [];
  const incoming = [];
  const outgoing = [];

  list.forEach(f => {
    const isRequester = (f.requester?.id || f.requester_id) === currentUserId;
    const friend = isRequester ? f.addressee : f.requester;

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
