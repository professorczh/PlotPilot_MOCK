import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Loader2, 
  Users, Map as MapIcon, Zap, Activity, 
  ArrowRight, Database, Globe, Shield, Coins, Scale, Mountain, Wind, Flame, Sparkles
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  storyTitle: string;
}

type StepStatus = 'thinking' | 'reviewing' | 'completed';

export default function Onboarding({ onComplete, storyTitle }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<StepStatus>('thinking');
  const [thinkingText, setThinkingText] = useState('');
  const [selectedStoryline, setSelectedStoryline] = useState<number | null>(null);

  // Simulated LLM Thinking Logic
  useEffect(() => {
    if (status === 'thinking') {
      const texts = getThinkingTexts(currentStep);
      let i = 0;
      const interval = setInterval(() => {
        setThinkingText(texts[i % texts.length]);
        i++;
      }, 800);

      const timer = setTimeout(() => {
        setStatus('reviewing');
        clearInterval(interval);
      }, 3000); // 3s of "thinking"

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [currentStep, status]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      setStatus('thinking');
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setStatus('reviewing'); // No need to re-think when going back
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
    <div className="h-screen bg-app-bg text-text-main font-sans flex flex-col relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')] mix-blend-overlay" />
      </div>

      {/* Compact Fixed Header */}
      <header className="fixed top-0 left-0 w-full p-4 px-8 border-b border-hud-border/30 bg-panel-bg/40 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-12">
          <div className="flex items-center gap-4 shrink-0">
            <h1 className="text-2xl font-display font-bold tracking-[0.2em] text-text-main whitespace-nowrap uppercase">新书设置向导</h1>
            <div className="h-4 w-[1px] bg-hud-border/50" />
            <div className="text-sm font-mono text-muted-text tracking-[0.2em] uppercase opacity-60">
              {storyTitle || "墨枢"}
            </div>
          </div>
          
          <div className="flex-1 flex justify-between relative max-w-3xl">
            {/* Progress Line */}
            <div className="absolute top-4 left-0 w-full h-[1px] bg-hud-border/20 -z-10" />
            <motion.div 
              className="absolute top-4 left-0 h-[1px] bg-brand-red shadow-[0_0_10px_#DC2626] -z-10"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />

            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 text-sm
                  ${currentStep > step.id ? 'bg-brand-red border-brand-red text-white' : 
                    currentStep === step.id ? 'bg-panel-bg border-brand-red text-brand-red shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 
                    'bg-panel-bg border-hud-border text-muted-text'}
                `}>
                  {currentStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : <span className="font-display font-bold">{step.id}</span>}
                </div>
                <div className={`text-sm font-medium ${currentStep === step.id ? 'text-text-main' : 'text-muted-text/60'}`}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative z-10 pt-24 pb-24">
        <div className="w-full h-full px-8 lg:px-12 flex flex-col">
          <AnimatePresence mode="wait">
            {status === 'thinking' ? (
              <ThinkingState key="thinking" text={thinkingText} step={currentStep} />
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {renderStepContent(currentStep, selectedStoryline, setSelectedStoryline)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Actions - Dual Navigation */}
      {status === 'reviewing' && (
        <footer className="fixed bottom-0 left-0 w-full p-8 bg-gradient-to-t from-app-bg via-app-bg to-transparent z-30 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-between pointer-events-auto">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`
                group flex items-center gap-2 px-8 py-3 rounded-xl font-display font-bold tracking-widest transition-all
                ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-panel-bg border border-hud-border text-muted-text hover:text-text-main hover:border-text-main'}
              `}
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span>上一步</span>
            </button>

            <button
              onClick={handleNext}
              className="group flex items-center gap-2 bg-brand-red text-white px-8 py-3 rounded-xl font-display font-bold tracking-[0.2em] text-xs hover:bg-red-700 transition-all shadow-[0_10px_30px_rgba(220,38,38,0.2)] active:scale-95"
            >
              <span>{currentStep === 5 ? '完成设置' : '下一步'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

// --- Sub-components ---

function ThinkingState({ text, step }: { text: string; step: number; key?: string }) {
  const icons = [Database, Users, MapIcon, Zap, Activity];
  const Icon = icons[step - 1];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[60vh] flex flex-col items-center justify-center text-center"
    >
      <div className="relative mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-t-2 border-brand-red/30 border-r-2 border-brand-red/10"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-10 h-10 text-brand-red animate-pulse" />
        </div>
      </div>
      <h2 className="text-3xl font-display font-bold text-text-main mb-4 tracking-[0.2em] uppercase">
        {getStepTitle(step)}
      </h2>
      <div className="flex items-center gap-3 text-muted-text font-mono text-lg">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="tracking-[0.2em] uppercase">{text}</span>
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
    <div className="h-full flex flex-col justify-center space-y-12 w-full">
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 flex items-center gap-6 max-w-3xl mx-auto shadow-[0_0_20px_rgba(34,197,94,0.1)] shrink-0">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-green-500 mb-1 tracking-[0.2em] uppercase">世界观解析协议已就绪</h3>
          <p className="text-muted-text text-lg font-serif">深度推演引擎已完成底层架构映射，请审阅核心设定。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-hidden">
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
    { name: "赢扶苏", role: "主角", img: "https://picsum.photos/seed/fusu/600/800", desc: "现代顶尖公关公司CEO重生为秦公子扶苏，性格冷静务实、擅于舆情引导与资源整合，目标是通过现代管理、公关思维扭转秦二世而亡的结局。" },
    { name: "张苍", role: "导师", img: "https://picsum.photos/seed/zhang/600/800", desc: "原秦廷御史，精通秦代典制与律法，性格严谨刻板、恪守官规，目标是辅佐扶苏推行合规新政，纠正秦政的严苛弊端。" },
    { name: "赵高", role: "对手", img: "https://picsum.photos/seed/zhao/600/800", desc: "秦廷中车府令，擅于揣摩上意、玩弄权术，性格阴险狡诈、野心勃勃，目标是掌控大秦朝政，扶持傀儡皇帝以专权。" },
    { name: "王离", role: "配角", img: "https://picsum.photos/seed/wang/600/800", desc: "秦大将军王翦之孙，承袭武成侯爵位，性格刚直勇猛、重视军功秩序，目标是维护军功集团的二十等爵制利益。" },
    { name: "郑国", role: "配角", img: "https://picsum.photos/seed/zheng/600/800", desc: "原韩国水工，受命主持修建郑国渠，性格专注务实、不善言辞 but 精通水利工程，目标是完成郑国渠的后续修缮与推广。" }
  ];

  return (
    <div className="h-full flex flex-col justify-center space-y-12">
      <div className="text-center max-w-2xl mx-auto shrink-0">
        <h3 className="text-3xl font-display font-bold text-text-main mb-3 tracking-[0.2em] uppercase">主要角色生成完成</h3>
        <p className="text-muted-text text-sm tracking-[0.3em] uppercase opacity-80">基于世界观设定，AI 正在生成 3-5 个主要角色...</p>
      </div>

      {/* Horizontal Scroll Gallery - Centered */}
      <div className="flex justify-center gap-8 overflow-x-auto pb-8 custom-scrollbar snap-x w-full">
        {chars.map(c => (
          <div key={c.name} className="min-w-[320px] w-[320px] snap-center bg-panel-bg/40 border border-hud-border/30 rounded-2xl overflow-hidden group hover:border-brand-red/50 transition-all duration-500 shadow-2xl flex flex-col">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img 
                src={c.img} 
                alt={c.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-panel-bg via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-mono text-brand-red bg-brand-red/10 border border-brand-red/30 px-2 py-0.5 rounded uppercase tracking-widest">{c.role}</span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-display font-bold text-text-main mb-3 uppercase tracking-wider">{c.name}</h4>
              <p className="text-muted-text text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapContent() {
  return (
    <div className="h-full flex flex-col justify-between space-y-6">
      <div className="text-center shrink-0">
        <h3 className="text-2xl font-display font-bold text-text-main mb-2 tracking-[0.2em] uppercase">大秦都城咸阳</h3>
        <p className="text-muted-text text-xs tracking-widest uppercase opacity-60">地点分布预览（按类型着色；线表示同一书世界观下的关联占位）</p>
      </div>
      
      {/* SVG Map Visualization - Reduced Height */}
      <div className="bg-panel-bg/20 border border-hud-border/30 rounded-2xl p-6 aspect-[21/7] max-h-[45vh] relative overflow-hidden w-full flex-1">
        <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="xMidYMid meet">
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
            <line x1="400" y1="50" x2="200" y2="150" />
            <line x1="400" y1="50" x2="600" y2="150" />
            <line x1="400" y1="50" x2="400" y2="250" />
            <line x1="200" y1="150" x2="100" y2="250" />
            <line x1="600" y1="150" x2="700" y2="250" />
          </g>
          {/* Nodes */}
          <circle cx="400" cy="50" r="8" className="fill-brand-red" filter="url(#glow)" />
          <circle cx="200" cy="150" r="6" className="fill-blue-500" />
          <circle cx="600" cy="150" r="6" className="fill-orange-500" />
          <circle cx="400" cy="250" r="6" className="fill-purple-500" />
          <circle cx="100" cy="250" r="6" className="fill-green-500" />
          <circle cx="700" cy="250" r="6" className="fill-yellow-500" />
          
          {/* Labels */}
          <text x="400" y="30" textAnchor="middle" className="fill-text-main text-[10px] font-display font-bold uppercase tracking-widest">大秦都城咸阳</text>
          <text x="200" y="135" textAnchor="middle" className="fill-muted-text text-[10px]">廷尉府</text>
          <text x="600" y="135" textAnchor="middle" className="fill-muted-text text-[10px]">渭水码头</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <LocationItem name="大秦都城咸阳" type="城市" desc="秦统一后的核心都城，位于关中平原渭水北岸，分为宫城、外郭官署区与市井商圈。" />
        <LocationItem name="咸阳宫" type="建筑（宫殿群）" desc="大秦帝国皇宫，包含前朝朝会区、后宫寝殿与九卿官署附楼，是皇帝与朝臣议事的核心场所。" />
        <LocationItem name="廷尉府" type="建筑（官署）" desc="大秦最高司法与监察官署，负责百官考核、案件审理与舆情稽查。" />
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
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-display font-bold text-text-main mb-2 tracking-[0.2em] uppercase">确立故事主轴</h3>
        <p className="text-muted-text text-sm">基于你确认的世界观、人物与地图，系统推演三条可选主线方向。</p>
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
              <h4 className="text-lg font-display font-bold text-text-main mb-3 group-hover:text-brand-red transition-colors uppercase tracking-wider">{line.title}</h4>
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
    <div className="h-full flex flex-col items-center justify-center space-y-16 py-8 text-center">
      <div className="relative inline-block shrink-0">
        <Activity className="w-20 h-20 text-brand-red mx-auto mb-8" />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-brand-red/20 blur-3xl rounded-full"
        />
      </div>
      
      <div className="shrink-0">
        <h3 className="text-5xl font-display font-bold text-text-main mb-6 tracking-[0.2em] uppercase">设计情节弧线</h3>
        <p className="text-muted-text text-2xl font-serif italic opacity-80">规划故事的起承转合，设置关键剧情点和张力变化。</p>
      </div>

      <div className="w-full max-w-2xl mx-auto space-y-8 text-left bg-panel-bg/20 p-12 rounded-3xl border border-hud-border/20 backdrop-blur-sm">
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
      <div className="bg-hud-border/10 px-8 py-6 border-b border-hud-border/30 flex items-center justify-between">
        <h4 className="text-lg font-display font-bold tracking-[0.3em] text-muted-text uppercase">{title}</h4>
        <Icon className="w-5 h-5 text-brand-red/50 group-hover:text-brand-red transition-colors" />
      </div>
      <div className="p-8 space-y-12 flex-1">
        {items.map(item => (
          <div key={item.label} className="relative pl-10 border-l border-hud-border/20 hover:border-brand-red/30 transition-colors">
            {item.icon && (
              <div className="absolute -left-4 top-0 w-8 h-8 bg-app-bg border border-hud-border/30 rounded-full flex items-center justify-center shadow-lg">
                <item.icon className="w-4 h-4 text-brand-red" />
              </div>
            )}
            <div className="text-lg font-display font-bold text-brand-red tracking-[0.2em] mb-2 uppercase">{item.label}</div>
            <p className="text-text-main text-sm leading-relaxed font-serif opacity-80">{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationItem({ name, type, desc }: { name: string; type: string; desc: string }) {
  return (
    <div className="bg-panel-bg/40 border border-hud-border/30 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base font-display font-bold text-text-main uppercase tracking-wider">{name}</h4>
        <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase">{type}</span>
      </div>
      <p className="text-muted-text text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function ArcItem({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex items-center gap-8">
      <div className="w-20 text-right text-lg font-mono text-brand-red uppercase tracking-widest font-bold">{label}</div>
      <div className="h-[1px] flex-1 bg-brand-red/30" />
      <div className="text-2xl text-text-main font-serif tracking-wide">{val}</div>
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
