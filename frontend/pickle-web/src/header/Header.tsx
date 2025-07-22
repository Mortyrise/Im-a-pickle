import React from 'react';
import './Header.css';

type ViewType = 'login' | 'register';
interface HeaderProps {
  onNav: (view: ViewType) => void;
  view: ViewType;
}

const Header: React.FC<HeaderProps> = ({ onNav, view }) => (
  <header className="header-rm">
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg" alt="Rick and Morty" />
      <h1>Pickle Web</h1>
    </div>
    <nav>
      <a href="#login" onClick={e => { e.preventDefault(); onNav('login'); }} style={view === 'login' ? { color: '#fff' } : {}}>Login</a>
      <a href="#register" onClick={e => { e.preventDefault(); onNav('register'); }} style={view === 'register' ? { color: '#fff' } : {}}>Register</a>
    </nav>
  </header>
);

export default Header;
