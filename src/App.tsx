import React from 'react';
import Header from './components/Header';
import PokemonList from './components/PokemonList';
import { PokemonDataProvider } from './contexts/PokemonDataProvider';
import './styles/global.css';
import './App.css';
import { FilterProvider } from './contexts/FilterProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const App: React.FC = () => {

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <PokemonDataProvider>
        <FilterProvider>
          <Header />
          <PokemonList />
        </FilterProvider>
      </PokemonDataProvider>
    </QueryClientProvider>
  );
};

export default App;
