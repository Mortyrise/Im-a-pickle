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
      title={isFavorite ? 'Remove from favorites (Portal activated)' : 'Add to favorites (Activate portal)'}
    >
      <div className="portal-icon">
        <div className="portal-ring outer-ring"></div>
        <div className="portal-ring inner-ring"></div>
        <div className="portal-center"></div>
      </div>
      <div className="tooltip">
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </div>
    </button>
  );
};

export default FavoriteButton;
