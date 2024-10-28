import React from 'react';
import './PokemonCard.css';
import { Pokemon } from '../types/Pokemon'; 

type PokemonCardProps = {
  pokemon: Pokemon;
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className="pokemon-card">
      <img
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        className="pokemon-card__image"
      />
      <h3 className="pokemon-card__name">{pokemon.name}</h3>
    </div>
  );
};

export default PokemonCard;
