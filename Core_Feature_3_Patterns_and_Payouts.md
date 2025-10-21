Patterns and Payouts
This feature detects winning patterns in the grid and computes coin payouts.
Description
Patterns are lines of 3 matching symbols (rows, columns, diagonals in 3x3). Payout = Symbol Value × Symbols Multiplier × Pattern Value × Patterns Multiplier. Use big numbers for scaling.
Key Components

Detection: Scan for full lines of matching symbols.
Multipliers: Track global symbols and patterns multipliers.
Triggers: Some charms make patterns trigger extra times.

Step-by-Step Implementation

Multiplier States: Maintain state for symbols and patterns multipliers.
Detection Function: After grid generation, scan rows, columns, and diagonals for matches; for each, calculate base payout and apply multipliers.
UI: Highlight winning patterns with animations; show payout breakdown.
Integration: Call this in spin handler; link to charms for extra triggers or value boosts.