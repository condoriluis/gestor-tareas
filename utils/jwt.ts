import { SignJWT, jwtVerify } from 'jose';
import { TextEncoder } from 'util';

export interface JwtPayload {
  id: number;
  email: string;
  rol: string;
}

export function signJwtAccessToken(payload: { id: number; email: string; rol: string }) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  return new SignJWT({ ...payload, id_user: payload.id, email_user: payload.email, rol_user: payload.rol })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret);
}

export async function verifyJwt(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}
