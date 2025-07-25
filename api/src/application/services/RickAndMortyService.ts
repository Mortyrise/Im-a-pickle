import { externalApiCaller } from '../../infrastructure/utils/apiCaller';
import { getRedisKey, setRedisKey } from '../../infrastructure/redis/RedisClient';
import { Character } from '../../domain/models/Character';
import { CharactersResponse, CharacterFilters } from '../../domain/interfaces/CharacterInterfaces';

export class RickAndMortyService {
  private readonly baseUrl = 'https://rickandmortyapi.com/api';

 
  async getCharacters(filters: CharacterFilters = {}): Promise<CharactersResponse> {
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
      const parsedData = JSON.parse(cachedData);
      return {
        info: parsedData.info,
        results: parsedData.results.map((char: any) => Character.fromApiResponse(char))
      };
    }

    const response = await externalApiCaller.call<any>(`${this.baseUrl}${endpoint}`);
    
    const charactersResponse: CharactersResponse = {
      info: response.info,
      results: response.results.map((char: any) => Character.fromApiResponse(char))
    };

    await setRedisKey(cacheKey, JSON.stringify(response), 3600); // Cache raw API response
    
    return charactersResponse;
  }


  async getCharacterById(id: number): Promise<Character> {
    const cacheKey = `api:rick_and_morty:character:${id}`;
    const cachedData = await getRedisKey(cacheKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return Character.fromApiResponse(parsedData);
    }

    const response = await externalApiCaller.call<any>(`${this.baseUrl}/character/${id}`);
    const character = Character.fromApiResponse(response);
    
    await setRedisKey(cacheKey, JSON.stringify(response), 3600);
    return character;
  }

 
  async getCharactersByIds(ids: number[]): Promise<Character[]> {
    const idsString = ids.join(',');
    const cacheKey = `api:rick_and_morty:characters:multiple:${idsString}`;
    const cachedData = await getRedisKey(cacheKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return Array.isArray(parsedData) 
        ? parsedData.map((char: any) => Character.fromApiResponse(char))
        : [Character.fromApiResponse(parsedData)];
    }

    const response = await externalApiCaller.call<any>(`${this.baseUrl}/character/${idsString}`);
    const characters = Array.isArray(response) 
      ? response.map((char: any) => Character.fromApiResponse(char))
      : [Character.fromApiResponse(response)];
    
    await setRedisKey(cacheKey, JSON.stringify(response), 3600);
    return characters;
  }
}
