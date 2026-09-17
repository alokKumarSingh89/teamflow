export interface JwtPayload {
  sub: string;
  sid: string;
  iat?: number;
  exp?: number;
}
