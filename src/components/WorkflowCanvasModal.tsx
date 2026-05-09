import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Play, Save, Share2, Plus, 
  Settings, Database, Zap, MessageSquare, 
  ChevronRight, Brain, Filter, MousePointer2,
  GitBranch, Terminal, Layers, Flag, Bot,
  ListTodo, CircleUser, Repeat, MapPin, Network,
  Box
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeMode } from '../types';

interface WorkflowCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeMode;
}

const INITIAL_NODES = [
  { id: 'start', type: 'start', label: '阶段1：开始', status: 'completed', x: 50, y: 180, tags: ['入口', '初始化'], prompt: '工作流起点：初始化大秦小说生成的时空锚点。' },
  { id: 'bible', type: 'agent', label: 'Bible 生成', status: 'completed', x: 200, y: 180, tags: ['世界观', '设定集'], prompt: '生成世界观 Bible：包含秦朝法律、社会等级、地理版图等核心底座。' },
  { id: 'persona', type: 'agent', label: '人设生成', status: 'processing', x: 380, y: 100, tags: ['林墨', '扶苏', '赵高'], prompt: '基于林墨 PR 背景，重构赢扶苏的性格引擎，计算其对“沙丘遗诏”的心理抗性。' },
  { id: 'relations', type: 'agent', label: '地图关系生成', status: 'idle', x: 380, y: 260, tags: ['咸阳', '长城', '势力分布'], prompt: '构建大秦关键地理节点的关系网，标记蒙恬军团与胡亥势力的地理博弈点。' },
  { id: 'merge', type: 'logic', label: '地基整合', status: 'idle', x: 580, y: 180, tags: ['冲突对齐', '逻辑校验'], prompt: '整合 Bible、人设与地图数据，检测长城防线与咸阳政变之间的因果逻辑冲突。' },
  { id: 'macro', type: 'agent', label: '宏观规划', status: 'idle', x: 780, y: 180, tags: ['主线设计', '节奏控制'], prompt: '规划大秦全篇“灵魂穿越”系列主线，设定林墨逆天改命的关键节拍点。' },
  { id: 'outline', type: 'agent', label: '固化大纲', status: 'idle', x: 980, y: 180, tags: ['终案', '章节列表'], prompt: '最终生成固化大纲：锁定前三十章核心冲突及高潮爆发点。' },
  { id: 'end', type: 'end', label: '阶段1结束', status: 'idle', x: 1150, y: 180, tags: ['存档', '待批复'], prompt: '第一阶段工作流执行完毕，等待人类进行“灵感批改”。' },
];

const CONNECTIONS = [
  { from: 'start', to: 'bible' },
  { from: 'bible', to: 'persona' },
  { from: 'bible', to: 'relations' },
  { from: 'persona', to: 'merge' },
  { from: 'relations', to: 'merge' },
  { from: 'merge', to: 'macro' },
  { from: 'macro', to: 'outline' },
  { from: 'outline', to: 'end' },
];

export default function WorkflowCanvasModal({ isOpen, onClose, theme = 'ink' }: WorkflowCanvasModalProps) {
  const isDarkMode = theme === 'ink';
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('2');

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleDrag = (id: string, info: any) => {
    setNodes(prev => prev.map(node => 
      node.id === id 
        ? { ...node, x: node.x + info.delta.x, y: node.y + info.delta.y }
        : node
    ));
  };

  // Avoid SSR issues
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              "w-full h-full rounded-2xl border flex overflow-hidden shadow-2xl relative",
              isDarkMode ? "bg-[#0F0F0F] border-white/10" : "bg-[#f4f1ea] border-black/10 text-text-main"
            )}
          >
            <div className={cn(
              "absolute top-0 left-0 right-0 h-14 border-b flex items-center justify-between px-6 z-10 backdrop-blur-md",
              isDarkMode ? "bg-black/20 border-white/5" : "bg-white/40 border-black/5"
            )}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={cn(
                    "text-sm font-sans font-bold uppercase tracking-widest",
                    isDarkMode ? "text-white" : "text-text-main"
                  )}>大秦剧情工作流控制台</h2>
                </div>
                <div className={cn("h-4 w-px", isDarkMode ? "bg-white/10" : "bg-black/10")} />
                <span className="text-xs text-muted-text font-mono">v2.4.0 Engine Active</span>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold transition-all hover:bg-emerald-500/20">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>执行推演</span>
                </button>
                <button className={cn(
                  "p-2 rounded-lg text-muted-text transition-colors",
                  isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"
                )}>
                  <Save className="w-4 h-4" />
                </button>
                <button className={cn(
                  "p-2 rounded-lg text-muted-text transition-colors",
                  isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"
                )}>
                  <Share2 className="w-4 h-4" />
                </button>
                <div className={cn("h-4 w-px", isDarkMode ? "bg-white/10" : "bg-black/10")} />
                <button 
                  onClick={onClose}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isDarkMode ? "text-white hover:bg-red-500" : "text-text-main hover:bg-red-500 hover:text-white"
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Left Sidebar: Node Library */}
            <div className={cn(
              "w-64 border-r pt-14 flex flex-col",
              isDarkMode ? "border-white/5 bg-black/40" : "border-black/5 bg-black/2"
            )}>
              <div className={cn(
                "p-4 border-b",
                isDarkMode ? "border-white/5" : "border-black/5"
              )}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-sans font-bold text-muted-text uppercase tracking-widest">节点组件库</span>
                  <Filter className="w-3.5 h-3.5 text-muted-text" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Plus className="w-3 h-3 text-muted-text" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="搜索组件..." 
                    className={cn(
                      "w-full border rounded-lg py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-brand-red/50 transition-colors",
                      isDarkMode ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-text-main"
                    )}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
                <div className="space-y-1">
                  <span className="px-2 text-[9px] font-display text-muted-text uppercase tracking-widest">核心工作流驱动</span>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all bg-brand-red/10 border border-brand-red/20 text-brand-red"
                  )}>
                    <Network className="w-4 h-4" />
                    <span className="text-[13px] truncate font-sans">工作流控制台</span>
                  </div>
                  
                  {[
                    { icon: Flag, label: '开始', indent: 12 },
                    { icon: Bot, label: 'Bible生成', indent: 12 },
                    { icon: Bot, label: '人设生成', indent: 12 },
                    { icon: Bot, label: '地图关系生成', indent: 12 },
                    { icon: Bot, label: '地基整合', indent: 12 },
                    { icon: ListTodo, label: '阶段1快照保存', indent: 12 },
                    { icon: CircleUser, label: '阶段1人类确认', indent: 12 },
                    { icon: Bot, label: '宏观规划', indent: 12 },
                    { icon: Bot, label: '幕/卷设计', indent: 12 },
                    { icon: Bot, label: '节拍表生成', indent: 12 },
                    { icon: Bot, label: '分支生成', indent: 12 },
                    { icon: Bot, label: '固化大纲', indent: 12, highlight: true },
                    { icon: CircleUser, label: '分支选择判断', indent: 12 },
                    { icon: Repeat, label: '章节内容循环生成', indent: 12 },
                    { icon: Bot, label: '事实提取', indent: 12 },
                    { icon: Bot, label: '人物一致性检查', indent: 12 },
                    { icon: MapPin, label: '结束', indent: 12 },
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      style={{ marginLeft: item.indent }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all group",
                        item.highlight 
                          ? "bg-brand-red/20 text-brand-red" 
                          : "hover:bg-white/5 text-muted-text"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", !item.highlight && "opacity-60")} />
                      <span className="text-[13px] truncate font-sans">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3 text-muted-text hover:text-white transition-colors cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span className="text-xs">全局工作流设置</span>
                </div>
              </div>
            </div>

            {/* Main Canvas Area */}
            <div className={cn(
              "flex-1 relative overflow-hidden pt-14",
              isDarkMode 
                ? "bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px]" 
                : "bg-[radial-gradient(#d1d1c9_1px,transparent_1px)] [background-size:20px_20px]"
            )}>
              <div className="absolute top-4 left-4 flex gap-2">
                <div className={cn(
                  "px-2 py-1 rounded border backdrop-blur-md text-[10px] flex items-center gap-2",
                  isDarkMode ? "bg-black/60 border-white/10 text-white" : "bg-white/60 border-black/10 text-text-main shadow-sm"
                )}>
                  <MousePointer2 className="w-3 h-3 text-muted-text" />
                  <span>坐标同步模式</span>
                </div>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {CONNECTIONS.map((conn, i) => {
                  const from = nodes.find(n => n.id === conn.from)!;
                  const to = nodes.find(n => n.id === conn.to)!;
                  const dx = to.x - from.x;
                  return (
                    <path
                      key={i}
                      d={`M ${from.x + 180} ${from.y + 40} C ${from.x + 180 + dx/2} ${from.y + 40}, ${from.x + 180 + dx/2} ${to.y + 40}, ${to.x} ${to.y + 40}`}
                      fill="none"
                      stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  drag
                  dragMomentum={false}
                  onDrag={(_, info) => handleDrag(node.id, info)}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={cn(
                    "absolute w-44 p-3 rounded-xl border flex flex-col gap-2 transition-shadow cursor-grab active:cursor-grabbing group shadow-lg",
                    selectedNodeId === node.id 
                      ? "bg-brand-red border-brand-red shadow-brand-red/20 z-20" 
                      : "bg-[#171717] border-white/10 hover:border-white/30 z-10"
                  )}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center",
                      selectedNodeId === node.id ? "bg-white/20" : "bg-white/5"
                    )}>
                      {node.type === 'start' ? <Flag className="w-3.5 h-3.5 text-amber-500" /> : 
                       node.type === 'agent' ? <Bot className="w-3.5 h-3.5 text-blue-400" /> :
                       node.type === 'logic' ? <Network className="w-3.5 h-3.5 text-purple-400" /> :
                       node.type === 'end' ? <MapPin className="w-3.5 h-3.5 text-red-500" /> :
                       <CircleUser className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    {node.status === 'processing' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                  <div className={cn(
                    "flex flex-col",
                    selectedNodeId === node.id ? "text-white" : (isDarkMode ? "text-white" : "text-text-main")
                  )}>
                    <span className="text-[11px] font-sans font-bold">
                      {node.label}
                    </span>
                    <span className={cn(
                      "text-[8px] font-display uppercase tracking-widest",
                      selectedNodeId === node.id ? "text-white/60" : "text-muted-text"
                    )}>
                      {node.type} node
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Sidebar: Inspector */}
            <div className={cn(
              "w-80 border-l pt-14 flex flex-col",
              isDarkMode ? "border-white/5 bg-black/40" : "border-black/5 bg-black/2"
            )}>
              <div className={cn(
                "p-4 border-b",
                isDarkMode ? "border-white/5" : "border-black/5"
              )}>
                <span className="text-[10px] font-sans font-bold text-muted-text uppercase tracking-widest">属性检查器</span>
              </div>

              {selectedNode ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl border flex items-center justify-center",
                        isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                      )}>
                        {selectedNode.type === 'start' ? <Flag className="w-6 h-6 text-amber-500" /> : 
                         selectedNode.type === 'agent' ? <Bot className="w-6 h-6 text-blue-400" /> :
                         selectedNode.type === 'logic' ? <Network className="w-6 h-6 text-purple-400" /> :
                         selectedNode.type === 'end' ? <MapPin className="w-6 h-6 text-red-500" /> :
                         <CircleUser className="w-6 h-6 text-emerald-400" />}
                      </div>
                      <div>
                        <h3 className={cn(
                          "text-sm font-bold",
                          isDarkMode ? "text-white" : "text-text-main"
                        )}>{selectedNode.label}</h3>
                        <span className="text-[10px] text-muted-text font-mono">ID: node_gen_{selectedNode.id}x99</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                    <label className="text-[9px] font-display text-muted-text uppercase tracking-[0.2em]">推理深度</label>
                    <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((v) => (
                        <div key={v} className={cn(
                          "h-1 rounded",
                          v <= 3 ? "bg-brand-red" : "bg-white/10"
                        )} />
                      ))}
                    </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-display text-muted-text uppercase tracking-[0.2em]">Prompt 逻辑参数</label>
                      <div className={cn(
                        "border rounded-lg p-3 font-mono text-[11px] leading-relaxed",
                        isDarkMode ? "bg-black/60 border-white/10 text-muted-text" : "bg-black/5 border-black/5 text-text-main/70"
                      )}>
                        {selectedNode.prompt}
                      </div>
                    </div>

                    <div className="space-y-2">
                    <label className="text-[10px] font-display text-muted-text uppercase tracking-[0.2em]">上下文依存 / 标签</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.tags?.map((tag: string) => (
                        <span key={tag} className={cn(
                          "px-2 py-0.5 rounded-full border text-[10px]",
                          isDarkMode ? "bg-white/5 border-white/10 text-white/60" : "bg-black/5 border-black/10 text-text-main/60"
                        )}>{tag}</span>
                      ))}
                    </div>
                    </div>
                  </div>

                  <div className={cn(
                    "pt-4 border-t",
                    isDarkMode ? "border-white/5" : "border-black/5"
                  )}>
                    <label className="text-[9px] font-display text-muted-text uppercase tracking-[0.2em] mb-3 block">输出历史 (Log)</label>
                    <div className="space-y-2">
                       <div className={cn(
                         "p-2 rounded border flex gap-2",
                         isDarkMode ? "bg-emerald-500/5 border-emerald-500/10" : "bg-emerald-500/5 border-emerald-500/20 shadow-sm"
                       )}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className={cn(
                          "text-[9px] font-mono",
                          isDarkMode ? "text-emerald-500/80" : "text-emerald-700"
                        )}>21:47:09 - 逻辑自洽性校验通过 (S级)</span>
                       </div>
                       <div className={cn(
                         "p-2 rounded border flex gap-2",
                         isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                       )}>
                        <Terminal className="w-3 h-3 text-muted-text shrink-0" />
                        <span className={cn(
                          "text-[9px] font-mono",
                          isDarkMode ? "text-muted-text" : "text-text-main/60"
                        )}>21:47:05 - 初始化性格子模块成功</span>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-30">
                  <MousePointer2 className="w-12 h-12 text-muted-text mb-4" />
                  <span className="text-xs text-muted-text font-mono">请在画布上选择节点以查看详情</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
