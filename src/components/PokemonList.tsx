import React from 'react';
import PokemonCard from './PokemonCard';
import { usePokemonData } from '../hooks/usePokemonData';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { ERROR_MESSAGES } from '../helpers/constants';
import './PokemonList.css';

const PokemonList: React.FC = () => {
  const { pokemonList, loading, error, loadMorePokemon } = usePokemonData();

  const handleReload = () => {
    window.location.reload(); 
  };

  return (
    <div className="pokemon-list">
      {loading && <Loading />}
      {error && (
        <>
          <ErrorMessage message={ERROR_MESSAGES.FETCH_ERROR} />
          <button className='pokemon-list__button' onClick={handleReload}>
            Try Again
          </button>
        </>
      )}
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
      {!loading && !error && (
        <button className='pokemon-list__button' onClick={loadMorePokemon}>
          Load more ( + )
        </button>
      )}
    </div>
  );
};

export default PokemonList;
