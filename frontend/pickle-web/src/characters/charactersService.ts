import { apiCaller } from '../utils/apiCaller';
import { API_BASE_URL } from '../config';

export interface Character {
  id: number;
  name: string;
  image?: string;
}

export async function getCharacters(token: string): Promise<Character[]> {
  const data = await apiCaller<{ characters: Character[] }>(`${API_BASE_URL}/api/characters`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.characters || [];
}
