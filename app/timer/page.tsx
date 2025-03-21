"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw, Clock } from "lucide-react";

const GlitchTimer = () => {
  const [initialTime, setInitialTime] = useState(60); // Initial time in seconds
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(1);
  // Add state for client-side rendering to fix hydration
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate percentage of time remaining
  const percentRemaining = (timeRemaining / initialTime) * 100;

  // Dynamically adjust glitch intensity based on time remaining
  useEffect(() => {
    if (percentRemaining <= 20) {
      setGlitchIntensity(5);
    } else if (percentRemaining <= 40) {
      setGlitchIntensity(4);
    } else if (percentRemaining <= 60) {
      setGlitchIntensity(3);
    } else if (percentRemaining <= 80) {
      setGlitchIntensity(2);
    } else {
      setGlitchIntensity(1);
    }
  }, [percentRemaining]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(prev - 1, 0));
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle play/pause
  const toggleTimer = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(initialTime);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(initialTime);
  };

  // Set initial time and reset
  const updateInitialTime = (value: number) => {
    setInitialTime(value);
    if (!isRunning) {
      setTimeRemaining(value);
    }
  };

  // If not client-side yet, render a simple loading state to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black"></div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md mx-auto p-6 bg-black rounded-lg shadow-lg relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>

        {/* Color overlay glitches */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Red glitch overlay */}
          <motion.div
            className="absolute inset-0 bg-red-600 mix-blend-exclusion"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [
                0,
                0.05 * glitchIntensity,
                0,
                0.03 * glitchIntensity,
                0,
              ],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 0.5 / glitchIntensity,
            }}
          />

          {/* Green glitch overlay */}
          <motion.div
            className="absolute inset-0 bg-green-600 mix-blend-exclusion"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [
                0,
                0.03 * glitchIntensity,
                0,
                0.05 * glitchIntensity,
                0,
              ],
            }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              repeat: Infinity,
              repeatDelay: 0.6 / glitchIntensity,
            }}
          />

          {/* Horizontal glitch lines */}
          {Array.from({ length: 3 * glitchIntensity }).map((_, i) => (
            <motion.div
              key={`glitch-line-${i}`}
              className={`absolute h-1 ${
                i % 2 === 0 ? "bg-red-500" : "bg-green-500"
              } left-0 right-0`}
              style={{ top: `${Math.random() * 100}%` }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scaleX: [0, 1, 0],
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 0.2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 2 / glitchIntensity,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <h2 className="text-2xl  font-mono font-bold text-center text-green-500 mb-6">
            COUNTDOWN TERMINAL
          </h2>

          {/* Timer display */}
          <div className="relative bg-black border-2 border-gray-700 rounded-lg p-6 mb-6">
            <motion.div
              className="text-6xl font-mono font-bold text-center"
              style={{
                color: timeRemaining > 0 ? "#22c55e" : "#ef4444",
              }}
              animate={
                timeRemaining === 0
                  ? {
                      color: ["#ef4444", "#22c55e", "#ef4444"],
                      x: [-2, 2, -2, 0],
                      y: [-1, 1, -1, 0],
                    }
                  : {
                      x:
                        timeRemaining < initialTime * 0.2
                          ? [
                              -1 * glitchIntensity,
                              1 * glitchIntensity,
                              -1 * glitchIntensity,
                              0,
                            ]
                          : 0,
                    }
              }
              transition={{
                duration: 0.3,
                repeat: timeRemaining === 0 ? Infinity : 0,
                repeatType: "loop",
              }}
            >
              {formatTime(timeRemaining)}
            </motion.div>

            {/* Scanning line effect */}
            <motion.div
              className="absolute inset-x-0 h-1 bg-green-500 opacity-40"
              initial={{ top: 0 }}
              animate={{ top: ["0%", "100%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Digital noise */}
            <div className="absolute inset-0 overflow-hidden mix-blend-overlay">
              {Array.from({ length: 20 * glitchIntensity }).map((_, i) => (
                <motion.div
                  key={`noise-${i}`}
                  className={`absolute ${
                    i % 2 === 0 ? "bg-green-400" : "bg-red-400"
                  }`}
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
          </div>

          {/* Controls */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-gray-400">
                Timer (seconds):
              </span>
              <span className="font-mono text-green-500">{initialTime}</span>
            </div>

            {/* <Slider
              value={[initialTime]}
              min={5}
              max={300}
              step={5}
              onValueChange={(values) => updateInitialTime(values[0])}
              className="mb-6 cursor-pointer"
            /> */}

            

            <div className="flex justify-between gap-4">
              <Button
                onClick={toggleTimer}
                className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-mono"
              >
                {isRunning ? (
                  <Pause className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isRunning
                  ? "PAUSE"
                  : timeRemaining === 0
                  ? "RESTART"
                  : "START"}
              </Button>

              <Button
                onClick={resetTimer}
                className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-mono"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                RESET
              </Button>
            </div>
          </div>

          {/* Status indicator */}
          <div className="font-mono text-xs text-gray-500 flex items-center justify-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {!isRunning && timeRemaining === 0
                ? "EXPIRED"
                : !isRunning
                ? "STANDBY"
                : glitchIntensity >= 4
                ? "CRITICAL"
                : glitchIntensity >= 3
                ? "WARNING"
                : "RUNNING"}
            </span>
          </div>
          <div className="flex items-center space-x-3 mx-auto bg-gray-100 my-5 p-3 rounded-lg shadow-md w-fit">
              <input
                type="number"
                onChange={(e) => updateInitialTime(parseInt(e.target.value)*60)}
                className="w-50 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Enter number"
              />

            </div>
        </div>
      </div>
    </div>
  );
};

export default GlitchTimer;
