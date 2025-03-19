"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, X, Edit3 } from 'lucide-react';

// Player type definition
interface Player {
  id: number;
  name: string;
  eliminated: boolean;
  checked: boolean;
  blank: boolean;
}

export default function Home() {
  // Initial player data
  const initialPlayers: Player[] = Array.from({ length: 50 }, (_, i) => ({
    id: 101 + i,
    name: `Player ${101 + i}`,
    eliminated: false,
    checked: false,
    blank: false,
  }));

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [editMode, setEditMode] = useState(true);

  // Toggle player elimination status
  const toggleEliminatedStatus = (id: number) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === id ? { ...player, eliminated: !player.eliminated } : player
      )
    );
  };

  // Toggle blank status and allow editing name
  const toggleBlankStatus = (id: number) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === id ? { ...player, blank: !player.blank, name: player.blank ? `Player ${player.id}` : '' } : player
      )
    );
  };

  const handleNameChange = (id: number, newName: string) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === id ? { ...player, name: newName } : player
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Editing Mode - Player Elimination</h1>

        {/* Players Grid */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {players.map((player) => (
            <motion.div
              key={player.id}
              className={`relative aspect-square overflow-hidden cursor-pointer`}
              onClick={() => toggleEliminatedStatus(player.id)}
            >
              <div className={`w-full h-full flex flex-col items-center justify-center rounded p-2 
                ${player.eliminated ? 'border-4 border-red-600 bg-opacity-50' : ''} bg-teal-800`}
              >
                <div className="relative w-full h-3/4 flex items-center justify-center bg-gray-700 rounded overflow-hidden">
                  <User className="w-full h-full p-2 text-gray-300" />
                  <div className="absolute top-0 left-0 text-xs bg-black bg-opacity-50 px-1 rounded-br">
                    {player.id}
                  </div>
                  {editMode && (
                    <button 
                      className="absolute bottom-1 right-1 bg-gray-800 p-1 rounded-full" 
                      onClick={(e) => { e.stopPropagation(); toggleBlankStatus(player.id); }}
                    >
                      <Edit3 className="text-white w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="mt-1 text-xs text-center truncate w-full">
                  {player.blank ? (
                    <input
                      type="text"
                      className="bg-gray-800 text-white px-1 py-0.5 rounded text-xs text-center"
                      value={player.name}
                      onChange={(e) => handleNameChange(player.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    player.name
                  )}
                </div>
                {player.eliminated && (
                  <motion.div
                    initial={{ scale: 2, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-700 bg-opacity-60 rounded"
                  >
                    <X className="text-white w-3/4 h-3/4" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status Panel */}
        <div className="mt-8 text-center">
          <p>
            Players Eliminated: {players.filter(p => p.eliminated).length} / {players.length}
          </p>
        </div>
      </div>
    </div>
  );
}
