import React, { useEffect, useState } from 'react';
import './Characters.css';
import { getCharacters, Character } from './charactersService';

const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    getCharacters(token)
      .then(setCharacters)
      .catch(() => setError('Failed to load characters'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="characters-title">Loading characters...</div>;
  if (error) return <div className="auth-error">{error}</div>;

  return (
    <div className="characters-container">
      <div className="characters-title">Characters</div>
      <ul className="characters-list">
        {characters.map(c => (
          <li key={c.id} className="character-item">
            {c.image && <img src={c.image} alt={c.name} className="character-img" />}
            <div className="character-info">
           
              <span className="character-name">{c.name}</span>
              <span className="character-details">{c.status} - {c.species}</span>
              <span className="character-origin">Origin: {c.origin.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Characters;
