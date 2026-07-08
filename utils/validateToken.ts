import { cookies } from 'next/headers';
import { verifyJwt, JwtPayload } from '@/utils/jwt';

export async function validateToken(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = await verifyJwt(token);
    return decoded;
  } catch {
    return null;
  }
}
