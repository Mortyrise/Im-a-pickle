import React from 'react';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite, 
  onToggle, 
  size = 'medium' 
}) => {
  return (
    <button 
      className={`favorite-button ${size} ${isFavorite ? 'favorited' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="star-icon">
        {isFavorite ? '★' : '☆'}
      </span>
    </button>
  );
};

export default FavoriteButton;
