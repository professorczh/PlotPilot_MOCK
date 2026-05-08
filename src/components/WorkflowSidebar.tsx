import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Maximize2, 
  ChevronDown, 
  ChevronRight, 
  Flag, 
  Bot, 
  ListTodo, 
  UserCircle, 
  Repeat, 
  MapPin,
  CheckCircle2,
  Clock,
  Box,
  X,
  MessageCircle,
  Play,
  Code,
  Minimize2,
  Settings2,
  Variable,
  Share2,
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ThemeMode } from '../types';
import WorkflowCanvasModal from './WorkflowCanvasModal';

interface WorkflowSidebarProps {
  theme?: ThemeMode;
}

interface WorkflowNode {
  id: string;
  title: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  depth: number;
  hasChildren?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  status?: 'completed' | 'loading' | 'pending';
}

interface NodeDetail {
  title: string;
  description: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  input: Record<string, string>;
  output: Record<string, string>;
}

const nodeDetails: Record<string, NodeDetail> = {
  'map': {
    title: '地图关系生成',
    description: '根据人设生成地图关系（极简占位符）',
    model: 'Doubao-Seed-1.8',
    systemPrompt: '你是一个小说地图关系设计专家，负责生成地图关系。',
    userPrompt: '根据以下人设，生成一段模拟的地图关系文本：\n\n人设：{characters}\n\n请输出模拟的地图关系文本。',
    input: { characters: '人设内容字符串' },
    output: { map_relations: '生成的地图关系文本' }
  },
  'bible': {
    title: 'Bible生成',
    description: '生成小说的核心设定集（世界大典/Bible）',
    model: 'Doubao-Seed-1.8',
    systemPrompt: '你是一个小说世界观设定专家，负责生成详尽的设定集。',
    userPrompt: '基于当前创意，完善世界观设定，包括地理、社会、力量体系等。',
    input: { pitch: '核心创意内容' },
    output: { bible_content: '完整的世界观设定文档' }
  },
  'chars': {
    title: '人设生成',
    description: '生成主要角色的人物小传和关系网',
    model: 'Doubao-Seed-1.8',
    systemPrompt: '你是一个专业的人物心理咨询师和剧作家，擅长细腻的人设构建。',
    userPrompt: '为当前故事生成核心角色的人设，包括性格、动机、背景故事。',
    input: { plot_outline: '剧情梗概' },
    output: { characters: '角色列表及详细小传' }
  },
  'outline': {
    title: '固化大纲',
    description: '将创意细节固化为标准的三幕式或分章大纲',
    model: 'Doubao-Seed-1.8',
    systemPrompt: '你是一个严谨的图书编辑和架构师，负责梳理剧情逻辑。',
    userPrompt: '整合当前的所有设定，生成一份逻辑严密的章节大纲。',
    input: { all_settings: '整合后的所有设定' },
    output: { final_outline: '结构化的章节大纲' }
  },
  // Default fallback for others
  'default': {
    title: '工作节点',
    description: '该节点负责工作流中的特定处理逻辑',
    model: 'Doubao-Seed-1.8',
    systemPrompt: '你是一个高效的AI助手。',
    userPrompt: '请执行当前任务。',
    input: { data: '输入数据' },
    output: { result: '处理结果' }
  }
};

export default function WorkflowSidebar({ theme = 'ink' }: WorkflowSidebarProps) {
  const isDarkMode = theme === 'ink';
  const [showModal, setShowModal] = useState(false);
  const [showWorkflowCanvas, setShowWorkflowCanvas] = useState(false);
  const [selectedNodeInModal, setSelectedNodeInModal] = useState<string>('outline');
  
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'root', title: '工作流', icon: Network, iconColor: 'text-amber-500/60', bgColor: isDarkMode ? 'bg-white/10' : 'bg-black/5', depth: 0, hasChildren: true, isExpanded: true },
    { id: 'start', title: '开始', icon: Flag, iconColor: 'text-text-main/40', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'bible', title: 'Bible生成', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'chars', title: '人设生成', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'map', title: '地图关系生成', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'base', title: '地基整合', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'snapshot', title: '阶段1快照保存', icon: ListTodo, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'confirm', title: '阶段1人类确认', icon: UserCircle, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'macro', title: '宏观规划', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'volume', title: '幕/卷设计', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'beats', title: '节拍表生成', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'branch-gen', title: '分支生成', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'outline', title: '固化大纲', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1, isSelected: true },
    { id: 'branch-check', title: '分支选择判断', icon: UserCircle, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'chapters-loop', title: '章节内容循环生成', icon: Repeat, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'fact', title: '事实提取', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'status', title: '状态提取', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'foreshadow', title: '伏笔提取', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'context', title: '更新全局上下文', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'char-check', title: '人物一致性检查', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'timeline-check', title: '时间线逻辑检查', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'plot-check', title: '情节连贯性检查', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'foreshadow-check', title: '伏笔回收检查', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'report', title: '生成校验报告', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
    { id: 'decision', title: '校验结果判断', icon: ListTodo, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1, hasChildren: true, isExpanded: false },
    { id: 'final-confirm', title: '阶段5校验决策', icon: UserCircle, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1, hasChildren: true, isExpanded: true },
    { id: 'end-case', title: 'case___end__', icon: Box, iconColor: 'text-text-main/60', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 2 },
    { id: 'fix-case', title: 'case_node30_generate_fix_proposal', icon: Box, iconColor: 'text-text-main/60', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 2, hasChildren: true, isExpanded: true },
    { id: 'fix-gen', title: '生成修复提案', icon: Bot, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 3 },
    { id: 'end', title: '结束', icon: MapPin, iconColor: 'text-text-main', bgColor: isDarkMode ? 'bg-white/5' : 'bg-black/5', depth: 1 },
  ]);

  const toggleNode = (id: string) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, isExpanded: !node.isExpanded } : node
    ));
  };

  const getActiveDetail = () => {
    return nodeDetails[selectedNodeInModal] || nodeDetails['default'];
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-auto native-scrollbar py-2">
        <div className="space-y-0.5">
          {nodes.map((node, nodeIdx) => {
            if (node.depth > 1) {
              const parentId = node.id.includes('case') ? 'final-confirm' : (node.id === 'fix-gen' ? 'fix-case' : 'decision');
              const parent = nodes.find(n => n.id === parentId);
              if (parent && !parent.isExpanded) return null;
            }

            return (
              <div 
                key={`workflow-node-${node.id}-${nodeIdx}`} 
                className={cn(
                  "group relative flex flex-col",
                  node.isSelected && (isDarkMode ? "bg-white/5" : "bg-black/5")
                )}
              >
                {node.depth > 0 && (
                  <div 
                    className="absolute top-0 bottom-0 border-l border-hud-border/20" 
                    style={{ left: `${node.depth * 14}px` }}
                  />
                )}

                <div 
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 cursor-pointer transition-colors",
                    isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5",
                    node.isSelected && (isDarkMode ? "bg-brand-red/10" : "bg-brand-red/5")
                  )}
                  style={{ paddingLeft: `${node.depth * 14 + 12}px` }}
                  onClick={() => node.hasChildren ? toggleNode(node.id) : null}
                >
                  <div className={cn(
                    "w-4 h-4 flex items-center justify-center rounded shrink-0",
                    isDarkMode ? "bg-white/5" : "bg-black/5",
                    node.isSelected && (isDarkMode ? "bg-brand-red/20 shadow-[0_0_8px_rgba(220,38,38,0.2)]" : "bg-brand-red/10")
                  )}>
                    <node.icon className={cn(
                      "w-2.5 h-2.5 transition-colors", 
                      node.isSelected ? "text-brand-red" : (node.iconColor || "text-text-main/60")
                    )} />
                  </div>

                  <span className={cn(
                    "text-[12px] font-sans truncate flex-1",
                    node.isSelected ? "text-brand-red font-medium" : "text-text-main/80"
                  )}>
                    {node.title}
                  </span>

                  {node.id === 'root' ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                      }}
                      className="text-muted-text/60 hover:text-brand-red transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  ) : node.hasChildren && (
                    <div className="text-muted-text/40">
                      {node.isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-screen Workflow Modal via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={cn(
                  "relative w-full h-full max-w-7xl max-h-[90vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col",
                  isDarkMode ? "bg-[#0F0F0F] border-white/10" : "bg-[#f4f1ea] border-black/10"
                )}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-hud-border/10">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      isDarkMode ? "bg-white/5" : "bg-black/5"
                    )}>
                      <Maximize2 className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display uppercase tracking-widest text-text-main">工作流可视化</h2>
                      <p className="text-sm text-muted-text font-sans uppercase tracking-[0.1em] opacity-60">全链路分析逻辑</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowWorkflowCanvas(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-text hover:bg-brand-red/10 hover:text-brand-red transition-colors border border-hud-border/20"
                    >
                      <Play className="w-4 h-4" />
                      <span>工作流画布</span>
                    </button>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-red/10 hover:text-brand-red transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  {/* Modal Left Sidebar (Node Tree) */}
                  <div className={cn(
                    "w-64 border-r border-hud-border/10 flex flex-col p-4",
                    isDarkMode ? "bg-black/20" : "bg-white/50"
                  )}>
                    <div className="mb-4">
                      <h3 className="text-xs font-display uppercase tracking-[0.2em] text-muted-text mb-4 px-2">选择节点</h3>
                      <div className="space-y-1 overflow-auto max-h-[60vh] pr-2 native-scrollbar">
                        {nodes.map((node, modalNodeIdx) => (
                          <div
                            key={`modal-node-${node.id}-${modalNodeIdx}`}
                            onClick={() => {
                              if (nodeDetails[node.id]) {
                                setSelectedNodeInModal(node.id);
                              } else {
                                setSelectedNodeInModal(node.id);
                              }
                            }}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all",
                              selectedNodeInModal === node.id 
                                ? (isDarkMode ? "bg-brand-red/20 text-brand-red" : "bg-brand-red/10 text-brand-red")
                                : (isDarkMode ? "hover:bg-white/5 text-muted-text" : "hover:bg-black/5 text-muted-text")
                            )}
                            style={{ marginLeft: `${node.depth * 12}px` }}
                          >
                            <node.icon className={cn("w-4 h-4", selectedNodeInModal === node.id ? "text-brand-red" : "opacity-60")} />
                            <span className="text-[13px] truncate font-sans">{node.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Modal Content Area */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Inner Header / Toolbar */}
                    <div className="flex items-center justify-between px-8 py-4 border-b border-hud-border/5">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-sans font-medium text-text-main">{getActiveDetail().title}</h3>
                        <div className="px-3 py-0.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-[11px] font-mono uppercase text-brand-red tracking-wide">
                          AI 节点
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-brand-red/10 text-muted-text hover:text-brand-red transition-colors border border-hud-border/10">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-brand-red/10 text-muted-text hover:text-brand-red transition-colors border border-hud-border/10">
                          <Code className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-brand-red/10 text-muted-text hover:text-brand-red transition-colors border border-hud-border/10">
                          <Settings2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="px-8 py-2 text-sm text-muted-text font-sans border-b border-hud-border/5 opacity-80">
                      {getActiveDetail().description}
                    </div>

                    {/* Scrollable Form Area */}
                    <div className="flex-1 overflow-auto p-8 native-scrollbar space-y-8 text-text-main">


                      {/* Prompts */}
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-display uppercase tracking-[0.2em] text-muted-text">系统提示词 (System)</label>
                          </div>
                          <div className={cn(
                            "p-4 rounded-xl border border-hud-border/20 font-sans leading-relaxed text-sm min-h-[120px]",
                            isDarkMode ? "bg-white/5 text-white/70" : "bg-black/5 text-black/70"
                          )}>
                            {getActiveDetail().systemPrompt}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-display uppercase tracking-[0.2em] text-muted-text">用户提示词 (User)</label>
                          </div>
                          <div className={cn(
                            "p-4 rounded-xl border border-hud-border/20 font-sans leading-relaxed text-sm min-h-[120px] whitespace-pre-wrap",
                            isDarkMode ? "bg-white/5 text-white/70" : "bg-black/5 text-black/70"
                          )}>
                            {getActiveDetail().userPrompt}
                          </div>
                        </div>
                      </div>

                      {/* JSON IO */}
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-display uppercase tracking-[0.2em] text-muted-text">输入定义 (Input)</label>
                          <div className={cn(
                            "p-6 rounded-xl border border-hud-border/20 font-mono text-[13px] overflow-hidden",
                            isDarkMode ? "bg-black text-lime-400/90" : "bg-black/5 text-emerald-700"
                          )}>
                            <div className="flex flex-col gap-1">
                              <span>{'{'}</span>
                              <div className="pl-6 flex flex-col">
                                {Object.entries(getActiveDetail().input).map(([key, val], entryIdx) => (
                                  <div key={`input-entry-${key}-${entryIdx}`} className="flex gap-2">
                                    <span className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}>"{key}"</span>
                                    <span className={isDarkMode ? "text-white" : "text-black/60"}>:</span>
                                    <span className={isDarkMode ? "text-amber-300" : "text-amber-600"}>"{val}"</span>
                                  </div>
                                ))}
                              </div>
                              <span>{'}'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-display uppercase tracking-[0.2em] text-muted-text">输出定义 (Output)</label>
                          <div className={cn(
                            "p-6 rounded-xl border border-hud-border/20 font-mono text-[13px] overflow-hidden",
                            isDarkMode ? "bg-black text-lime-400/90" : "bg-black/5 text-emerald-700"
                          )}>
                            <div className="flex flex-col gap-1">
                              <span>{'{'}</span>
                              <div className="pl-6 flex flex-col">
                                {Object.entries(getActiveDetail().output).map(([key, val], outEntryIdx) => (
                                  <div key={`output-entry-${key}-${outEntryIdx}`} className="flex gap-2">
                                    <span className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}>"{key}"</span>
                                    <span className={isDarkMode ? "text-white" : "text-black/60"}>:</span>
                                    <span className={isDarkMode ? "text-amber-300" : "text-amber-600"}>"{val}"</span>
                                  </div>
                                ))}
                              </div>
                              <span>{'}'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <WorkflowCanvasModal 
        isOpen={showWorkflowCanvas} 
        onClose={() => setShowWorkflowCanvas(false)} 
        theme={theme}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .native-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .native-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .native-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.1);
          border-radius: 10px;
        }
        .native-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.3);
        }
      `}} />
    </div>
  );
}
