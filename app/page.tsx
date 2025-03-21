"use client";

// pages/index.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X, CheckCircle } from "lucide-react";
import { getUsers, updateUsers } from "@/backend/functions";
import { User as Player } from "@prisma/client";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(false);
  const [checkingSpeed, setCheckingSpeed] = useState(800);

  // Fetch users on initial render
  useEffect(() => {
    (async()=>{
      let data = await getUsers();
      setPlayers(data);
    })()
  }, []);

  // Keyboard shortcut handler for Shift+Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Shift+Space is pressed
      if (e.shiftKey && e.code === "Space") {
        e.preventDefault(); // Prevent default space behavior (scrolling)
        startChecking();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [players, isChecking]); // Add dependencies to ensure we have the latest state

  // Start the checking animation
  const startChecking = async () => {
    if (isChecking) return;
    let pp = await getUsers();
    
    setIsChecking(true);

    // Find the first non-blank player
    const firstNonBlankIndex = pp.findIndex((player) => !player.blank);
    setCurrentPlayerIndex(firstNonBlankIndex >= 0 ? firstNonBlankIndex : null);

    setCheckingSpeed(800); // Reset speed to initial value

    // Reset all players' checked status
    const updatedPlayers = pp.map((player) => ({ ...player, checked: false }));
    setPlayers(updatedPlayers);
    
    // Update to backend
    (async() => {
      await updateUsers(updatedPlayers);
    })();
  };

  // Handle the checking animation progression
  useEffect(() => {
    if (!isChecking || currentPlayerIndex === null) return;

    if (currentPlayerIndex >= players.length) {
      // Animation complete
      setIsChecking(false);
      setCurrentPlayerIndex(null);
      let pp = players.map((player) =>
        player.eliminated && player.checked
          ? { ...player, blank: true }
          : player
      );
      (async()=>{
        await updateUsers(pp);
      })()
      // After checking is complete, mark eliminated players as blank
      setPlayers(pp);
      return;
    }

    // Skip blank positions
    if (players[currentPlayerIndex].blank) {
      setCurrentPlayerIndex((prevIndex) => {
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
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers];
        if (currentPlayerIndex < newPlayers.length) {
          newPlayers[currentPlayerIndex] = {
            ...newPlayers[currentPlayerIndex],
            checked: true,
          };
        }
        
        // Update to backend
        (async() => {
          await updateUsers(newPlayers);
        })();
        
        return newPlayers;
      });

      // Move to next player
      setCurrentPlayerIndex((prevIndex) => {
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

  // Sound effects
  const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Player Elimination Game
        </h1>

        {/* Instruction for keyboard shortcut */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-800 px-6 py-3 rounded-lg shadow-lg">
            <p className="text-center">
              Press <kbd className="bg-gray-800 px-2 py-1 rounded mx-1">Shift</kbd> + 
              <kbd className="bg-gray-800 px-2 py-1 rounded mx-1">Space</kbd> to start checking round
            </p>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {players.map((player, index) => {
            const isBeingChecked = isChecking && index === currentPlayerIndex;
            console.log(JSON.stringify(player))
            if (player.blank && !player.eliminated) {
              return (
                <motion.div
                  key={player.playerId}
                  className="relative aspect-square overflow-hidden"
                  // Use layoutId for smoother transition between states
                  layoutId={`player-card-${player.playerId}`}
                >
                  <div className="w-full h-full bg-black bg-opacity-90 flex flex-col items-center justify-center rounded relative overflow-hidden">
                    {/* Static background */}
                    <div className="absolute inset-0 bg-grid-pattern bg-opacity-20"></div>
            
                    {/* Use the enhanced HackingAnimation component */}
                    <HackingAnimation
                      playerId={player.playerId}
                      onComplete={() => {
                        // After animation completes, set player.blank to false
                        setTimeout(() => {
                          setPlayers((prevPlayers) => {
                            const updatedPlayers = prevPlayers.map((p) =>
                              p.playerId === player.playerId ? { ...p, blank: false } : p
                            );
                            
                            // Update to backend
                            (async() => {
                              await updateUsers(updatedPlayers);
                            })();
                            
                            return updatedPlayers;
                          });           
                        }, 3000); // Allow animation to show for 3 seconds before changing state
                      }}
                    />
                  </div>
                </motion.div>
              );
            }

            // Return empty grid cell if player is blank
            if (player.blank) {
              return (
                <motion.div
                  key={player.playerId}
                  className="relative aspect-square overflow-hidden"
                >
                  <div className="w-full h-full bg-gray-800 bg-opacity-30 flex items-center justify-center rounded">
                    <div className="text-sm font-bold text-center text-gray-500">
                      I SEE
                      <br /> DEAD PEOPLE
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Only animate when checking is active and player is being checked
            const shouldAnimateScale = isBeingChecked;
            const shouldRemove =
              isChecking && player.eliminated && player.checked;

            return (
              <motion.div
                key={player.playerId}
                className="relative aspect-square overflow-hidden"
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
                <div
                  className={`w-full h-full flex flex-col items-center justify-center rounded p-2 
                  ${player.eliminated ? "bg-opacity-50" : ""}
                  bg-teal-800`}
                >
                  {/* Player Avatar */}
                  <div className="relative w-full h-3/4 flex items-center justify-center bg-gray-700 rounded overflow-hidden">
                    <User className="w-full h-full p-2 text-gray-300" />
                    <div className="absolute top-0 left-0 text-xs bg-black bg-opacity-50 px-1 rounded-br">
                      {player.playerId}
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
                        if (player.eliminated) {
                          playSound("/sg-sound-effect.mp3");
                        } else if (!player.eliminated && !player.checked) {
                          playSound("/tick.mp3");
                        }
                      }}
                      className={`absolute inset-0 flex items-center justify-center ${
                        player.eliminated ? "bg-red-700" : "bg-green-700"
                      } bg-opacity-30 rounded`}
                    >
                      {player.eliminated ? (
                        <X className="text-white w-3/4 h-3/4" />
                      ) : (
                        <CheckCircle className="text-white w-1/2 h-1/2" />
                      )}
                    </motion.div>
                  )}

                  {/* X Mark for Eliminated Players - only during checking or if already checked */}
                  <AnimatePresence>
                    {player.eliminated && player.checked && (
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
            Players Remaining:{" "}
            {players.filter((p) => !p.eliminated && !p.blank).length} /{" "}
            {players.length}
          </p>
          <p>Blank Positions: {players.filter((p) => p.blank).length}</p>
        </div>
      </div>
    </div>
  );
}

// HackingAnimation component 
function HackingAnimation({ playerId, onComplete }:{playerId: number, onComplete: () => void}) {
  const [animationStarted, setAnimationStarted] = useState(false);
  
  useEffect(() => {
    // Start animation after component mounts to avoid hydration issues
    setAnimationStarted(true);

    // playSound("/glitch-sound-effect-96251.mp3");

    // Set a timer to call onComplete after the animation duration
    const timer = setTimeout(() => {
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Only render animation elements after client-side hydration is complete
  if (!animationStarted) {
    return null;
  }

  return (
    <>
      {/* Terminal-style loading bar */}
      <div className="w-4/5 h-2 bg-gray-900 rounded-full mb-3 overflow-hidden">
        <motion.div
          className="h-full bg-red-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>

      {/* Glitchy Text */}
      <motion.div 
        className="text-green-500 font-mono font-bold text-center z-30 px-1"
        animate={{
          x: [-2, 2, -2, 1, -1, 0],
          opacity: [1, 0.8, 1, 0.9, 1],
          color: ["#22c55e", "#ef4444", "#22c55e", "#000000", "#22c55e"],
          scale: [1, 1.02, 0.98, 1]
        }}
        transition={{
          duration: 0.3,
          repeat: 8,
          repeatType: "loop"
        }}
      >
        RESTORING
        <br />
        PLAYER
      </motion.div>

      {/* Overall screen shake */}
      <motion.div
        className="absolute inset-0 z-20"
        animate={{
          x: [-4, 4, -3, 3, -2, 2, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: 6,
          repeatType: "mirror"
        }}
      />

      {/* Red glitch overlay */}
      <motion.div
        className="absolute inset-0 bg-red-600 mix-blend-exclusion z-15"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0, 0.15, 0] }}
        transition={{
          duration: 0.2,
          repeat: 15,
          repeatType: "loop"
        }}
      />

      {/* Green glitch overlay */}
      <motion.div
        className="absolute inset-0 bg-green-600 mix-blend-exclusion z-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0, 0.1, 0] }}
        transition={{
          duration: 0.3,
          delay: 0.1,
          repeat: 15,
          repeatType: "loop"
        }}
      />

      {/* Horizontal glitch lines - alternating red and green */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`glitch-line-${i}`}
          className={`absolute h-1 ${i % 2 === 0 ? 'bg-red-500' : 'bg-green-500'} left-0 right-0 z-25`}
          style={{ top: `${Math.random() * 100}%` }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scaleX: [0, 1, 0],
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 0.2,
            delay: i * 0.3,
            repeat: Math.floor(Math.random() * 5) + 2,
            repeatDelay: Math.random()
          }}
        />
      ))}

      {/* Distortion blocks */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`block-${i}`}
          className={`absolute ${i % 3 === 0 ? 'bg-red-500' : i % 3 === 1 ? 'bg-green-500' : 'bg-black'} mix-blend-screen z-20`}
          style={{
            width: `${Math.random() * 40 + 10}px`,
            height: `${Math.random() * 15 + 5}px`,
          }}
          initial={{ 
            opacity: 0,
            x: Math.random() * 100,
            y: Math.random() * 100
          }}
          animate={{ 
            opacity: [0, 0.4, 0],
            x: Math.random() * 100,
            y: Math.random() * 100
          }}
          transition={{
            duration: 0.3,
            delay: i * 0.2,
            repeat: 5,
            repeatType: "mirror"
          }}
        />
      ))}

      {/* Black cutout glitches */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`blackout-${i}`}
          className="absolute bg-black z-25"
          style={{
            width: `${Math.random() * 60 + 20}px`,
            height: `${Math.random() * 20 + 4}px`,
          }}
          initial={{ 
            opacity: 0,
            x: Math.random() * 100,
            y: Math.random() * 100
          }}
          animate={{ 
            opacity: [0, 1, 0],
            x: Math.random() * 100,
            y: Math.random() * 100
          }}
          transition={{
            duration: 0.2,
            delay: i * 0.4,
            repeat: 4,
            repeatType: "mirror"
          }}
        />
      ))}

      {/* Code elements - alternating colors */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`code-${playerId}-${i}`}
            className={`absolute text-xs ${i % 2 === 0 ? 'text-green-500' : 'text-red-500'} font-mono opacity-60`}
            style={{
              top: `${10 + i * 10}%`,
              left: "-100%",
            }}
            animate={{
              left: ["100%", "-100%"],
              y: [0, Math.random() > 0.5 ? 5 : -5, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: 2,
              repeatType: "loop",
            }}
          >
            {/* Generate random code-like strings */}
            {`> ${
              ["INIT", "SCAN", "DECRYPT", "RESTORE", "VERIFY", "REBOOT", "INJECT", "COMPLETE"][i]
            }_${Math.floor(Math.random() * 10000)}`}
          </motion.div>
        ))}
      </div>

      {/* Digital noise - red and green pixels */}
      <div className="absolute inset-0 overflow-hidden mix-blend-overlay z-5">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={`noise-${i}`}
            className={`absolute ${i % 2 === 0 ? 'bg-green-400' : 'bg-red-400'}`}
            style={{
              width: "2px",
              height: "2px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random(),
            }}
          />
        ))}
      </div>
    </>
  );
}