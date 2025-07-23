import { externalApiCaller } from '../../infrastructure/utils/apiCaller';

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

    return await externalApiCaller.call<RickAndMortyResponse>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Get a single character by ID
   */
  async getCharacterById(id: number): Promise<RickAndMortyCharacter> {
    return await externalApiCaller.call<RickAndMortyCharacter>(`${this.baseUrl}/character/${id}`);
  }

  /**
   * Get multiple characters by IDs
   */
  async getCharactersByIds(ids: number[]): Promise<RickAndMortyCharacter[]> {
    const idsString = ids.join(',');
    return await externalApiCaller.call<RickAndMortyCharacter[]>(`${this.baseUrl}/character/${idsString}`);
  }
}
