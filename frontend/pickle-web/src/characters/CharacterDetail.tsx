import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCharacterById, Character } from './charactersService';
import { useFavorites } from './FavoritesContext';
import FavoriteButton from './FavoriteButton';
import './CharacterDetail.css';

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    getCharacterById(Number(id), token)
      .then(setCharacter)
      .catch(() => setError('Failed to load character'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="character-detail-loading">Loading character...</div>;
  if (error) return <div className="character-detail-error">{error}</div>;
  if (!character) return <div className="character-detail-error">Character not found</div>;

  return (
    <div className="character-detail-container">
      <button className="back-button" onClick={() => navigate('/characters')}>
        ← Back to Characters
      </button>
      
      <div className="character-detail-card">
        <div className="character-detail-image">
          <img src={character.image} alt={character.name} />
        </div>
        
        <div className="character-detail-info">
          <div className="character-header">
            <h1 className="character-detail-name">{character.name}</h1>
            <FavoriteButton 
              isFavorite={isFavorite(character.id)}
              onToggle={() => toggleFavorite({
                id: character.id,
                name: character.name,
                image: character.image
              })}
            />
          </div>
          
          <div className="character-detail-stats">
            <div className="stat-item">
              <span className="stat-label">Status:</span>
              <span className={`stat-value status-${character.status.toLowerCase()}`}>
                {character.status}
              </span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Species:</span>
              <span className="stat-value">{character.species}</span>
            </div>
            
            {character.type && (
              <div className="stat-item">
                <span className="stat-label">Type:</span>
                <span className="stat-value">{character.type}</span>
              </div>
            )}
            
            <div className="stat-item">
              <span className="stat-label">Gender:</span>
              <span className="stat-value">{character.gender}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Origin:</span>
              <span className="stat-value">{character.origin.name}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Location:</span>
              <span className="stat-value">{character.location.name}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Episodes:</span>
              <span className="stat-value">{character.episode.length} episodes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
