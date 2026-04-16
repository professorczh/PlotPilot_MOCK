import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

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

export default function AnalyticsPanel() {
  return (
    <div className="h-full border-t border-hud-border bg-panel-bg/80 backdrop-blur-md flex flex-col overflow-hidden relative">
      <div className="h-10 border-b border-hud-border flex items-center justify-between px-4 bg-app-bg/30 shrink-0 z-20 sticky top-0">
        <div className="flex items-center gap-2 text-brand-red">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-display font-bold uppercase tracking-widest">Tension Dynamics</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
              <span>RHYTHM</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
              <span>SUSPENSE</span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-red">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-red shadow-[0_0_5px_rgba(220,38,38,0.5)]" />
              <span>CONFLICT</span>
            </div>
          </div>
          <button className="text-xs font-mono uppercase bg-brand-red/10 text-brand-red px-2 py-0.5 rounded border border-brand-red/30 hover:bg-brand-red/20 transition-all">
            Recalculate
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 relative">
        {/* HUD Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#DC2626 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
            />
            <Line 
              type="monotone" 
              dataKey="rhythm" 
              stroke="#34D399" 
              strokeWidth={1.5} 
              dot={{ r: 2, fill: '#34D399', strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="suspense" 
              stroke="#60A5FA" 
              strokeWidth={1.5} 
              dot={{ r: 2, fill: '#60A5FA', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

