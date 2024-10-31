import React from 'react';
import PokemonCard from './PokemonCard';
import { usePokemonData } from '../hooks/usePokemonData';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { ERROR_MESSAGES } from '../helpers/constants';
import './PokemonList.css';

const PokemonList: React.FC = () => {
  const { pokemonList, loading, error, loadMorePokemon } = usePokemonData();

  return (
    <>
      {loading && pokemonList.length === 0 && <Loading />}
      {error && pokemonList.length === 0 && (

        <ErrorMessage message={ERROR_MESSAGES.FETCH_ERROR} />

      )}
      {(pokemonList.length > 0 || (!loading && !error)) && (
        <div className="pokemon-list">
          {pokemonList.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
          <button className='pokemon-list__button' onClick={loadMorePokemon}>
            Load more ( + )
          </button>
          {loading && pokemonList.length > 0 && <Loading />}
          {error && pokemonList.length > 0 && (<span className="pokemon-list__error">Error during loading, try again...</span>)}

        </div>
      )}
    </>
  );
};

export default PokemonList;
