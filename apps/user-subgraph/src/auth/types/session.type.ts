export const SESSION_TTL_SECONDS = Number(
  process.env.SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 7,
);

export interface UserSession {
  sessionId: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  status: 'ACTIVE';
}
