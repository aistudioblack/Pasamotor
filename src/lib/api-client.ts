import { dbClient } from './db-client';

export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { data: { session } } = await dbClient.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Oturum bulunamadı. Lütfen giriş yapın.');
  }

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...(options.headers || {})
    }
  });
}
