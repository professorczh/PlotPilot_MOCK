import { motion, AnimatePresence } from 'framer-motion';
import { X, Map as MapIcon, Users, History, Compass, Search, Filter, Layers, Box, Network, ChevronRight, Database } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { characterData, geographyData } from '../constants/storyData';
import RelationshipGraph from './RelationshipGraph';
import RelationshipGraph3D from './RelationshipGraph3D';
import WorldMapGraph from './WorldMapGraph';
import WorldMapGraph3D from './WorldMapGraph3D';

interface WorldExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'ink' | 'paper' | 'classic';
}

type ExplorerTab = 'geography' | 'characters' | 'history';
type ViewMode = '2D' | '3D' | 'topology';
type ContentMode = 'canvas' | 'cards';

export default function WorldExplorer({ isOpen, onClose, theme = 'ink' }: WorldExplorerProps) {
  const [activeTab, setActiveTab] = useState<ExplorerTab>('geography');
  const [viewMode, setViewMode] = useState<ViewMode>('topology');
  const [contentMode, setContentMode] = useState<ContentMode>('canvas');
  const isDarkMode = theme === 'ink';

  const tabs = [
    { id: 'geography', label: '地理疆域', icon: MapIcon },
    { id: 'characters', label: '人物关系', icon: Users },
    { id: 'history', label: '历史长河', icon: History },
  ];

  const modes = [
    { id: '2D', label: '2D', icon: Layers },
    { id: '3D', label: '3D', icon: Box },
    { id: 'topology', label: '拓扑', icon: Network },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Main Panel */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-full h-full max-w-7xl hud-panel !bg-panel-bg/95 !rounded-3xl overflow-hidden flex flex-col",
              isDarkMode ? "shadow-[0_0_80px_rgba(0,0,0,0.8)]" : "shadow-2xl shadow-black/10 border-hud-border/10"
            )}
          >
            {/* Ink Decoration (Top Right Overlay) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 blur-[150px] pointer-events-none" />
            
            {/* Header */}
            <header className="px-10 py-5 flex items-center justify-between border-b border-hud-border z-10">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <h2 className="flex items-center gap-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-brand-red font-brush text-4xl select-none drop-shadow-lg">剧本</span>
                      <span className="text-xl font-display font-medium tracking-[0.2em] text-text-main uppercase">浏览器</span>
                    </div>
                    <div className="w-px h-6 bg-hud-border rotate-12 mx-2" />
                    <span className="text-[10px] font-display uppercase tracking-[0.4em] text-brand-red/70 bg-brand-red/5 px-3 py-1 rounded-full border border-brand-red/20">
                      世界架构器
                    </span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className={cn(
                  "hidden md:flex items-center rounded-full px-5 py-2 border border-hud-border focus-within:hud-border-red focus-within:ring-1 focus-within:ring-brand-red/20 transition-all group/search",
                  isDarkMode ? "bg-black/40" : "bg-white/60 shadow-sm"
                )}>
                  <Search className="w-3.5 h-3.5 text-muted-text mr-3 group-focus-within/search:text-brand-red transition-colors" />
                  <input 
                    type="text" 
                    placeholder="搜索地点、人物或事件..." 
                    className="bg-transparent border-none text-[13px] outline-none text-text-main w-56 placeholder:text-muted-text/30 font-sans tracking-wide"
                  />
                  <div className="flex items-center gap-1 ml-3 opacity-30 group-focus-within/search:opacity-60 transition-opacity">
                    <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded border", isDarkMode ? "bg-white/10 text-white border-white/10" : "bg-black/5 text-black/60 border-black/10")}>⌘</span>
                    <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded border", isDarkMode ? "bg-white/10 text-white border-white/10" : "bg-black/5 text-black/60 border-black/10")}>K</span>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-brand-red/10 text-muted-text hover:text-brand-red transition-all border border-hud-border group shadow-lg"
                >
                  <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                </button>
              </div>
            </header>

            {/* Sidebar & Content Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Internal Sidebar */}
              <aside className={cn(
                "w-20 md:w-64 border-r border-hud-border flex flex-col py-8",
                isDarkMode ? "bg-black/10" : "bg-black/[0.02]"
              )}>
                <nav className="flex-1 space-y-3 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={`explorer-tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id as ExplorerTab)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-500 overflow-hidden relative group",
                        activeTab === tab.id 
                          ? "text-brand-red" 
                          : "text-muted-text hover:text-text-main"
                      )}
                    >
                      {activeTab === tab.id && (
                        <motion.div 
                          layoutId="explorer-tab-bg"
                          className="absolute inset-0 bg-brand-red/5 border border-brand-red/20 rounded-xl"
                        />
                      )}
                      <tab.icon className={cn("w-4 h-4 z-10", activeTab === tab.id ? "text-brand-red" : "opacity-50")} />
                      <span className="hidden md:block font-display text-xs tracking-[0.2em] uppercase z-10">{tab.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-auto px-6 pt-6 border-t border-hud-border">
                  <div className={cn(
                    "p-5 rounded-2xl border",
                    isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white/40 border-hud-border shadow-sm"
                  )}>
                    <div className="flex items-center justify-between mb-2.5">
                       <span className="text-[9px] font-display text-muted-text uppercase tracking-[0.2em]">探险完成度</span>
                       <span className="text-[10px] font-mono text-brand-red font-bold">42%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "42%" }}
                        className="h-full bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                      />
                    </div>
                  </div>
                </div>
              </aside>

              {/* Viewport */}
              <main className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-app-bg opacity-40 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                
                {/* Float Content Mode Toggle */}
                {activeTab !== 'history' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex bg-panel-bg/60 backdrop-blur-md border border-hud-border/20 rounded-full p-1 shadow-2xl select-none"
                  >
                    <button 
                      onClick={() => setContentMode('canvas')}
                      className={cn(
                        "px-5 py-1.5 flex items-center gap-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all duration-300",
                        contentMode === 'canvas' ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" : "text-muted-text hover:text-text-main"
                      )}
                    >
                      <Network className="w-3 h-3" />
                      画布模式
                    </button>
                    <button 
                      onClick={() => setContentMode('cards')}
                      className={cn(
                        "px-5 py-1.5 flex items-center gap-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all duration-300",
                        contentMode === 'cards' ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" : "text-muted-text hover:text-text-main"
                      )}
                    >
                      <Box className="w-3 h-3" />
                      卡片模式
                    </button>
                  </motion.div>
                )}
                
                {activeTab === 'geography' && (
                  <div className="absolute inset-0 p-10">
                    <AnimatePresence mode="wait">
                      {contentMode === 'canvas' ? (
                        <motion.div 
                          key="geo-canvas"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full"
                        >
                          {/* Map Area */}
                          <div className={cn(
                            "w-full h-full relative border border-hud-border rounded-3xl overflow-hidden group shadow-inner",
                            isDarkMode ? "bg-black/40" : "bg-black/[0.04]"
                          )}>
                            {/* Dynamic SVG Map Graph */}
                            <div className="absolute inset-0 z-0">
                              {viewMode === '3D' ? <WorldMapGraph3D /> : <WorldMapGraph />}
                            </div>

                            {/* Mock Map Background Overlay */}
                            <div className="absolute inset-0 opacity-[0.08] bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2000')] bg-cover bg-center grayscale contrast-150 mix-blend-overlay pointer-events-none" />
                            
                            {/* Coordinate Lines */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
                            </div>

                            <div className="z-10 text-left space-y-3 pointer-events-none absolute top-10 left-10">
                               <div className="flex flex-col gap-2">
                                 <h3 className={cn(
                                   "text-3xl font-display font-black tracking-[0.4em] uppercase opacity-80 drop-shadow-2xl",
                                   isDarkMode ? "text-white" : "text-black/80"
                                 )}>山海舆图</h3>
                                 <div className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse" />
                                   <span className="text-[10px] font-mono text-muted-text uppercase tracking-[0.5em] font-medium">
                                     {viewMode === '2D' ? '制图投影' : viewMode === '3D' ? '空间神经映射' : '拓扑关系网'}
                                   </span>
                                 </div>
                               </div>
                            </div>

                            <div className={cn(
                              "absolute bottom-8 left-8 flex items-center p-1.5 backdrop-blur-xl rounded-full border z-20 shadow-2xl",
                              isDarkMode ? "bg-[#171717]/80 border-white/5" : "bg-white/80 border-hud-border"
                            )}>
                               {modes.map(mode => (
                                 <button 
                                  key={`map-mode-${mode.id}`} 
                                  onClick={() => setViewMode(mode.id as ViewMode)}
                                  className={cn(
                                    "p-2.5 rounded-full transition-all duration-500 relative overflow-hidden group",
                                    viewMode === mode.id 
                                      ? "text-white" 
                                      : "text-muted-text hover:text-white"
                                  )}
                                  title={mode.label}
                                 >
                                   {viewMode === mode.id && (
                                     <motion.div 
                                       layoutId="map-mode-indicator"
                                       className="absolute inset-0 bg-brand-red rounded-full"
                                     />
                                   )}
                                   <mode.icon className="w-4 h-4 relative z-10" />
                                 </button>
                               ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="geo-cards"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          className="h-full overflow-y-auto custom-scrollbar pr-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                            {geographyData.map((loc, idx) => (
                              <motion.div
                                key={`geo-grid-card-${loc.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={cn(
                                  "group relative aspect-[4/5] rounded-[2rem] overflow-hidden border transition-all duration-500 shadow-xl",
                                  isDarkMode ? "bg-white/[0.03] border-white/10 hover:border-brand-red/50" : "bg-white border-hud-border hover:border-brand-red/40"
                                )}
                              >
                                <img 
                                  src={loc.img} 
                                  alt={loc.name}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.4] group-hover:grayscale-0"
                                  onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${loc.id}/800/1200`)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                  <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] text-white uppercase shadow-lg bg-brand-red/80 backdrop-blur-md self-start">
                                    {loc.type}
                                  </span>
                                </div>

                                <div className="absolute bottom-8 left-8 right-8">
                                  <h4 className="text-3xl font-display font-bold text-white mb-2 tracking-widest group-hover:text-brand-red transition-colors uppercase">
                                    {loc.name}
                                  </h4>
                                  <p className="text-white/60 text-xs leading-relaxed font-sans line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {loc.description}
                                  </p>
                                  <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{loc.status}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                      <ChevronRight className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {activeTab === 'characters' && (
                  <div className="absolute inset-0 p-10">
                    <AnimatePresence mode="wait">
                      {contentMode === 'canvas' ? (
                        <motion.div 
                          key="char-canvas"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full"
                        >
                          {/* Graph Area */}
                          <div className={cn(
                            "w-full h-full relative border border-hud-border rounded-3xl overflow-hidden group shadow-inner",
                            isDarkMode ? "bg-black/40" : "bg-black/[0.04]"
                          )}>
                             {/* Background Graph */}
                             <div className="absolute inset-0 z-0">
                               {viewMode === '3D' ? <RelationshipGraph3D /> : <RelationshipGraph />}
                             </div>
                             
                             {/* Overlay Information */}
                             <div className="z-10 text-left space-y-3 pointer-events-none absolute top-10 left-10">
                               <div className="flex flex-col gap-2">
                                 <h3 className={cn(
                                   "text-3xl font-display font-black tracking-[0.4em] uppercase opacity-80 drop-shadow-2xl",
                                   isDarkMode ? "text-white" : "text-black/80"
                                 )}>羁绊因果图</h3>
                                 <div className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse" />
                                   <span className="text-[10px] font-mono text-muted-text uppercase tracking-[0.5em] font-medium">
                                     同步映射: {viewMode === '3D' ? '深度建模' : '2D 投影'}
                                   </span>
                                 </div>
                               </div>
                             </div>
                             
                             {/* Legend */}
                             <div className={cn(
                               "absolute bottom-8 right-8 flex flex-col gap-3 p-4 backdrop-blur-xl rounded-2xl border z-20 shadow-2xl invisible md:flex",
                               isDarkMode ? "bg-[#171717]/80 border-white/5" : "bg-white/80 border-hud-border"
                             )}>
                                <span className={cn(
                                  "text-[9px] font-display uppercase tracking-widest mb-1 border-b pb-2",
                                  isDarkMode ? "text-muted-text border-white/5" : "text-muted-text border-hud-border"
                                )}>拓扑图例</span>
                                {[
                                  { label: '核心/正面', color: 'bg-emerald-400' },
                                  { label: '中立/多面', color: 'bg-blue-400' },
                                  { label: '反派/暗面', color: 'bg-purple-400' },
                                ].map((item, idx) => (
                                  <div key={`legend-item-${item.label}-${idx}`} className="flex items-center gap-3">
                                    <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]", item.color)} />
                                    <span className="text-[10px] font-sans text-muted-text font-medium">{item.label}</span>
                                  </div>
                                ))}
                             </div>
       
                              <div className={cn(
                                "absolute bottom-8 left-8 flex items-center p-1.5 backdrop-blur-xl rounded-full border z-20 shadow-2xl",
                                isDarkMode ? "bg-[#171717]/80 border-white/5" : "bg-white/80 border-hud-border"
                              )}>
                                {modes.map(mode => (
                                  <button 
                                    key={`relation-mode-${mode.id}`} 
                                    onClick={() => setViewMode(mode.id as ViewMode)}
                                    className={cn(
                                      "p-2.5 rounded-full transition-all duration-500 relative overflow-hidden group",
                                      viewMode === mode.id 
                                        ? "text-white" 
                                        : "text-muted-text hover:text-white"
                                    )}
                                    title={mode.label}
                                  >
                                    {viewMode === mode.id && (
                                      <motion.div 
                                        layoutId="relation-mode-indicator"
                                        className="absolute inset-0 bg-brand-red rounded-full shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                      />
                                    )}
                                    <mode.icon className="w-4 h-4 relative z-10" />
                                  </button>
                                ))}
                              </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="char-cards"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          className="h-full overflow-y-auto custom-scrollbar pr-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                              {characterData.map((c, idx) => {
                                 // Define role-based colors
                                 const getRoleStyle = (role: string) => {
                                   if (role.includes('主角')) return { bg: 'bg-brand-red', text: 'text-brand-red', border: 'border-brand-red/30', lightBg: 'bg-brand-red/10' };
                                   if (role.includes('反派') || role.includes('对手')) return { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500/30', lightBg: 'bg-purple-500/10' };
                                   if (role.includes('配角') || role.includes('中立')) return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30', lightBg: 'bg-emerald-500/10' };
                                   return { bg: 'bg-slate-600', text: 'text-slate-400', border: 'border-slate-500/30', lightBg: 'bg-slate-500/10' };
                                 };
                                 
                                 const roleStyle = getRoleStyle(c.role);

                                 return (
                                   <motion.div 
                                     key={`char-grid-card-${c.id}`}
                                     initial={{ opacity: 0, y: 20 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     transition={{ delay: idx * 0.05 }}
                                     className={cn(
                                       "w-full min-h-[300px] rounded-[2.5rem] overflow-hidden border transition-all duration-700 shadow-xl flex flex-col md:flex-row group",
                                       isDarkMode 
                                         ? "bg-white/[0.03] border-white/10 hover:border-brand-red/40 hover:bg-white/[0.05]" 
                                         : "bg-white border-hud-border hover:border-brand-red/30 hover:shadow-2xl"
                                     )}
                                   >
                                     <div className="md:w-[32%] w-full h-48 md:h-auto relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-hud-border/10">
                                       <img 
                                         src={c.img} 
                                         alt={c.name} 
                                         className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[0.6] group-hover:grayscale-0"
                                         onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${c.id}/600/800`)}
                                       />
                                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                       
                                       <div className="absolute top-6 left-6">
                                          <span className={cn(
                                            "inline-flex px-4 py-1.5 rounded-full text-[10px] font-display font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md shadow-lg transition-colors",
                                            roleStyle.bg
                                          )}>
                                            {c.role}
                                          </span>
                                       </div>
                                     </div>
    
                                     <div className="flex-1 p-8 md:p-10 flex flex-col">
                                       <div className="mb-6">
                                          <div className="flex items-center justify-between gap-4 mb-4">
                                            <h4 className="text-4xl font-brush text-text-main tracking-widest leading-none drop-shadow-sm group-hover:text-brand-red transition-colors">
                                              {c.name}
                                            </h4>
                                            <div className="flex flex-col items-end">
                                              <span className="text-[9px] font-mono text-muted-text/30 uppercase tracking-[0.3em] mb-1">Status</span>
                                              <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-display font-bold text-emerald-500 uppercase tracking-widest">活跃中</span>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-6">
                                             <div className="flex flex-col gap-1.5">
                                                <span className="text-[9px] font-display font-bold text-muted-text/40 uppercase tracking-[0.2em]">位阶序列</span>
                                                <div className={cn("px-3 py-1 rounded-lg border text-[11px] font-display font-bold tracking-[0.1em]", roleStyle.lightBg, roleStyle.border, roleStyle.text)}>
                                                  {c.weight}
                                                </div>
                                             </div>
                                             <div className="w-px h-8 bg-hud-border/10" />
                                             <div className="flex flex-col gap-1.5">
                                                <span className="text-[9px] font-display font-bold text-muted-text/40 uppercase tracking-[0.2em]">威胁等级</span>
                                                <div className="px-3 py-1 rounded-lg bg-orange-500/5 border border-orange-500/20 text-orange-500 text-[11px] font-display font-bold tracking-[0.1em]">
                                                  {c.threat}
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                       
                                       <div className="relative mb-8">
                                         <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand-red/20 rounded-full" />
                                         <p className="text-muted-text/70 text-[13px] leading-relaxed font-serif italic line-clamp-3">
                                           "{c.description}"
                                         </p>
                                       </div>
    
                                       <div className="mt-auto flex items-center justify-between pt-8 border-t border-hud-border/10">
                                         <div className="flex-1 max-w-[70%]">
                                           <div className="flex items-center justify-between mb-3 px-1">
                                             <span className="text-[10px] font-display font-bold text-muted-text/50 uppercase tracking-[0.2em]">神经共鸣度 Resonance</span>
                                             <span className="text-xs font-mono font-bold text-brand-red">{c.resonance}</span>
                                           </div>
                                           <div className="h-1.5 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                                             <motion.div 
                                               initial={{ width: 0 }}
                                               animate={{ width: "85%" }}
                                               transition={{ duration: 1.5, ease: "circOut" }}
                                               className="h-full bg-gradient-to-r from-brand-red/40 to-brand-red shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                                             />
                                           </div>
                                         </div>
                                         <button className="w-12 h-12 rounded-2xl border border-hud-border/30 flex items-center justify-center hover:border-brand-red/50 hover:bg-brand-red/5 transition-all text-muted-text hover:text-brand-red group/data active:scale-95 ml-6">
                                           <Database className="w-5 h-5 transition-transform group-hover/data:scale-110" />
                                         </button>
                                       </div>
                                     </div>
                                   </motion.div>
                                 );
                               })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
 
                {activeTab === 'history' && (
                  <div className="absolute inset-0 p-10 flex gap-8">
                    {/* Timeline Sidebar */}
                    <div className="w-80 flex flex-col gap-6 z-20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-display font-bold tracking-[0.3em] text-text-main uppercase">纪元编年</h3>
                        <span className="text-[10px] font-mono text-brand-red/60 bg-brand-red/5 px-2.5 py-1 rounded border border-brand-red/10">关键节点: 4</span>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto space-y-8 pr-3 custom-scrollbar relative pl-4">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-hud-border ml-2 opacity-50" />
                        
                        {[
                          { era: '上古纪元', date: '公元前 3000', title: '神兽陨落', desc: '灵气首次枯竭，四大神兽化为山川，世界进入末法时代。' },
                          { era: '拓荒纪元', date: '公元 120', title: '黑盘之城', desc: '探险者在巨大的黑色岩盘上建立了贸易枢纽，即墨水城的前身。' },
                          { era: '暗影纪元', date: '公元 450', title: '阁楼阴影', desc: '神秘组织暗影阁在深潜中被发现，其背后的力量影响着整片大陆。' },
                          { era: '当今', date: '现在', title: '李寒秋复仇', desc: '命运的齿轮再次转动，剑修李寒秋踏上了他的征途。' },
                        ].map((item, idx) => (
                          <motion.div 
                            key={`history-item-${idx}`}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative"
                          >
                            <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-brand-red border-4 border-app-bg z-10 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-brand-red bg-brand-red/5 px-2 py-0.5 rounded border border-brand-red/10">{item.date}</span>
                                <span className="text-[10px] font-display text-muted-text uppercase tracking-widest">{item.era}</span>
                              </div>
                              <div className={cn(
                                "border rounded-2xl p-4 transition-all cursor-pointer group",
                                isDarkMode ? "bg-white/[0.03] border-white/5 hover:border-brand-red/30" : "bg-white/60 border-hud-border hover:bg-white hover:border-brand-red/40 hover:shadow-md"
                              )}>
                                <h4 className="text-text-main font-brush text-xl mb-1 group-hover:text-brand-red transition-colors">{item.title}</h4>
                                <p className="text-[11px] text-muted-text font-sans leading-relaxed opacity-70">{item.desc}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
 
                      <button className={cn(
                        "w-full py-4 border border-dashed rounded-2xl text-[10px] font-display tracking-[0.3em] uppercase text-muted-text transition-all",
                        isDarkMode 
                          ? "bg-white/5 border-white/10 hover:text-text-main hover:border-white/20 hover:bg-white/[0.08]" 
                          : "bg-black/[0.03] border-hud-border/60 hover:text-brand-red hover:border-brand-red/40 hover:bg-white shadow-sm"
                      )}>
                        + 记录新的纪元
                      </button>
                    </div>
 
                    {/* Timeline Canvas View */}
                    <div className={cn(
                      "flex-1 relative border border-hud-border rounded-3xl overflow-hidden shadow-inner flex flex-col",
                      isDarkMode ? "bg-black/40" : "bg-black/[0.03]"
                    )}>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')] opacity-[0.03] pointer-events-none" />
                      
                      <div className="flex-1 flex flex-col items-center justify-center relative p-12 overflow-hidden">
                        {/* Artistic Ink Splashes as Background */}
                        <div className="absolute top-1/4 -left-10 w-96 h-96 bg-brand-red/5 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-brand-red/5 blur-[100px] rounded-full mix-blend-screen" />
 
                        <div className="relative z-10 text-center max-w-2xl px-8 flex flex-col items-center">
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 rounded-full border border-brand-red/30 flex items-center justify-center mb-8 bg-brand-red/5 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                          >
                            <History className="w-8 h-8 text-brand-red" />
                          </motion.div>
                          
                          <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-brush text-text-main mb-6 drop-shadow-2xl tracking-widest"
                          >
                            历史长河
                          </motion.h2>
                          
                          <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-muted-text font-serif text-lg leading-relaxed mb-10 opacity-80"
                          >
                            在这个板块中，您可以推演整个世界的宏大历史进程。每一笔勾勒皆为因果，每一段记载皆为命运。
                          </motion.p>
                          
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-6"
                          >
                            <button className="px-8 py-3 bg-brand-red text-white font-display uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all">
                              开始编年推演
                            </button>
                            <button className={cn(
                              "px-8 py-3 border font-display uppercase tracking-widest text-xs rounded-full transition-all",
                              isDarkMode ? "bg-white/5 border-white/10 text-text-main hover:bg-white/10" : "bg-white border-hud-border text-black hover:bg-black/5 shadow-sm"
                            )}>
                              查询古籍存证
                            </button>
                          </motion.div>
                        </div>
 
                        {/* Interactive Timeline Bar */}
                        <div className="absolute bottom-12 left-10 right-10 flex flex-col gap-4">
                           <div className="flex items-center justify-between mb-2">
                             <div className="flex flex-col">
                               <span className="text-[10px] font-display text-muted-text uppercase tracking-[0.4em] opacity-60">时间刻度轴</span>
                               <span className="text-xs font-mono text-brand-red font-bold">当前纪元: 3.2.14</span>
                             </div>
                             <div className="flex items-center gap-3">
                               <button className={cn(
                                 "p-2 rounded-md transition-all border",
                                 isDarkMode ? "bg-white/5 border-white/5 hover:text-brand-red" : "bg-white border-hud-border shadow-sm hover:text-brand-red"
                               )}>
                                 <Filter className="w-3.5 h-3.5" />
                               </button>
                               <button className={cn(
                                 "p-2 rounded-md transition-all border",
                                 isDarkMode ? "bg-white/5 border-white/5 hover:text-brand-red" : "bg-white border-hud-border shadow-sm hover:text-brand-red"
                               )}>
                                 <Layers className="w-3.5 h-3.5" />
                               </button>
                             </div>
                           </div>
                           <div className={cn(
                             "h-2 w-full rounded-full relative border p-px",
                             isDarkMode ? "bg-white/5 border-white/5" : "bg-black/[0.05] border-hud-border"
                           )}>
                             <div className="absolute left-1/4 top-0 bottom-0 w-px bg-brand-red/30 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-red/30" />
                             <div className="absolute left-3/4 top-0 bottom-0 w-px bg-brand-red/30" />
                             <motion.div 
                               className="absolute left-0 top-0 bottom-0 bg-brand-red rounded-full"
                               initial={{ width: 0 }}
                               animate={{ width: "65%" }}
                               transition={{ duration: 1, ease: "easeOut" }}
                             >
                               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-[3px] border-brand-red shadow-[0_0_15px_rgba(220,38,38,0.8)] cursor-pointer" />
                             </motion.div>
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-[9px] font-mono text-muted-text opacity-40">公元前 3000</span>
                             <span className="text-[9px] font-mono text-muted-text opacity-40">公元 2400</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
