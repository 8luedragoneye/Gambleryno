import { useState, useCallback, useEffect } from 'react';
import { GridSize, GridSizeModifier } from '../systems/patternGenerator';

export interface GridSizeState {
  rows: number;
  cols: number;
  modifiers: GridSizeModifier[];
}

export const useGridSize = (initialSize: GridSize = { rows: 3, cols: 3 }) => {
  const [state, setState] = useState<GridSizeState>({
    rows: initialSize.rows,
    cols: initialSize.cols,
    modifiers: []
  });

  // Update grid size
  const updateGridSize = useCallback((newSize: GridSize) => {
    setState(prev => ({
      ...prev,
      rows: newSize.rows,
      cols: newSize.cols
    }));
  }, []);

  // Apply grid size modifier
  const applyGridSizeModifier = useCallback((modifier: GridSizeModifier) => {
    setState(prev => {
      const newModifiers = [...prev.modifiers, modifier];
      const newRows = Math.max(1, prev.rows + modifier.rows);
      const newCols = Math.max(1, prev.cols + modifier.cols);
      
      return {
        rows: newRows,
        cols: newCols,
        modifiers: newModifiers
      };
    });
  }, []);

  // Remove grid size modifier
  const removeGridSizeModifier = useCallback((source: string) => {
    setState(prev => {
      const newModifiers = prev.modifiers.filter(mod => mod.source !== source);
      
      // Recalculate grid size without the removed modifier
      let newRows = 3; // Base size
      let newCols = 3; // Base size
      
      newModifiers.forEach(mod => {
        newRows = Math.max(1, newRows + mod.rows);
        newCols = Math.max(1, newCols + mod.cols);
      });
      
      return {
        rows: newRows,
        cols: newCols,
        modifiers: newModifiers
      };
    });
  }, []);

  // Apply temporary modifier with duration
  const applyTemporaryModifier = useCallback((modifier: GridSizeModifier, duration: number) => {
    applyGridSizeModifier(modifier);
    
    // Set timeout to remove the modifier
    setTimeout(() => {
      removeGridSizeModifier(modifier.source);
    }, duration * 1000); // Convert to milliseconds
  }, [applyGridSizeModifier, removeGridSizeModifier]);

  // Get current effective grid size
  const getCurrentGridSize = useCallback((): GridSize => {
    return {
      rows: state.rows,
      cols: state.cols
    };
  }, [state.rows, state.cols]);

  // Check if a modifier is active
  const isModifierActive = useCallback((source: string): boolean => {
    return state.modifiers.some(mod => mod.source === source);
  }, [state.modifiers]);

  // Get all active modifiers
  const getActiveModifiers = useCallback((): GridSizeModifier[] => {
    return [...state.modifiers];
  }, [state.modifiers]);

  // Reset to base grid size
  const resetToBase = useCallback(() => {
    setState({
      rows: 3,
      cols: 3,
      modifiers: []
    });
  }, []);

  // Process charm effects on grid size
  const processCharmGridEffects = useCallback((charmEffects: any[]) => {
    charmEffects.forEach(effect => {
      if (effect.type === 'grid_size' && effect.modifier) {
        if (effect.duration) {
          applyTemporaryModifier(effect.modifier, effect.duration);
        } else {
          applyGridSizeModifier(effect.modifier);
        }
      }
    });
  }, [applyGridSizeModifier, applyTemporaryModifier]);

  return {
    state,
    updateGridSize,
    applyGridSizeModifier,
    removeGridSizeModifier,
    applyTemporaryModifier,
    getCurrentGridSize,
    isModifierActive,
    getActiveModifiers,
    resetToBase,
    processCharmGridEffects
  };
};
