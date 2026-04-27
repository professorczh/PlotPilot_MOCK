import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { cn } from '../lib/utils';
import { Activity, X, ChevronDown, ChevronUp } from 'lucide-react';

const data = [
  { name: 'PH_01', rhythm: 40, suspense: 20, conflict: 10 },
  { name: 'PH_02', rhythm: 45, suspense: 35, conflict: 15 },
  { name: 'PH_03', rhythm: 50, suspense: 45, conflict: 30 },
  { name: 'PH_04', rhythm: 40, suspense: 60, conflict: 45 },
  { name: 'PH_05', rhythm: 60, suspense: 75, conflict: 80 },
  { name: 'PH_06', rhythm: 80, suspense: 90, conflict: 95 },
  { name: 'PH_07', rhythm: 50, suspense: 40, conflict: 30 },
  { name: 'PH_08', rhythm: 45, suspense: 30, conflict: 20 },
  { name: 'PH_09', rhythm: 55, suspense: 50, conflict: 40 },
  { name: 'PH_10', rhythm: 70, suspense: 85, conflict: 90 },
];

interface AnalyticsPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSetSize: (percentage: number) => void;
}

export default function AnalyticsPanel({ isCollapsed, onToggle, onClose, onSetSize }: AnalyticsPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Manual resize observer to bypass ResponsiveContainer's quirks
  useEffect(() => {
    if (isCollapsed || !containerRef.current) return;

    const observeTarget = containerRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.disconnect();
  }, [isCollapsed]);

  return (
    <div className="h-full w-full p-4 pt-2 pb-6 flex justify-center pointer-events-none">
      <div className={cn(
        "w-full max-w-3xl h-full flex flex-col overflow-hidden relative pointer-events-auto transition-all duration-500 ease-[0.23,1,0.32,1] rounded-xl",
        "bg-app-bg border border-hud-border/40 shadow-2xl",
        isCollapsed && "max-w-md self-start"
      )}>
        <div 
          className={cn(
            "border-b border-hud-border flex items-center justify-between px-6 shrink-0 select-none relative z-[300] bg-panel-bg/40 pointer-events-auto transition-colors",
            isCollapsed 
              ? 'flex-1 h-full min-h-[44px] bg-brand-red/10 animate-pulse-subtle hover:bg-brand-red/20 cursor-pointer' 
              : 'h-12 bg-white/5'
          )}
          onClick={() => isCollapsed && onToggle()}
        >
          <div className="flex items-center gap-6 relative z-[310]">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="flex items-center gap-2 text-brand-red cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Activity className="w-4 h-4 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em]">张力心电图</span>
            </div>

                <div className="flex items-center gap-2 ml-2">
            {[
              { label: '1/4', val: 25 },
              { label: '1/2', val: 50 },
              { label: 'MAX', val: 80 }
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`[UI] Analytics: Force Size -> ${btn.label} (${btn.val}%)`);
                  onSetSize(btn.val);
                }}
                className="text-[9px] font-mono font-bold bg-white/5 hover:bg-brand-red/20 text-muted-text hover:text-text-main px-2 py-0.5 rounded-lg border border-hud-border hover:border-brand-red/50 transition-all uppercase tracking-tighter"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 relative z-[310] pointer-events-auto">
          <AnimatePresence>
            {isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-[10px] font-mono text-brand-red font-bold uppercase tracking-widest mr-2 hidden sm:inline-block"
              >
                已折叠
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex-1 p-4 pt-0 relative flex flex-col min-h-0 w-full overflow-hidden">
          <div className="flex items-center justify-between py-3 z-10 shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-tight">
                <div className="flex items-center gap-1.5 text-emerald-400/80">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                  <span>节奏 Rhythm</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400/80">
                  <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
                  <span>悬念 Suspense</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-red/80">
                  <div className="w-1 h-1 rounded-full bg-brand-red shadow-[0_0_5px_rgba(220,38,38,0.5)]" />
                  <span>冲突 Conflict</span>
                </div>
              </div>
            </div>
            <button className="text-[10px] font-mono font-bold uppercase bg-brand-red/10 text-brand-red px-3 py-1 rounded-lg border border-brand-red/30 hover:bg-brand-red/20 transition-all hover:scale-105 active:scale-95">
              重新演算 RE-CALCULATE
            </button>
          </div>

          <div 
            ref={containerRef}
            className="flex-1 relative mt-2 w-full min-h-0"
          >
            {dimensions.width > 0 && dimensions.height > 0 && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                     style={{ backgroundImage: 'radial-gradient(#DC2626 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
                
                <AreaChart 
                  width={dimensions.width} 
                  height={dimensions.height} 
                  data={data} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorConflict" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#737373" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    fontFamily="JetBrains Mono"
                  />
                  <YAxis 
                    stroke="#737373" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    fontFamily="JetBrains Mono"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      border: '1px solid var(--hud-border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono',
                      color: 'var(--text-main)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conflict" 
                    stroke="#DC2626" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorConflict)" 
                    isAnimationActive={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rhythm" 
                    stroke="#34D399" 
                    strokeWidth={1.5} 
                    dot={{ r: 2, fill: '#34D399', strokeWidth: 0 }}
                    isAnimationActive={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="suspense" 
                    stroke="#60A5FA" 
                    strokeWidth={1.5} 
                    dot={{ r: 2, fill: '#60A5FA', strokeWidth: 0 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);
}

