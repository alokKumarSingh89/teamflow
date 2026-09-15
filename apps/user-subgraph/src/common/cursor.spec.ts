import { describe, expect, it } from 'vitest';

import { decodeCursor, encodeCursor } from './cursor';

describe('Cursor', () => {
  const createdAt = new Date('2026-09-15T10:30:00.000Z');

  it('should encode and decode createdAt and id', () => {
    const id = '12345678-1234-1234-1234-123456789abc';

    const cursor = encodeCursor(createdAt, id);

    expect(cursor).not.toBe(id);

    expect(decodeCursor(cursor)).toEqual({
      v: 2,
      createdAt: '2026-09-15T10:30:00.000Z',
      id,
    });
  });

  it('should produce a URL-safe cursor', () => {
    const cursor = encodeCursor(createdAt, 'user-123');

    expect(cursor).not.toContain('+');
    expect(cursor).not.toContain('/');
    expect(cursor).not.toContain('=');
  });

  it('should reject an invalid cursor', () => {
    expect(() => decodeCursor('invalid-cursor')).toThrow('Invalid cursor');
  });

  it('should reject an unsupported cursor version', () => {
    const cursor = Buffer.from(
      JSON.stringify({
        v: 1,
        id: 'user-123',
      }),
      'utf8',
    ).toString('base64url');

    expect(() => decodeCursor(cursor)).toThrow('Invalid cursor');
  });

  it('should reject a cursor without an id', () => {
    const cursor = Buffer.from(
      JSON.stringify({
        v: 2,
        createdAt: '2026-09-15T10:30:00.000Z',
      }),
      'utf8',
    ).toString('base64url');

    expect(() => decodeCursor(cursor)).toThrow('Invalid cursor');
  });

  it('should reject a cursor without createdAt', () => {
    const cursor = Buffer.from(
      JSON.stringify({
        v: 2,
        id: 'user-123',
      }),
      'utf8',
    ).toString('base64url');

    expect(() => decodeCursor(cursor)).toThrow('Invalid cursor');
  });

  it('should reject an invalid createdAt', () => {
    const cursor = Buffer.from(
      JSON.stringify({
        v: 2,
        createdAt: 'not-a-date',
        id: 'user-123',
      }),
      'utf8',
    ).toString('base64url');

    expect(() => decodeCursor(cursor)).toThrow('Invalid cursor');
  });
});
