Patterns and Payouts
This feature detects winning patterns in the grid and computes coin payouts.
Description
Patterns are lines of 3 matching symbols (rows, columns, diagonals in 3x3). Payout = Symbol Value × Symbols Multiplier × Pattern Value × Patterns Multiplier. Use big numbers for scaling. After detection, roll for sixes overrides (666 resets, 999 doubles).
Key Components

Detection: Scan for full lines of matching symbols.
Multipliers: Track global symbols and patterns multipliers.
Overrides: Sequential checks for triple/double/single sixes with fixed chances.
Triggers: Some charms make patterns trigger extra times.

Step-by-Step Implementation

Multiplier States: Maintain state for symbols and patterns multipliers.
Detection Function: After grid generation, scan rows, columns, and diagonals for matches; for each, calculate base payout and apply multipliers.
Special Overrides: Post-payout, roll for sixes; if triggered, adjust coins accordingly (e.g., reset for 666).
UI: Highlight winning patterns with animations; show payout breakdown.
Integration: Call this in spin handler; link to charms for extra triggers or value boosts.