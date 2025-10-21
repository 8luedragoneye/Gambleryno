Phone Calls
Random events at deadline starts offering choices.
Description
Types: Normal (buffs), Evil (mixed), Holy (buffs). Rarities affect options; pick one or more.
Key Components

Types and Options: Lists of effects (e.g., +space, +multipliers, manifestations).
Triggers: Based on previous sixes or unlocks.
Rarities: Weighted generation.

Step-by-Step Implementation

Data Structure: Arrays for normal/evil/holy calls with rarity, max picks.
Trigger Logic: At deadline start, determine type; generate options with rerolls.
Apply Effects: On selection, update states (e.g., weights, multipliers).
UI: Modal for call, show options to choose.
Integration: Call at round start; track for evil/holy scheduling.