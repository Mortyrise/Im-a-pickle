import { externalApiCaller } from '../../infrastructure/utils/apiCaller';
import { getRedisKey, setRedisKey } from '../../infrastructure/redis/RedisClient';

export interface RickAndMortyCharacter {
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

export interface RickAndMortyResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: RickAndMortyCharacter[];
}

export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}

export class RickAndMortyService {
  private readonly baseUrl = 'https://rickandmortyapi.com/api';

  /**
   * Get characters from Rick and Morty API
   */
  async getCharacters(filters: CharacterFilters = {}): Promise<RickAndMortyResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.name) params.append('name', filters.name);
    if (filters.status) params.append('status', filters.status);
    if (filters.species) params.append('species', filters.species);
    if (filters.gender) params.append('gender', filters.gender);

    const queryString = params.toString();
    const endpoint = `/character${queryString ? `?${queryString}` : ''}`;
    
    const cacheKey = `api:rick_and_morty:characters:${queryString || 'all'}`;
    const cachedData = await getRedisKey(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await externalApiCaller.call<RickAndMortyResponse>(`${this.baseUrl}${endpoint}`);
    await setRedisKey(cacheKey, JSON.stringify(response), 3600);
    
    return response;
  }

  /**
   * Get a single character by ID
   */
  async getCharacterById(id: number): Promise<RickAndMortyCharacter> {
    const cacheKey = `api:rick_and_morty:character:${id}`;
    const cachedData = await getRedisKey(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const character = await externalApiCaller.call<RickAndMortyCharacter>(`${this.baseUrl}/character/${id}`);
    await setRedisKey(cacheKey, JSON.stringify(character), 3600)
    return character;
  }

  /**
   * Get multiple characters by IDs
   */
  async getCharactersByIds(ids: number[]): Promise<RickAndMortyCharacter[]> {
    const idsString = ids.join(',');
    const cacheKey = `api:rick_and_morty:characters:multiple:${idsString}`;
    const cachedData = await getRedisKey(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const characters = await externalApiCaller.call<RickAndMortyCharacter[]>(`${this.baseUrl}/character/${idsString}`);
    await setRedisKey(cacheKey, JSON.stringify(characters), 3600);
    
    return characters;
  }
}
