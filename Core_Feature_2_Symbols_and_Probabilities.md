Symbols and Probabilities
This feature defines the symbols, their base values, and spawn probabilities, which influence grid generation.
Description
There are 7 main symbols with base weights determining appearance chances. Charms and phone calls modify weights (e.g., +manifestation increases weight). Symbols can have modifiers like Golden (extra value). Sixes are special for overrides.
Key Components

Symbols List:

Lemon: Weight 1.3 (~19.4%), base value defined in balance.
Cherry: Weight 1.3 (~19.4%).
Clover: Weight 1.0 (~14.9%).
Bell: Weight 1.0 (~14.9%).
Diamond: Weight 0.8 (~11.9%).
Treasure (Coins): Weight 0.8 (~11.9%).
Seven: Weight 0.5 (~7.5%).


Modifiers: Golden (+value boost), Ticket (+tickets), others like Battery, Token.
Adjustments: +1 manifestation adds 0.8 to weight; halving divides current weight by 2; value doubles/triples from phone calls apply to current value.

Step-by-Step Implementation

Data Structure: Create an object or array with symbol names, base weights, and base values.
Dynamic Weights: Use state to track current weights; provide functions to apply manifestations or halvings from charms/phone calls.
Generation with Modifiers: In symbol generation, first pick base symbol via weights, then roll for modifiers based on charm probabilities (e.g., +20% for Golden on specific symbols).
UI: Display symbols with visual indicators for modifiers (e.g., gold border).
Integration: Update grid cells to hold symbol objects including modifiers; use in payout calculations.
