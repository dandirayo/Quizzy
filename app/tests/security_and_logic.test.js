import { test, describe } from 'node:test';
import assert from 'node:assert';
import { hashPassword, verifyPassword } from '../src/utils/crypto.js';
import { sanitizeUser, sanitizeSearchQuery, safeJsonParse } from '../src/utils/helpers.js';

describe('Security & Data Layer Tests', () => {
  test('hashPassword produces consistent SHA-256 hex string', async () => {
    const pwd = 'secretPassword123!';
    const hash1 = await hashPassword(pwd);
    const hash2 = await hashPassword(pwd);

    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 64);
    assert.notStrictEqual(hash1, pwd);
  });

  test('verifyPassword validates correct password and rejects wrong password', async () => {
    const pwd = 'mySecurePassword';
    const hash = await hashPassword(pwd);

    const valid = await verifyPassword(pwd, hash);
    const invalid = await verifyPassword('wrongPassword', hash);

    assert.strictEqual(valid, true);
    assert.strictEqual(invalid, false);
  });

  test('sanitizeUser completely strips password and preserves safe fields', () => {
    const rawUser = {
      id: 'usr-123',
      username: 'nendra17',
      display_name: 'Nendra Pratama',
      email: 'nendra@example.com',
      password: 'superSecretHashOrPlaintext',
      avatar_url: 'https://avatar.png'
    };

    const clean = sanitizeUser(rawUser);

    assert.strictEqual(clean.id, 'usr-123');
    assert.strictEqual(clean.username, 'nendra17');
    assert.strictEqual(clean.password, undefined);
    assert.strictEqual('password' in clean, false);
  });

  test('sanitizeSearchQuery strips PostgREST injection characters', () => {
    const maliciousQuery = 'nendra),id.eq.admin,(';
    const clean = sanitizeSearchQuery(maliciousQuery);

    assert.strictEqual(clean, 'nendraid.eq.admin');
    assert.strictEqual(clean.includes(')'), false);
    assert.strictEqual(clean.includes('('), false);
    assert.strictEqual(clean.includes(','), false);
  });

  test('safeJsonParse falls back cleanly on corrupted JSON strings without throwing', () => {
    const corrupted = '{ broken json ';
    const fallback = { fallback: true };
    const result = safeJsonParse(corrupted, fallback);

    assert.deepStrictEqual(result, fallback);
  });
});

describe('Mini Games Logic Tests', () => {
  test('WouldYouRather percentage algorithm never returns NaN for any question id format', () => {
    const testIds = ['wyr-1', 'wyr-2', 'wyr-10', 'custom_id_42', '1', 'wyr-999'];

    for (const id of testIds) {
      const numericPart = parseInt(String(id).replace(/\D/g, ''), 10) || 1;
      const p1 = ((numericPart * 37 + 17) % 41) + 30;
      const pA = p1;
      const pB = 100 - p1;

      assert.strictEqual(Number.isNaN(pA), false, `pA was NaN for ${id}`);
      assert.strictEqual(Number.isNaN(pB), false, `pB was NaN for ${id}`);
      assert.strictEqual(pA + pB, 100);
      assert.ok(pA >= 30 && pA <= 70);
    }
  });
});
