import React from 'react';
import { ActiveCharm } from '../../systems/charmSystem';
import './CharmDisplay.css';

interface CharmDisplayProps {
  equippedCharms: ActiveCharm[];
  maxSlots: number;
}

const CharmDisplay: React.FC<CharmDisplayProps> = ({ equippedCharms, maxSlots }) => {
  const getRarityColor = (rarity: string): string => {
    const colors = {
      common: '#9ca3af',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b',
      ultra_legendary: '#ef4444'
    };
    return colors[rarity as keyof typeof colors] || '#9ca3af';
  };

  return (
    <div className="charm-display">
      <h3>🍀 Equipped Charms ({equippedCharms.length}/{maxSlots})</h3>
      <div className="charm-slots">
        {Array.from({ length: maxSlots }, (_, index) => {
          const charm = equippedCharms[index];
          return (
            <div 
              key={index} 
              className={`charm-slot ${charm ? 'filled' : 'empty'}`}
              style={charm ? { borderColor: getRarityColor(charm.charm.rarity) } : {}}
            >
              {charm ? (
                <div className="charm-info">
                  <div className="charm-name">{charm.charm.name}</div>
                  <div className="charm-effect">{charm.charm.effect}</div>
                  {charm.usesRemaining && (
                    <div className="charm-uses">Uses: {charm.usesRemaining}</div>
                  )}
                </div>
              ) : (
                <div className="empty-slot">Empty</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharmDisplay;
