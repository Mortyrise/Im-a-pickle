import { apiCaller } from '../utils/apiCaller';
import { API_BASE_URL } from '../config';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export async function getCharacters(token: string): Promise<Character[]> {
  const data = await apiCaller<{ characters: Character[] }>(`${API_BASE_URL}/api/characters`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.characters || [];
}

export async function getCharacterById(id: number, token: string): Promise<Character> {
  const data = await apiCaller<Character>(`${API_BASE_URL}/api/characters/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
