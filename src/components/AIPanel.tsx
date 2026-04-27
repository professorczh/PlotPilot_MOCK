import { useState } from 'react';
import { 
  Sparkles, Brain, Network, ChevronDown, Plus, ListTree, X, 
  Library, Wrench, Activity, ShieldCheck, AlertCircle, Radar,
  Drama, Radio, ExternalLink, CheckCircle2, Minus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeMode } from '../types';
import RelationshipGraph from './RelationshipGraph';

type AITab = 'deduction' | 'analytics' | 'tools';

interface AIPanelProps {
  theme?: ThemeMode;
  isMockLoadingEnabled?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
}

export default function AIPanel({ 
  theme = 'ink', 
  isMockLoadingEnabled = true,
  onClose,
  onMinimize
}: AIPanelProps) {
  const isDarkMode = theme === 'ink';
  const isClassic = theme === 'classic';
  const [activeTab, setActiveTab] = useState<AITab>('deduction');

  const tabs: { id: AITab; label: string; icon: any }[] = [
    { id: 'deduction', label: '推演推敲', icon: Brain },
    { id: 'analytics', label: '运行日志', icon: Activity },
    { id: 'tools', label: '辅助工具', icon: Wrench },
  ];

  return (
    <div className="w-full h-full pt-0 pr-3 pb-3 pl-1 overflow-hidden">
      <div className="w-full flex flex-col h-full overflow-hidden transition-[width,height] duration-300 ease-out">
        {/* Integrated Header with Tabs - Now as a separate module */}
      <div className="h-14 flex items-center justify-between px-3 shrink-0 z-30 transition-shadow duration-300">
        <div className="flex items-center gap-1.5 focus-within:outline-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "h-[32px] px-3 flex items-center gap-1.5 transition-all duration-200 rounded-[8px] border font-medium text-[13px] tracking-tight",
                activeTab === tab.id 
                  ? (isDarkMode ? 'bg-white/10 text-white border-white/20' : 'bg-white text-text-main border-hud-border') 
                  : (isDarkMode ? 'bg-transparent text-muted-text border-white/5 hover:bg-white/5 hover:text-white' : 'bg-transparent text-muted-text border-hud-border/40 hover:bg-black/5 hover:text-text-main')
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5 transition-all", activeTab === tab.id ? 'stroke-[2px]' : 'stroke-1.5')} />
              <span className="font-sans whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={onClose}
            className={cn(
              "w-[32px] h-[32px] flex items-center justify-center transition-all duration-200 rounded-[8px] border",
              isDarkMode ? 'bg-transparent text-muted-text border-hud-border/30 hover:bg-white/5 hover:text-white' : 'bg-transparent text-muted-text border-hud-border/50 hover:bg-black/5 hover:text-black'
            )}
            title="关闭面板"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Area - Also a separate module */}
      <div className={`flex-1 overflow-hidden relative border rounded-xl ${isDarkMode ? 'bg-app-bg/50 border-hud-border' : 'bg-panel-bg/80 border-hud-border/50'} backdrop-blur-sm`}>
        {activeTab === 'deduction' ? (
          <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
            {/* Logic Flow */}
            <div className={`border-b border-hud-border ${isDarkMode ? 'bg-panel-bg/30' : 'bg-app-bg/30'}`}>
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-black/5'}`}>
                <div className="flex items-center gap-2 text-emerald-500">
                  <ListTree className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">逻辑推演流</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-text" />
              </div>
              <div className="p-3 space-y-4">
                <div className="relative pl-4 border-l border-hud-border space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-panel-bg rounded-full" />
                    <div className="text-[10px] font-mono text-muted-text mb-1 uppercase tracking-tighter">阶段 01 - 矛盾爆发</div>
                    <div className={`text-sm text-text-main p-2 border rounded-lg ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-500/10 border-emerald-500/30'} backdrop-blur-sm`}>
                      林墨在天台发现法阵，与张磊的矛盾进一步升级。
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-hud-border border-2 border-panel-bg rounded-full" />
                    <div className="text-[10px] font-mono text-muted-text mb-1 uppercase tracking-tighter">阶段 02 - 初入异界</div>
                    <div className="text-sm text-muted-text p-2 rounded-lg">
                      进入异世界，林墨觉醒了古老的符文天赋。
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant - Simplified since cards moved to Agent view */}
            <div className={`border-b border-hud-border ${isDarkMode ? 'bg-panel-bg/20' : 'bg-app-bg/20'}`}>
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-black/5'}`}>
                <div className="flex items-center gap-2 text-blue-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">AI 协同建议</span>
                </div>
              </div>
              <div className="p-8 text-center">
                <div className={cn(
                  "inline-block p-3 rounded-full mb-3",
                  isDarkMode ? "bg-white/5" : "bg-black/5"
                )}>
                  <Sparkles className="w-5 h-5 text-muted-text opacity-50" />
                </div>
                <p className="text-[11px] text-muted-text uppercase tracking-widest font-mono">
                  建议卡片已移至 Agent 墨枢对话流 <br/>
                  <span className="opacity-40 mt-1 block">实时推演中...</span>
                </p>
              </div>
            </div>

            {/* Relationship Graph Section */}
            <div className={`${isDarkMode ? 'bg-panel-bg/40' : 'bg-app-bg/40'}`}>
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-black/5'}`}>
                <div className="flex items-center gap-2 text-purple-500">
                  <Network className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">关系图谱</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-text" />
              </div>
              <div className={`h-72 relative overflow-hidden ${isDarkMode ? 'bg-black/20' : 'bg-black/5'}`}>
                <RelationshipGraph />
                {/* HUD Overlay */}
                <div className={`absolute inset-0 pointer-events-none border m-2 ${isDarkMode ? 'border-brand-red/5' : 'border-brand-red/10'}`} />
              </div>
            </div>
            
            {/* Added spacing at the bottom for scroll */}
            <div className="h-10 shrink-0" />
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
            {/* Real-time Logs */}
            <div className={`border-b border-hud-border ${isDarkMode ? 'bg-panel-bg/30' : 'bg-app-bg/30'}`}>
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-black/5'}`}>
                <div className="flex items-center gap-2 text-brand-red">
                  <Radio className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">实时日志</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-muted-text uppercase">自动驾驶已停止</span>
                  <span className={`px-1.5 py-0.5 text-[9px] text-muted-text border border-hud-border rounded ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>2 条</span>
                  <button className="text-[9px] text-muted-text hover:text-text-main uppercase font-bold tracking-tighter rounded px-1 hover:bg-black/5 transition-colors">折叠日志</button>
                </div>
              </div>
              <div className="p-3">
                <div className={`h-32 border border-hud-border p-2 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-2 ${isDarkMode ? 'bg-black/40' : 'bg-white/80'}`}>
                  <div className={`${isDarkMode ? 'text-blue-400/80' : 'text-blue-700/80'} flex gap-2`}>
                    <span className="opacity-50">21:47:09</span>
                    <span className="flex-1">🔌 日志流已连接 (阶段变更需连续约 4 秒一致才推送，避免界面抖动)</span>
                  </div>
                  <div className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} flex gap-2`}>
                    <span className="opacity-50">21:47:09</span>
                    <span className="flex-1">🟦 自动驾驶已停止</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Circuit Breaker */}
            <div className={`border-b border-hud-border ${isDarkMode ? 'bg-panel-bg/20' : 'bg-app-bg/20'}`}>
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-black/5'}`}>
                <div className="flex items-center gap-2 text-emerald-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">熔断保护</span>
                </div>
                <span className={`px-1.5 py-0.5 border text-[9px] font-bold uppercase ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-500/20 text-emerald-700 border-emerald-500/40'}`}>正常</span>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-[10px] text-muted-text leading-relaxed">
                  单本连续失败达到阈值会挂起；未启动托管时多为「正常」。守护进程内另有全局 LLM 熔断（防 API 雪崩），本卡无法显示其开闭；若所有书长时间不推进，请查看 <code className={`px-1 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>logs/autopilot_daemon.log</code> 或重启守护进程并等待冷却。
                </p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 border-2 flex items-center justify-center relative rounded-xl ${isDarkMode ? 'border-emerald-500/30' : 'border-emerald-500/20'}`}>
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <div className="absolute inset-0 border-2 border-emerald-500/10 animate-ping" />
                  </div>
                  <div>
                    <div className={`text-sm font-bold mb-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>系统运行正常</div>
                    <div className="text-[10px] text-muted-text">无异常错误，保护待命</div>
                  </div>
                </div>
                <div className={`pt-2 flex justify-between items-center text-[11px] font-mono border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                  <span className="text-muted-text">连续错误:</span>
                  <span className="text-text-main">0 / 3</span>
                </div>
              </div>
            </div>

            {/* Style Monitor */}
            <div className={`border-b border-hud-border ${isDarkMode ? 'bg-panel-bg/10' : 'bg-app-bg/10'}`}>
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-black/5'}`}>
                <div className="flex items-center gap-2 text-amber-500">
                  <Drama className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">文风警报器</span>
                </div>
              </div>
              <div className="p-6 flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                  <span className="text-2xl font-mono font-bold text-text-main">0.0</span>
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-bold mb-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>文风稳定</div>
                  <p className="text-[10px] text-muted-text leading-relaxed">文风保持一致，无需干预</p>
                </div>
              </div>
            </div>

            {/* Foreshadowing Radar */}
            <div className={`${isDarkMode ? 'bg-panel-bg/5' : 'bg-app-bg/5'}`}>
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-black/5'}`}>
                <div className="flex items-center gap-2 text-purple-500">
                  <Radar className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">伏笔雷达</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 border text-[9px] font-bold uppercase rounded ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-500/20 text-emerald-700 border-emerald-500/40'}`}>已回收 9</span>
                  <span className={`px-1.5 py-0.5 border text-[9px] font-bold uppercase rounded ${isDarkMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-500/20 text-amber-700 border-amber-500/40'}`}>待回收 4</span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] text-muted-text leading-relaxed max-w-[160px]">
                    只读摘要。新增 / 编辑伏笔：侧栏 「片场 → 伏笔账本」 → 「+ 添加伏笔」 (与本卡数据同源)。
                  </p>
                  <button className="flex items-center gap-1 text-[9px] text-muted-text hover:text-brand-red uppercase font-bold transition-colors hover:bg-black/5 p-1 rounded">
                    查看全部 <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`border border-hud-border p-2 text-center rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                    <div className="text-[9px] text-muted-text uppercase mb-1">总计</div>
                    <div className="text-lg font-mono font-bold text-text-main">13</div>
                  </div>
                  <div className={`border border-hud-border p-2 text-center rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                    <div className="text-[9px] text-muted-text uppercase mb-1">回收率</div>
                    <div className="text-lg font-mono font-bold text-text-main">69%</div>
                  </div>
                  <div className={`border border-hud-border p-2 text-center rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                    <div className="text-[9px] text-muted-text uppercase mb-1">平均间隔</div>
                    <div className="text-lg font-mono font-bold text-text-main">2 <span className="text-[10px] opacity-50">章</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-10 shrink-0" />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-black/20">
            <div className="w-16 h-16 bg-white/5 border border-hud-border flex items-center justify-center mb-6 relative overflow-hidden group rounded-xl">
              <div className="absolute inset-0 bg-brand-red/10 animate-pulse" />
              <Wrench className="w-6 h-6 text-brand-red" />
            </div>
            <h3 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-text-main mb-2">
              辅助工具中心
            </h3>
            <p className="text-xs text-muted-text font-mono uppercase tracking-widest opacity-50">
              {isMockLoadingEnabled ? 'Module Initializing...' : 'Module Ready'}
            </p>
            {isMockLoadingEnabled ? (
              <div className="mt-8 w-48 h-1 bg-hud-border overflow-hidden">
                <div className="h-full bg-brand-red animate-[loading_2s_infinite]" style={{ width: '40%' }} />
              </div>
            ) : (
              <div className="mt-8 flex items-center gap-2 text-emerald-500">
                <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Active</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
