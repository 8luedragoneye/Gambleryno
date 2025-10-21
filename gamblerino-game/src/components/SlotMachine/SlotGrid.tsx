import React from 'react';
import { getSymbolByName } from '../../data/symbols';
import { GridSize } from '../../systems/patternGenerator';
import './SlotGrid.css';

interface SlotGridProps {
  grid: string[][];
  isSpinning?: boolean;
  winningPositions?: number[][];
  gridSize: GridSize;
}

const SlotGrid: React.FC<SlotGridProps> = ({ 
  grid, 
  isSpinning = false, 
  winningPositions = [],
  gridSize
}) => {
  const isWinningPosition = (row: number, col: number): boolean => {
    return winningPositions.some(([r, c]) => r === row && c === col);
  };

  // Dynamic grid styling based on grid size
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
  };

  return (
    <div 
      className={`slot-grid ${isSpinning ? 'spinning' : ''}`}
      style={gridStyle}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="slot-row">
          {row.map((symbolName, colIndex) => {
            const symbol = getSymbolByName(symbolName);
            const isWinning = isWinningPosition(rowIndex, colIndex);
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`slot-cell ${isWinning ? 'winning' : ''} ${isSpinning ? 'spinning' : ''}`}
                style={{
                  backgroundColor: symbol?.color || '#333',
                  animationDelay: `${(rowIndex * gridSize.cols + colIndex) * 0.1}s`
                }}
              >
                <span className="symbol-emoji">
                  {symbol?.emoji || '❓'}
                </span>
                <span className="symbol-name">
                  {symbol?.name || symbolName}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SlotGrid;
