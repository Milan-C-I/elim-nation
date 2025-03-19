'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Participant {
  name: string;
  eliminated: boolean;
}

interface EliminationGridProps {
  participants: Participant[];
}



const EliminationGrid: React.FC<EliminationGridProps> = ({ participants }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % participants.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [participants.length]);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {participants.map((participant, index) => (
        <motion.div
          key={participant.name}
          className={`relative flex items-center justify-center w-24 h-24 text-lg font-semibold border-2 rounded-lg shadow-lg ${
            participant.eliminated ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'
          }`}
          animate={{ scale: index === activeIndex ? 1.2 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {participant.name}
          {participant.eliminated && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-4xl text-red-500"
              initial={{ scale: 0 }}
              animate={{ scale: index === activeIndex ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              ✖
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default EliminationGrid;