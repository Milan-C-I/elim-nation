"use client";

// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, CheckCircle } from 'lucide-react';

// Player type definition
interface Player {
  id: number;
  name: string;
  eliminated: boolean;
  checked: boolean;
  blank: boolean; // New field for blank positions
}

export default function Home() {
  // Initial player data
  const initialPlayers: Player[] = Array.from({ length: 50 }, (_, i) => ({
    id: 101 + i,
    name: `Player ${101 + i}`,
    eliminated: false,
    checked: false,
    blank: false, // Initially all positions are filled
  }));

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkingSpeed, setCheckingSpeed] = useState(800); // Initial animation speed in ms
  const [editMode, setEditMode] = useState(false);

  // Start the checking animation
  const startChecking = () => {
    if (isChecking) return;
    
    setEditMode(false);
    setIsChecking(true);
    
    // Find the first non-blank player
    const firstNonBlankIndex = players.findIndex(player => !player.blank);
    setCurrentPlayerIndex(firstNonBlankIndex >= 0 ? firstNonBlankIndex : null);
    
    setCheckingSpeed(800); // Reset speed to initial value
    
    // Reset all players' checked status
    setPlayers(players.map(player => ({ ...player, checked: false })));
  };

  // Handle the checking animation progression
  useEffect(() => {
    if (!isChecking || currentPlayerIndex === null) return;
    
    if (currentPlayerIndex >= players.length) {
      // Animation complete
      setIsChecking(false);
      setCurrentPlayerIndex(null);
      
      // After checking is complete, mark eliminated players as blank
      setPlayers(prevPlayers => 
        prevPlayers.map(player => 
          player.eliminated && player.checked ? { ...player, blank: true } : player
        )
      );
      return;
    }

    // Skip blank positions
    if (players[currentPlayerIndex].blank) {
      setCurrentPlayerIndex(prevIndex => {
        if (prevIndex === null) return null;
        
        // Find next non-blank player
        let nextIndex = prevIndex + 1;
        while (nextIndex < players.length && players[nextIndex].blank) {
          nextIndex++;
        }
        
        return nextIndex < players.length ? nextIndex : players.length;
      });
      return;
    }

    // Calculate new speed (gets faster)
    const newSpeed = Math.max(100, checkingSpeed * 0.95);
    
    const timer = setTimeout(() => {
      // Mark current player as checked
      setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers];
        if (currentPlayerIndex < newPlayers.length) {
          newPlayers[currentPlayerIndex] = {
            ...newPlayers[currentPlayerIndex],
            checked: true,
          };
        }
        return newPlayers;
      });
      
      // Move to next player
      setCurrentPlayerIndex(prevIndex => {
        if (prevIndex === null) return null;
        
        // Find next non-blank player
        let nextIndex = prevIndex + 1;
        while (nextIndex < players.length && players[nextIndex].blank) {
          nextIndex++;
        }
        
        return nextIndex < players.length ? nextIndex : players.length;
      });
      
      setCheckingSpeed(newSpeed);
    }, checkingSpeed);
    
    return () => clearTimeout(timer);
  }, [isChecking, currentPlayerIndex, players, checkingSpeed]);
  

  // Toggle player elimination status (for edit mode)
  const toggleEliminatedStatus = (id: number) => {
    if (!editMode) return;
    
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === id ? { ...player, eliminated: !player.eliminated } : player
      )
    );
  };

  // Toggle player blank status (for edit mode)
  const toggleBlankStatus = (id: number) => {
    if (!editMode) return;
    
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === id ? { ...player, blank: !player.blank } : player
      )
    );
  };

  // Reset all players
  const resetPlayers = () => {
    window.location.reload();
  };

  //soundEffects

  const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Player Elimination Game</h1>
        
        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={startChecking}
            disabled={isChecking}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          >
            Start Checking Round
          </button>
          
          <button
            onClick={() => setEditMode(!editMode)}
            disabled={isChecking}
            className={`px-4 py-2 rounded disabled:opacity-50 ${
              editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {editMode ? 'Editing Mode: ON' : 'Editing Mode: OFF'}
          </button>
          
          <button
            onClick={resetPlayers}
            disabled={isChecking}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded disabled:opacity-50"
          >
            Reset All Players
          </button>
        </div>
        
        {/* Instructions */}
        {editMode && (
          <div className="text-center mb-8 bg-gray-800 p-4 rounded">
            <p>Left-click on a player card to toggle elimination status</p>
            <p>Right-click on a player card to toggle blank status</p>
          </div>
        )}
        
        {/* Players Grid */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {players.map((player, index) => {
            const isBeingChecked = isChecking && index === currentPlayerIndex;
            
            // Return empty grid cell if player is blank
            if (player.blank) {
              return (
                <motion.div
                  key={player.id}
                  className={`relative aspect-square overflow-hidden ${
                    editMode ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => toggleBlankStatus(player.id)}
                  onContextMenu={(e:any) => {
                    e.preventDefault();
                    toggleBlankStatus(player.id);
                  }}
                >
                  <div className="w-full h-full bg-gray-800 bg-opacity-30 flex items-center justify-center rounded">
                    <div className="text-sm font-bold text-center text-gray-500">I SEE<br/> DEAD PEOPLE</div>
                  </div>
                </motion.div>
              );
            }
            
            // Only animate when checking is active and player is being checked
            const shouldAnimateScale = isBeingChecked;
            const shouldRemove = isChecking && player.eliminated && player.checked;
            
            return (
              <motion.div
                key={player.id}
                className={`relative aspect-square overflow-hidden ${
                  editMode ? 'cursor-pointer' : ''
                }`}
                onClick={() => toggleEliminatedStatus(player.id)}
                onContextMenu={(e:any) => {
                  e.preventDefault();
                  toggleBlankStatus(player.id);
                }}
                animate={{
                  scale: shouldAnimateScale ? [1, 1.1, 1] : 1,
                  y: shouldRemove ? [0, 20, 100] : 0,
                  opacity: shouldRemove ? [1, 1, 0] : 1,
                }}
                transition={{
                  scale: { duration: shouldAnimateScale ? 0.8 : 0 },
                  y: { delay: shouldRemove ? 1 : 0, duration: 1 },
                  opacity: { delay: shouldRemove ? 1 : 0, duration: 1 },
                }}
                
              >
                {/* Player Card */}
                <div className={`w-full h-full flex flex-col items-center justify-center rounded p-2 
                  ${editMode && player.eliminated ? 'border-4 border-red-600' : ''}
                  ${!editMode && player.eliminated ? 'bg-opacity-50' : ''}
                  bg-teal-800`}
                >
                  {/* Player Avatar */}
                  <div className="relative w-full h-3/4 flex items-center justify-center bg-gray-700 rounded overflow-hidden">
                    <User className="w-full h-full p-2 text-gray-300" />
                    <div className="absolute top-0 left-0 text-xs bg-black bg-opacity-50 px-1 rounded-br">
                      {player.id}
                    </div>
                  </div>
                  
                  {/* Player Name */}
                  <div className="mt-1 text-xs text-center truncate w-full">
                    {player.name}
                  </div>
                  
                  {/* Checking Indicator */}
                  {isBeingChecked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onAnimationStart={() => {
                        if (player.eliminated){
                          playSound("/sg-sound-effect.mp3");
                        }
                        else if(!player.eliminated && !player.checked){
                          playSound("/Unlock.mp3");
                        } 
                      }}
                      className={`absolute inset-0 flex items-center justify-center ${player.eliminated ? 'bg-red-700' : 'bg-green-700'} bg-opacity-30 rounded`}
                    >
                      {player.eliminated ? <X className="text-white w-3/4 h-3/4" /> : <CheckCircle className="text-white w-1/2 h-1/2" />}
                    </motion.div>
                  )}
                  
                  {/* X Mark for Eliminated Players - only during checking or if already checked */}
                  <AnimatePresence>
                    {!editMode && player.eliminated && player.checked  && (
                      <motion.div
                        initial={{ scale: 2, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 0.8 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center bg-red-700 bg-opacity-60 rounded"
                      >
                        {<X className="text-white w-3/4 h-3/4" />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Status Panel */}
        <div className="mt-8 text-center">
          <p>
            Players Remaining: {players.filter(p => !p.eliminated && !p.blank).length} / {players.length}
          </p>
          <p>
            Blank Positions: {players.filter(p => p.blank).length}
          </p>
        </div>
      </div>
    </div>
  );
}