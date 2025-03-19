"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, X, Edit3, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog";
import { parse } from 'path';
import { DialogTitle } from '@radix-ui/react-dialog';

// Player type definition
interface Player {
  id: number;
  name: string;
  eliminated: boolean;
  checked: boolean;
}

export default function Home() {
  const initialPlayers: Player[] = Array.from({ length: 50 }, (_, i) => ({
    id: 101 + i,
    name: `Player ${101 + i}`,
    eliminated: false,
    checked: false,
  }));

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [editMode, setEditMode] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newId, setNewId] = useState<number>();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Toggle player elimination status
  const toggleEliminatedStatus = (id: number) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === id ? { ...player, eliminated: !player.eliminated } : player
      )
    );
  };

  // Handle adding a new player
  const addPlayer = () => {
    if (newPlayerName.trim() === "") return;
    setPlayers([...players, { id: newId || 0, name: newPlayerName, eliminated: false, checked: false }]);
    setNewPlayerName("");
    setNewId(undefined);    
    setIsDialogOpen(false);
  };

  // Handle editing an existing player
  const editPlayer = () => {
    if (!editingPlayer || newPlayerName.trim() === "") return;
    setPlayers(prevPlayers => prevPlayers.map(player => (player.id === editingPlayer.id ? { ...player, name: newPlayerName } : player)));
    setEditingPlayer(null);
    setNewPlayerName("");
    setIsDialogOpen(false);
  };

  // Handle deleting a player
  const deletePlayer = (id: number) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Editing Mode - Player Elimination</h1>

        {/* Players Grid */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {players.map(player => (
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
                      onClick={(e) => { e.stopPropagation(); setEditingPlayer(player); setNewPlayerName(player.name); setIsDialogOpen(true); }}
                    >
                      <Edit3 className="text-white w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="mt-1 text-xs text-center truncate w-full">{player.name}</div>
                {editMode && (
                  <button 
                    className="absolute top-1 right-1 bg-red-600 p-1 rounded-full"
                    onClick={(e) => { e.stopPropagation(); deletePlayer(player.id); }}
                  >
                    <Trash2 className="text-white w-4 h-4" />
                  </button>
                )}
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

        <div className="mt-8 text-center">
          <button className="bg-green-600 px-4 py-2 rounded" onClick={() => setIsDialogOpen(true)}>
            <Plus className="inline-block w-5 h-5 mr-2" /> Add Player
          </button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogOverlay />
          <DialogContent className='bg-gray-500'>
            <DialogTitle className="text-xl mb-4 text-white">{editingPlayer ? "Edit Player" : "Add Player"}</DialogTitle>
            <input
              type="number"
              className="bg-gray-200 text-black px-2 py-1 rounded w-full"
              value={newId || ""}
              onChange={(e) => setNewId(parseInt(e.target.value))}
            />
            <input
              type="text"
              className="bg-gray-200 text-black px-2 py-1 rounded w-full"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="bg-blue-600 px-4 py-2 rounded" onClick={editingPlayer ? editPlayer : addPlayer}>Save</button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
