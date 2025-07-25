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

export interface CharactersResponse {
  characters: Character[];
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
}

export async function getCharacters(token: string, page: number = 1, searchTerm: string = ''): Promise<CharactersResponse> {
  let url = `${API_BASE_URL}/api/characters?page=${page}`;
  if (searchTerm.trim()) {
    url += `&name=${encodeURIComponent(searchTerm.trim())}`;
  }
  
  const data = await apiCaller<CharactersResponse>(url, {
    token
  });
  return data;
}

export async function getCharacterById(id: number, token: string): Promise<Character> {
  const data = await apiCaller<Character>(`${API_BASE_URL}/api/characters/${id}`, {
    token
  });
  return data;
}
