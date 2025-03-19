"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Player type definition
interface Player {
  id: number;
  name: string;
  eliminated: boolean;
}

export default function Home() {
  // Initial player data
  const initialPlayers: Player[] = [
    { id: 1, name: "Player 001", eliminated: false },
    { id: 2, name: "Player 067", eliminated: false },
    { id: 3, name: "Player 218", eliminated: false },
    { id: 4, name: "Player 456", eliminated: false },
    { id: 5, name: "Player 199", eliminated: false },
    { id: 6, name: "Player 212", eliminated: false },
    { id: 7, name: "Player 101", eliminated: false },
    { id: 8, name: "Player 320", eliminated: false },
  ];

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [editPlayers, setEditPlayers] = useState<Player[]>(initialPlayers);
  const [animationState, setAnimationState] = useState<
    "initial" | "animating" | "complete"
  >("initial");
  const [showHackedPopup, setShowHackedPopup] = useState(false);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<Player[]>([]);

  // Get filtered players (non-eliminated) for display
  const activePlayers = players.filter((player) => !player.eliminated);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any player's elimination state changed from true to false
    const newlyRevived = players.filter(
      (player) =>
        player.eliminated &&
        !editPlayers.find((p) => p.id === player.id)?.eliminated
    );

    if (newlyRevived.length > 0) {
      setEliminatedPlayers(newlyRevived);
      setShowHackedPopup(true);

      // Set timeout to hide popup and add players back
      setTimeout(() => {
        setShowHackedPopup(false);

        // Update players with the edited state
        setPlayers([...editPlayers]);

        // Reset animation state to trigger new animation
        setAnimationState("initial");
        setTimeout(() => setAnimationState("animating"), 100);
      }, 3000);
    } else {
      // Update players with the edited state
      setPlayers([...editPlayers]);

      // Reset animation state to trigger new animation
      setAnimationState("initial");
      setTimeout(() => setAnimationState("animating"), 100);
    }
  };

  // Toggle player elimination state in edit form
  const toggleElimination = (id: number) => {
    setEditPlayers(
      editPlayers.map((player) =>
        player.id === id
          ? { ...player, eliminated: !player.eliminated }
          : player
      )
    );
  };

  // Initialize animation on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState("animating");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Set animation to complete after animations finish
  useEffect(() => {
    if (animationState === "animating") {
      const timer = setTimeout(() => {
        setAnimationState("complete");
      }, players.length * 1000 + 1000); // Update to account for 1 second per card

      return () => clearTimeout(timer);
    }
  }, [animationState, players.length]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center text-pink-500">
        Player Elimination Grid
      </h1>

      {/* Hacked popup */}
      <AnimatePresence>
        {showHackedPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-red-600 p-6 rounded-lg shadow-lg z-50 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8" />
              <h2 className="text-2xl font-bold">SYSTEM ERROR</h2>
            </div>
            <p className="text-lg mb-4">
              Security breach detected! Players are being added back to the
              game.
            </p>
            <div className="flex flex-wrap gap-2">
              {eliminatedPlayers.map((player) => (
                <span
                  key={player.id}
                  className="bg-white text-red-600 px-2 py-1 rounded-md font-mono"
                >
                  {player.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player grid - showing only active players */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12 w-full max-w-5xl text-black">
        <AnimatePresence mode="popLayout">
          {animationState === "complete"
            ? // Show only active players after animation completes
              activePlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    backgroundColor: "#22c55e",
                  }}
                  exit={{ opacity: 0, scale: 0, y: 100 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="relative overflow-hidden rounded-lg aspect-square flex flex-col items-center justify-center p-4 shadow-lg"
                >
                  <div className="absolute inset-0 bg-gray-800 opacity-20">
                    <svg
                      className="h-full w-full text-white opacity-10"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="50" cy="35" r="20" fill="currentColor" />
                      <path
                        d="M30 70 Q50 100 70 70 Q70 60 50 50 Q30 60 30 70"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gray-300 mb-3 overflow-hidden relative z-10">
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white font-bold">
                      {player.id.toString().padStart(3, "0")}
                    </div>
                  </div>
                  <h2 className="text-lg font-bold relative z-10">
                    {player.name}
                  </h2>
                  <p className="text-sm opacity-75 relative z-10">
                    ID: {player.id.toString().padStart(3, "0")}
                  </p>
                </motion.div>
              ))
            : // Show all players during animation
              players.map((player, index) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    animationState === "initial"
                      ? { opacity: 1, scale: 1, backgroundColor: "white" }
                      : animationState === "animating"
                      ? {
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          backgroundColor: player.eliminated
                            ? "#ef4444"
                            : "#22c55e",
                          transition: {
                            delay: index * 1,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          },
                        }
                      : {
                          opacity: player.eliminated ? 0 : 1,
                          scale: player.eliminated ? 0.8 : 1,
                          y: player.eliminated ? 100 : 0,
                          transition: {
                            duration: 0.5,
                            delay: player.eliminated ? 0.5 : 0,
                          },
                          backgroundColor: player.eliminated
                            ? "#ef4444"
                            : "#22c55e",
                        }
                  }
                  exit={{ opacity: 0, scale: 0, y: 100 }}
                  className={cn(
                    "relative overflow-hidden rounded-lg aspect-square flex flex-col items-center justify-center p-4 shadow-lg",
                    animationState === "initial" && "bg-white text-black"
                  )}
                >
                  {/* Human avatar silhouette background */}
                  <div className="absolute inset-0 bg-gray-800 opacity-20 z-50">
                    <svg
                      className="h-full w-full text-white opacity-50"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="50" cy="35" r="20" fill="currentColor" />
                      <path
                        d="M30 70 Q50 100 70 70 Q70 60 50 50 Q30 60 30 70"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  {player.eliminated && (
                    <motion.div
                      initial={{ opacity: 0, scale: 1.5 }}
                      animate={{
                        opacity:
                          animationState === "animating" ||
                          animationState === "complete"
                            ? 1
                            : 0,
                        scale: 1,
                      }}
                      transition={{
                        delay:
                          animationState === "animating" ? index * 1 + 0.3 : 0,
                        duration: 0.3,
                      }}
                      className="absolute inset-0 bg-red-500 flex items-center justify-center z-10"
                    >
                      <X className="w-20 h-20 text-white" strokeWidth={3} />
                    </motion.div>
                  )}

                  <div className="w-16 h-16 rounded-full bg-gray-300 mb-3 overflow-hidden relative z-10">
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white font-bold">
                      {player.id.toString().padStart(3, "0")}
                    </div>
                  </div>
                  <h2 className="text-lg font-bold relative z-10">
                    {player.name}
                  </h2>
                  <p className="text-sm opacity-75 relative z-10">
                    ID: {player.id.toString().padStart(3, "0")}
                  </p>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>

      {/* Edit form */}
      <Card className="w-full max-w-2xl p-6 bg-gray-900 border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Players</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center space-x-3 p-3 rounded-md border border-gray-700"
              >
                <Checkbox
                  id={`player-${player.id}`}
                  checked={player.eliminated}
                  onCheckedChange={() => toggleElimination(player.id)}
                />
                <Label
                  htmlFor={`player-${player.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <span
                    className={
                      player.eliminated ? "line-through text-red-400" : ""
                    }
                  >
                    {player.name}
                  </span>
                </Label>
              </div>
            ))}
          </div>
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            Apply Changes
          </Button>
        </form>
      </Card>
    </main>
  );
}
