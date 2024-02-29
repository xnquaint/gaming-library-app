import { ApiResponseInterface } from '../types/ApiResponseInterface';
import { client } from '../utils/FetchClient';

export const API_KEY = '';

export const getGames = (genre: string | null) => { 
  return client.get<ApiResponseInterface>(genre 
    ? `/games?exclude_additions&genres=${genre}&key=${API_KEY}`
    : `/games?exclude_additions&key=${API_KEY}`
    );
}

export const getGamesByFilter = ( filter : { filter: string }) => { 
  return client.get<ApiResponseInterface>(`/games?exclude_additions&genres=${filter}&key=${API_KEY}`);
}

export const getFilters = (filter : string) => { 
  return client.get<ApiResponseInterface>(`/${filter}?key=${API_KEY}&page_size=100`);
}

