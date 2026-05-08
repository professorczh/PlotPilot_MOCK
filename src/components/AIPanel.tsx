import { useState } from 'react';
import { 
  Sparkles, Brain, Network, ChevronDown, Plus, ListTree, X, 
  Library, Wrench, Activity, ShieldCheck, AlertCircle, Radar,
  Drama, Radio, ExternalLink, CheckCircle2, Minus, Map, Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { ThemeMode, Chapter } from '../types';
import { characterData, geographyData } from '../constants/storyData';
import RelationshipGraph from './RelationshipGraph';
import WorldMapGraph from './WorldMapGraph';

type AITab = 'deduction' | 'analytics' | 'tools';

interface AIPanelProps {
  theme?: ThemeMode;
  isMockLoadingEnabled?: boolean;
  activeChapter?: Chapter;
  onClose?: () => void;
  onMinimize?: () => void;
}

export default function AIPanel({ 
  theme = 'ink', 
  isMockLoadingEnabled = true,
  activeChapter,
  onClose,
  onMinimize
}: AIPanelProps) {
  const isDarkMode = theme === 'ink';
  const isClassic = theme === 'classic';
  const [activeTab, setActiveTab] = useState<AITab>('deduction');
  
  // Content mode state for sidebar panels
  const [geographyMode, setGeographyMode] = useState<'canvas' | 'cards'>('canvas');
  const [relationshipMode, setRelationshipMode] = useState<'canvas' | 'cards'>('canvas');
  
  // State for foldable sections
  const [expandedSections, setExpandedSections] = useState({
    logicFlow: true,
    geography: true,
    graph: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const tabs: { id: AITab; label: string; icon: any }[] = [
    { id: 'deduction', label: '推演推敲', icon: Brain },
    { id: 'analytics', label: '运行日志', icon: Activity },
    { id: 'tools', label: '辅助工具', icon: Wrench },
  ];

  return (
    <div className="w-full h-full pt-0 pr-3 pb-3 pl-1 overflow-hidden">
      <div className="w-full flex flex-col h-full overflow-hidden transition-[width,height] duration-300 ease-out">
        {/* Integrated Header with Tabs */}
      <div className="h-14 flex items-center justify-between px-3 shrink-0 z-30 transition-shadow duration-300">
        <div className="flex items-center gap-1.5 focus-within:outline-none">
          {tabs.map((tab) => (
            <button
              key={`ai-panel-tab-${tab.id}`}
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

      {/* Content Area */}
      <div className={`flex-1 overflow-hidden relative border rounded-xl ${isDarkMode ? 'bg-app-bg/50 border-hud-border' : 'bg-panel-bg/80 border-hud-border/50'} backdrop-blur-sm`}>
        {activeTab === 'deduction' ? (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Logic Flow */}
            <div className={cn(
              "border-b border-hud-border/30 flex flex-col transition-all duration-500 ease-in-out",
              expandedSections.logicFlow ? "flex-1 min-h-[140px]" : "shrink-0"
            )}>
              <div 
                onClick={() => toggleSection('logicFlow')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleSection('logicFlow');
                  }
                }}
                className={cn(
                  "w-full p-3 border-b border-hud-border/20 flex items-center justify-between transition-colors cursor-pointer outline-none shrink-0",
                  isDarkMode ? "hover:bg-white/[0.05] bg-white/[0.02]" : "hover:bg-black/[0.05] bg-black/[0.02]"
                )}
              >
                <div className="flex items-center gap-2 text-emerald-500">
                  <ListTree className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">逻辑推演流</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-muted-text transition-transform duration-300", !expandedSections.logicFlow && "-rotate-90")} />
              </div>
              
              <AnimatePresence initial={false}>
                {expandedSections.logicFlow && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 overflow-hidden"
                  >
                    <div className={cn(
                      "p-4 h-full overflow-y-auto custom-scrollbar space-y-4", 
                      isDarkMode ? "bg-white/[0.03]" : "bg-black/[0.01]"
                    )}>
                      <div className="relative pl-4 border-l border-hud-border space-y-4">
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-brand-red border-2 border-panel-bg rounded-full" />
                          <div className="text-[10px] font-mono text-muted-text mb-1 uppercase tracking-tighter">阶段 01 - 宿命重生</div>
                          <div className={`text-sm text-text-main p-2 border rounded-lg ${isDarkMode ? 'bg-brand-red/10 border-brand-red/20' : 'bg-brand-red/20 border-brand-red/30'} backdrop-blur-sm`}>
                            赢扶苏在南境长城苏醒，利用现代公关思维平息了一场即将爆发的戍卒营变。
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-hud-border border-2 border-panel-bg rounded-full" />
                          <div className="text-[10px] font-mono text-muted-text mb-1 uppercase tracking-tighter">阶段 02 - 咸阳风云</div>
                          <div className="text-sm text-muted-text p-2 rounded-lg">
                            受召回京，在廷尉府与赵高党羽展开第一轮资源博弈。
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Geographical Territory */}
            <div className={cn(
              "border-b border-hud-border/30 flex flex-col transition-all duration-500 ease-in-out font-sans",
              expandedSections.geography ? "flex-1 min-h-[220px]" : "shrink-0"
            )}>
              <div 
                onClick={() => toggleSection('geography')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleSection('geography');
                  }
                }}
                className={cn(
                  "w-full p-3 border-b border-hud-border/20 flex items-center justify-between transition-colors group/header cursor-pointer outline-none shrink-0",
                  isDarkMode ? "hover:bg-white/[0.05] bg-white/[0.02]" : "hover:bg-black/[0.05] bg-black/[0.02]"
                )}
              >
                <div className="flex items-center gap-2 text-blue-500">
                  <Map className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">地理疆域</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex bg-black/20 rounded-full p-0.5 border border-white/5">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setGeographyMode('canvas');
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded-full flex items-center gap-1 transition-all",
                        geographyMode === 'canvas' ? "bg-brand-red text-white" : "text-muted-text hover:text-text-main"
                      )}
                    >
                      <Network className="w-2.5 h-2.5" />
                      <span className="text-[8px] font-display font-bold uppercase">画布</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setGeographyMode('cards');
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded-full flex items-center gap-1 transition-all",
                        geographyMode === 'cards' ? "bg-brand-red text-white" : "text-muted-text hover:text-text-main"
                      )}
                    >
                      <Box className="w-2.5 h-2.5" />
                      <span className="text-[8px] font-display font-bold uppercase">卡片</span>
                    </button>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-text transition-transform duration-300", !expandedSections.geography && "-rotate-90")} />
                </div>
              </div>
              
              <AnimatePresence initial={false}>
                {expandedSections.geography && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 overflow-hidden"
                  >
                    <div className={cn(
                      "h-full relative overflow-hidden group/geo shrink-0", 
                      isDarkMode ? "bg-white/[0.03]" : "bg-black/[0.01]"
                    )}>
                      <AnimatePresence mode="wait">
                        {geographyMode === 'canvas' ? (
                          <motion.div 
                            key="geo-sidebar-canvas"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                          >
                            <WorldMapGraph highlightedIds={activeChapter?.relatedLocations} />
                            <div className="absolute bottom-2 left-3 pointer-events-none">
                              <span className="text-[7px] font-mono text-muted-text uppercase tracking-[0.2em] opacity-40">滚轮缩放 · 拖拽平移</span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="geo-sidebar-cards"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full overflow-y-auto custom-scrollbar px-3 py-4 grid grid-cols-2 gap-x-3 gap-y-5 auto-rows-max"
                          >
                            {geographyData
                              .slice()
                              .sort((a, b) => {
                                const aRelated = activeChapter?.relatedLocations?.includes(a.id) ? 1 : 0;
                                const bRelated = activeChapter?.relatedLocations?.includes(b.id) ? 1 : 0;
                                return bRelated - aRelated;
                              })
                              .map((loc, i) => {
                                const isRelated = activeChapter?.relatedLocations?.includes(loc.id);
                                const hasContext = !!activeChapter?.relatedLocations?.length;
                                
                                return (
                                  <div key={`sidebar-geo-${loc.id}-${i}`} className={cn(
                                    "group/card relative transition-all duration-500",
                                    hasContext && !isRelated && "opacity-40 scale-95 origin-center grayscale brightness-75"
                                  )}>
                                    <div className={cn(
                                      "relative aspect-[16/9] rounded-xl border overflow-hidden flex transition-all duration-500",
                                      isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-hud-border shadow-sm",
                                      hasContext && isRelated && "hud-card-glow"
                                    )}>
                                      {/* Left: Portrait/Scene */}
                                      <div className={cn(
                                        "w-2/5 relative h-full shrink-0 overflow-hidden border-r",
                                        isDarkMode ? "border-white/10" : "border-black/5"
                                      )}>
                                        <img 
                                          src={loc.img} 
                                          alt={loc.name}
                                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                                        {isRelated && (
                                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-brand-red border border-white/20 backdrop-blur-md z-10 shadow-lg scale-[0.8] origin-top-left">
                                            <div className="w-1 h-1 rounded-full bg-white" />
                                            <span className="text-[7px] text-white font-display uppercase tracking-[0.1em] font-bold">关联</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Right: Info */}
                                      <div className="flex-1 p-2 flex flex-col justify-center min-w-0 relative">
                                        <div className="flex flex-col gap-0.5 mb-1.5">
                                           <span className={cn(
                                             "text-[10px] font-sans font-extrabold truncate",
                                             isDarkMode ? "text-white" : "text-black"
                                           )}>{loc.name}</span>
                                           <div className="flex items-center">
                                             <span className={cn(
                                               "shrink-0 text-[6px] font-display uppercase tracking-widest px-1 border rounded-[2px]",
                                               isDarkMode ? "border-white/20 text-white/60 bg-white/5" : "border-black/10 text-black/40 bg-black/5"
                                             )}>{loc.tag}</span>
                                           </div>
                                        </div>
                                        <p className={cn(
                                          "text-[7px] line-clamp-2 leading-relaxed italic",
                                          isDarkMode ? "text-white/50" : "text-black/50"
                                        )}>"{loc.description}"</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            <div className="col-span-2 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Relationship Graph Section */}
            <div className={cn(
              "border-hud-border/30 flex flex-col transition-all duration-500 ease-in-out",
              expandedSections.graph ? "flex-1 min-h-[220px]" : "shrink-0"
            )}>
              <div 
                onClick={() => toggleSection('graph')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleSection('graph');
                  }
                }}
                className={cn(
                  "w-full p-3 border-b border-hud-border/20 flex items-center justify-between transition-colors group/header cursor-pointer outline-none shrink-0",
                  isDarkMode ? "hover:bg-white/[0.05] bg-white/[0.02]" : "hover:bg-black/[0.05] bg-black/[0.02]"
                )}
              >
                <div className="flex items-center gap-2 text-purple-500">
                  <Network className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">关系图谱</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex bg-black/20 rounded-full p-0.5 border border-white/5">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setRelationshipMode('canvas');
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded-full flex items-center gap-1 transition-all",
                        relationshipMode === 'canvas' ? "bg-brand-red text-white" : "text-muted-text hover:text-text-main"
                      )}
                    >
                      <Network className="w-2.5 h-2.5" />
                      <span className="text-[8px] font-display font-bold uppercase">画布</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setRelationshipMode('cards');
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded-full flex items-center gap-1 transition-all",
                        relationshipMode === 'cards' ? "bg-brand-red text-white" : "text-muted-text hover:text-text-main"
                      )}
                    >
                      <Box className="w-2.5 h-2.5" />
                      <span className="text-[8px] font-display font-bold uppercase">卡片</span>
                    </button>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-text transition-transform duration-300", !expandedSections.graph && "-rotate-90")} />
                </div>
              </div>
              
              <AnimatePresence initial={false}>
                {expandedSections.graph && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 overflow-hidden"
                  >
                    <div className={cn(
                      "h-full relative overflow-hidden group/rel shrink-0", 
                      isDarkMode ? "bg-white/[0.03]" : "bg-black/[0.01]"
                    )}>
                      <AnimatePresence mode="wait">
                        {relationshipMode === 'canvas' ? (
                          <motion.div 
                            key="rel-sidebar-canvas"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                          >
                            <RelationshipGraph theme={theme} highlightedIds={activeChapter?.relatedCharacters} />
                            <div className={`absolute inset-0 pointer-events-none border m-2 shadow-inner ${isDarkMode ? 'border-brand-red/5' : 'border-brand-red/10'}`} />
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="rel-sidebar-cards"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full overflow-y-auto custom-scrollbar px-3 py-4 grid grid-cols-2 gap-x-3 gap-y-5 auto-rows-max"
                          >
                            {characterData
                              .slice()
                              .sort((a, b) => {
                                const aRelated = activeChapter?.relatedCharacters?.includes(a.id) ? 1 : 0;
                                const bRelated = activeChapter?.relatedCharacters?.includes(b.id) ? 1 : 0;
                                return bRelated - aRelated; 
                              })
                              .map((char, i) => {
                                const isRelated = activeChapter?.relatedCharacters?.includes(char.id);
                                const hasContext = !!activeChapter?.relatedCharacters?.length;

                                return (
                                  <div key={`sidebar-char-${char.id}-${i}`} className={cn(
                                    "group/card relative transition-all duration-500",
                                    hasContext && !isRelated && "opacity-40 scale-95 origin-center grayscale brightness-75"
                                  )}>
                                    <div className={cn(
                                      "relative aspect-[16/9] rounded-xl border overflow-hidden flex transition-all duration-500",
                                      isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-hud-border shadow-sm",
                                      hasContext && isRelated && "hud-card-glow"
                                    )}>
                                      {/* Left: Portrait */}
                                      <div className={cn(
                                        "w-2/5 relative h-full shrink-0 overflow-hidden border-r",
                                        isDarkMode ? "border-white/10" : "border-black/5"
                                      )}>
                                        <img 
                                          src={char.img} 
                                          alt={char.name}
                                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                                        {isRelated && (
                                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-brand-red border border-white/20 backdrop-blur-md z-10 shadow-lg scale-[0.8] origin-top-left">
                                            <div className="w-1 h-1 rounded-full bg-white" />
                                            <span className="text-[7px] text-white font-display uppercase tracking-[0.1em] font-bold">关联</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Right: Info */}
                                      <div className="flex-1 p-2 flex flex-col justify-center min-w-0 relative">
                                        <div className="flex flex-col gap-0.5 mb-1.5">
                                           <div className="flex items-center gap-1.5">
                                             <div className={cn("w-1.5 h-1.5 rounded-full", char.color)} />
                                             <span className={cn(
                                               "text-[10px] font-sans font-extrabold truncate",
                                               isDarkMode ? "text-white" : "text-black"
                                             )}>{char.name}</span>
                                           </div>
                                           <div className="flex items-center">
                                             <span className={cn(
                                               "shrink-0 text-[6px] font-display uppercase tracking-widest px-1 border rounded-[2px]",
                                               isDarkMode ? "border-white/20 text-white/50 bg-white/5" : "border-black/10 text-black/40 bg-black/5"
                                             )}>{char.role}</span>
                                           </div>
                                        </div>
                                        <p className={cn(
                                          "text-[7px] line-clamp-2 leading-relaxed italic",
                                          isDarkMode ? "text-white/50" : "text-black/50"
                                        )}>"{char.description}"</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            <div className="col-span-2 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
            {/* Real-time Logs */}
            <div className={`border-b border-hud-border ${isDarkMode ? 'bg-panel-bg/30' : 'bg-app-bg/30'}`}>
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-white/40'}`}>
                <div className="flex items-center gap-2 text-brand-red">
                  <Radio className="w-4 h-4" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest">实时日志</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-muted-text uppercase">自动驾驶已停止</span>
                  <span className={`px-1.5 py-0.5 text-[9px] text-muted-text border border-hud-border rounded ${isDarkMode ? 'bg-white/5' : 'bg-white/60 shadow-sm'}`}>2 条</span>
                  <button className="text-[9px] text-muted-text hover:text-text-main uppercase font-bold tracking-tighter rounded px-1 hover:bg-black/5 transition-colors">折叠日志</button>
                </div>
              </div>
              <div className="p-3">
                <div className={cn(
                  "h-32 border border-hud-border p-2 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-2",
                  isDarkMode ? "bg-black/40" : "bg-white/60 shadow-inner"
                )}>
                  <div className={cn("flex gap-2", isDarkMode ? 'text-blue-400/80' : 'text-blue-600/80')}>
                    <span className="opacity-50">21:47:09</span>
                    <span className="flex-1">🔌 日志流已连接 (阶段变更需连续约 4 秒一致才推送，避免界面抖动)</span>
                  </div>
                  <div className={cn("flex gap-2", isDarkMode ? 'text-blue-400' : 'text-blue-600')}>
                    <span className="opacity-50">21:47:09</span>
                    <span className="flex-1">🟦 自动驾驶已停止</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Circuit Breaker */}
            <div className={`border-b border-hud-border ${isDarkMode ? 'bg-panel-bg/20' : 'bg-app-bg/20'}`}>
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-white/40'}`}>
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
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-white/40'}`}>
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
              <div className={`p-3 border-b border-hud-border flex items-center justify-between ${isDarkMode ? 'bg-black/10' : 'bg-white/40'}`}>
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
          <div className={cn(
            "h-full flex flex-col items-center justify-center p-8 text-center",
            isDarkMode ? "bg-black/20" : "bg-black/5"
          )}>
            <div className={cn(
              "w-16 h-16 border flex items-center justify-center mb-6 relative overflow-hidden group rounded-xl",
              isDarkMode ? "bg-white/5 border-hud-border" : "bg-white border-hud-border shadow-sm"
            )}>
              <div className="absolute inset-0 bg-brand-red/10 animate-pulse" />
              <Wrench className="w-6 h-6 text-brand-red" />
            </div>
            <h3 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-text-main mb-2">
              辅助工具中心
            </h3>
            <p className="text-xs text-muted-text font-mono uppercase tracking-widest opacity-50">
              {isMockLoadingEnabled ? '模块初始化中...' : '模块就绪'}
            </p>
            {isMockLoadingEnabled ? (
              <div className="mt-8 w-48 h-1 bg-hud-border overflow-hidden">
                <div className="h-full bg-brand-red animate-[loading_2s_infinite]" style={{ width: '40%' }} />
              </div>
            ) : (
              <div className="mt-8 flex items-center gap-2 text-emerald-500">
                <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">活跃</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
