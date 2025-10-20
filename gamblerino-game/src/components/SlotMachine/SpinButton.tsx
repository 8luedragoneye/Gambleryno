import React from 'react';
import './SpinButton.css';

interface SpinButtonProps {
  onSpin: () => void;
  spinsRemaining: number;
  isSpinning: boolean;
  disabled?: boolean;
}

const SpinButton: React.FC<SpinButtonProps> = ({ 
  onSpin, 
  spinsRemaining, 
  isSpinning, 
  disabled = false 
}) => {
  const canSpin = spinsRemaining > 0 && !isSpinning && !disabled;

  return (
    <div className="spin-button-container">
      <button
        className={`spin-button ${!canSpin ? 'disabled' : ''} ${isSpinning ? 'spinning' : ''}`}
        onClick={onSpin}
        disabled={!canSpin}
      >
        <div className="button-content">
          <span className="button-text">
            {isSpinning ? 'SPINNING...' : 'SPIN'}
          </span>
          <span className="spins-remaining">
            {spinsRemaining} spins left
          </span>
        </div>
        <div className="button-glow"></div>
      </button>
    </div>
  );
};

export default SpinButton;
