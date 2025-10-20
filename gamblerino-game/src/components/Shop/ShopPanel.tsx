import React, { useState, useEffect } from 'react';
import { CHARMS, RARITY_WEIGHTS, getCharmById } from '../../data/charms';
import { random } from '../../utils/random';
import CharmCard from './CharmCard';
import './ShopPanel.css';

interface ShopPanelProps {
  tickets: number;
  onSpendTickets: (amount: number) => boolean;
  onEquipCharm: (charmId: string) => boolean;
  onUnequipCharm: (charmId: string) => void;
  equippedCharms: string[];
  maxCharmSlots: number;
  restockCost: number;
  onRestock: (cost: number) => boolean;
  onClose: () => void;
}

interface ShopCharm {
  charm: typeof CHARMS[0];
  id: string;
}

const ShopPanel: React.FC<ShopPanelProps> = ({
  tickets,
  onSpendTickets,
  onEquipCharm,
  onUnequipCharm,
  equippedCharms,
  maxCharmSlots,
  restockCost,
  onRestock,
  onClose
}) => {
  const [shopCharms, setShopCharms] = useState<ShopCharm[]>([]);
  const [ownedCharms, setOwnedCharms] = useState<string[]>([]);

  // Generate shop inventory
  const generateShopInventory = () => {
    const newShopCharms: ShopCharm[] = [];
    const totalWeight = Object.values(RARITY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    
    for (let i = 0; i < 4; i++) {
      const randomValue = Math.random() * totalWeight;
      let currentWeight = 0;
      
      for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
        currentWeight += weight;
        if (randomValue <= currentWeight) {
          const charmsOfRarity = CHARMS.filter(charm => charm.rarity === rarity);
          if (charmsOfRarity.length > 0) {
            const selectedCharm = random.pick(charmsOfRarity);
            newShopCharms.push({
              charm: selectedCharm,
              id: random.id()
            });
          }
          break;
        }
      }
    }
    
    setShopCharms(newShopCharms);
  };

  // Initialize shop on mount
  useEffect(() => {
    generateShopInventory();
  }, []);

  const handlePurchase = (charmId: string) => {
    const shopCharm = shopCharms.find(sc => sc.id === charmId);
    if (shopCharm && onSpendTickets(shopCharm.charm.cost)) {
      setOwnedCharms(prev => [...prev, shopCharm.charm.id]);
      setShopCharms(prev => prev.filter(sc => sc.id !== charmId));
    }
  };

  const handleEquip = (charmId: string) => {
    if (onEquipCharm(charmId)) {
      // Charm equipped successfully
    }
  };

  const handleUnequip = (charmId: string) => {
    onUnequipCharm(charmId);
  };

  const handleRestock = () => {
    if (onRestock(restockCost)) {
      generateShopInventory();
    }
  };


  const isEquipped = (charmId: string) => {
    return equippedCharms.includes(charmId);
  };

  const canEquip = (charmId: string) => {
    return equippedCharms.length < maxCharmSlots && !isEquipped(charmId);
  };

  return (
    <div className="shop-panel">
      <div className="shop-header">
        <h2>🛒 Lucky Charms Shop</h2>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="shop-info">
        <div className="shop-currency">
          <span className="tickets">🎫 {tickets} tickets</span>
        </div>
        <div className="shop-slots">
          <span className="slots">Charm Slots: {equippedCharms.length}/{maxCharmSlots}</span>
        </div>
      </div>

      <div className="shop-actions">
        <button 
          className="restock-button"
          onClick={handleRestock}
          disabled={tickets < restockCost}
        >
          Restock Shop (🎫 {restockCost})
        </button>
      </div>

      <div className="shop-inventory">
        <h3>Available Charms</h3>
        <div className="charm-grid">
          {shopCharms.map(shopCharm => (
            <CharmCard
              key={shopCharm.id}
              charm={shopCharm.charm}
              onPurchase={() => handlePurchase(shopCharm.id)}
              canAfford={tickets >= shopCharm.charm.cost}
              canEquip={canEquip(shopCharm.charm.id)}
              isEquipped={isEquipped(shopCharm.charm.id)}
              onEquip={() => handleEquip(shopCharm.charm.id)}
              onUnequip={() => handleUnequip(shopCharm.charm.id)}
            />
          ))}
        </div>
      </div>

      {ownedCharms.length > 0 && (
        <div className="owned-charms">
          <h3>Your Charms</h3>
          <div className="charm-grid">
            {ownedCharms.map(charmId => {
              const charm = getCharmById(charmId);
              if (!charm) return null;
              
              return (
                <CharmCard
                  key={charmId}
                  charm={charm}
                  onPurchase={() => {}} // No purchase action for owned charms
                  canAfford={false}
                  canEquip={canEquip(charmId)}
                  isEquipped={isEquipped(charmId)}
                  onEquip={() => handleEquip(charmId)}
                  onUnequip={() => handleUnequip(charmId)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPanel;
