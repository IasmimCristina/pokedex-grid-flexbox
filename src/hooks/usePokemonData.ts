import { useState, useEffect } from "react";
import { fetchPokemons } from "../api/pokemonApi"; 
import { Pokemon } from "../types/Pokemon";
import { LIMIT, ERROR_MESSAGES } from "../helpers/constants";

export function usePokemonData() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); 
      try {
        const pokemonData = await fetchPokemons(offset);
        setPokemonList((prevList) => [...prevList, ...pokemonData]);
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

  return { pokemonList, loading, error, loadMorePokemon };
}
