import { cookies } from 'next/headers';
import { verifyJwt } from '@/utils/jwt';

export async function validateToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {

    const decoded = await verifyJwt(token);
    return decoded;
  } catch (error) {
    return null;
  }
}
