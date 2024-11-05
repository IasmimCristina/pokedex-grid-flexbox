import { useState, useMemo, useEffect, ReactNode, useRef } from "react";
import { fetchPokemons } from "../api/pokemonApi";
import { Pokemon } from "../types/Pokemon";
import { PokemonDataContext } from "./PokemonDataContext";
import { LIMIT, ERROR_MESSAGES } from "../helpers/constants";

export const PokemonDataProvider = ({ children }: { children: ReactNode }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pokemonIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const pokemonData = await fetchPokemons(offset);
        const newPokemons = pokemonData.filter((pokemon) => {
          if (!pokemonIds.current.has(pokemon.id)) {
            pokemonIds.current.add(pokemon.id);
            return true;
          }
          return false;
        });

        setPokemonList((prevList) => [...prevList, ...newPokemons]);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
        setError(ERROR_MESSAGES.FETCH_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [offset]);

  const loadMorePokemon = () => {
    setOffset((prevOffset) => prevOffset + LIMIT);
  };

  const value = useMemo(
    () => ({
      pokemonList,
      loading,
      error,
      loadMorePokemon,
    }),
    [pokemonList, loading, error]
  );

  return <PokemonDataContext.Provider value={value}>{children}</PokemonDataContext.Provider>;
};
