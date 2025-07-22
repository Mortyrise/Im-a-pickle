
import { apiCaller } from './apiCaller';
import { API_BASE_URL } from './config';

export async function login(email: string, password: string): Promise<{ access_token: string }> {
  return apiCaller(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: { email, password },
  });
}


export async function register(username: string, email: string, password: string): Promise<void> {
  await apiCaller(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    body: { username, email, password },
  });
}



