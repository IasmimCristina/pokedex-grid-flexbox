import { HttpClient } from "./httpClient";
import { Pokemon } from "../types/Pokemon";
import { LIMIT, ERROR_MESSAGES, NETWORK_DELAY } from "../helpers/constants";
import { simulateError, delay } from "../helpers/apiUtils";

type PokemonApi = {
  name: string;
  url: string;
}

type ApiResults = {
  results: PokemonApi[];
}

export const createPokemonService = (httpClient: HttpClient) => {
  // Fetches the list.
  const fetchPokemonList = async (offset: number): Promise<PokemonApi[]> => {
    try {
      await delay(NETWORK_DELAY); 
      simulateError();

      
      const response = await httpClient.get<ApiResults>(`?offset=${offset}&limit=${LIMIT}`);
      return response.data.results;
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_ERROR, error);
      throw new Error(ERROR_MESSAGES.FETCH_ERROR);
    }
  };

  // Fetches one pokémon
  const fetchPokemonDetails = async (pokemonUrl: string): Promise<Pokemon> => {
    try {
      const detailsResponse = await httpClient.get<Pokemon>(pokemonUrl);
      return detailsResponse.data;
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_ERROR, error);
      throw new Error(ERROR_MESSAGES.FETCH_ERROR);
    }
  };

  // Main function
  const fetchPokemons = async (offset: number): Promise<Pokemon[]> => {
    try {
      const pokemonList = await fetchPokemonList(offset);
      
      const pokemonData = await Promise.all(
        pokemonList.map(pokemon => fetchPokemonDetails(pokemon.url))
      );
      
      return pokemonData;
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_ERROR, error);
      throw new Error(ERROR_MESSAGES.FETCH_ERROR);
    }
  };

  return { fetchPokemons };
};
