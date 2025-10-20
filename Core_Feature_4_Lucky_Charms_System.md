Lucky Charms System
Lucky Charms are items that modify rules, providing passive buffs, triggers, or synergies.
Description
Charms are bought with tickets and equipped in limited slots (base + upgrades). Effects include +spins, +luck, multipliers. Types: passive, random trigger (e.g., 10% chance), red-button (usable with energy), pattern-triggered.
Key Components

Charm Data: Name, cost, rarity, effect type.
Equipment: Limited slots; apply effects on relevant events.
Rarities: Affect shop appearance (common to ultra legendary).
Triggers: Handle random percentages, button activations.

Step-by-Step Implementation

Data Structure: Array of charm objects with properties like name, cost, effect description.
State Management: Track equipped charms and slot limit.
Apply Effects: On events (e.g., round start for +spins, spin for triggers), loop through equipped charms and apply matching effects.
Red Button: Add UI button to activate usable charms if energy available; restore energy at deadlines.
Integration: Link to shop for purchasing; use in other systems like spins or payouts.