import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const FAVORITES_KEY = 'rickAndMortyFavorites';

export interface FavoriteCharacter {
  id: number;
  name: string;
  image: string;
}

export interface FavoritesContextType {
  favorites: FavoriteCharacter[];
  addToFavorites: (character: FavoriteCharacter) => void;
  removeFromFavorites: (characterId: number) => void;
  toggleFavorite: (character: FavoriteCharacter) => void;
  isFavorite: (characterId: number) => boolean;
  getFavoriteCount: () => number;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteCharacter[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (character: FavoriteCharacter) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === character.id)) {
        return prev; 
      }
      return [...prev, character];
    });
  };

  const removeFromFavorites = (characterId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== characterId));
  };

  const toggleFavorite = (character: FavoriteCharacter) => {
    if (isFavorite(character.id)) {
      removeFromFavorites(character.id);
    } else {
      addToFavorites(character);
    }
  };

  const isFavorite = (characterId: number): boolean => {
    return favorites.some(fav => fav.id === characterId);
  };

  const getFavoriteCount = (): number => {
    return favorites.length;
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoriteCount
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};


