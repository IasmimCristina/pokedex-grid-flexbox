import { createContext } from "react";
import { Pokemon } from "../types/Pokemon";

type PokemonDataContextType = {
  pokemonList: Pokemon[];
  loading: boolean;
  error: string | null;
  loadMorePokemon: () => void;
};

export const PokemonDataContext = createContext<PokemonDataContextType | undefined>(undefined);
