import React from 'react';
import { FaSearch } from 'react-icons/fa';
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
      <div className='header__logo'>
        <img src={logo} alt="Pokémon Logo showing a pokédex" className="header__logo-img" />
        <h1 className="header__logo-title">Pokédex</h1>
      </div>
      <div className="header__filter-container">
        <label htmlFor="filter-input" className="header__filter-label">
          Filter by Pokémon name:
        </label>
        <div className="header__filter-wrapper">
          <input
            id="filter-input"
            type="text"
            value={filter}
            onChange={handleFilterChange}
            className="header__filter-input"
            disabled={loading}
          />
          <FaSearch className="header__filter-icon" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
};

export default Header;
