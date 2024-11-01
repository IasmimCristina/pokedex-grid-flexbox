import axios from "axios";
import { POKEMON_API_URL, LIMIT } from "../helpers/constants";
import { Pokemon } from "../types/Pokemon";

export const fetchPokemons = async (offset: number): Promise<Pokemon[]> => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  if (Math.random() < 0.3) {
    throw new Error("Random API failure");
  }
  const response = await axios.get(`${POKEMON_API_URL}?offset=${offset}&limit=${LIMIT}`);
  const results = response.data.results;

  const pokemonData = await Promise.all(
    results.map(async (pokemon: any) => {
      const details = await axios.get(pokemon.url);
      return details.data;
    })
  );

  return pokemonData;
};
