import { random } from '../utils/random';

export interface LuckState {
  baseLuck: number;
  spontaneousLuck: number;
  totalLuck: number;
}

export interface LuckCalculation {
  totalLuck: number;
  guaranteedMatches: number;
  jackpotChance: boolean;
  spontaneousSources: string[];
}

export class LuckSystem {
  private state: LuckState;

  constructor() {
    this.state = {
      baseLuck: 0,
      spontaneousLuck: 0,
      totalLuck: 0
    };
  }

  // Calculate total luck for current spin
  calculateLuck(): LuckCalculation {
    this.updateSpontaneousLuck();
    this.state.totalLuck = this.state.baseLuck + this.state.spontaneousLuck;
    
    // Each luck point guarantees 1 symbol
    const guaranteedMatches = this.state.totalLuck;
    // Jackpot chance when you have enough luck to fill most/all of the grid (9 symbols)
    const jackpotChance = this.state.totalLuck >= 9;
    
    const spontaneousSources = this.getSpontaneousSources();
    
    return {
      totalLuck: this.state.totalLuck,
      guaranteedMatches,
      jackpotChance,
      spontaneousSources
    };
  }

  // Update spontaneous luck based on various factors
  private updateSpontaneousLuck(): void {
    // No spontaneous luck systems - luck is purely from charms and other permanent sources
    this.state.spontaneousLuck = 0;
  }

  // Get sources of spontaneous luck
  private getSpontaneousSources(): string[] {
    // No spontaneous luck sources
    return [];
  }

  // Record a spin result (no longer needed for luck calculation)
  recordSpin(hadWin: boolean): void {
    // Spin tracking removed - luck is now purely from charms
  }

  // Add base luck (from charms)
  addBaseLuck(amount: number): void {
    this.state.baseLuck += amount;
  }

  // Set base luck (from charms)
  setBaseLuck(amount: number): void {
    this.state.baseLuck = amount;
  }

  // Reset luck for new deadline
  resetForNewDeadline(): void {
    this.state.spontaneousLuck = 0;
    // Keep baseLuck (from equipped charms)
  }

  // Get current state
  getState(): LuckState {
    return { ...this.state };
  }

  // Force matches based on luck
  forceMatches(grid: string[][], symbolWeights: { [key: string]: number }): string[][] {
    const luckCalc = this.calculateLuck();
    const newGrid = grid.map(row => [...row]);

    console.log('🎲 LUCK SYSTEM DEBUG:');
    console.log('  Total Luck:', luckCalc.totalLuck);
    console.log('  Guaranteed Matches:', luckCalc.guaranteedMatches);
    console.log('  Jackpot Chance:', luckCalc.jackpotChance);
    console.log('  Original Grid:', grid);

    if (luckCalc.guaranteedMatches > 0) {
      // Each luck point guarantees 1 symbol
      const symbolsToPlace = Math.min(luckCalc.guaranteedMatches, 9); // Max 9 symbols (full grid)
      
      console.log('  Symbols to Place:', symbolsToPlace);
      
      // Get all available positions
      const allPositions: number[][] = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          allPositions.push([row, col]);
        }
      }
      
      // Select random positions for guaranteed symbols
      const selectedPositions = random.pickMultiple(allPositions, symbolsToPlace);
      console.log('  Selected Positions:', selectedPositions);
      
      const placedSymbols: string[] = [];
      
      // Select ONE symbol type for all guaranteed placements to create winning patterns
      const totalWeight = Object.values(symbolWeights).reduce((sum, weight) => sum + weight, 0);
      const randomValue = Math.random() * totalWeight;
      let currentWeight = 0;
      let selectedSymbol = 'lemon'; // fallback

      for (const [symbol, weight] of Object.entries(symbolWeights)) {
        currentWeight += weight;
        if (randomValue <= currentWeight) {
          selectedSymbol = symbol;
          break;
        }
      }
      
      console.log(`  Selected Symbol for ALL ${symbolsToPlace} placements: ${selectedSymbol}`);
      
      // Place the same symbol in all selected positions
      selectedPositions.forEach(([row, col], index) => {
        console.log(`  Placing symbol ${index + 1}/${symbolsToPlace}: ${selectedSymbol} at [${row},${col}]`);
        placedSymbols.push(selectedSymbol);
        newGrid[row][col] = selectedSymbol;
      });
      
      console.log('  Placed Symbols:', placedSymbols);
      console.log('  Final Grid:', newGrid);
    } else {
      console.log('  No luck applied - using original random grid');
    }

    return newGrid;
  }

  // Get random positions for forced matches
  private getRandomPositions(count: number): number[][] {
    const allPositions: number[][] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        allPositions.push([row, col]);
      }
    }

    return random.pickMultiple(allPositions, Math.min(count, allPositions.length));
  }

  // Check if current luck should trigger jackpot
  shouldTriggerJackpot(): boolean {
    return this.state.totalLuck >= 9;
  }

  // Get luck description for UI
  getLuckDescription(): string {
    const luckCalc = this.calculateLuck();
    const descriptions: string[] = [];

    if (luckCalc.guaranteedMatches > 0) {
      descriptions.push(`Guaranteed ${luckCalc.guaranteedMatches} symbol${luckCalc.guaranteedMatches > 1 ? 's' : ''}`);
    }

    if (luckCalc.jackpotChance) {
      descriptions.push('JACKPOT CHANCE!');
    }

    if (this.state.baseLuck > 0) {
      descriptions.push(`Base Luck: ${this.state.baseLuck}`);
    }

    return descriptions.join(' • ') || 'No luck bonus';
  }

}
