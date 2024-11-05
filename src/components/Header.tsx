import React from 'react';
import { FaSearch, FaLock } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/logo.png';
import useFilter from '../hooks/useFilter';
import { usePokemonData } from '../hooks/usePokemonData';

const Header: React.FC = () => {
  const { filter, setFilter } = useFilter();
  const { loading } = usePokemonData();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <header className="header">
      <div className="header__logo">
        <img src={logo} alt="Pokémon Logo showing a pokédex" className="header__logo-img" />
        <h1 className="header__logo-title">Pokédex</h1>
      </div>
      <form className="header__filter-container" aria-labelledby="filter-label">
        <label id="filter-label" htmlFor="filter-input" className="header__filter-label">
          Filter by Pokémon name:
        </label>
        <div className="header__filter-wrapper">
          <input
            id="filter-input"
            type="text"
            value={filter}
            onChange={handleFilterChange}
            className="header__filter-input"
            aria-disabled={loading}
            tabIndex={loading ? -1 : 0}
            aria-describedby="filter-help-text"
          />
          {loading ? (
            <FaLock className="header__filter-icon" aria-hidden="true" />
          ) : (
            <FaSearch className="header__filter-icon" aria-hidden="true" />
          )}
        </div>
        <p id="filter-help-text" className="header__help-text">
          {loading ? 'Input is disabled while data is loading.' : 'Type to filter Pokémon by name.'}
        </p>
      </form>
    </header>
  );
};

export default Header;
