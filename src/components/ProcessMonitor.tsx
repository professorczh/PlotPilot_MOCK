import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ChevronUp, ChevronDown, Sparkles, Zap, Square } from 'lucide-react';
import { cn } from '../lib/utils';
import { AgentStatus, TraceStep } from '../types';

const AgentMirror = ({ fileName = "storageProxy.ts", onClick }: { fileName?: string, onClick?: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ delay: 0.3 }}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="hidden sm:block absolute left-12 -top-10 w-[105px] h-[75px] rounded-lg overflow-hidden bg-bubble-bg/10 backdrop-blur-2xl transition-all duration-500 hover:scale-[1.08] hover:-translate-y-1 border border-hud-border/20 cursor-pointer group shadow-2xl z-[60] active:scale-95"
  >
    <div className="flex flex-col rounded-[12px] overflow-hidden bg-app-bg border border-hud-border/40 shadow-2xl w-[350px] h-[250px] pointer-events-none scale-[0.3] origin-top-left">
      <div className="h-[36px] flex items-center px-3 w-full bg-panel-bg/40 border-b border-hud-border/20">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-[250px] truncate text-muted-text/60 text-[12px] font-medium text-center">
            {fileName}
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 font-mono text-[10px] space-y-2 opacity-50">
        <div className="flex gap-2"><span className="text-purple-400">res</span>.<span className="text-blue-400">status</span>(502).<span className="text-blue-400">send</span>("...");</div>
        <div className="text-red-400">return;</div>
        <div className="h-4" />
        <div className="flex gap-2"><span className="text-purple-400">res</span>.<span className="text-blue-400">set</span>("Cache-Control", "no-store");</div>
        <div className="flex gap-2"><span className="text-purple-400">res</span>.<span className="text-blue-400">redirect</span>(307, url);</div>
      </div>
    </div>
    <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/5 transition-colors pointer-events-none" />
    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-md bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
      <Zap className="w-3 h-3 text-brand-red fill-brand-red/30" />
    </div>
  </motion.div>
);

interface TraceViewProps {
  steps?: TraceStep[];
  isThinking: boolean;
  isCompleted: boolean;
  className?: string;
  onIconClick?: () => void;
  isPanelOpen?: boolean;
  theme?: 'ink' | 'paper' | 'classic';
  status?: AgentStatus;
  isAnalyticsVisible?: boolean;
  isAnalyticsCollapsed?: boolean;
}

const LocalStatusBall = ({ isRunning, theme, onClick, status }: { isRunning: boolean; theme?: 'ink' | 'paper' | 'classic'; onClick?: () => void; status?: AgentStatus }) => {
  const isDarkMode = theme === 'ink';
  const primaryRed = isDarkMode ? "#DC2626" : "#991b1b";
  const waveColor = isDarkMode ? "rgba(100, 210, 255, 0.3)" : "rgba(0, 112, 201, 0.3)";
  const isAutomationActive = status === 'running' || status === 'writing';
  
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
    <motion.div 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "relative w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0 cursor-pointer transition-all duration-300",
        "backdrop-blur-3xl border border-hud-border/40 bg-app-bg/80 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] hover:border-brand-red/40 group",
        isRunning && "ring-2 ring-brand-red/20 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
      )}
    >
      {(isRunning || status === 'none') && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <div className={cn(
            "rounded-[2px] transition-all duration-500",
            isRunning 
              ? "w-2 h-2 bg-brand-red shadow-[0_0_8px_rgba(220,38,38,0.6)] group-hover:scale-110" 
              : "w-1 h-1 bg-muted-text/30 group-hover:bg-brand-red group-hover:scale-125"
          )} />
        </motion.div>
      )}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
        animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
        transition={isRunning ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 1 }}
      >
        <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] overflow-visible">
          <g style={{ mixBlendMode: isDarkMode ? 'plus-lighter' : 'multiply' }}>
            <motion.path
              variants={waveVariants}
              animate="waveAlpha"
              fill="none"
              stroke={isRunning ? primaryRed : (isDarkMode ? "#64D2FF" : "#0070C9")}
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
    </motion.div>
  );
};

export function ProcessMonitor({ 
  steps = [], 
  isThinking, 
  isCompleted, 
  className, 
  onIconClick, 
  isPanelOpen, 
  theme, 
  status,
  isAnalyticsVisible,
  isAnalyticsCollapsed
}: TraceViewProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed as per user request

  const isAutomationActive = status === 'running' || status === 'writing';
  const hasSteps = steps && steps.length > 0;
  const completedCount = steps ? steps.filter(s => s.status === 'completed').length : 0;
  const totalCount = steps ? steps.length : 0;
  const isFullyDone = completedCount === totalCount && totalCount > 0;
  const isWorking = isThinking || (totalCount > 0 && completedCount < totalCount) || isAutomationActive;

  const currentStep = hasSteps 
    ? (steps.find(s => s.status === 'thinking') || steps[steps.length - 1]) 
    : { label: "系统逻辑中枢已就绪" };

  const isNone = status === 'none';
  const isDarkMode = theme === 'ink';
  const panelColors = {
    ink: {
      bg: isNone ? "rgba(23,23,23,0)" : (isExpanded ? "rgba(23,23,23,1)" : "rgba(23,23,23,0.4)"),
      border: isNone ? "rgba(38,38,38,0)" : "rgba(38,38,38,0.4)",
    },
    paper: {
      bg: isNone ? "rgba(244,241,234,0)" : (isExpanded ? "rgba(255,255,255,1)" : "rgba(243,241,233,0.6)"),
      border: isNone ? "rgba(220,217,207,0)" : "rgba(220,217,207,0.6)",
    },
    classic: {
      bg: isNone ? "rgba(245,245,245,0)" : (isExpanded ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)"),
      border: isNone ? "rgba(224,224,224,0)" : "rgba(224,224,224,0.8)",
    }
  };

  const currentPanelColor = panelColors[theme || 'ink'];

  return (
    <div className={cn("inline-flex", !isNone && "w-full flex justify-center", className)}>
      <motion.div 
        initial={false}
        animate={{ 
          width: isNone ? "40px" : (isExpanded ? "26rem" : "22rem"),
          height: isNone ? "40px" : "auto",
          padding: isNone ? "0px" : "4px 8px",
          backgroundColor: isNone ? (isDarkMode ? "rgba(23,23,23,0.2)" : "rgba(255,255,255,0.2)") : currentPanelColor.bg,
          borderColor: isNone ? (isDarkMode ? "rgba(38,38,38,0.3)" : "rgba(220,217,207,0.3)") : currentPanelColor.border,
          backdropFilter: isNone ? "blur(8px)" : "blur(12px)",
          borderRadius: isExpanded ? "16px" : "9999px"
        }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 30,
          mass: 1
        }}
        className={cn(
          "relative group border flex flex-col items-center justify-center overflow-hidden",
          !isNone && isExpanded && "shadow-2xl shadow-black/40"
        )}
      >
        {/* Main Bar (The Pill Content) */}
        <div className={cn(
          "flex items-center justify-between h-8 w-full transition-all duration-300",
          isNone ? "justify-center" : "sm:pl-40 pl-3"
        )}>
          {/* Status Orb / Local Ball - Permanent position */}
          <div className={cn(
            isNone ? "relative w-full h-full flex items-center justify-center" : "absolute left-2.5 top-1/2 -translate-y-1/2"
          )}>
            <LocalStatusBall isRunning={isWorking} theme={theme} onClick={onIconClick} status={status} />
            <AnimatePresence>
              {!isNone && !isExpanded && <AgentMirror onClick={onIconClick} />}
            </AnimatePresence>
          </div>

          {/* Left Content: Icon + Label */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {!isNone && (
              <div className={cn(
                "relative w-5.5 h-5.5 flex items-center justify-center shrink-0 border rounded-lg overflow-hidden transition-all duration-500",
                (isFullyDone && status !== 'writing')
                  ? "bg-green-500/10 border-green-500/30 text-green-500 shadow-[0_0_12px_rgba(34,197,94,0.15)]" 
                  : "bg-brand-red/10 border-brand-red/30 text-brand-red shadow-[0_0_12px_rgba(220,38,38,0.15)]"
              )}>
                <div className={cn(
                  "absolute inset-0 opacity-20",
                  (status === 'writing' || !isFullyDone) && "animate-pulse bg-brand-red"
                )} />
                {(isFullyDone && status !== 'writing') ? (
                  <Check className="w-2.5 h-2.5 relative z-10" />
                ) : (
                  <div className="relative w-2.5 h-2.5 flex items-center justify-center">
                    <Loader2 className="absolute inset-0 w-full h-full animate-spin opacity-40" />
                    {status === 'writing' ? (
                      <div className="w-1 h-1 bg-current rounded-full" />
                    ) : (
                      <Zap className="w-1.5 h-1.5 fill-current animate-pulse" />
                    )}
                  </div>
                )}
              </div>
            )}

            {!isNone && (
              <div className="flex flex-col min-w-0 justify-center">
                <span className="text-[11px] font-medium text-text-main truncate group-hover:text-brand-red transition-colors tracking-tight leading-none">
                  {currentStep?.label}
                </span>
              </div>
            )}
          </div>

          {/* Right Content: Stats + Toggle */}
          {!isNone && (
            <div className="flex items-center gap-3 shrink-0 px-1.5 ml-3 border-l border-hud-border/20">
              <div className="flex items-center gap-1 font-mono text-[10px] font-medium leading-none">
                <span className={cn(
                  isFullyDone ? "text-green-500" : "text-brand-red"
                )}>{completedCount}</span>
                <span className="text-muted-text/30">/</span>
                <span className="text-muted-text/60">{totalCount}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-black/5 cursor-pointer transition-all text-muted-text/40 group-hover:text-muted-text text-text-main"
              >
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Expanded Content Area */}
        <AnimatePresence>
          {isExpanded && !isNone && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="px-3 pt-1 pb-4 flex flex-col gap-3">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-hud-border/20 to-transparent mb-1" />
                
                {/* Secondary Status info in expanded view */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isFullyDone ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-brand-red animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.4)]"
                    )} />
                    <span className="text-[9px] font-display font-bold uppercase tracking-[0.2em] text-muted-text/60">
                      {status === 'writing' ? "自动化执行中" : (isFullyDone ? "推演序列完成" : "正在实时同步数据...")}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-muted-text/40 uppercase tracking-widest">TRACE_LOG_v2</span>
                </div>

                {/* Vertical Capsule Steps */}
                {hasSteps && (
                  <div className="flex flex-col gap-1.5 pl-3 ml-1 border-l border-hud-border/10">
                    {steps.map((step, idx) => (
                      <motion.div 
                        key={`trace-step-${step.id}-${idx}`} 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-[10px] font-sans w-full transition-colors",
                          step.status === 'completed' 
                            ? "bg-neutral-500/[0.02] border-neutral-500/5 text-muted-text/40" 
                            : step.status === 'thinking'
                              ? "bg-brand-red/[0.04] border-brand-red/15 text-text-main font-medium"
                              : "bg-transparent border-transparent text-muted-text/20"
                        )}
                      >
                        {/* Status Indicator Dot */}
                        <div className={cn(
                          "w-1 h-1 rounded-full shrink-0",
                          step.status === 'completed' && "bg-neutral-400/40",
                          step.status === 'thinking' && "bg-brand-red animate-pulse shadow-[0_0_6px_rgba(220,38,38,0.5)]",
                          step.status === 'pending' && "bg-muted-text/10"
                        )} />
                        
                        {step.status === 'thinking' && (
                          <Loader2 className="w-2.5 h-2.5 animate-spin shrink-0 opacity-40" />
                        )}

                        <span className="truncate flex-1">{step.label}</span>
                        {step.status === 'completed' && (
                          <Check className="w-2.5 h-2.5 text-green-500 opacity-60" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
