import React from 'react';
import Header from './components/Header';
import PokemonList from './components/PokemonList';
import './styles/global.css';
import './App.css'

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <main className='main'>
        <PokemonList />
      </main>
    </div>
  );
};

export default App;
