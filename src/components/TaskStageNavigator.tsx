import React from 'react';
import { motion } from 'motion/react';
import { Wand2, CheckCircle2, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { AISuggestion, TraceStep } from '../types';

interface TaskStageNavigatorProps {
  suggestions: AISuggestion[];
  onApply: (id: string) => void;
  isDarkMode: boolean;
}

export const TaskStageNavigator: React.FC<TaskStageNavigatorProps> = ({ 
  suggestions, 
  onApply,
  isDarkMode 
}) => {
  return (
    <div className="w-full max-w-[92%] space-y-3 mt-2 mb-4">
      {/* 场景 C 特有的结构化头部：标识这是“方案决策”阶段 */}
      <div className="flex items-center gap-2 px-1 mb-2">
        <div className="w-1 h-3 bg-brand-red rounded-full" />
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-muted-text/60">
          方案演化分支 / EVOLUTION BRANCHES
        </span>
      </div>

      {suggestions.map((suggestion, idx) => (
        <motion.div 
          key={suggestion.id}
          // 修复漂移 Bug：彻底移除 Y 轴位移动画，改为纯透明度与极小缩放，防止视觉“下沉感”
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.4,
            delay: idx * 0.08,
            ease: [0.23, 1, 0.32, 1] 
          }}
          className={cn(
            "group relative p-4 rounded-xl border transition-all duration-300",
            suggestion.isRecommended 
              ? (isDarkMode 
                  ? "bg-brand-red/[0.03] border-brand-red/30 shadow-[0_4px_20px_rgba(220,38,38,0.05)]" 
                  : "bg-red-50/50 border-red-200 shadow-md")
              : (isDarkMode 
                  ? "bg-panel-bg/40 border-hud-border/40 hover:border-hud-border" 
                  : "bg-white border-slate-200 shadow-sm")
          )}
        >
          {suggestion.isRecommended && (
            <div className="absolute -top-px -left-px -right-px h-[2px] bg-gradient-to-r from-transparent via-brand-red/40 to-transparent" />
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-7 h-7 flex items-center justify-center rounded-lg border transition-all duration-500",
                suggestion.isRecommended 
                  ? "bg-brand-red/10 border-brand-red/30 text-brand-red shadow-[0_0_10px_rgba(220,38,38,0.1)]" 
                  : "bg-muted-text/5 border-hud-border/30 text-muted-text/60"
              )}>
                {suggestion.isRecommended ? <Star className="w-3.5 h-3.5 fill-current" /> : <Wand2 className="w-3.5 h-3.5" />}
              </div>
              <span className={cn(
                "text-[12px] font-sans font-bold tracking-tight",
                isDarkMode ? "text-text-main" : "text-slate-800"
              )}>
                {suggestion.title}
              </span>
            </div>
            {suggestion.isRecommended && (
              <div className="flex items-center bg-brand-red/10 px-2 py-0.5 rounded-md border border-brand-red/20 shadow-[0_0_8px_rgba(220,38,38,0.1)]">
                <span className="text-[9px] font-sans font-bold text-brand-red uppercase tracking-wider">高契合推演</span>
              </div>
            )}
          </div>
          
          <p className={cn(
            "text-[14px] font-sans leading-relaxed mb-5",
            isDarkMode ? "text-text-main/70" : "text-slate-700"
          )}>
            {suggestion.content}
          </p>
          
          <div className="flex justify-end">
            <button 
              onClick={() => onApply(suggestion.id)}
              className={cn(
                "group/btn relative px-6 py-2.5 overflow-hidden rounded-xl transition-all active:scale-95 border",
                suggestion.isRecommended
                  ? "bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/30 hover:brightness-110"
                  : "bg-transparent border-hud-border text-muted-text hover:border-brand-red hover:text-brand-red"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-sweep pointer-events-none" />
              <div className="flex items-center gap-2.5 text-[10px] font-sans font-bold uppercase tracking-[0.15em] relative z-10">
                <CheckCircle2 className="w-3.5 h-3.5 opacity-80" />
                确认采用
              </div>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
