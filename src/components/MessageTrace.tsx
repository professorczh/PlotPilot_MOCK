import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Loader2, ChevronDown, Activity, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface TraceStep {
  id: string;
  label: string;
  status: 'pending' | 'thinking' | 'completed';
}

interface MessageTraceProps {
  steps: TraceStep[];
  isThinking?: boolean;
  isCompleted?: boolean;
  className?: string;
}

export const MessageTrace: React.FC<MessageTraceProps> = ({ 
  steps, 
  isThinking, 
  isCompleted,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const totalCount = steps.length;
  const isFullyCompleted = completedCount === totalCount && totalCount > 0;
  const isActivelyWorking = isThinking || (completedCount < totalCount);

  return (
    <div className={cn("w-full transition-all duration-300", className)}>
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-colors",
          "bg-white/5 hover:bg-white/10 border border-white/5",
          isExpanded ? "mb-0.5 rounded-lg border-b shadow-lg" : "rounded-lg"
        )}
      >
        <div className="flex items-center gap-2">
          {isActivelyWorking ? (
            <Loader2 className="w-3 h-3 text-brand-red animate-spin" />
          ) : isFullyCompleted ? (
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
            </div>
          ) : (
            <Activity className="w-3 h-3 text-muted-text/40" />
          )}
          <span className="text-[11px] font-sans font-medium text-text-main/80">
            {isActivelyWorking ? "正在同步推演逻辑..." : "推演逻辑已同步"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-mono text-muted-text/60">
            {completedCount} / {totalCount}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-3 h-3 text-muted-text/40" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white/5 border border-white/5 border-t-0 rounded-b-lg"
          >
            <div className="p-2 space-y-1">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-2 px-1 py-0.5">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500/60" />
                  ) : step.status === 'thinking' ? (
                    <Loader2 className="w-3 h-3 text-brand-red animate-spin" />
                  ) : (
                    <Circle className="w-3 h-3 text-muted-text/20" />
                  )}
                  <span className={cn(
                    "text-[10px] font-sans",
                    step.status === 'completed' ? "text-text-main/60" : 
                    step.status === 'thinking' ? "text-brand-red" : "text-muted-text/40"
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
