import { supabase, isSupabaseConfigured } from './supabase';
import { safeJsonParse, sanitizeUser, sanitizeSearchQuery } from '../utils/helpers';

// Local storage keys for fallback/standalone mode
const LS_USERS_KEY = 'quizzy_db_users';
const LS_RESULTS_KEY = 'quizzy_db_quiz_results';
const LS_FRIENDSHIPS_KEY = 'quizzy_db_friendships';

/**
 * Returns current storage mode info
 */
export function getStorageMode() {
  return {
    isCloud: isSupabaseConfigured,
    label: isSupabaseConfigured ? 'Supabase Cloud' : 'Mode Lokal (Browser)',
    description: isSupabaseConfigured
      ? 'Terhubung dengan database cloud Supabase.'
      : 'Tersimpan lokal di browser perangkat ini.'
  };
}

/**
 * Helper to clean corrupted entries and initialize local storage
 */
export function initLocalDb() {
  const currentUsers = safeJsonParse(localStorage.getItem(LS_USERS_KEY), []);
  
  // Clean up any invalid, ghost, or legacy seed users
  const cleanedUsers = currentUsers.filter(u => 
    u && 
    u.id &&
    u.username && 
    u.username !== 'user' && 
    u.username !== 'dendiz7' && 
    u.username !== 'dea33' && 
    u.username !== 'maya_infj' && 
    u.username !== 'budi_builder' && 
    u.username !== 'dina_creative' &&
    !String(u.id).startsWith('seed-')
  );

  localStorage.setItem(LS_USERS_KEY, JSON.stringify(cleanedUsers));

  // Clean corrupted quiz results
  const currentResults = safeJsonParse(localStorage.getItem(LS_RESULTS_KEY), []);
  const validUserIds = new Set(cleanedUsers.map(u => u.id));
  const validResults = currentResults.filter(r => 
    r && 
    r.user_id && 
    !String(r.user_id).startsWith('seed-') &&
    validUserIds.has(r.user_id)
  );
  localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(validResults));

  // Clean friendships: remove any record with invalid IDs, ghost references, or seeds
  const rawFriendships = safeJsonParse(localStorage.getItem(LS_FRIENDSHIPS_KEY), []);
  const validFriendships = rawFriendships.filter(f => 
    f && 
    f.requester_id && 
    f.addressee_id && 
    !String(f.requester_id).startsWith('seed-') &&
    !String(f.addressee_id).startsWith('seed-') &&
    validUserIds.has(f.requester_id) && 
    validUserIds.has(f.addressee_id)
  );
  localStorage.setItem(LS_FRIENDSHIPS_KEY, JSON.stringify(validFriendships));
}

// ----------------------------------------------------
// USER / PROFILE METHODS
// ----------------------------------------------------

export async function getUserProfile(identifier) {
  if (!identifier) return null;

  if (isSupabaseConfigured) {
    const isUuid = identifier.includes('-') && identifier.length >= 32;
    const query = isUuid
      ? supabase.from('profiles').select('id, username, display_name, avatar_url, bio, gender, created_at').eq('id', identifier).single()
      : supabase.from('profiles').select('id, username, display_name, avatar_url, bio, gender, created_at').eq('username', identifier.toLowerCase()).single();
    
    const { data, error } = await query;
    if (error) return null;
    return sanitizeUser(data);
  }

  // Local fallback
  initLocalDb();
  const users = safeJsonParse(localStorage.getItem(LS_USERS_KEY), []);
  const target = identifier.toLowerCase().replace(/^@/, '');
  const found = users.find(u => 
    u.id === identifier || 
    (u.username && u.username.toLowerCase() === target)
  );
  return sanitizeUser(found);
}

export async function updateUserProfile(userId, updates) {
  if (!userId) return null;

  // Filter out forbidden fields from direct client updates
  const { password, id, ...allowedUpdates } = updates;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...allowedUpdates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('id, username, display_name, avatar_url, bio, gender, created_at')
      .single();
    if (error) throw error;
    return sanitizeUser(data);
  }

  initLocalDb();
  const users = safeJsonParse(localStorage.getItem(LS_USERS_KEY), []);
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...allowedUpdates, updated_at: new Date().toISOString() };
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
    return sanitizeUser(users[idx]);
  }
  return null;
}

export async function getAllUsers(currentUserId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, gender')
      .neq('id', currentUserId || '00000000-0000-0000-0000-000000000000')
      .limit(50);
    if (error) return [];
    return (data || []).map(u => sanitizeUser(u));
  }

  initLocalDb();
  const users = safeJsonParse(localStorage.getItem(LS_USERS_KEY), []);
  return users
    .filter(u => 
      u && 
      u.id !== currentUserId && 
      u.username && 
      u.username !== 'user'
    )
    .map(u => sanitizeUser(u));
}

export async function searchUsers(queryStr, currentUserId) {
  const cleanQ = sanitizeSearchQuery(queryStr).toLowerCase();
  if (!cleanQ) {
    return getAllUsers(currentUserId);
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, gender')
      .neq('id', currentUserId || '00000000-0000-0000-0000-000000000000')
      .or(`username.ilike.%${cleanQ}%,display_name.ilike.%${cleanQ}%`)
      .limit(25);
    if (error) return [];
    return (data || []).map(u => sanitizeUser(u));
  }

  initLocalDb();
  const users = safeJsonParse(localStorage.getItem(LS_USERS_KEY), []);
  return users
    .filter(u => 
      u && 
      u.id !== currentUserId && 
      u.username && 
      u.username !== 'user' && 
      (
        (u.username && u.username.toLowerCase().includes(cleanQ)) || 
        (u.display_name && u.display_name.toLowerCase().includes(cleanQ)) ||
        (u.email && u.email.toLowerCase().includes(cleanQ))
      )
    )
    .map(u => sanitizeUser(u));
}

// ----------------------------------------------------
// QUIZ RESULTS METHODS
// ----------------------------------------------------

export async function getUserQuizResults(userId, viewerUserId = null) {
  if (!userId) return [];

  const isOwner = !viewerUserId || viewerUserId === userId;

  if (isSupabaseConfigured) {
    let query = supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });

    if (!isOwner) {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;
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
  const allResults = safeJsonParse(localStorage.getItem(LS_RESULTS_KEY), []);
  const userResults = allResults
    .filter(r => {
      if (r.user_id !== userId) return false;
      if (!isOwner && r.is_public === false) return false;
      return true;
    })
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

  return uniqueUserResults;
}

export async function saveUserQuizResult(userId, resultData) {
  if (!userId || !resultData?.quizId) {
    throw new Error('User ID and Quiz ID are required to save results.');
  }

  // Generate valid UUID for database compatibility
  const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
    ? crypto.randomUUID() 
    : `res-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const newRecord = {
    id: newId,
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
      .upsert(
        {
          user_id: userId,
          quiz_id: resultData.quizId,
          dominant_result: newRecord.dominant_result,
          dominant_emoji: newRecord.dominant_emoji,
          scores: newRecord.scores,
          is_public: newRecord.is_public,
          taken_at: newRecord.taken_at
        },
        { onConflict: 'user_id, quiz_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  initLocalDb();
  let results = safeJsonParse(localStorage.getItem(LS_RESULTS_KEY), []);

  // Upsert in local storage
  const existingIdx = results.findIndex(r => r.user_id === userId && r.quiz_id === resultData.quizId);
  if (existingIdx !== -1) {
    results[existingIdx] = {
      ...results[existingIdx],
      dominant_result: newRecord.dominant_result,
      dominant_emoji: newRecord.dominant_emoji,
      scores: newRecord.scores,
      is_public: newRecord.is_public,
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
  if (!userId) return { friends: [], incoming: [], outgoing: [] };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        status,
        created_at,
        requester:requester_id (id, username, display_name, avatar_url, bio, gender),
        addressee:addressee_id (id, username, display_name, avatar_url, bio, gender)
      `)
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
    if (error) return { friends: [], incoming: [], outgoing: [] };
    
    return formatFriendships(data || [], userId);
  }

  initLocalDb();
  const rawFriendships = safeJsonParse(localStorage.getItem(LS_FRIENDSHIPS_KEY), []);
  const users = safeJsonParse(localStorage.getItem(LS_USERS_KEY), []);

  const populated = [];
  rawFriendships.forEach(f => {
    const requester = users.find(u => u.id === f.requester_id);
    const addressee = users.find(u => u.id === f.addressee_id);
    if (
      requester && 
      addressee && 
      requester.username && 
      addressee.username && 
      requester.username !== 'user' && 
      addressee.username !== 'user'
    ) {
      populated.push({
        ...f,
        requester: sanitizeUser(requester),
        addressee: sanitizeUser(addressee)
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

    if (!isRequester && !isAddressee) return;

    const friend = isRequester ? f.addressee : f.requester;
    if (!friend || !friend.id || !friend.username || friend.username === 'user') return;

    const sanitizedFriend = sanitizeUser(friend);

    if (f.status === 'accepted') {
      friends.push({ friendshipId: f.id, ...sanitizedFriend });
    } else if (f.status === 'pending') {
      if (isRequester) {
        outgoing.push({ friendshipId: f.id, ...sanitizedFriend });
      } else {
        incoming.push({ friendshipId: f.id, ...sanitizedFriend });
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
  const friendships = safeJsonParse(localStorage.getItem(LS_FRIENDSHIPS_KEY), []);
  
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
    id: `friendship-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
  let friendships = safeJsonParse(localStorage.getItem(LS_FRIENDSHIPS_KEY), []);
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
  let friendships = safeJsonParse(localStorage.getItem(LS_FRIENDSHIPS_KEY), []);
  friendships = friendships.filter(f => f.id !== friendshipId);
  localStorage.setItem(LS_FRIENDSHIPS_KEY, JSON.stringify(friendships));
  return true;
}
