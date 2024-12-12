import { useInfiniteQuery } from "@tanstack/react-query";
import { createPokemonService } from "../../api/pokemonService";
import { makeHttpClient } from "../../api/httpClient";
import { Pokemon } from "../../types/Pokemon";
import { POKEMON_API_URL, LIMIT } from "../../helpers/constants";

const httpClient = makeHttpClient({ baseURL: POKEMON_API_URL });
const pokemonService = createPokemonService(httpClient);

// It´s useful to return a query inside a custom Hook.
export const usePokemons = () => {
  return useInfiniteQuery<Pokemon[], Error>({
    queryKey: ["pokemons"],
    queryFn: async ({ pageParam = 0 }) => {
      return await pokemonService.fetchPokemons(Number(pageParam));
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === LIMIT ? allPages.length * LIMIT : undefined;
    },
    maxPages: 3, // Memory related, it helps, nice detail. See documentaiton.
    retry: 1,
    retryDelay: 1000,
  });
};
