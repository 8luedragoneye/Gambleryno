import React, { useState, useEffect } from 'react';
import { useSlotMachine } from './hooks/useSlotMachine';
import { useGameState } from './hooks/useGameState';
import { useCharms } from './hooks/useCharms';
import { useLuck } from './hooks/useLuck';
import { usePhoneCalls } from './hooks/usePhoneCalls';
import { useGridSize } from './hooks/useGridSize';
import { GridSize } from './systems/patternGenerator';
import { analyzePatterns, testWinningGrid, testMixedGrid } from './utils/patternAnalysis';
import SlotGrid from './components/SlotMachine/SlotGrid';
import SpinButton from './components/SlotMachine/SpinButton';
import StatusBar from './components/UI/StatusBar';
import CharmDisplay from './components/UI/CharmDisplay';
import LuckMeter from './components/UI/LuckMeter';
import ShopPanel from './components/Shop/ShopPanel';
import PhoneCallModal from './components/PhoneCalls/PhoneCallModal';
import './App.css';

function App() {
  // Initialize grid size management
  const { 
    state: gridSizeState, 
    updateGridSize, 
    applyGridSizeModifier, 
    getCurrentGridSize 
  } = useGridSize({ rows: 3, cols: 3 });
  
  const { state: slotState, spin, resetSpins, addSpins, updateMultipliers, updateLuck, addCoins, updateGridSize: updateSlotGridSize } = useSlotMachine(5, gridSizeState);
  const { state: gameState, payDebt, advanceDeadline, setGamePhase, addTickets, spendTickets, updateGridSize: updateGameGridSize } = useGameState();
  const { 
    equipCharm, 
    unequipCharm, 
    getEquippedCharms, 
    processCharmEffects 
  } = useCharms(3);
  
  const {
    calculateLuck,
    recordSpin,
    addBaseLuck,
    resetForNewDeadline: resetLuck
  } = useLuck();
  
  const {
    currentCall,
    triggerPhoneCall,
    processPhoneCallOptions,
    closeCurrentCall,
    phoneCallSystem
  } = usePhoneCalls();
  
  const [lastSpinResult, setLastSpinResult] = useState<any>(null);
  const [winningPositions, setWinningPositions] = useState<number[][]>([]);
  const [showShop, setShowShop] = useState(false);
  const [currentLuck, setCurrentLuck] = useState(calculateLuck());
  const [phoneCallTriggered, setPhoneCallTriggered] = useState(false);
  const [pendingPhoneCall, setPendingPhoneCall] = useState<any>(null);

  const handleSpin = () => {
    console.log('🎮 HANDLE SPIN - APP LEVEL:');
    
    // Calculate current luck
    const luckCalc = calculateLuck();
    console.log('  Initial Luck Calculation:', luckCalc);
    setCurrentLuck(luckCalc);

    // Process charm effects before spinning
    const charmEffects = processCharmEffects('spin', {
      luck: luckCalc.totalLuck,
      symbolsMultiplier: slotState.symbolsMultiplier,
      patternsMultiplier: slotState.patternsMultiplier
    });
    console.log('  Charm Effects:', charmEffects);

    // Update multipliers and luck based on charm effects
    const finalLuck = charmEffects.luck || luckCalc.totalLuck;
    console.log('  Final Luck to Apply:', finalLuck);
    
    updateMultipliers(charmEffects.symbolsMultiplier || slotState.symbolsMultiplier, 
                     charmEffects.patternsMultiplier || slotState.patternsMultiplier);
    updateLuck(finalLuck);

    const result = spin();
    if (result) {
      // Record spin result for luck system
      recordSpin(result.matches.length > 0);
      
      setLastSpinResult(result);
      
      // Extract winning positions from matches
      const positions: number[][] = [];
      result.matches.forEach(match => {
        positions.push(...match.positions);
      });
      setWinningPositions(positions);
      
      // Process pattern-triggered charm effects
      if (result.matches.length > 0) {
        const patternEffects = processCharmEffects('pattern_match', {
          patternCount: result.matches.length,
          totalPayout: result.totalPayout
        });
        
        // Apply any pattern-triggered effects here
        if (patternEffects.patternMultiplier) {
          // Could modify payout based on pattern effects
        }
      }

      // Generate tickets based on matches (simple system for now)
      if (result.matches.length > 0) {
        const ticketsEarned = Math.floor(result.matches.length * 0.5); // 0.5 tickets per match
        if (ticketsEarned > 0) {
          addTickets(ticketsEarned);
        }
      }

      // Special sequences still have effects but don't trigger phone calls
      // 666 and 999 effects are handled in the slot machine logic
      
      // Check if spins are exhausted
      if (slotState.spinsRemaining <= 1) {
        setGamePhase('shop');
      }
    }
  };

  const handlePayDebt = () => {
    if (payDebt(slotState.coins)) {
      advanceDeadline();
      resetSpins(5); // Reset spins for new deadline
      resetLuck(); // Reset luck for new deadline
      setGamePhase('playing');
      setLastSpinResult(null);
      setWinningPositions([]);
      setCurrentLuck(calculateLuck());
      setPhoneCallTriggered(false); // Reset phone call trigger for new deadline
      setPendingPhoneCall(null); // Reset pending phone call
    }
  };

  const handleShopComplete = () => {
    setGamePhase('playing');
    setShowShop(false);
  };

  const handleOpenShop = () => {
    setShowShop(true);
  };

  const handleCloseShop = () => {
    setShowShop(false);
  };


  const handleEquipCharm = (charmId: string) => {
    const success = equipCharm(charmId);
    
    // Check if charm has grid size modifier
    if (success) {
      const charmEffects = processCharmEffects('equip', {});
      
      if (charmEffects.gridSizeModifier) {
        const newGridSize = {
          rows: Math.max(1, gridSizeState.rows + charmEffects.gridSizeModifier.rows),
          cols: Math.max(1, gridSizeState.cols + charmEffects.gridSizeModifier.cols)
        };
        
        updateGridSize(newGridSize);
        updateSlotGridSize(newGridSize);
        updateGameGridSize(newGridSize);
      }
    }
    
    return success;
  };

  const handleUnequipCharm = (charmId: string) => {
    unequipCharm(charmId);
    
    // Recalculate grid size after unequipping charm
    const currentGridSize = getCurrentGridSize();
    updateSlotGridSize(currentGridSize);
    updateGameGridSize(currentGridSize);
  };

  const handleRestock = (cost: number) => {
    return spendTickets(cost);
  };

  const calculateRestockCost = () => {
    return 50 + (gameState.currentDeadline - 1) * 25;
  };

  // Phone call handlers
  const handlePhoneCallOptionSelect = (selectedOptions: any[]) => {
    const activeCall = currentCall || pendingPhoneCall;
    if (activeCall) {
      const effects = processPhoneCallOptions(activeCall.call, selectedOptions);
      applyPhoneCallEffects(effects);
      
      // Close the phone call and return to playing
      closeCurrentCall();
      setPendingPhoneCall(null);
      setGamePhase('playing');
    }
  };

  const applyPhoneCallEffects = (effects: any[]) => {
    effects.forEach(effect => {
      switch (effect.type) {
        case 'spins':
          // Add spins to current round
          if (effect.value > 0) {
            addSpins(effect.value);
          }
          break;
        case 'luck':
          addBaseLuck(effect.value);
          // Update UI luck display immediately
          const newLuckCalc = calculateLuck();
          setCurrentLuck(newLuckCalc);
          // Also update slot machine luck for StatusBar display
          updateLuck(newLuckCalc.totalLuck);
          break;
        case 'multiplier':
          // Update multipliers
          const currentSymbolsMultiplier = slotState.symbolsMultiplier;
          const currentPatternsMultiplier = slotState.patternsMultiplier;
          updateMultipliers(
            currentSymbolsMultiplier + effect.value,
            currentPatternsMultiplier + effect.value
          );
          break;
        case 'coins':
          // Add coins
          addCoins(effect.value);
          break;
        case 'tickets':
          addTickets(effect.value);
          break;
        case 'charm_slot':
          // Update charm slots - this would need to be implemented
          break;
        case 'interest':
          // Update interest rate - this would need to be implemented
          break;
        case 'manifestation':
          // Update symbol manifestations - this would need to be implemented
          break;
        case 'protection':
          // Divine protection no longer used
          break;
        case 'curse':
          // Apply curse effects - this would need to be implemented
          break;
      }
    });
  };

  // Phone call at start of each deadline
  useEffect(() => {
    if (gameState.gamePhase === 'playing' && !phoneCallTriggered) {
      const call = triggerPhoneCall();
      if (call) {
        setPendingPhoneCall(call);
        setPhoneCallTriggered(true);
        setGamePhase('phone_call');
      }
    }
  }, [gameState.gamePhase, phoneCallTriggered, triggerPhoneCall, setGamePhase, gameState.currentDeadline]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎰 Gamblerino 🎰</h1>
        <p>Escape the demonic slot machine!</p>
      </header>

      <main className="App-main">
        {gameState.gamePhase === 'playing' && (
          <div className="game-layout">
            {/* Left Sidebar - Charms */}
            <div className="left-sidebar">
              <CharmDisplay
                equippedCharms={getEquippedCharms()}
                maxSlots={3}
              />
            </div>

            {/* Center - Slot Machine */}
            <div className="center-area">
              <LuckMeter
                luckCalculation={currentLuck}
                isSpinning={slotState.isSpinning}
              />
              
              <SlotGrid
                grid={slotState.grid}
                isSpinning={slotState.isSpinning}
                winningPositions={winningPositions}
                gridSize={slotState.gridSize}
              />
              
              <div className="game-controls">
                <SpinButton
                  onSpin={handleSpin}
                  spinsRemaining={slotState.spinsRemaining}
                  isSpinning={slotState.isSpinning}
                />
                
                <button 
                  className="open-shop-button"
                  onClick={handleOpenShop}
                  disabled={gameState.tickets === 0}
                >
                  🛒 Shop ({gameState.tickets} tickets)
                </button>
                
                <button 
                  className="test-patterns-button"
                  onClick={() => analyzePatterns(slotState.gridSize, slotState.grid)}
                  style={{ marginLeft: '10px', padding: '8px 12px', fontSize: '12px' }}
                >
                  🔍 Analyze Patterns
                </button>
                
                <button 
                  className="test-winning-button"
                  onClick={() => testWinningGrid(slotState.gridSize)}
                  style={{ marginLeft: '5px', padding: '8px 12px', fontSize: '12px' }}
                >
                  🎰 Test Winning
                </button>
              </div>

              {lastSpinResult && (
                <div className="spin-result">
                  {lastSpinResult.matches.length > 0 && (
                    <div className="matches">
                      <h3>🎉 Matches Found!</h3>
                      {lastSpinResult.matches.map((match: any, index: number) => (
                        <div key={index} className="match">
                          <span>{match.pattern.name}: {match.symbol}</span>
                          <span>+{match.payout} coins</span>
                        </div>
                      ))}
                      <div className="total-payout">
                        Total: +{lastSpinResult.totalPayout} coins
                      </div>
                    </div>
                  )}
                  
                  {lastSpinResult.specialSequence && (
                    <div className={`special-sequence ${lastSpinResult.specialSequence}`}>
                      {lastSpinResult.specialSequence === '666' && (
                        <div>😈 666 - All coins reset!</div>
                      )}
                      {lastSpinResult.specialSequence === '999' && (
                        <div>😇 999 - Double payout!</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar - Stats */}
            <div className="right-sidebar">
              <StatusBar
                coins={slotState.coins}
                tickets={gameState.tickets}
                spinsRemaining={slotState.spinsRemaining}
                luck={slotState.luck}
                currentDeadline={gameState.currentDeadline}
                debt={gameState.debt}
              />
            </div>
          </div>
        )}

        {gameState.gamePhase === 'shop' && (
          <div className="shop-area">
            <h2>🛒 Shop</h2>
            <p>Deadline {gameState.currentDeadline} complete!</p>
            <p>You earned {slotState.coins} coins</p>
            <p>Debt: ${gameState.debt}</p>
            
            <button 
              className="pay-debt-button"
              onClick={handlePayDebt}
              disabled={slotState.coins < gameState.debt}
            >
              Pay Debt (${gameState.debt})
            </button>
            
            <button 
              className="shop-button"
              onClick={handleOpenShop}
            >
              Open Charm Shop
            </button>
            
            <button 
              className="continue-button"
              onClick={handleShopComplete}
            >
              Continue Playing
            </button>
          </div>
        )}

        {gameState.gamePhase === 'phone_call' && (currentCall || pendingPhoneCall) && (
          <PhoneCallModal
            call={(currentCall || pendingPhoneCall).call}
            onSelectOptions={handlePhoneCallOptionSelect}
            onClose={() => {
              closeCurrentCall();
              setPendingPhoneCall(null);
              setGamePhase('playing');
            }}
            phoneCallSystem={phoneCallSystem}
          />
        )}
        

        {gameState.gamePhase === 'game_over' && (
          <div className="game-over">
            <h2>💀 Game Over</h2>
            <p>You couldn't pay the debt!</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {showShop && (
          <ShopPanel
            tickets={gameState.tickets}
            onSpendTickets={spendTickets}
            onEquipCharm={handleEquipCharm}
            onUnequipCharm={handleUnequipCharm}
            equippedCharms={getEquippedCharms().map(ac => ac.charm.id)}
            maxCharmSlots={3}
            restockCost={calculateRestockCost()}
            onRestock={handleRestock}
            onClose={handleCloseShop}
          />
        )}
      </main>
    </div>
  );
}

export default App;