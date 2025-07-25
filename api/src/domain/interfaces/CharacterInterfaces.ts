import { Character } from '../models/Character';

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharactersResponse {
  info: ApiInfo;
  results: Character[];
}

export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}
