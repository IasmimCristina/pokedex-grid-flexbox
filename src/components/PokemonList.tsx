import React, { useState } from 'react';
import PokemonCard from './PokemonCard';
import { usePokemonData } from '../hooks/usePokemonData';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { ERROR_MESSAGES } from '../helpers/constants';
import './PokemonList.css';
import useFilter from '../hooks/useFilter';

const PokemonList: React.FC = () => {
  const { pokemonList, loading, error, loadMorePokemon } = usePokemonData();
  const { filter, clearFilter } = useFilter();
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleLoadMoreClick = () => {
    clearFilter();
    setButtonClicked(true);
    loadMorePokemon();
  };

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main >
      {loading && pokemonList.length === 0 && <Loading />}
      {error && pokemonList.length === 0 && (
        <ErrorMessage message={ERROR_MESSAGES.FETCH_ERROR} />
      )}
      {pokemonList.length > 0 &&

        <div className="pokemon-list">
          {filteredPokemonList.length > 0 && filteredPokemonList.map((pokemon) => (
            <PokemonCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
          ))}
          {filteredPokemonList.length === 0 && pokemonList.length > 0 && (
            <div className='pokemon-list__empty-result'>{ERROR_MESSAGES.EMPTY}</div>
          )}
          <button className='pokemon-list__button' onClick={handleLoadMoreClick}>
            Load more ( + )
          </button>
          {loading && (pokemonList.length > 0 || filteredPokemonList.length > 0) && <Loading />}
          {error && buttonClicked && (pokemonList.length > 0 || filteredPokemonList.length > 0) && (
            <span className="pokemon-list__error">{ERROR_MESSAGES.LOAD_MORE_ERROR}</span>
          )}
        </div>
      }
    </main>
  );
};

export default PokemonList;
