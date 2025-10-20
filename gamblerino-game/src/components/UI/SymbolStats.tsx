import React from 'react';
import { SYMBOLS, TOTAL_WEIGHT } from '../../data/symbols';
import './SymbolStats.css';

const SymbolStats: React.FC = () => {
  const calculateRollChance = (weight: number) => {
    return ((weight / TOTAL_WEIGHT) * 100).toFixed(1);
  };

  return (
    <div className="symbol-stats">
      <div className="symbol-stats-header">
        <span className="symbol-stats-icon">🎯</span>
        <span className="symbol-stats-title">Symbol Stats</span>
      </div>
      
      <div className="symbol-stats-grid">
        {SYMBOLS.map((symbol) => (
          <div key={symbol.name} className="symbol-stat-item">
            <div className="symbol-emoji" style={{ color: symbol.color }}>
              {symbol.emoji}
            </div>
            <div className="symbol-info">
              <div className="symbol-name">{symbol.name}</div>
              <div className="symbol-details">
                <span className="symbol-value">{symbol.baseValue}</span>
                <span className="symbol-chance">{calculateRollChance(symbol.weight)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymbolStats;
