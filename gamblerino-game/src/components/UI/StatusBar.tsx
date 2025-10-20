import React from 'react';
import SymbolStats from './SymbolStats';
import './StatusBar.css';

interface StatusBarProps {
  coins: number;
  tickets: number;
  spinsRemaining: number;
  luck: number;
  currentDeadline: number;
  debt: number;
}

const StatusBar: React.FC<StatusBarProps> = ({
  coins,
  tickets,
  spinsRemaining,
  luck,
  currentDeadline,
  debt
}) => {
  return (
    <div className="status-bar">
      <div className="status-section">
        <div className="status-item">
          <span className="status-icon">🪙</span>
          <span className="status-label">Coins</span>
          <span className="status-value">{coins}</span>
        </div>
        
        <div className="status-item">
          <span className="status-icon">🎫</span>
          <span className="status-label">Tickets</span>
          <span className="status-value">{tickets}</span>
        </div>
        
        <div className="status-item">
          <span className="status-icon">🎰</span>
          <span className="status-label">Spins</span>
          <span className="status-value">{spinsRemaining}</span>
        </div>
      </div>

      <div className="status-section">
        <div className="status-item">
          <span className="status-icon">🍀</span>
          <span className="status-label">Luck</span>
          <span className="status-value">{luck}</span>
        </div>
      </div>

      <div className="status-section deadline-section">
        <div className="status-item deadline-item">
          <span className="status-icon">📅</span>
          <span className="status-label">Deadline {currentDeadline}</span>
          <span className="status-value debt">${debt}</span>
        </div>
      </div>

      <SymbolStats />
    </div>
  );
};

export default StatusBar;
