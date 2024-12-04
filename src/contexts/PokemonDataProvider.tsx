import { useState, useMemo, useEffect, ReactNode, useRef } from "react";
import { createPokemonService } from "../api/pokemonService";
import { makeHttpClient } from "../api/httpClient";
import { Pokemon } from "../types/Pokemon";
import { PokemonDataContext } from "./PokemonDataContext";
import { ERROR_MESSAGES, LIMIT, POKEMON_API_URL } from "../helpers/constants";

export const PokemonDataProvider = ({ children }: { children: ReactNode }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pokemonIds = useRef<Set<number>>(new Set());

  const httpClient = useMemo(() => makeHttpClient({ baseURL: POKEMON_API_URL }), []);
  const pokemonService = useMemo(() => createPokemonService(httpClient), [httpClient]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const pokemonData = await pokemonService.fetchPokemons(offset);
        const newPokemons = pokemonData.filter((pokemon) => {
          if (!pokemonIds.current.has(pokemon.id)) {
            pokemonIds.current.add(pokemon.id);
            return true;
          }
          return false;
        });

        setPokemonList((prevList) => [...prevList, ...newPokemons]);
      } catch (error) {
        console.error(ERROR_MESSAGES.FETCH_ERROR, error);
        setError(ERROR_MESSAGES.DEFAULT);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [offset, pokemonService]);

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
