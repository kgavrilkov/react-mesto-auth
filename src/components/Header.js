import React from 'react';
import logoPath from '../images/logo.svg';

function Header() {
  return (
    <header className="header page__header">
      <img className="logo header__logo" src={logoPath} alt="Логотип" />
    </header>
  );
}

export default Header;