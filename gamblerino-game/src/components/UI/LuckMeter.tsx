import React from 'react';
import { LuckCalculation } from '../../systems/luckSystem';
import './LuckMeter.css';

interface LuckMeterProps {
  luckCalculation: LuckCalculation;
  isSpinning?: boolean;
}

const LuckMeter: React.FC<LuckMeterProps> = ({ luckCalculation, isSpinning = false }) => {
  // Simple luck display without levels
  const getLuckColor = (): string => {
    if (luckCalculation.totalLuck >= 9) return '#ffd700'; // Gold for high luck
    if (luckCalculation.totalLuck >= 5) return '#4ecdc4'; // Teal for medium luck
    if (luckCalculation.totalLuck >= 1) return '#10b981'; // Green for low luck
    return '#9ca3af'; // Gray for no luck
  };

  const getLuckIcon = (): string => {
    if (luckCalculation.totalLuck >= 9) return '🍀✨';
    if (luckCalculation.totalLuck >= 5) return '🍀';
    if (luckCalculation.totalLuck >= 1) return '🍃';
    return '🍂';
  };

  const color = getLuckColor();
  const icon = getLuckIcon();

  return (
    <div className={`luck-meter ${isSpinning ? 'spinning' : ''}`}>
      <div className="luck-header">
        <span className="luck-icon">{icon}</span>
        <span className="luck-label">Luck</span>
        <span className="luck-value" style={{ color }}>
          {luckCalculation.totalLuck}
        </span>
      </div>

      <div className="luck-bar-container">
        <div 
          className="luck-bar"
          style={{ 
            width: `${Math.min((luckCalculation.totalLuck / 9) * 100, 100)}%`,
            backgroundColor: color
          }}
        />
      </div>

      <div className="luck-effects">
        {luckCalculation.guaranteedMatches > 0 && (
          <div className="luck-effect guaranteed">
            <span className="effect-icon">🎯</span>
            <span className="effect-text">
              {luckCalculation.guaranteedMatches} guaranteed match{luckCalculation.guaranteedMatches > 1 ? 'es' : ''}
            </span>
          </div>
        )}

        {luckCalculation.jackpotChance && (
          <div className="luck-effect jackpot">
            <span className="effect-icon">💎</span>
            <span className="effect-text">JACKPOT CHANCE!</span>
          </div>
        )}

        {luckCalculation.spontaneousSources.length > 0 && (
          <div className="luck-effect sources">
            <span className="effect-icon">⚡</span>
            <span className="effect-text">
              {luckCalculation.spontaneousSources.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuckMeter;
