export const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";
export const FAULTY_URL = "https://pokeapi.co/api/v2/invalid-endpoint";
export const LIMIT = 12;
export const ERROR_MESSAGES = {
  FETCH_ERROR: "Error fetching Pokémon data.",
  RANDOM_API_FAILURE: "Random API failure: Invalid URL.",
  LOAD_MORE_ERROR: "Error during loading, try again...", 
  EMPTY: "No Pokémon found with that name.",
  FILTER_CONTEXT: "Invalid call to Filter Provider! It's not higher up in the tree."
};
