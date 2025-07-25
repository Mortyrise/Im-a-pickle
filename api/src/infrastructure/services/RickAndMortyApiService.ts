import { externalApiCaller } from '../../infrastructure/utils/apiCaller';

export interface ApiCharacterResponse {
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

export interface ApiCharactersResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: ApiCharacterResponse[];
}

export class RickAndMortyApiService {
  private readonly baseUrl = 'https://rickandmortyapi.com/api';

  async fetchCharacters(queryString: string = ''): Promise<ApiCharactersResponse> {
    const endpoint = `/character${queryString ? `?${queryString}` : ''}`;
    return await externalApiCaller.call<ApiCharactersResponse>(`${this.baseUrl}${endpoint}`);
  }

  async fetchCharacterById(id: number): Promise<ApiCharacterResponse> {
    return await externalApiCaller.call<ApiCharacterResponse>(`${this.baseUrl}/character/${id}`);
  }

  async fetchCharactersByIds(idsString: string): Promise<ApiCharacterResponse | ApiCharacterResponse[]> {
    return await externalApiCaller.call<ApiCharacterResponse | ApiCharacterResponse[]>(`${this.baseUrl}/character/${idsString}`);
  }
}
