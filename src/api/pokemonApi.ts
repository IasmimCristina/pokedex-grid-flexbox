import axios from "axios";
import { LIMIT, ERROR_MESSAGES, POKEMON_API_URL } from "../helpers/constants";
import { Pokemon } from "../types/Pokemon";
import { getPokemonApiUrl } from "../helpers/apiUtils";

export const fetchPokemons = async (offset: number): Promise<Pokemon[]> => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const apiUrl = getPokemonApiUrl();

  if (apiUrl !== POKEMON_API_URL) {
    throw new Error(ERROR_MESSAGES.RANDOM_API_FAILURE);
  }

  const response = await axios.get(`${apiUrl}?offset=${offset}&limit=${LIMIT}`);
  const results = response.data.results;

  const pokemonData = await Promise.all(
    results.map(async (pokemon: any) => {
      const details = await axios.get(pokemon.url);
      return details.data;
    })
  );

  return pokemonData;
};
