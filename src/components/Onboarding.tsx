import { useState, useEffect, useRef, FormEvent, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Loader2, 
  Users, Map as MapIcon, Zap, Activity, 
  ArrowRight, Database, Globe, Shield, Coins, Scale, Mountain, Wind, Flame, Sparkles,
  ChevronRight, MessageSquare, Send, X, Bot, Plus
} from 'lucide-react';

import { AgentMessage } from '../types';
import AgentCoreView from './AgentCoreView';

interface OnboardingProps {
  onComplete: () => void;
  onBackToLanding: () => void;
  storyTitle: string;
  isMockLoadingEnabled?: boolean;
  messages: AgentMessage[];
  onSendMessage: (text: string) => void;
  onAddAIMessage: (text: string, context?: 'world' | 'character' | 'map' | 'plot' | 'general') => void;
}

type StepStatus = 'thinking' | 'reviewing' | 'completed';

export default function Onboarding({ 
  onComplete, 
  onBackToLanding, 
  storyTitle, 
  isMockLoadingEnabled = true,
  messages,
  onSendMessage,
  onAddAIMessage
}: OnboardingProps) {
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
      
      setCurrentStep(nextStep);
      setStatus('thinking');
      
      // Trigger AI thinking for the NEXT step specifically
      onAddAIMessage(
        `已完成“${nextStepName}”的初步生成。你可以审阅左侧的设定项。如果你对某个部分不满意，或者想针对某些细节进行更深度的推演，可以直接咨询我。`,
        contextMap[nextStepName] || 'general'
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
                <div key={step.id} className="flex flex-col items-center gap-1">
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
                {renderStepContent(currentStep, selectedStoryline, setSelectedStoryline)}
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
              theme="paper" // Onboarding currently has its own background logic
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

function ThinkingState({ text, step, progress, isFinalizing }: { text: string; step: number; isAgentOpen: boolean; progress?: string; isFinalizing?: boolean; key?: string }) {
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
          className={`w-20 h-20 rounded-full border-t border-brand-red/30 border-r border-brand-red/10 ${isFinalizing ? 'border-green-500/30 ring-4 ring-green-500/10' : ''}`}
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
          <div className={`relative flex items-center w-full min-h-[84px] px-12 py-4 bg-panel-bg/30 border rounded-2xl backdrop-blur-md transition-all duration-700 ${isFinalizing ? 'border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : 'border-hud-border/40'}`}>
            
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
              <div className="w-full text-[11px] text-muted-text/70 !font-sans font-medium tracking-[0.1em] mt-1.5 leading-relaxed">
                {isFinalizing ? '深度推演引擎已完成底层架构映射，请审阅核心设定。' : '逻辑正在与墨枢灵感 Agent 实时对撞'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function renderStepContent(step: number, selectedStoryline: number | null, setSelectedStoryline: (id: number) => void) {
  switch (step) {
    case 1: return <WorldviewContent />;
    case 2: return <CharactersContent />;
    case 3: return <MapContent />;
    case 4: return <StorylineContent selected={selectedStoryline} onSelect={setSelectedStoryline} />;
    case 5: return <PlotArcContent />;
    default: return null;
  }
}

// --- Content Components (Based on Screenshots) ---

function WorldviewContent() {
  return (
    <div className="flex flex-col space-y-3 w-full py-1 flex-1 min-h-0">
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-2.5 flex items-center gap-6 max-w-3xl mx-auto shadow-[0_0_20px_rgba(34,197,94,0.1)] shrink-0">
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-sans font-bold text-green-500 mb-0.5 tracking-[0.2em] uppercase">世界观解析协议已就绪</h3>
          <p className="text-muted-text text-sm font-sans">深度推演引擎已完成底层架构映射，请审阅核心设定。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 overflow-hidden">
        <Section title="核心法则" icon={Zap} items={[
          { label: "力量体系", icon: Flame, val: "无超自然力量，核心优势为重生者携带的现代公关、危机管理、项目管理、舆情引导思维，通过适配秦代的竹简、斥候、工匠体系实现降维打击。" },
          { label: "物理规律", icon: Scale, val: "完全遵循战国末期至秦代的物理规律，无超自然现象，重力、温度、力学等与现实古代中国一致。" },
          { label: "逻辑奇点", icon: Sparkles, val: "以秦代现有生产工具为载体，将现代管理、公关、营销思维转化为可落地的古代操作方案。" }
        ]} />
        
        <Section title="地理生态" icon={MapIcon} items={[
          { label: "疆域版图", icon: Mountain, val: "覆盖战国末期至秦统一后的疆域，北至河套、辽东郡，南至象郡、桂林郡，西至临洮，中原腹地有关中平原、关东六国旧地。" },
          { label: "天候系统", icon: Wind, val: "整体为温带季风气候，关中、中原冬季寒冷干燥，夏季炎热多雨；南方百越地区湿热多雨；北方草原地区昼夜温差大。" },
          { label: "自然馈赠", icon: Globe, val: "关中、蜀地为核心粮食产区，盛产粟、稻；河东、蜀地有丰富的盐矿与铁矿；燕齐地区盛产海盐。" }
        ]} />

        <Section title="社会结构" icon={Database} items={[
          { label: "权力中枢", icon: Shield, val: "秦代中央集权制，三公九卿制与郡县制并行，统一后推行书同文、车同轨、统一度量衡，前期朝堂分为宗室派、军功派、文臣派等势力。" },
          { label: "经济命脉", icon: Coins, val: "以小农经济为核心，推行重农抑商政策，盐铁官营，统一货币为半两钱，主角通过现代市场营销思维推广统一农具。" },
          { label: "阶级秩序", icon: Users, val: "沿用秦代二十等爵制，以军功、农耕贡献为主要晋升标准，同时引入现代绩效考核逻辑调整爵位授予规则。" }
        ]} />
      </div>
    </div>
  );
}

function CharactersContent() {
  const chars = [
    { name: "赢扶苏", role: "主角", img: "https://picsum.photos/seed/chinese-nobleman-portrait/600/800", desc: "现代顶尖公关公司CEO重生为秦公子扶苏，性格冷静务实、擅于舆情引导与资源整合，目标是通过现代管理、公关思维扭转秦二世而亡的结局。" },
    { name: "张苍", role: "导师", img: "https://picsum.photos/seed/chinese-scholar-ancient/600/800", desc: "原秦廷御史，精通秦代典制与律法，性格严谨刻板、恪守官规，目标是辅佐扶苏推行合规新政，纠正秦政的严苛弊端。" },
    { name: "赵高", role: "对手", img: "https://picsum.photos/seed/chinese-eunuch-villain/600/800", desc: "秦廷中车府令，擅于揣摩上意、玩弄权术，性格阴险狡诈、野心勃勃，目标是掌控大秦朝政，扶持傀儡皇帝以专权。" },
    { name: "王离", role: "配角", img: "https://picsum.photos/seed/chinese-general-armor/600/800", desc: "秦大将军王翦之孙，承袭武成侯爵位，性格刚直勇猛、重视军功秩序，目标是维护军功集团的二十等爵制利益。" },
    { name: "郑国", role: "配角", img: "https://picsum.photos/seed/ancient-dam-construction/600/800", desc: "原韩国水工，受命主持修建郑国渠，性格专注务实、不善言辞 but 精通水利工程，目标是完成郑国渠的后续修缮与推广。" }
  ];

  return (
    <div className="flex flex-col h-full py-0 overflow-hidden min-h-0">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-2xl mx-auto shrink-0 mb-4"
      >
        <h3 className="text-xl font-sans font-bold text-text-main mb-1 tracking-[0.2em] uppercase">主要角色生成完成</h3>
        <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">基于世界观设定，AI 正在生成 3-5 个主要角色...</p>
      </motion.div>

      <div className="flex-1 flex flex-row gap-6 w-full max-w-[1440px] mx-auto px-4 min-h-0 overflow-hidden">
        {/* Left: Fixed Sidebar Container */}
        <div className="w-48 shrink-0 flex flex-col min-h-0 pb-12">
          <div className="flex-1 bg-panel-bg/20 border border-hud-border/30 rounded-3xl backdrop-blur-md border-dashed flex flex-col items-center justify-center p-4 relative group hover:border-brand-red/30 transition-all duration-500">
            <div className="absolute top-4 left-4 px-2 py-0.5 border border-hud-border/50 rounded text-[9px] font-sans text-muted-text/50 uppercase tracking-tighter">
              Char Slot
            </div>
            <div className="w-12 h-12 rounded-full bg-hud-border/10 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-text/30 group-hover:text-brand-red/50 transition-colors" />
            </div>
            <span className="text-[10px] font-sans font-bold text-muted-text/30 uppercase tracking-[0.2em] text-center leading-relaxed">
              待加载<br/>角色索引
            </span>
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-red/0 group-hover:border-brand-red/40 transition-colors" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-red/0 group-hover:border-brand-red/40 transition-colors" />
          </div>
        </div>

        {/* Vertical Scrollable Gallery */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 scrollbar-none scroll-smooth min-h-0 min-w-0"
        >
          <div className="w-full max-w-5xl mx-auto py-12 space-y-24">
          {chars.map((c, idx) => (
            <Fragment key={c.name}>
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: idx * 0.1,
                  ease: [0.23, 1, 0.32, 1] 
                }}
                className="w-full aspect-video bg-panel-bg/40 border border-hud-border/30 rounded-3xl overflow-hidden group hover:border-brand-red/50 transition-all duration-500 shadow-2xl flex relative select-none"
              >
                {/* Left: Image (Vertical 3:4 Ratio) */}
                <div className="w-[42%] h-full relative overflow-hidden pointer-events-none border-r border-hud-border/20 shrink-0">
                  <img 
                    src={c.img} 
                    alt={c.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.8] group-hover:grayscale-0 sepia-[0.2] group-hover:sepia-0"
                    referrerPolicy="no-referrer"
                  />
                  {/* Scanning Animation Effect */}
                  <motion.div 
                    initial={{ top: "-100%" }}
                    whileInView={{ top: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1), ease: "linear", repeat: 0 }}
                    className="absolute inset-x-0 h-1 bg-brand-red shadow-[0_0_15px_#DC2626] z-10 opacity-60"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-panel-bg via-transparent to-transparent opacity-80" />
                  <div className="absolute top-6 left-6">
                    <span className="text-xs font-sans font-bold text-brand-red bg-brand-red/10 border border-brand-red/30 px-3 py-1 rounded-lg uppercase tracking-[0.2em] backdrop-blur-md">{c.role}</span>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 p-8 lg:p-14 flex flex-col pointer-events-none relative justify-center">
                  <div className="mb-8">
                    <motion.h4 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                      className="text-4xl lg:text-5xl font-sans font-bold text-text-main mb-3 uppercase tracking-widest group-hover:text-brand-red transition-colors"
                    >
                      {c.name}
                    </motion.h4>
                    <div className="flex gap-4 items-center">
                      <div className="flex gap-2">
                        <span className="text-xs font-mono text-brand-red/60 uppercase tracking-tighter">身份已确认</span>
                        <div className="w-1 h-1 rounded-full bg-brand-red/40 self-center" />
                        <span className="text-xs font-mono text-muted-text uppercase tracking-tighter">零柒级核心成员</span>
                      </div>
                      <div className="h-px w-12 bg-hud-border/30" />
                      <span className="text-xs font-mono text-muted-text/40">存档编号: 墨-{idx+2024}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-h-[40%] overflow-hidden flex flex-col justify-center">
                    <div className="text-xs font-sans text-muted-text uppercase tracking-[0.3em] mb-4 opacity-40">主要事迹及人物侧写</div>
                    <p className="text-text-main/80 text-lg lg:text-xl leading-relaxed font-sans group-hover:text-text-main transition-colors duration-700 max-w-2xl line-clamp-4">{c.desc}</p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-hud-border/10 flex items-center justify-between shrink-0">
                    <div className="flex gap-16">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono text-muted-text/50 uppercase tracking-widest">社会影响力</span>
                        <span className="text-xl font-sans font-bold text-text-main tracking-widest">A+ 同步</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono text-muted-text/50 uppercase tracking-widest">系统危险等级</span>
                        <span className="text-xl font-sans font-bold text-brand-red tracking-widest">陆级 警戒</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-full border border-hud-border/30 flex items-center justify-center relative overflow-hidden group-hover:border-brand-red/50 transition-colors">
                      <div className="absolute inset-0 bg-brand-red/5 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                    </div>
                  </div>
                </div>

                {/* Grid Background Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 bg-[radial-gradient(#DC2626_1px,transparent_1px)] [background-size:20px_20px]" />
                
                {/* Bottom Decorative Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red/20 via-brand-red to-brand-red/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-1000" />
              </motion.div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}

function MapContent() {
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);

  const locations = [
    { name: "大秦都城咸阳", type: "核心枢纽", color: "#DC2626", img: "https://picsum.photos/seed/xianyang/400/400", desc: "秦统一后的核心都城，位于关中平原渭水北岸，分为宫城、外郭官署区与市井商圈。" },
    { name: "廷尉府", type: "政务官署", color: "#3B82F6", img: "https://picsum.photos/seed/tingwei/400/400", desc: "大秦最高司法与监察官署，负责百官考核、案件审理与舆情稽查。" },
    { name: "渭水码头", type: "物资补给", color: "#F97316", img: "https://picsum.photos/seed/wharf/400/400", desc: "重要的物资集散地，秦统一后作为漕运枢纽，连接关中与关东，是帝国物流命脉。" },
    { name: "咸阳宫", type: "皇权中心", color: "#A855F7", img: "https://picsum.photos/seed/palace/400/400", desc: "大秦帝国皇宫，包含前朝朝会区、后宫寝殿与九卿官署附楼，是皇帝与朝臣议事的核心。" },
    { name: "上郡大营", type: "军事要塞", color: "#22C55E", img: "https://picsum.photos/seed/camp/400/400", desc: "大秦在北方边境的核心军备中心，扶苏与蒙恬统领三十万大军抵御匈奴的最高指挥部。" },
    { name: "郑国渠", type: "农田水利", color: "#EAB308", img: "https://picsum.photos/seed/canal/400/400", desc: "战国末年修建的大型水利工程，使关中平原成为沃野，为秦国的统一战争提供了坚实的粮食基础。" }
  ];

  const currentLoc = locations.find(l => l.name === selectedLoc);

  return (
    <div className="flex flex-col space-y-3 py-1 h-full min-h-0 overflow-hidden">
      <div className="text-center shrink-0">
        <h3 className="text-xl font-sans font-bold text-text-main mb-1 tracking-[0.2em] uppercase">大秦都城咸阳</h3>
        <p className="text-muted-text text-[10px] tracking-widest uppercase opacity-60">地点分布预览（点击右侧卡片查看详情实景）</p>
      </div>
      
      {/* Dual Pane Layout */}
      <div className="grid lg:grid-cols-3 gap-6 flex-1 overflow-hidden min-h-0 items-stretch">
        {/* Left: 16:9 Map View */}
        <div className="lg:col-span-2 flex flex-col justify-center min-h-0 relative">
          <div className="bg-panel-bg/20 border border-hud-border/30 rounded-2xl p-4 lg:p-6 aspect-video relative overflow-hidden w-full shadow-2xl flex flex-col">
            <div className="flex-1 w-full min-h-0">
              <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Connections */}
                <g stroke="currentColor" strokeWidth="0.5" className="text-hud-border/40">
                  <line x1="400" y1="100" x2="250" y2="200" />
                  <line x1="400" y1="100" x2="550" y2="200" />
                  <line x1="400" y1="100" x2="400" y2="350" />
                  <line x1="250" y1="200" x2="150" y2="300" />
                  <line x1="550" y1="200" x2="650" y2="300" />
                </g>
                {/* Nodes */}
                <circle cx="400" cy="100" r={selectedLoc === "大秦都城咸阳" ? 15 : 10} className="fill-brand-red transition-all duration-300" filter="url(#glow)" />
                <circle cx="250" cy="200" r={selectedLoc === "廷尉府" ? 12 : 8} className="fill-blue-500 transition-all duration-300" />
                <circle cx="550" cy="200" r={selectedLoc === "渭水码头" ? 12 : 8} className="fill-orange-500 transition-all duration-300" />
                <circle cx="400" cy="350" r={selectedLoc === "咸阳宫" ? 12 : 8} className="fill-purple-500 transition-all duration-300" />
                <circle cx="150" cy="300" r={selectedLoc === "上郡大营" ? 12 : 8} className="fill-green-500 transition-all duration-300" />
                <circle cx="650" cy="300" r={selectedLoc === "郑国渠" ? 12 : 8} className="fill-yellow-500 transition-all duration-300" />
                
                {/* Labels */}
                <text x="400" y="75" textAnchor="middle" className="fill-text-main text-[12px] font-sans font-bold uppercase tracking-widest">中央枢纽：咸阳</text>
                <text x="250" y="180" textAnchor="middle" className="fill-muted-text text-[10px]">廷尉府</text>
                <text x="550" y="180" textAnchor="middle" className="fill-muted-text text-[10px]">渭水码头</text>
                <text x="400" y="380" textAnchor="middle" className="fill-muted-text text-[10px]">咸阳宫</text>
                <text x="150" y="330" textAnchor="middle" className="fill-muted-text text-[10px]">上郡大营</text>
                <text x="650" y="330" textAnchor="middle" className="fill-muted-text text-[10px]">郑国渠</text>
              </svg>
            </div>
            
            {/* Map Decorative Elements */}
            <div className="absolute bottom-4 left-6 flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-red" />
                <span className="text-xs font-mono text-muted-text uppercase">核心</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-mono text-muted-text uppercase">政务</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-xs font-mono text-muted-text uppercase">补给</span>
              </div>
            </div>
          </div>

          {/* Location Preview Popup */}
          <AnimatePresence>
            {selectedLoc && currentLoc && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute inset-0 z-20 flex items-center justify-center p-8 pointer-events-none"
              >
                <div className="w-full aspect-video bg-app-bg/90 border-2 border-brand-red rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)] pointer-events-auto relative group">
                  <img src={currentLoc.img.replace('400/400', '1920/1080')} alt={currentLoc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-app-bg via-transparent to-transparent" />
                  
                  {/* Info Overlay */}
                  <div className="absolute bottom-6 left-8 right-8">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-sans font-bold text-text-main uppercase tracking-widest">{currentLoc.name}</h4>
                      <span className="px-3 py-1 rounded text-[10px] font-bold tracking-widest text-white" style={{ backgroundColor: currentLoc.color }}>{currentLoc.type}</span>
                    </div>
                    <p className="text-muted-text text-xs max-w-xl leading-relaxed">{currentLoc.desc}</p>
                  </div>

                  {/* Close Button */}
                  <button 
                    onClick={() => setSelectedLoc(null)}
                    className="absolute top-6 right-6 w-10 h-10 bg-black/50 hover:bg-brand-red transition-colors rounded-full flex items-center justify-center backdrop-blur-md border border-white/20"
                  >
                    <span className="text-white text-xl">×</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Scrollable Location List */}
        <div className="lg:col-span-1 flex flex-col min-h-0 bg-panel-bg/10 rounded-2xl border border-hud-border/20 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-hud-border/20 bg-hud-border/5 shrink-0 flex items-center justify-between">
            <h4 className="text-xs font-sans font-bold tracking-[0.2em] text-muted-text uppercase">关键地点索引</h4>
            <span className="text-xs font-mono text-muted-text opacity-40">{locations.length} 个节点</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {locations.map((loc, idx) => (
              <motion.div
                key={loc.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <LocationItem 
                  {...loc} 
                  isSelected={selectedLoc === loc.name}
                  onClick={() => setSelectedLoc(loc.name === selectedLoc ? null : loc.name)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StorylineContent({ selected, onSelect }: { selected: number | null; onSelect: (id: number) => void }) {
  const lines = [
    { id: 1, tag: "底层生存逆袭", title: "临尘戍变的翻盘局", img: "https://picsum.photos/seed/border/800/600", desc: "重生为扶苏的赢扶苏抵达南境临尘城，既要平息移民与百越土著的械斗，又要对抗赵高与军功集团的破坏，用现代公关思维扭转危局。" },
    { id: 2, tag: "高层黑箱博弈", title: "咸阳宫的伪诏迷局", img: "https://picsum.photos/seed/palace/800/600", desc: "扶苏在咸阳宫协助始皇处理政务时，发现赵高篡改军粮调度令、控制始皇病情的黑箱阴谋，必须赶在沙丘之变前揭露真相。" },
    { id: 3, tag: "舆情异数觉醒", title: "能知民心的异数公子", img: "https://picsum.photos/seed/crowd/800/600", desc: "扶苏发现自己能通过民间歌谣、乡老汇报精准预判舆情走向，这种现代公关的能力被保守派视为妖术，他必须隐藏秘密推行新政。" }
  ];

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-xl font-sans font-bold text-text-main mb-1 tracking-[0.2em] uppercase">确立故事主轴</h3>
        <p className="text-muted-text text-[13px] font-sans">基于你确认的世界观、人物与地图，系统推演三条可选主线方向。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lines.map(line => (
          <button
            key={line.id}
            onClick={() => onSelect(line.id)}
            className={`
              relative flex flex-col rounded-2xl border text-left transition-all group overflow-hidden
              ${selected === line.id ? 'bg-brand-red/10 border-brand-red shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'bg-panel-bg/40 border-hud-border/30 hover:border-brand-red/30'}
            `}
          >
            <div className="aspect-video relative overflow-hidden">
              <img src={line.img} alt={line.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
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

function PlotArcContent() {
  return (
    <div className="flex flex-col items-center justify-start space-y-8 py-6 text-center flex-1">
      <div className="relative inline-block shrink-0">
        <Activity className="w-16 h-16 text-brand-red mx-auto mb-4" />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-brand-red/20 blur-3xl rounded-full"
        />
      </div>
      
      <div className="shrink-0">
        <h3 className="text-3xl font-sans font-bold text-text-main mb-4 tracking-[0.2em] uppercase">设计情节弧线</h3>
        <p className="text-lg font-sans italic opacity-80">规划故事的起承转合，设置关键剧情点和张力变化。</p>
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
        {items.map(item => (
          <div key={item.label} className="relative pl-10 border-l border-hud-border/20 hover:border-brand-red/30 transition-colors">
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
