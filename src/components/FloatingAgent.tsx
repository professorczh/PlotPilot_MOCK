import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Bot, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

import { AgentStatus } from '../types';

interface FloatingAgentProps {
  isDarkMode?: boolean;
  status?: AgentStatus;
  onClick?: () => void;
}

export const FloatingAgent: React.FC<FloatingAgentProps> = ({ 
  isDarkMode = true, 
  status = 'idle',
  onClick 
}) => {
  const constraintsRef = useRef(null);

  const isRunning = status === 'running';
  const isStarting = status === 'starting';
  const isPanelOpen = status !== 'idle';

  // Define harmonic water ripple variants using morphing SVG paths
  const waveVariants = {
    waveAlpha: {
      d: [
        "M 50 15 C 70 15 85 30 85 50 C 85 70 70 85 50 85 C 30 85 15 70 15 50 C 15 30 30 15 50 15",
        "M 50 12 C 75 18 88 35 88 50 C 88 65 75 82 50 88 C 25 82 12 65 12 50 C 12 35 25 18 50 12",
        "M 50 18 C 65 12 82 35 82 50 C 82 65 65 88 50 82 C 35 88 18 65 18 50 C 18 35 35 12 50 18",
      ],
      transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
    },
    waveBeta: {
      d: [
        "M 50 25 C 65 25 75 35 75 50 C 75 65 65 75 50 75 C 35 75 25 65 25 50 C 25 35 35 25 50 25",
        "M 50 22 C 68 28 78 40 78 50 C 78 60 68 72 50 78 C 32 72 22 60 22 50 C 22 40 32 28 50 22",
        "M 50 28 C 62 22 72 40 72 50 C 72 60 62 78 50 72 C 38 78 28 60 28 50 C 28 40 38 22 50 28",
      ],
      transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: -2 }
    }
  };

  const primaryRed = isDarkMode ? "#DC2626" : "#991b1b";

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[9997]" ref={constraintsRef} />
      
      <motion.div
        drag
        dragElastic={0.1}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={onClick}
        whileHover="hover"
        whileTap="tap"
        className={cn(
          "fixed right-8 bottom-8 z-[9999] w-10 h-10 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden",
          "backdrop-blur-3xl border transition-[border-color,background-color] duration-500", 
          isDarkMode 
            ? "border-white/10 bg-neutral-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(0,0,0,0.8)]"
            : "border-black/5 bg-white/40 shadow-[0_15px_30px_rgba(0,0,0,0.1),inset_0_0_15px_rgba(255,255,255,0.8)]",
          isRunning && "ring-4 ring-brand-red/20 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
        )}
        style={{ willChange: 'transform' }}
      >
        {/* Interaction Rim: Brand Glow on Hover or when Panel Open / Running */}
        <motion.div 
          variants={{
            hover: { opacity: 1, scale: 1 },
            tap: { opacity: 1, scale: 0.98 }
          }}
          initial={false}
          animate={{ 
            opacity: (isPanelOpen || isRunning) ? 1 : 0,
            scale: isRunning ? [1, 1.1, 1] : 1
          }}
          transition={isRunning ? { duration: 2, repeat: Infinity } : undefined}
          className="absolute inset-0 rounded-full border-2 pointer-events-none z-50"
          style={{ borderColor: primaryRed, filter: `blur(4px)` }}
        />

        {/* Specular Highlight (The Crystal Sparkle) */}
        <div className={cn(
          "absolute top-2 left-3 w-4 h-1.5 blur-[1px] rotate-[-15deg] rounded-full z-50 pointer-events-none",
          isDarkMode ? "bg-white/30" : "bg-white/60"
        )} />

        {/* Fluid Energy Core - Water Ripple Mode */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
          animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
          transition={isRunning ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 1 }}
          style={{ willChange: isRunning ? 'transform' : 'auto' }}
        >
          <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] overflow-visible">
            <g style={{ mixBlendMode: isDarkMode ? 'plus-lighter' : 'multiply' }}>
              {/* Outer Ripple Layer */}
              <motion.path
                variants={waveVariants}
                animate="waveAlpha"
                fill="none"
                stroke={isRunning ? primaryRed : (isDarkMode ? "#64D2FF" : "#007AFF")}
                strokeWidth={isRunning ? "0.8" : "0.4"}
                opacity={isDarkMode ? (isRunning ? "0.6" : "0.3") : (isRunning ? "0.4" : "0.15")}
                transition={{ duration: isRunning ? 5 : 10 }}
              />
              
              {/* Inner Ripple Layer (Brand Red) */}
              <motion.path
                variants={waveVariants}
                animate="waveBeta"
                fill="none"
                stroke={primaryRed}
                strokeWidth={isRunning ? "1.5" : "1"}
                opacity={isDarkMode ? (isRunning ? "0.8" : "0.5") : (isRunning ? "0.6" : "0.3")}
                transition={{ duration: isRunning ? 3.5 : 7 }}
              />

              {/* Core Accent (Harmonic Center) */}
              <motion.circle
                cx="50"
                cy="50"
                r="10"
                fill="none"
                stroke={isDarkMode ? "#E5E5EA" : "#737373"}
                strokeWidth="0.5"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.4, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          </svg>
        </motion.div>


        {/* Surface Optical Depth */}
        <div className={cn(
          "absolute inset-0 z-40 pointer-events-none bg-linear-to-br from-white/10 via-transparent",
          isDarkMode ? "to-black/50" : "to-black/10"
        )} />
        
        {/* Precision Texture (Grain) */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-30 mix-blend-soft-light" />
        
        {/* Structural Rim Lighting (The Crystal Edge) */}
        <div className={cn(
          "absolute inset-0 rounded-full border pointer-events-none z-50",
          isDarkMode ? "border-white/5 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]" : "border-black/5 shadow-[inset_0_0_8px_rgba(0,0,0,0.05)]"
        )} />
      </motion.div>
    </>
  );
};
