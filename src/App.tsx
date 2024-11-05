import React from 'react';
import Header from './components/Header';
import PokemonList from './components/PokemonList';
import { PokemonDataProvider } from './contexts/PokemonDataProvider';
import './styles/global.css';
import './App.css';
import { FilterProvider } from './contexts/FilterProvider';

const App: React.FC = () => {
  return (
    <PokemonDataProvider>
      <FilterProvider>
        <Header />
        <PokemonList />
      </FilterProvider>
    </PokemonDataProvider>
  );
};

export default App;
