export interface CursorPayload {
  v: 2;
  createdAt: string;
  id: string;
}

export function encodeCursor(createdAt: Date, id: string): string {
  const payload: CursorPayload = {
    v: 2,
    createdAt: createdAt.toISOString(),
    id,
  };
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string): CursorPayload {
  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
    const payload = JSON.parse(decoded) as Partial<CursorPayload>;
    if (
      payload.v !== 2 ||
      typeof payload.id !== 'string' ||
      payload.id.length === 0 ||
      typeof payload.createdAt !== 'string' ||
      Number.isNaN(Date.parse(payload.createdAt))
    ) {
      throw new Error('Invalid cursor payload');
    }
    return {
      v: 2,
      createdAt: new Date(payload.createdAt).toISOString(),
      id: payload.id,
    };
  } catch {
    throw new Error('Invalid cursor');
  }
}
