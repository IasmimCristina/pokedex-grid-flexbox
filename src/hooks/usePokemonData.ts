import { useContext } from "react";
import { PokemonDataContext } from "../contexts/PokemonDataContext";
import { ERROR_MESSAGES } from "../helpers/constants";

export const usePokemonData = () => {
  const context = useContext(PokemonDataContext);

  if (context === undefined) {
    throw new Error(ERROR_MESSAGES.FETCH_ERROR);
  }

  return context;
};
