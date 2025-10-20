import React from 'react';
import { Charm } from '../../data/charms';
import './CharmCard.css';

interface CharmCardProps {
  charm: Charm;
  onPurchase: (charmId: string) => void;
  canAfford: boolean;
  canEquip: boolean;
  isEquipped?: boolean;
  onEquip?: (charmId: string) => void;
  onUnequip?: (charmId: string) => void;
}

const CharmCard: React.FC<CharmCardProps> = ({
  charm,
  onPurchase,
  canAfford,
  canEquip,
  isEquipped = false,
  onEquip,
  onUnequip
}) => {
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

  const getTierColor = (tier: string): string => {
    const colors = {
      S: '#ffd700',
      A: '#c0c0c0',
      B: '#cd7f32',
      C: '#8b4513'
    };
    return colors[tier as keyof typeof colors] || '#9ca3af';
  };

  const handleAction = () => {
    if (isEquipped && onUnequip) {
      onUnequip(charm.id);
    } else if (!isEquipped && onEquip && canEquip) {
      onEquip(charm.id);
    } else if (!isEquipped && canAfford) {
      onPurchase(charm.id);
    }
  };

  const getActionText = (): string => {
    if (isEquipped) return 'UNEQUIP';
    if (!isEquipped && onEquip && canEquip) return 'EQUIP';
    if (!isEquipped && canAfford) return 'BUY';
    return 'CANNOT AFFORD';
  };

  return (
    <div 
      className={`charm-card ${charm.rarity} ${isEquipped ? 'equipped' : ''}`}
      style={{
        borderColor: getRarityColor(charm.rarity),
        boxShadow: isEquipped ? `0 0 20px ${getRarityColor(charm.rarity)}` : undefined
      }}
    >
      <div className="charm-header">
        <div className="charm-name">{charm.name}</div>
        <div className="charm-cost">🎫 {charm.cost}</div>
      </div>
      
      <div className="charm-tier" style={{ color: getTierColor(charm.tier) }}>
        {charm.tier}-TIER
      </div>
      
      <div className="charm-effect">
        {charm.effect}
      </div>
      
      <div className="charm-description">
        {charm.description}
      </div>
      
      <div className="charm-stats">
        <span className="charm-type">{charm.effectType.replace('_', ' ').toUpperCase()}</span>
        {charm.triggerChance && (
          <span className="charm-chance">{Math.round(charm.triggerChance * 100)}%</span>
        )}
      </div>
      
      <button
        className={`charm-action ${!canAfford && !isEquipped ? 'disabled' : ''}`}
        onClick={handleAction}
        disabled={!canAfford && !isEquipped}
      >
        {getActionText()}
      </button>
    </div>
  );
};

export default CharmCard;
