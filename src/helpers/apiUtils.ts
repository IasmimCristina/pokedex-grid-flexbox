import { POKEMON_API_URL, FAULTY_URL } from "./constants";

export const getPokemonApiUrl = () => {
  return Math.random() < 0.7 ? POKEMON_API_URL : FAULTY_URL;
};
