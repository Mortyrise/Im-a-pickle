import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Characters.css';
import { getCharacters, Character, CharactersResponse } from './charactersService';
import { useFavorites } from './useFavorites';
import { useAuth } from '../auth/AuthContext';
import FavoriteButton from './FavoriteButton';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Characters: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { toggleFavorite, isFavorite, getFavoriteCount } = useFavorites();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const scrollRef = useRef<HTMLUListElement>(null);
  const lastCharacterRef = useRef<HTMLLIElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadCharacters = useCallback(async (page: number, isLoadingMore = false, searchQuery = '') => {
    if (!token) return;
    
    try {
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        if (searchQuery.trim()) {
          setSearching(true);
        } else {
          setLoading(true);
        }
      }
      setError('');
      const response = await getCharacters(token, page, searchQuery);
      
      if (isLoadingMore) {
        setCharacters(prev => [...prev, ...response.characters]);
      } else {
        setCharacters(response.characters);
      }
      
      setHasNextPage(!!response.info.next);
      setCurrentPage(page);
    } catch (error: any) {
      if (error.message === 'Invalid or expired token') {
        logout();
      } else {
        if (searchQuery.trim()) {
          setCharacters([]);
          setHasNextPage(false);
        } else {
          setError('Failed to load characters');
        }
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setSearching(false);
    }
  }, [token, logout]);

  useEffect(() => {
    loadCharacters(1, false, debouncedSearchTerm);
  }, [loadCharacters, debouncedSearchTerm]);

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm && searchTerm.trim()) {
      setSearching(true);
    }
    if (searchTerm !== debouncedSearchTerm) {
      setError('');
    }
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    if (!lastCharacterRef.current || !hasNextPage || loadingMore || debouncedSearchTerm) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadCharacters(currentPage + 1, true, debouncedSearchTerm);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(lastCharacterRef.current);

    return () => observer.disconnect();
  }, [characters, hasNextPage, loadingMore, currentPage, loadCharacters, debouncedSearchTerm]);

  if (loading) return <div className="characters-title">Loading characters...</div>;
  if (error) return <div className="auth-error">{error}</div>;

  const displayedCharacters = showOnlyFavorites 
    ? characters.filter(char => isFavorite(char.id))
    : characters;

  const hasSearchTerm = debouncedSearchTerm.trim();
  const noSearchResults = hasSearchTerm && displayedCharacters.length === 0 && !searching;

  return (
    <div className="characters-container">
      <div className="characters-header">
        <div className="characters-title">Characters</div>
        <div className="header-controls">
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
          <button 
            className="logout-button"
            onClick={logout}
            title="Logout"
          >
            Logout
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
        className={`characters-list ${searching ? 'searching' : ''}`}
        ref={scrollRef}
      >
        {displayedCharacters.map((c, index) => (
          <li 
            key={c.id} 
            className="character-item" 
            onClick={() => navigate(`/characters/${c.id}`)}
            ref={index === displayedCharacters.length - 3 ? lastCharacterRef : null}
          >
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
        
        {loadingMore && (
          <li className="character-item loading-more">
            <div className="loading-spinner">Loading more...</div>
          </li>
        )}

        {noSearchResults && (
          <li className="no-search-results-item">
            <div className="no-search-results-content">
              <p>No characters found for "{debouncedSearchTerm}"</p>
              <p>Try a different search term or check your spelling.</p>
            </div>
          </li>
        )}
      </ul>
      
      <div className="search-section">
        <div className="search-controls">
          <div className="search-input-container">
            <input
              type="text"
              placeholder={searching ? "Searching..." : "Search characters..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`search-input ${searching ? 'searching' : ''}`}
            />
            {searching && (
              <div className="search-spinner">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Characters;
