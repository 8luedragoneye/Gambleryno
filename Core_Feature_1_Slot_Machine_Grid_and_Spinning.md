Slot Machine Grid and Spinning Mechanics
This core feature handles the primary interaction: spinning the slot machine to generate symbols and calculate payouts. It's the foundation of gameplay, where each spin populates a 3x3 grid with symbols based on probabilities.
Description
The slot machine uses a 3x3 grid. Spins are free but limited per deadline (base amount plus bonuses from charms). Each spin clears the grid, generates symbols independently per cell using weighted probabilities, applies luck for forced matches, checks for sixes overrides, detects patterns, and awards coins based on calculations.
Key Components

Grid: A 3x3 array holding symbols.
Symbol Generation: Weighted random selection per cell.
Spin Limits: Track remaining spins per deadline.
Visuals: Animate spinning for immersion.
UI: Display spins left, current coins, luck meter.

Step-by-Step Implementation

State Management: Use React state to manage the 3x3 grid (as a 2D array), remaining spins, and current coins.
Symbol Generation Function: Create a function for weighted random symbol selection based on current weights (adjustable by charms and phone calls).
Spin Handler: On button click, check if spins remain; if yes, generate a new grid, apply luck modifications, detect patterns, calculate payouts, apply special overrides like sixes, update coins, and decrement spins.
Rendering: Use a CSS grid to display the 3x3 cells with symbol icons; add a spin button and status displays.
Integration: Link to luck system for forced matches, charms for probability adjustments, and patterns for payouts. Test as a standalone component before adding rounds.