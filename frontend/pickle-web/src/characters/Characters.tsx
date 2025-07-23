import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Characters.css';
import { getCharacters, Character } from './charactersService';
import { useFavorites } from './FavoritesContext';
import FavoriteButton from './FavoriteButton';

const Characters: React.FC = () => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, getFavoriteCount } = useFavorites();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const scrollRef = useRef<HTMLUListElement>(null);

  // Manejo del scroll horizontal con rueda del ratón
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      const scrollAmount = e.deltaY * 2; // Multiplica para hacer el scroll más sensible
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };

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

  // Filtrar personajes según si se muestran solo favoritos
  const displayedCharacters = showOnlyFavorites 
    ? characters.filter(char => isFavorite(char.id))
    : characters;

  return (
    <div className="characters-container">
      <div className="characters-header">
        <div className="characters-title">Characters</div>
        <div className="favorites-controls">
          <span className="favorites-count">
            {getFavoriteCount()} favorites
          </span>
          <button 
            className={`filter-button ${showOnlyFavorites ? 'active' : ''}`}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            {showOnlyFavorites ? 'Show All' : 'Show Favorites'}
          </button>
        </div>
      </div>
      
      {showOnlyFavorites && displayedCharacters.length === 0 && (
        <div className="no-favorites">
          <p>No favorite characters yet!</p>
          <p>Click the portal button to add characters to your favorites.</p>
        </div>
      )}
      
      <ul 
        className="characters-list" 
        ref={scrollRef}
        onWheel={handleWheel}
      >
        {displayedCharacters.map(c => (
          <li key={c.id} className="character-item" onClick={() => navigate(`/characters/${c.id}`)}>
            {c.image && <img src={c.image} alt={c.name} className="character-img" />}
            <div className="character-info">
              <div className="character-header-inline">
                <span className="character-name">{c.name}</span>
                <FavoriteButton
                  isFavorite={isFavorite(c.id)}
                  onToggle={() => toggleFavorite({
                    id: c.id,
                    name: c.name,
                    image: c.image
                  })}
                  size="small"
                />
              </div>
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
