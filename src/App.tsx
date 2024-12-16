import React from 'react';
import Header from './components/Header';
import PokemonList from './components/PokemonList';
import './styles/global.css';
import './App.css';
import { FilterProvider } from './contexts/FilterProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      {/* v v v Super useful to trigger loading, error, etc. */}
      <ReactQueryDevtools initialIsOpen={false} />  
      <FilterProvider>
        <Header />
        <PokemonList />
      </FilterProvider>
    </QueryClientProvider>
  );
};

export default App;

