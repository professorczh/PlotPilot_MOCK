import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ChevronUp, ChevronDown, Sparkles, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { TraceStep } from '../types';

const AgentMirror = ({ fileName = "storageProxy.ts", onClick }: { fileName?: string, onClick?: () => void }) => (
  <div 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="hidden sm:block absolute left-12 -top-6 w-[100px] h-[68px] rounded-lg overflow-hidden bg-white/5 backdrop-blur-2xl transition-all duration-500 hover:scale-[1.08] hover:-translate-y-1 border border-white/10 cursor-pointer group shadow-2xl z-20 active:scale-95"
  >
    <div className="flex flex-col rounded-[12px] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl w-[355px] h-[284px] pointer-events-none scale-x-[0.282] scale-y-[0.242] origin-top-left">
      <div className="h-[36px] flex items-center px-3 w-full bg-white/[0.03] border-b border-white/5">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-[250px] truncate text-muted-text/60 text-[12px] font-medium text-center">
            {fileName}
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 font-mono text-[10px] space-y-2 opacity-40">
        <div className="flex gap-2"><span className="text-purple-400">res</span>.<span className="text-blue-400">status</span>(502).<span className="text-blue-400">send</span>("...");</div>
        <div className="text-red-400">return;</div>
        <div className="h-4" />
        <div className="flex gap-2"><span className="text-purple-400">res</span>.<span className="text-blue-400">set</span>("Cache-Control", "no-store");</div>
        <div className="flex gap-2"><span className="text-purple-400">res</span>.<span className="text-blue-400">redirect</span>(307, url);</div>
      </div>
    </div>
    <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/5 transition-colors pointer-events-none" />
    <div className="absolute bottom-1 right-1 w-6 h-6 rounded-md bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
      <Zap className="w-3 h-3 text-brand-red fill-brand-red/30" />
    </div>
  </div>
);

interface TraceViewProps {
  steps?: TraceStep[];
  isThinking: boolean;
  isCompleted: boolean;
  className?: string;
  onIconClick?: () => void;
  isPanelOpen?: boolean;
}

const LocalStatusBall = ({ isRunning, isDarkMode = true }: { isRunning: boolean; isDarkMode?: boolean }) => {
  const primaryRed = isDarkMode ? "#DC2626" : "#991b1b";
  
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

  return (
    <div className={cn(
      "relative w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0",
      "backdrop-blur-3xl border border-white/10 bg-neutral-950/80 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]",
      isRunning && "ring-2 ring-brand-red/20 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
    )}>
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
        animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
        transition={isRunning ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 1 }}
      >
        <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] overflow-visible">
          <g style={{ mixBlendMode: 'plus-lighter' }}>
            <motion.path
              variants={waveVariants}
              animate="waveAlpha"
              fill="none"
              stroke={isRunning ? primaryRed : "#64D2FF"}
              strokeWidth={isRunning ? "1.2" : "0.8"}
              opacity={isRunning ? "0.6" : "0.3"}
            />
            <motion.path
              variants={waveVariants}
              animate="waveBeta"
              fill="none"
              stroke={primaryRed}
              strokeWidth={isRunning ? "2" : "1.5"}
              opacity={isRunning ? "0.8" : "0.5"}
            />
          </g>
        </svg>
      </motion.div>
      <div className="absolute inset-0 z-40 pointer-events-none bg-linear-to-br from-white/10 via-transparent to-black/50" />
    </div>
  );
};

export function ProcessMonitor({ steps = [], isThinking, isCompleted, className, onIconClick, isPanelOpen }: TraceViewProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed as per user request

  const hasSteps = steps && steps.length > 0;
  const completedCount = steps ? steps.filter(s => s.status === 'completed').length : 0;
  const totalCount = steps ? steps.length : 0;
  const isFullyDone = completedCount === totalCount && totalCount > 0;
  const isWorking = isThinking || (totalCount > 0 && completedCount < totalCount);

  const currentStep = hasSteps 
    ? (steps.find(s => s.status === 'thinking') || steps[steps.length - 1]) 
    : { label: "系统逻辑中枢已就绪" };

  return (
    <div className={cn("w-full transition-all duration-500 flex justify-center", className)}>
      <motion.div 
        layout={!isPanelOpen}
        className={cn(
          "relative transition-all duration-300 group rounded-xl",
          isExpanded 
            ? "p-3 bg-panel-bg/95 backdrop-blur-xl border border-hud-border/40 shadow-2xl shadow-black/40 overflow-hidden w-full" 
            : "p-1 px-2 border border-hud-border/40 bg-panel-bg/40 backdrop-blur-md w-full"
        )}
      >
        {!isExpanded && !isPanelOpen && (
          <>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:block">
              <LocalStatusBall isRunning={isWorking} />
            </div>
            <AgentMirror onClick={onIconClick} />
          </>
        )}
        
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div 
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2 cursor-default"
            >
              {/* HUD Header for Expanded Trace */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isFullyDone ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-brand-red animate-pulse shadow-[0_0_8_rgba(220,38,38,0.4)]"
                  )} />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-muted-text">
                    {isFullyDone ? "推演序列已就绪" : "正在实时演算演化路径..."}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="p-1 hover:bg-white/5 transition-colors rounded-md group"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-muted-text/40 group-hover:text-muted-text" />
                </button>
              </div>

              {/* Vertical Capsule Steps */}
              {hasSteps && (
                <div className="flex flex-col gap-1 pl-4 ml-1 border-l border-hud-border/10">
                  {steps.map((step, idx) => (
                    <motion.div 
                      key={step.id} 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-1 rounded-full border text-[11px] font-sans w-fit max-w-full transition-colors",
                        step.status === 'completed' 
                          ? "bg-neutral-500/5 border-neutral-500/10 text-muted-text/60" 
                          : step.status === 'thinking'
                            ? "bg-brand-red/[0.03] border-brand-red/20 text-brand-red font-medium shadow-[0_4px_12px_rgba(220,38,38,0.03)]"
                            : "bg-transparent border-transparent text-muted-text/20"
                      )}
                    >
                      {/* Status Indicator Dot */}
                      <div className={cn(
                        "w-1 h-1 rounded-full shrink-0 transition-all duration-500",
                        step.status === 'completed' && "bg-neutral-400/40",
                        step.status === 'thinking' && "bg-brand-red animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]",
                        step.status === 'pending' && "bg-muted-text/10"
                      )} />
                      
                      {step.status === 'thinking' && (
                        <Loader2 className="w-2.5 h-2.5 animate-spin shrink-0 opacity-60" />
                      )}

                      <span className="truncate">{step.label}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "flex items-center justify-between h-8 w-full",
                isPanelOpen ? "px-1.5" : "sm:pl-40 pl-3"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Refined Logo / Status Indicator */}
                <div className={cn(
                  "relative w-6 h-6 flex items-center justify-center shrink-0 border rounded-lg overflow-hidden transition-all duration-500",
                  isFullyDone 
                    ? "bg-green-500/10 border-green-500/30 text-green-500 shadow-[0_0_12px_rgba(34,197,94,0.15)]" 
                    : "bg-brand-red/10 border-brand-red/30 text-brand-red shadow-[0_0_12px_rgba(220,38,38,0.15)]"
                )}>
                  <div className={cn(
                    "absolute inset-0 opacity-20",
                    !isFullyDone && "animate-pulse bg-brand-red"
                  )} />
                  {isFullyDone ? (
                    <Check className="w-3 h-3 relative z-10" />
                  ) : (
                    <div className="relative w-3 h-3 flex items-center justify-center">
                      <Loader2 className="absolute inset-0 w-full h-full animate-spin opacity-40" />
                      <Zap className="w-2 h-2 fill-current animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-medium text-text-main truncate group-hover:text-brand-red transition-colors tracking-tight">
                    {currentStep?.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 px-1.5 ml-3 border-l border-white/5">
                <div className="flex items-center gap-1 font-mono text-[10px] font-medium leading-none">
                  <span className={cn(
                    isFullyDone ? "text-green-500" : "text-brand-red"
                  )}>{completedCount}</span>
                  <span className="text-muted-text/30">/</span>
                  <span className="text-muted-text/60">{totalCount}</span>
                </div>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer transition-all text-muted-text/40 group-hover:text-muted-text"
                >
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
