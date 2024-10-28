import React from 'react';
import './Header.css';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <img src={logo} alt="Pokémon Logo" className="header__logo" />
      <h1 className="header__title">Pokédex</h1>
    </header>
  );
};

export default Header;
