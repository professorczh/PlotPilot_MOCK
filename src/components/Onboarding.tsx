import { useState, useEffect, useRef, FormEvent, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Loader2, 
  Users, Map as MapIcon, Zap, Activity, 
  ArrowRight, Database, Globe, Shield, Coins, Scale, Mountain, Wind, Flame, Sparkles,
  ChevronRight, MessageSquare, Send, X, Bot, Plus, Network, Box
} from 'lucide-react';

import { cn } from '../lib/utils';
import { AgentMessage } from '../types';
import AgentCoreView from './AgentCoreView';
import RelationshipGraph from './RelationshipGraph';

interface OnboardingProps {
  onComplete: () => void;
  onBackToLanding: () => void;
  storyTitle: string;
  isMockLoadingEnabled?: boolean;
  messages: AgentMessage[];
  onSendMessage: (text: string) => void;
  onAddAIMessage: (text: string, context?: 'world' | 'character' | 'map' | 'plot' | 'general', isSystem?: boolean) => void;
  theme: 'ink' | 'paper' | 'classic';
}

type StepStatus = 'thinking' | 'reviewing' | 'completed';

export default function Onboarding({ 
  onComplete, 
  onBackToLanding, 
  storyTitle, 
  isMockLoadingEnabled = true,
  messages,
  onSendMessage,
  onAddAIMessage,
  theme
}: OnboardingProps) {
  const isDarkMode = theme === 'ink';
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<StepStatus>('thinking');
  const [thinkingText, setThinkingText] = useState('');
  const [selectedStoryline, setSelectedStoryline] = useState<number | null>(null);
  const [isAgentOpen, setIsAgentOpen] = useState(true);

  // Find the latest AI message that possesses a trace (regardless of current thinking status)
  const activeThinkingMessage = [...messages].reverse().find(m => m.role === 'ai' && m.trace);
  const currentTraceSteps = activeThinkingMessage?.trace || [];
  const activeStep = currentTraceSteps.find(s => s.status === 'thinking');
  
  // Refined progress calculation
  const totalSteps = currentTraceSteps.length;
  const thinkingIndex = currentTraceSteps.findIndex(s => s.status === 'thinking');
  const completedCount = currentTraceSteps.filter(s => s.status === 'completed').length;
  
  const activeIndex = thinkingIndex !== -1 ? thinkingIndex + 1 : (completedCount > 0 ? completedCount : 0);
  const isFinalizing = totalSteps > 0 && completedCount === totalSteps;

  // Sync status with AI message state - agent is only "thinking" if the active message says so
  const isAgentThinking = activeThinkingMessage ? activeThinkingMessage.isThinking : false;

  // SYNC: Only update when thinking process is definitely done
  useEffect(() => {
    // If the latest push is no longer thinking, reveal content immediately
    if (status === 'thinking' && activeThinkingMessage && !isAgentThinking && messages.length > 1) {
      setStatus('reviewing');
    }
  }, [isAgentThinking, activeThinkingMessage, status, messages.length]);

  const handleNext = () => {
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      const nextStepName = steps.find(s => s.id === nextStep)?.label || '';
      const contextMap: Record<string, any> = {
        '世界观': 'world',
        '人物': 'character',
        '地图': 'map',
        '故事线': 'plot'
      };
      
      const stepIntros: Record<string, string> = {
        '人物': '核心博弈实体映射完成',
        '地图': '核心逻辑节点同步完成',
        '故事线': '剧情主轴推演就绪',
        '情节弧': '时空曲率修正完成'
      };
      
      setCurrentStep(nextStep);
      setStatus('thinking');
      
      // Trigger AI thinking for the NEXT step specifically with PROTOCOL style
      onAddAIMessage(
        stepIntros[nextStepName] || `正在加载“${nextStepName}”...`,
        contextMap[nextStepName] || 'general',
        true
      );
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setStatus('reviewing'); // No need to re-think when going back
    } else {
      onBackToLanding();
    }
  };

  const steps = [
    { id: 1, label: '世界观' },
    { id: 2, label: '人物' },
    { id: 3, label: '地图' },
    { id: 4, label: '故事线' },
    { id: 5, label: '情节弧' },
  ];

  return (
    <div className="h-screen bg-app-bg text-text-main font-sans flex relative overflow-hidden">
      {/* 1. Left Section: Onboarding Workspace (70% or 100% when closed) */}
      <motion.div 
        layout
        className={`flex-1 flex flex-col relative h-full transition-all duration-700 ease-[0.23,1,0.32,1] border-r border-hud-border/10 overflow-hidden`}
        style={{ width: isAgentOpen ? '70%' : '100%' }}
      >
        {/* Background Accents (Local to Left) */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')] mix-blend-overlay" />
        </div>

        {/* Local Header */}
        <header className="p-4 px-8 border-b border-hud-border/30 bg-panel-bg/20 backdrop-blur-xl z-50 shrink-0">
          <div className="flex items-center justify-between gap-8 w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-4 shrink-0">
              <h1 className="text-xl font-sans font-bold tracking-[0.2em] text-text-main whitespace-nowrap uppercase">新书向导</h1>
              <div className="h-4 w-[1px] bg-hud-border/50" />
              <div className="text-xs font-mono text-muted-text tracking-[0.2em] uppercase opacity-60 truncate max-w-[150px]">
                {storyTitle || "墨枢"}
              </div>
            </div>
            
            <div className="flex-1 flex justify-between relative max-w-2xl px-4">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 w-full h-[1px] bg-hud-border/10 -z-10" />
              <motion.div 
                className="absolute top-4 left-0 h-[1px] bg-brand-red shadow-[0_0_10px_#DC2626] -z-10"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />

              {steps.map((step) => (
                <div key={`onboarding-step-indicator-${step.id}`} className="flex flex-col items-center gap-1">
                  <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 text-[10px]
                    ${currentStep > step.id ? 'bg-brand-red border-brand-red text-white' : 
                      currentStep === step.id ? 'bg-panel-bg border-brand-red text-brand-red shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 
                      'bg-panel-bg border-hud-border text-muted-text'}
                  `}>
                    {currentStep > step.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="font-sans font-bold">{step.id}</span>}
                  </div>
                  <div className={`text-xs font-medium hidden md:block ${currentStep === step.id ? 'text-text-main' : 'text-muted-text/60'}`}>{step.label}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <main className={`flex-1 flex flex-col ${[2, 3].includes(currentStep) ? 'overflow-hidden' : 'overflow-y-auto'} relative z-10 custom-scrollbar p-4 lg:px-8 lg:pt-5 lg:pb-2 min-h-0`}>
          <AnimatePresence mode="wait">
            {status === 'thinking' ? (
              <ThinkingState 
                key="thinking" 
                text={activeStep?.label || thinkingText} 
                step={currentStep} 
                isAgentOpen={isAgentOpen}
                progress={activeIndex > 0 ? `${activeIndex} / ${totalSteps}` : undefined}
                isFinalizing={isFinalizing}
                isDarkMode={isDarkMode}
              />
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="min-h-full flex flex-col"
              >
                {renderStepContent(currentStep, selectedStoryline, setSelectedStoryline, isDarkMode)}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Local Footer Actions */}
        <AnimatePresence mode="wait">
          {status === 'reviewing' && (
            <motion.footer 
              key="onboarding-footer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-6 py-4 bg-gradient-to-t from-app-bg via-app-bg/95 to-transparent shrink-0 border-t border-hud-border/5 z-50 mt-auto"
            >
              <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
                <button
                  onClick={handleBack}
                  className="group flex items-center gap-2 px-6 py-2.5 rounded-xl font-sans font-bold tracking-widest transition-all bg-panel-bg border border-hud-border text-muted-text hover:text-text-main hover:border-text-main"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  <span>上一步</span>
                </button>

                <button
                  onClick={handleNext}
                  className="group flex items-center gap-2 bg-brand-red text-white px-8 py-3 rounded-xl font-sans font-bold tracking-[0.2em] text-xs hover:bg-red-700 transition-all shadow-[0_10px_30px_rgba(220,38,38,0.2)] active:scale-95"
                >
                  <span>{currentStep === 5 ? '完成设置' : '下一步'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. Right Section: AI Agent Panel (30%) */}
      <AnimatePresence mode="wait">
        {isAgentOpen ? (
          <motion.aside
            key="agent-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '30%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="h-full z-40 overflow-hidden p-4"
          >
            <AgentCoreView 
              messages={messages}
              onSendMessage={onSendMessage}
              onClose={() => setIsAgentOpen(false)}
              theme={theme} 
              isMockLoadingEnabled={isMockLoadingEnabled}
            />
          </motion.aside>
        ) : (
          <motion.button
            key="agent-toggle"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setIsAgentOpen(true)}
            className="fixed right-6 top-1/2 -translate-y-1/2 w-10 h-32 rounded-l-2xl bg-brand-red/10 border-l border-y border-brand-red/30 backdrop-blur-md flex flex-col items-center justify-center gap-2 text-brand-red z-50 hover:bg-brand-red/20 transition-all group"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="[writing-mode:vertical-lr] text-[10px] font-sans font-bold tracking-widest uppercase">展开灵感轴</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

function SmartImage({ src, fallback, alt, className, ...props }: any) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setCurrentSrc(fallback);
      setHasError(true);
    }
  };

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className} 
      onError={handleError} 
      {...props} 
    />
  );
}

function ThinkingState({ text, step, progress, isFinalizing, isDarkMode }: { text: string; step: number; isAgentOpen: boolean; progress?: string; isFinalizing?: boolean; key?: string; isDarkMode: boolean }) {
  const icons = [Database, Users, MapIcon, Zap, Activity];
  const Icon = icons[step - 1];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8"
    >
      <div className="relative">
        <motion.div 
          animate={{ rotate: isFinalizing ? 0 : 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className={cn(
            "w-20 h-20 rounded-full border-t border-brand-red/30 border-r border-brand-red/10",
            isFinalizing && 'border-green-500/30 ring-4 ring-green-500/10'
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {isFinalizing ? (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          ) : (
            <Icon className="w-8 h-8 text-brand-red/40" />
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-sans font-bold text-text-main tracking-[0.2em] uppercase">
          {getStepTitle(step)}
        </h2>
        <div className="flex flex-col items-center gap-2 w-full max-w-lg mx-auto">
          {/* Status Bar Frame */}
          <div className={`relative flex items-center w-full min-h-[84px] px-20 py-4 bg-panel-bg/30 border rounded-2xl backdrop-blur-md transition-all duration-700 ${isFinalizing ? 'border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-hud-border/40'}`}>
            
            {/* Left Anchored Icon: Matches screenshot exactly */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {isFinalizing ? (
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center border border-brand-red/20 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.6)]" />
                </div>
              )}
            </div>
            
            {/* Centered Text Container: Absolute centering logic */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <div className="w-full text-[12px] font-sans font-bold text-text-main uppercase tracking-[0.2em] leading-tight">
                <span className={isFinalizing ? 'text-green-500' : 'animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--text-main),35%,#DC2626,50%,#f87171,65%,var(--text-main))] bg-[length:200%_100%]'}>
                  {isFinalizing ? '世界观解析协议已就绪' : text}
                </span>
                {progress && <span className="opacity-30 ml-2 font-mono text-[10px]">[{progress}]</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function renderStepContent(step: number, selectedStoryline: number | null, setSelectedStoryline: (id: number) => void, isDarkMode: boolean) {
  switch (step) {
    case 1: return <WorldviewContent isDarkMode={isDarkMode} />;
    case 2: return <CharactersContent isDarkMode={isDarkMode} />;
    case 3: return <MapContent isDarkMode={isDarkMode} />;
    case 4: return <StorylineContent selected={selectedStoryline} onSelect={setSelectedStoryline} isDarkMode={isDarkMode} />;
    case 5: return <PlotArcContent isDarkMode={isDarkMode} />;
    default: return null;
  }
}

// --- Content Components ---

function WorldviewContent({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex flex-col space-y-3 w-full py-4 flex-1 min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 overflow-hidden">
        <Section title="核心法则" icon={Zap} items={[
          { label: "力量体系", icon: Flame, val: "无超自然力量，核心优势为重生者携带的现代公关、危机管理、项目管理、舆情引导思维，通过适配秦代的竹简、斥候、工匠体系实现降维打击。" },
          { label: "物理规律", icon: Scale, val: "完全遵循战国末期至秦代的物理规律，无超自然现象，重力、温度、力学等与现实古代中国一致。" },
          { label: "逻辑奇点", icon: Sparkles, val: "以秦代现有生产工具为载体，将现代管理、公关、营销思维转化为可落地的古代操作方案。" }
        ]} />
        
        <Section title="地理生态" icon={MapIcon} items={[
          { label: "地缘政治", icon: Globe, val: "秦统一六国后的关中平原为轴心，北抵长城，南至岭南，西起陇西，东达海滨。各地文化隔阂巨大，方言与习俗各异。" },
          { label: "战略节点", icon: Mountain, val: "函谷关、咸阳宫、上郡大营。这些地点不仅是物理枢纽，更是舆情传播与权力博弈的咽喉点。" },
          { label: "气候环境", icon: Wind, val: "关中气候干燥，渭河系统是命脉。环境对军队机动与补给运输有着决定性影响。" }
        ]} />

        <Section title="社会契约" icon={Shield} items={[
          { label: "权力结构", icon: Database, val: "郡县制下的中央集权，法家思想绝对统治。核心权力在于对信息的解释权与对诏书、虎符的物理掌控。" },
          { label: "利益群体", icon: Users, val: "老秦人军功集团、关东六国旧贵族、儒生士子、商贾阶层。各方利益错综复杂，是舆情引导、统一战线的主要受众。" },
          { label: "价值取向", icon: Coins, val: "崇尚武功、严刑峻法、耕战合一。重生者需在维持国家运行的前提下，逐步引入契约、共赢与现代人文管理思维。" }
        ]} />
      </div>
    </div>
  );
}

function CharactersContent({ isDarkMode }: { isDarkMode: boolean }) {
  const [activeView, setActiveView] = useState<'graph' | 'cards'>('cards');

  const chars = [
    { name: "赢扶苏", role: "主角", weight: "壹级 · 枢密", resonance: "S级 · 极致", threat: "陆级 · 潜伏", img: "/assets/story/char_1.png", fallback: "https://picsum.photos/seed/chinese-nobleman-portrait/600/800", desc: "现代顶尖公关公司CEO重生为秦公子扶苏，擅于舆情引导与资源整合，目标是通过现代管理思维扭转秦二世而亡的结局。" },
    { name: "张苍", role: "导师", weight: "贰级 · 律令", resonance: "A级 · 高频", threat: "叁级 · 稳定", img: "/assets/story/char_2.png", fallback: "https://picsum.photos/seed/chinese-scholar-ancient/600/800", desc: "秦代典制专家，精通律法。目标是辅佐扶苏推行合规新政，在大秦法律体系中寻找博弈空间。" },
    { name: "赵高", role: "对手", weight: "壹级 · 阴影", resonance: "B级 · 混沌", threat: "玖级 · 极危", img: "/assets/story/char_3.png", fallback: "https://picsum.photos/seed/chinese-eunuch-villain/600/800", desc: "秦廷权力操盘手，擅于玩弄权术。目标是掌控帝国舆情通道，扶持傀儡以专权。" },
    { name: "蒙恬", role: "盟友", weight: "壹级 ·执剑", resonance: "A级 · 全域", threat: "伍级 · 锋芒", img: "/assets/story/char_4.png", fallback: "https://picsum.photos/seed/terracotta-general/600/800", desc: "大秦名将，统领三十万大军。是主角重整帝国武力基石的核心支柱，忠诚且刚毅。" },
    { name: "李斯", role: "中立者", weight: "壹级 · 辅弼", resonance: "A级 · 均衡", threat: "柒级 · 多变", img: "/assets/story/char_5.png", fallback: "https://picsum.photos/seed/chinese-chancellor/600/800", desc: "法家代表人物，极度功利。是主角进行政治公关布局的关键争取对象。" },
    { name: "王离", role: "配角", weight: "叁级 · 锋刃", resonance: "B+ 局部", threat: "肆级 · 正直", img: "/assets/story/char_6.png", fallback: "https://picsum.photos/seed/chinese-general-armor/600/800", desc: "王翦之孙，代表军功集团的核心利益，在军事改革中持观望态度。" },
    { name: "郑国", role: "配角", weight: "肆级 · 工造", resonance: "A+ 根基", threat: "贰级 · 沉稳", img: "/assets/story/char_7.png", fallback: "https://picsum.photos/seed/ancient-dam-construction/600/800", desc: "水利专家，主持修建郑国渠。是扶苏改善民生、获取社会共鸣的基础技术保障。" }
  ];

  return (
    <div className="flex flex-col h-full py-4 lg:py-6 overflow-hidden min-h-0">
      {/* Header Info */}
      <div className="flex items-center justify-between px-5 mb-8 shrink-0 h-10">
        <h3 className="text-xl font-display font-bold text-text-main tracking-widest uppercase">核心博弈实体映射完成</h3>
        
        {/* Content Mode Toggle */}
        <div className="flex bg-panel-bg/60 backdrop-blur-md border border-hud-border/20 rounded-full p-1 shadow-xl select-none">
          <button 
            onClick={() => setActiveView('graph')}
            className={cn(
              "px-4 py-1.5 flex items-center gap-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all duration-300",
              activeView === 'graph' ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" : "text-muted-text hover:text-text-main"
            )}
          >
            <Network className="w-3 h-3" />
            画布模式
          </button>
          <button 
            onClick={() => setActiveView('cards')}
            className={cn(
              "px-4 py-1.5 flex items-center gap-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all duration-300",
              activeView === 'cards' ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" : "text-muted-text hover:text-text-main"
            )}
          >
            <Box className="w-3 h-3" />
            卡片模式
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1440px] mx-auto min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeView === 'graph' ? (
            <motion.div 
              key="view-graph"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full h-full pb-12"
            >
              <div className="w-full h-full bg-panel-bg/10 border border-hud-border/20 rounded-3xl backdrop-blur-md relative overflow-hidden">
                <div className="w-full h-full">
                  <RelationshipGraph theme={isDarkMode ? 'ink' : 'paper'} />
                </div>
                
                {/* HUD Overlay Elements for Graph */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-brand-red animate-pulse" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-brand-red animate-pulse" />
                
                <div className="absolute bottom-8 left-8 flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#34D399]" />
                    <span className="text-[10px] font-mono text-muted-text/60 uppercase">核心阵营</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#60A5FA]" />
                    <span className="text-[10px] font-mono text-muted-text/60 uppercase">权重官署</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#A855F7]" />
                    <span className="text-[10px] font-mono text-muted-text/60 uppercase">潜伏变数</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="view-cards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full overflow-y-auto scrollbar-none pb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                {chars.map((c, idx) => (
                  <motion.div 
                    key={`char-card-${c.name}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-full aspect-[21/9] bg-panel-bg/40 border border-hud-border/30 rounded-3xl overflow-hidden group hover:border-brand-red/50 transition-all duration-500 flex shadow-xl"
                  >
                    {/* Compact Image */}
                    <div className="w-[35%] h-full relative overflow-hidden border-r border-hud-border/20 shrink-0">
                      <SmartImage 
                        src={c.img} 
                        fallback={c.fallback}
                        alt={c.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.8] group-hover:grayscale-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-panel-bg/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="text-[9px] font-sans font-bold text-brand-red bg-brand-red/10 border border-brand-red/30 px-2 py-0.5 rounded uppercase tracking-[0.2em] backdrop-blur-md">{c.role}</span>
                      </div>
                    </div>

                    {/* Compact Content */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="mb-4">
                        <h4 className="text-3xl font-display font-bold text-text-main mb-1 tracking-widest group-hover:text-brand-red transition-colors uppercase">
                          {c.name}
                        </h4>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono text-muted-text/40 uppercase tracking-widest">位阶:</span>
                           <span className="text-[10px] font-display font-bold text-brand-red uppercase tracking-[0.1em]">{c.weight}</span>
                        </div>
                      </div>
                      
                      <p className="text-text-main/70 text-xs leading-relaxed font-sans line-clamp-2 mb-4">{c.desc}</p>

                      <div className="pt-4 border-t border-hud-border/10 flex items-center justify-between">
                        <div className="flex gap-6">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-display text-muted-text/40 uppercase tracking-widest">共鸣</span>
                            <span className="text-sm font-display font-bold text-text-main tracking-widest">{c.resonance}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] font-display text-muted-text/40 uppercase tracking-widest">威胁</span>
                            <span className="text-sm font-display font-bold text-brand-red tracking-widest">{c.threat}</span>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-hud-border/30 flex items-center justify-center relative overflow-hidden group-hover:border-brand-red/50 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-ping" />
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
    </div>
  );
}

function MapContent({ isDarkMode }: { isDarkMode: boolean }) {
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');

  const locations = [
    { name: "大秦都城咸阳", type: "核心枢纽", color: "#DC2626", icon: Globe, img: "/assets/story/loc_1.png", fallback: "https://picsum.photos/seed/xianyang/400/400", desc: "秦统一后的核心都城，位于关中平原渭水北岸，分为宫城、外郭官署区与市井商圈。" },
    { name: "廷尉府", type: "政务官署", color: "#3B82F6", icon: Shield, img: "/assets/story/loc_2.png", fallback: "https://picsum.photos/seed/tingwei/400/400", desc: "大秦最高司法与监察官署，负责百官考核、案件审理与舆情稽查。" },
    { name: "渭水码头", type: "物资补给", color: "#F97316", icon: Wind, img: "/assets/story/loc_3.png", fallback: "https://picsum.photos/seed/wharf/400/400", desc: "重要的物资集散地，秦统一后作为漕运枢纽，连接关中与关东，是帝国物流命脉。" },
    { name: "咸阳宫", type: "皇权中心", color: "#A855F7", icon: Database, img: "/assets/story/loc_4.png", fallback: "https://picsum.photos/seed/palace/400/400", desc: "大秦帝国皇宫，包含前朝朝会区、后宫寝殿与九卿官署附楼，是皇帝与朝臣议事的核心。" },
    { name: "上郡大营", type: "军事要塞", color: "#22C55E", icon: Mountain, img: "/assets/story/loc_5.png", fallback: "https://picsum.photos/seed/camp/400/400", desc: "大秦在北方边境的核心军备中心，扶苏与蒙恬统领三十万大军抵御匈奴的最高指挥部。" },
    { name: "郑国渠", type: "农田水利", color: "#EAB308", icon: Activity, img: "/assets/story/loc_6.png", fallback: "https://picsum.photos/seed/canal/400/400", desc: "战国末年修建的大型水利工程，使关中平原成为沃野，为秦国的统一战争提供了坚实的粮食基础。" },
    { name: "函谷关", type: "咽喉要塞", color: "#6366F1", icon: Shield, img: "/assets/story/loc_7.png", fallback: "https://picsum.photos/seed/pass/400/400", desc: "扼守关中门户的战略天险，是关东六国入秦的必经之地，也是帝国封锁舆情传播的关键物理关哨。" }
  ];

  const currentLoc = locations.find(l => l.name === selectedLoc);

  return (
    <div className="flex flex-col h-full py-4 lg:py-6 overflow-hidden min-h-0">
      {/* Header Info */}
      <div className="flex items-center justify-between px-5 mb-8 shrink-0 h-10">
        <h3 className="text-xl font-display font-bold text-text-main tracking-widest uppercase">核心逻辑节点同步完成</h3>
        
        {/* Content Mode Toggle */}
        <div className="flex bg-panel-bg/60 backdrop-blur-md border border-hud-border/20 rounded-full p-1 shadow-xl select-none">
          <button 
            onClick={() => setActiveView('map')}
            className={cn(
              "px-4 py-1.5 flex items-center gap-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all duration-300",
              activeView === 'map' ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" : "text-muted-text hover:text-text-main"
            )}
          >
            <Network className="w-3 h-3" />
            画布模式
          </button>
          <button 
            onClick={() => setActiveView('list')}
            className={cn(
              "px-4 py-1.5 flex items-center gap-2 rounded-full text-[10px] font-display font-bold uppercase tracking-widest transition-all duration-300",
              activeView === 'list' ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" : "text-muted-text hover:text-text-main"
            )}
          >
            <Box className="w-3 h-3" />
            卡片模式
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1440px] mx-auto min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeView === 'map' ? (
            <motion.div 
              key="view-map-main"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full h-full pb-12 flex flex-col justify-center relative"
            >
              <div className="bg-panel-bg/20 border border-hud-border/30 rounded-3xl p-6 lg:p-10 aspect-video relative overflow-hidden w-full shadow-2xl flex flex-col backdrop-blur-xl">
                <div className="flex-1 w-full min-h-0">
                  <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <filter id="glow-map">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <g stroke="currentColor" strokeWidth="0.5" className="text-hud-border/40">
                      <line x1="400" y1="100" x2="250" y2="200" />
                      <line x1="400" y1="100" x2="550" y2="200" />
                      <line x1="400" y1="100" x2="400" y2="350" />
                      <line x1="250" y1="200" x2="150" y2="300" />
                      <line x1="550" y1="200" x2="650" y2="300" />
                      <line x1="650" y1="300" x2="720" y2="200" />
                      <line x1="400" y1="100" x2="720" y2="200" />
                    </g>
                    {locations.map((loc, idx) => {
                      const coords: Record<string, {x: number, y: number}> = {
                        "大秦都城咸阳": { x: 400, y: 100 },
                        "廷尉府": { x: 250, y: 200 },
                        "渭水码头": { x: 550, y: 200 },
                        "咸阳宫": { x: 400, y: 350 },
                        "上郡大营": { x: 150, y: 300 },
                        "郑国渠": { x: 650, y: 300 },
                        "函谷关": { x: 720, y: 200 }
                      };
                      const pos = coords[loc.name];
                      if (!pos) return null;
                      return (
                        <g 
                          key={`map-node-${idx}`} 
                          className="cursor-pointer group"
                          onClick={() => setSelectedLoc(loc.name)}
                        >
                          <circle 
                            cx={pos.x} cy={pos.y} 
                            r={selectedLoc === loc.name ? 14 : 8} 
                            className="transition-all duration-500"
                            style={{ fill: loc.color }}
                            filter={selectedLoc === loc.name ? "url(#glow-map)" : ""}
                          />
                          <circle 
                            cx={pos.x} cy={pos.y} 
                            r={selectedLoc === loc.name ? 22 : 0} 
                            className="fill-none stroke-current opacity-20 animate-ping"
                            style={{ color: loc.color }}
                          />
                          <text 
                            x={pos.x} y={pos.y + 25} 
                            textAnchor="middle" 
                            className={cn(
                              "text-[9px] font-sans font-bold uppercase tracking-widest transition-all duration-300",
                              selectedLoc === loc.name ? "fill-text-main opacity-100" : "fill-muted-text/40 opacity-0 group-hover:opacity-100"
                            )}
                          >
                            {loc.name}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>

                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                    <span className="text-[10px] font-mono text-text-main uppercase tracking-widest">战术层级已加载</span>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 flex items-center gap-6">
                  {['核心', '政务', '补给'].map((label, i) => (
                    <div key={label} className="flex items-center gap-2">
                       <div className={cn("w-2 h-2 rounded-full", i === 0 ? "bg-brand-red" : i === 1 ? "bg-blue-500" : "bg-orange-500")} />
                       <span className="text-[10px] font-mono text-muted-text/60 uppercase">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-brand-red/20" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-brand-red/20" />
              </div>

              <AnimatePresence>
                {selectedLoc && currentLoc && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="absolute inset-0 z-30 flex items-center justify-center p-12 pointer-events-none"
                  >
                    <div className="w-full max-w-4xl aspect-video bg-app-bg/95 border border-brand-red/50 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.3)] pointer-events-auto relative group">
                      <SmartImage 
                        src={currentLoc.img.replace('.png', '_hd.png')} 
                        fallback={currentLoc.fallback.replace('400/400', '1920/1080')}
                        alt={currentLoc.name} 
                        className="w-full h-full object-cover grayscale-[0.4]" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-app-bg via-app-bg/40 to-transparent" />
                      
                      <div className="absolute bottom-10 left-12 right-12">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="p-2 rounded-xl bg-brand-red/10 border border-brand-red/30"><currentLoc.icon className="w-5 h-5 text-brand-red" /></span>
                          <h4 className="text-4xl font-display font-bold text-text-main uppercase tracking-widest">{currentLoc.name}</h4>
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] text-white uppercase ml-auto" style={{ backgroundColor: currentLoc.color }}>{currentLoc.type}</span>
                        </div>
                        <p className="text-text-main/80 text-base max-w-2xl leading-relaxed font-sans">{currentLoc.desc}</p>
                      </div>

                      <button 
                        onClick={() => setSelectedLoc(null)}
                        className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 bg-black/40 text-white hover:bg-brand-red transition-all"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              key="view-map-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full overflow-y-auto scrollbar-none pb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
                {locations.map((loc, idx) => (
                  <motion.div
                    key={`map-list-item-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-panel-bg/40 border border-hud-border/20 rounded-3xl p-5 flex flex-col gap-4 group hover:border-brand-red/50 transition-all duration-500 shadow-xl"
                  >
                    <div className="aspect-video rounded-2xl overflow-hidden relative">
                      <SmartImage 
                        src={loc.img} 
                        fallback={loc.fallback}
                        alt={loc.name} 
                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded text-[8px] font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-black/20" style={{ backgroundColor: loc.color }}>{loc.type}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xl font-display font-bold text-text-main group-hover:text-brand-red transition-colors uppercase tracking-widest">{loc.name}</h4>
                      <p className="text-muted-text text-[11px] leading-relaxed line-clamp-3">{loc.desc}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-hud-border/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <loc.icon className="w-3.5 h-3.5 text-brand-red/50" />
                        <span className="text-[9px] font-mono text-muted-text uppercase tracking-widest">战略优先级：高</span>
                      </div>
                      <button 
                        onClick={() => { setSelectedLoc(loc.name); setActiveView('map'); }}
                        className="text-[9px] font-display font-bold text-brand-red uppercase tracking-widest hover:underline"
                      >
                        在地图中定位
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StorylineContent({ selected, onSelect, isDarkMode }: { selected: number | null; onSelect: (id: number) => void; isDarkMode: boolean }) {
  const lines = [
    { id: 1, tag: "底层生存逆袭", title: "临尘戍变的翻盘局", img: "/assets/story/plot_1.png", fallback: "https://picsum.photos/seed/border/800/600", desc: "重生为扶苏的赢扶苏抵达南境临尘城，既要平息移民与百越土著的械斗，又要对抗赵高与军功集团的破坏，用现代公关思维扭转危局。" },
    { id: 2, tag: "高层黑箱博弈", title: "咸阳宫的伪诏迷局", img: "/assets/story/plot_2.png", fallback: "https://picsum.photos/seed/palace/800/600", desc: "扶苏在咸阳宫协助始皇处理政务时，发现赵高篡改军粮调度令、控制始皇病情的黑箱阴谋，必须赶在沙丘之变前揭露真相。" },
    { id: 3, tag: "舆情异数觉醒", title: "能知民心的异数公子", img: "/assets/story/plot_3.png", fallback: "https://picsum.photos/seed/crowd/800/600", desc: "扶苏发现自己能通过民间歌谣、乡老汇报精准预判舆情走向，这种现代公关的能力被保守派视为妖术，他必须隐藏秘密推行新政。" }
  ];

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lines.map(line => (
          <button
            key={`storyline-choice-${line.id}`}
            onClick={() => onSelect(line.id)}
            className={`
              relative flex flex-col rounded-2xl border text-left transition-all group overflow-hidden
              ${selected === line.id ? 'bg-brand-red/10 border-brand-red shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'bg-panel-bg/40 border-hud-border/30 hover:border-brand-red/30'}
            `}
          >
            <div className="aspect-video relative overflow-hidden">
              <SmartImage 
                src={line.img} 
                fallback={line.fallback}
                alt={line.title} 
                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-panel-bg/80 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-xs font-mono text-brand-red border border-brand-red/30 px-2 py-0.5 rounded uppercase tracking-widest bg-app-bg/80">{line.tag}</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="text-lg font-sans font-bold text-text-main mb-3 group-hover:text-brand-red transition-colors uppercase tracking-wider">{line.title}</h4>
              <p className="text-muted-text text-sm leading-relaxed mb-6 flex-1">{line.desc}</p>
              
              <div className={`
                w-full py-2 rounded-lg text-xs font-bold tracking-widest text-center transition-all
                ${selected === line.id ? 'bg-brand-red text-white' : 'bg-hud-border/20 text-muted-text group-hover:bg-brand-red/20 group-hover:text-brand-red'}
              `}>
                {selected === line.id ? '已选定为主线' : '选这条作为主线'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlotArcContent({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6 text-center flex-1">
      <div className="relative inline-block shrink-0">
        <Activity className="w-16 h-16 text-brand-red mx-auto mb-4" />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-brand-red/20 blur-3xl rounded-full"
        />
      </div>

      <div className="w-full max-w-xl mx-auto space-y-6 text-left bg-panel-bg/20 p-6 rounded-3xl border border-hud-border/20 backdrop-blur-sm">
        <ArcItem label="开端" val="故事的起点" />
        <ArcItem label="上升" val="矛盾逐渐激化" />
        <ArcItem label="转折" val="关键转折点" />
        <ArcItem label="高潮" val="矛盾最激烈时刻" />
        <ArcItem label="结局" val="故事的收尾" />
      </div>
    </div>
  );
}

// --- Helper Components ---

function Section({ title, icon: Icon, items }: { title: string; icon: any; items: { label: string; icon?: any; val: string }[] }) {
  return (
    <div className="bg-panel-bg/40 border border-hud-border/30 rounded-3xl overflow-hidden flex flex-col h-full group hover:border-brand-red/30 transition-all duration-500 shadow-2xl">
      <div className="bg-hud-border/10 px-8 py-4 border-b border-hud-border/30 flex items-center justify-between">
        <h4 className="text-lg font-sans font-bold tracking-[0.3em] text-muted-text uppercase">{title}</h4>
        <Icon className="w-5 h-5 text-brand-red/50 group-hover:text-brand-red transition-colors" />
      </div>
      <div className="p-6 space-y-6 flex-1">
        {items.map((item, idx) => (
          <div key={`section-item-${title}-${item.label}-${idx}`} className="relative pl-10 border-l border-hud-border/20 hover:border-brand-red/30 transition-colors">
            {item.icon && (
              <div className="absolute -left-4 top-0 w-8 h-8 bg-app-bg border border-hud-border/30 rounded-full flex items-center justify-center shadow-lg">
                <item.icon className="w-4 h-4 text-brand-red" />
              </div>
            )}
            <div className="text-lg font-sans font-bold text-brand-red tracking-[0.2em] mb-2 uppercase">{item.label}</div>
            <p className="text-text-main text-sm leading-relaxed font-sans opacity-80">{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationItem({ name, type, desc, color, img, isSelected, onClick }: { name: string; type: string; desc: string; color: string; img: string; isSelected?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full text-left bg-panel-bg/40 border rounded-xl p-3 flex gap-4 transition-all duration-300 group
        ${isSelected ? 'border-brand-red ring-1 ring-brand-red bg-brand-red/5' : 'border-hud-border/30 hover:border-brand-red/30'}
      `}
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-hud-border/20">
        <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-sans font-bold text-text-main uppercase tracking-wider truncate">{name}</h4>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter" style={{ color: color, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>{type}</span>
        </div>
        <p className="text-muted-text text-xs leading-tight line-clamp-2">{desc}</p>
      </div>
    </button>
  );
}

function ArcItem({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex items-center gap-8">
      <div className="w-20 text-right text-base font-mono text-brand-red uppercase tracking-widest font-bold">{label}</div>
      <div className="h-[1px] flex-1 bg-brand-red/30" />
      <div className="text-xl text-text-main font-sans tracking-wide">{val}</div>
    </div>
  );
}

function getStepTitle(step: number) {
  switch (step) {
    case 1: return "构建世界观";
    case 2: return "生成人物";
    case 3: return "生成地图";
    case 4: return "确立故事主轴";
    case 5: return "设计情节弧线";
    default: return "AI 正在思考";
  }
}

function getThinkingTexts(step: number) {
  switch (step) {
    case 1: return ["解析故事原点...", "检索历史背景...", "构建五维框架...", "推演物理法则...", "生成社会结构..."];
    case 2: return ["基于世界观推演角色...", "生成人物小传...", "设定性格缺陷与动机...", "构建人际关系网...", "分配剧情权重..."];
    case 3: return ["测绘地理坐标...", "标记战略隘口...", "生成城市布局...", "计算物流与水运...", "渲染地点关联图..."];
    case 4: return ["推演冲突核心...", "生成主线分支...", "计算剧情张力...", "匹配开篇钩子...", "优化叙事节奏..."];
    case 5: return ["规划起承转合...", "设定关键转折...", "模拟情绪曲线...", "验证逻辑闭环...", "准备进入工作台..."];
    default: return ["正在计算...", "深度推演中...", "逻辑校验中..."];
  }
}
