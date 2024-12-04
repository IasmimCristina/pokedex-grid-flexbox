import { HttpClient } from "./httpClient";
import { Pokemon } from "../types/Pokemon";
import { LIMIT, ERROR_MESSAGES, NETWORK_DELAY } from "../helpers/constants";
import { simulateError, delay } from "../helpers/apiUtils"; 

//  This 'service' returns my main fetch function.
export const createPokemonService = (httpClient: HttpClient) => {
  const fetchPokemons = async (offset: number): Promise<Pokemon[]> => {
    try {
      await delay(NETWORK_DELAY);
      simulateError();

      const response = await httpClient.get<{
        results: { name: string; url: string }[];
      }>(`?offset=${offset}&limit=${LIMIT}`);
      const results = response.data.results;

      const pokemonData = await Promise.all(
        results.map(async (pokemon) => {
          const detailsResponse = await httpClient.get<Pokemon>(pokemon.url);
          return detailsResponse.data;
        })
      );

      return pokemonData;
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_ERROR, error);
      throw new Error(ERROR_MESSAGES.FETCH_ERROR);
    }
  };

  return { fetchPokemons };
};
