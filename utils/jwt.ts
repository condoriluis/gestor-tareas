import { SignJWT, jwtVerify } from 'jose';
import { TextEncoder } from 'util';

export function signJwtAccessToken(payload: { id_user: number, email_user: string, rol_user: string }) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret);
}

export async function verifyJwt(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id_user: number, email_user: string, rol_user: string };
  } catch (error) {
    return null;
  }
}