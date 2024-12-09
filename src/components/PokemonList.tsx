import React from 'react';
import PokemonCard from './PokemonCard';
import { usePokemons } from '../hooks/queries/usePokemons';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { ERROR_MESSAGES } from '../helpers/constants';
import './PokemonList.css';
import useFilter from '../hooks/useFilter';
import { BeatLoader } from 'react-spinners';
import { Pokemon } from '../types/Pokemon';

const PokemonList: React.FC = () => {
  const { filter, clearFilter } = useFilter();

  // Using infinite query.
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePokemons();

  // Explicitly type and flatten the pages
  const pokemonList: Pokemon[] = React.useMemo(() => 
    data?.pages.flatMap((page) => page as Pokemon[]) || [], 
    [data]
  );

  const handleLoadMoreClick = () => {
    clearFilter();
    fetchNextPage();
  };

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main>
      {isLoading && pokemonList.length === 0 && <Loading />}
      {isError && pokemonList.length === 0 && (
        <ErrorMessage message={ERROR_MESSAGES.FETCH_ERROR} />
      )}
      {pokemonList.length > 0 && (
        <div className="pokemon-list">
          {filteredPokemonList.length > 0 &&
            filteredPokemonList.map((pokemon) => (
              <PokemonCard 
                key={`${pokemon.id}-${pokemon.name}`} 
                pokemon={pokemon} 
              />
            ))}
          {filteredPokemonList.length === 0 && pokemonList.length > 0 && (
            <div className="pokemon-list__empty-result">
              {ERROR_MESSAGES.EMPTY}
            </div>
          )}
          {hasNextPage && (
            <button
              className="pokemon-list__button"
              onClick={handleLoadMoreClick}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <>
                  Loading... 
                  <BeatLoader color="var(--light-color)" loading={true} size={15} />
                </>
              ) : (
                'Load more ( + )'
              )}
            </button>
          )}
          {isError && (
            <span className="pokemon-list__error">
              {ERROR_MESSAGES.LOAD_MORE_ERROR}
            </span>
          )}
        </div>
      )}
    </main>
  );
};

export default PokemonList;
