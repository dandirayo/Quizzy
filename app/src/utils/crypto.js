/**
 * Cryptographic utility for secure client-side hashing
 */

export async function hashPassword(plainText) {
  if (!plainText) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    // Fallback simple hash if Web Crypto API is unavailable in non-secure context
    console.warn('crypto.subtle unavailable, using fallback hash', err);
    let hash = 0;
    for (let i = 0; i < plainText.length; i++) {
      const char = plainText.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'fb_' + Math.abs(hash).toString(16);
  }
}

/**
 * Verify password against stored hash or legacy plaintext
 */
export async function verifyPassword(inputPassword, storedPasswordOrHash) {
  if (!inputPassword || !storedPasswordOrHash) return false;
  // If stored password is already hashed with SHA-256 (64 hex chars) or fallback
  if (storedPasswordOrHash.length === 64 || storedPasswordOrHash.startsWith('fb_')) {
    const inputHash = await hashPassword(inputPassword);
    return inputHash === storedPasswordOrHash;
  }
  // Legacy backward-compatibility for previously saved plaintext passwords
  return inputPassword === storedPasswordOrHash;
}
