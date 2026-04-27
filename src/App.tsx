/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, Group, Separator, useDefaultLayout } from 'react-resizable-panels';
import { Sparkles } from 'lucide-react';
import type { Layout } from 'react-resizable-panels';
import { cn } from './lib/utils';
import ActivityBar from './components/ActivityBar';
import AIActivityBar from './components/AIActivityBar';
import { SidebarHeader, MainHeader } from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AIPanel from './components/AIPanel';
import AgentCoreView from './components/AgentCoreView';
import { ProcessMonitor } from './components/ProcessMonitor';
import AnalyticsPanel from './components/AnalyticsPanel';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';
import SettingsModal from './components/SettingsModal';
import BranchPanel from './components/BranchPanel';
import { FloatingAgent } from './components/FloatingAgent'; 
import { Chapter, NovelBook, SidebarTab, AgentMessage, ThemeMode, AgentStatus } from './types';

const INITIAL_BOOK: NovelBook = {
  id: 'book_1',
  title: '秦土潜龙：耕战与律法',
  volumes: [
    {
      id: 'vol_1',
      title: '楚地求生卷',
      stages: [
        {
          id: 'stage_1',
          title: '卷一、改',
          description: '林墨改良农具救活庄稼，被伍老赏识，觉察异样，李拓为求爵位主动庇护并教导秦律。',
          chapters: [
            { id: '1', title: '第1章 荒野之变', status: 'completed', wordCount: 4796, content: '<p>林墨揪着被巴邑的数学练习册从教学楼后侧的杂物巷走出来的时候，帆布鞋尖还沾着张磊刚泼在地上的矿泉水印。左脸的巴掌印热辣辣地疼，黑框眼镜的镜腿刚才被打的时候蹬了一道划痕，架在鼻梁上总往下滑。他不敢去医务室，更不敢找老师，去年有个高一的学生告张磊霸凌，转头就被安了个“寻衅滋事”的名头劝退，谁都知道张磊他爸是学校的大金主，校领导都要让三分。</p>' },
            { id: '2', title: '第2章 暗流涌动', status: 'completed', wordCount: 4694, content: '<p>内容加载中...</p>' },
            { id: '3', title: '第3章 利益交换', status: 'completed', wordCount: 4333, content: '<p>内容加载中...</p>' },
            { id: '4', title: '第4章 律法之教', status: 'completed', wordCount: 4275, content: '<p>内容加载中...</p>' },
            { id: '5', title: '第5章 初显峥嵘', status: 'completed', wordCount: 3992, content: '<p>内容加载中...</p>' },
          ]
        },
        {
          id: 'stage_2',
          title: '卷二、织',
          description: '林墨为阿拾改良织机以应付苛捐，被郡尉赵亥盯上，赵亥以“六国细作”罪名进行盘查。',
          chapters: [
            { id: '6', title: '第6章 机杼变法', status: 'draft', wordCount: 0, content: '' },
            { id: '7', title: '第7章 织机惊梦', status: 'draft', wordCount: 0, content: '' },
            { id: '8', title: '第8章 酷吏入村', status: 'draft', wordCount: 0, content: '' },
            { id: '9', title: '第9章 莫须之罪', status: 'draft', wordCount: 0, content: '' },
            { id: '10', title: '第10章 危局待解', status: 'draft', wordCount: 0, content: '' },
          ]
        }
      ]
    }
  ]
};

type ViewState = 'landing' | 'onboarding' | 'editor';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [book, setBook] = useState<NovelBook>(INITIAL_BOOK);
  const [activeChapterId, setActiveChapterId] = useState('1');
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('chapters');
  const [activeAITab, setActiveAITab] = useState<SidebarTab>('ai-chat');
  // Re-enabling layout persistence with a fresh, stable production ID
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'PLOT_PILOT_STABLE_V6',
    storage: localStorage,
  });

  // Sidebar expanded state 
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([
    { 
      id: 'msg_init',
      role: 'ai', 
      content: '你好！我是墨枢灵感 Agent。我将协助你完成新书的设定。目前我们正在进行“世界观”构建，如果你有任何关于设定细节的疑问，或者需要我提供更多创意，请随时告诉我。',
      timestamp: '14:20'
    }
  ]);

  // Helper to simulate a complex Agent reasoning process
  const simulateAgentTraceResponse = (text: string, context: 'world' | 'character' | 'map' | 'plot' | 'general' = 'general') => {
    const traceTemplates = {
      world: [
        { id: 't1', label: '检索大秦因果冲突模型', type: 'search' as const },
        { id: 't2', label: '校验秦律与灵气复苏的耦合度', type: 'check' as const },
        { id: 't3', label: '正在演化咸阳地宫能量中枢参数', type: 'evolve' as const },
        { id: 't4', label: '聚合地理异化设定建议', type: 'aggregate' as const },
      ],
      character: [
        { id: 'c1', label: '分析重生者性格偏移量', type: 'logic' as const },
        { id: 'c2', label: '校验反派技能树冲突', type: 'check' as const },
        { id: 'c3', label: '拟合大秦古风台词模型', type: 'evolve' as const },
        { id: 'c4', label: '生成人物弧光延展方案', type: 'aggregate' as const },
      ],
      map: [
        { id: 'm1', label: '获取关中水文特征数据', type: 'search' as const },
        { id: 'm2', label: '识别函谷关军事灵力节点', type: 'check' as const },
        { id: 'm3', label: '渲染板块断裂带视觉描述', type: 'evolve' as const },
      ],
      plot: [
        { id: 'p1', label: '检索起承转合关键张力点', type: 'logic' as const },
        { id: 'p2', label: '正在校验情节逻辑自洽性', type: 'check' as const },
        { id: 'p3', label: '模拟高潮冲突爆发波向', type: 'evolve' as const },
      ],
      general: [
        { id: 'g1', label: '正在理解用户意图', type: 'logic' as const },
        { id: 'g2', label: '正在跨维度检索设定库', type: 'search' as const },
        { id: 'g3', label: '正在合成逻辑闭环建议', type: 'aggregate' as const },
      ]
    };

    const initialSteps = traceTemplates[context].map((s, idx) => ({ 
      ...s, 
      status: (idx === 0 ? 'thinking' : 'pending') as any 
    }));
    
    // Create mock suggestions to show within the Agent message
    const mockSuggestions = [
      { 
        id: 's_01', 
        title: '候选方案_01', 
        isRecommended: true,
        content: '“秘密基地不仅是一个藏身处，更是一个时空锚点。当主角林墨踏入此地，周围的空气开始液化，历史的重影在此交叠...”'
      },
      { 
        id: 's_02', 
        title: '候选方案_02', 
        isRecommended: false,
        content: '张磊的挑衅其实是“暗影”组织的一次压力测试，旨在观测主角在极端情绪下的灵力波动数值。'
      }
    ];

    const messageId = `ai-${Date.now()}`;

    // Add the thinking message
    const thinkingMsg: AgentMessage = { 
      id: messageId,
      role: 'ai', 
      text: '', 
      trace: initialSteps, 
      isThinking: true 
    };
    
    setAgentMessages(prev => [...prev, thinkingMsg]);

    // Animate the steps starting from the second one
    let currentStepIndex = 1;
    const interval = setInterval(() => {
      setAgentMessages(prev => {
        const msgIndex = prev.findIndex(m => m.id === messageId);
        if (msgIndex === -1) {
          clearInterval(interval);
          return prev;
        }
        
        const targetMsg = prev[msgIndex];
        if (!targetMsg.trace) return prev;
        
        const isLastTick = currentStepIndex >= initialSteps.length;
        
        const newTrace = targetMsg.trace.map((s, idx) => {
          if (idx < currentStepIndex) return { ...s, status: 'completed' as const };
          if (idx === currentStepIndex && !isLastTick) return { ...s, status: 'thinking' as const };
          return s;
        });

        const newMessages = [...prev];
        
        // Show suggestions earlier (when currentStepIndex is near completion)
        const shouldShowSuggestions = currentStepIndex >= initialSteps.length - 1;

        if (isLastTick) {
          clearInterval(interval);
          // Auto-finalize without waiting for next tick
          newMessages[msgIndex] = { 
            ...targetMsg, 
            isThinking: false, 
            trace: newTrace.map(s => ({ ...s, status: 'completed' as const })),
            text: text,
            suggestions: mockSuggestions
          };
        } else {
          newMessages[msgIndex] = { 
            ...targetMsg, 
            trace: newTrace,
            suggestions: shouldShowSuggestions ? mockSuggestions : undefined
          };
        }
        
        return newMessages;
      });

      currentStepIndex++;
    }, isMockLoadingEnabled ? 800 : 100);
  };

  const handleSendAgentMessage = (text: string) => {
    const newUserMsg: AgentMessage = { role: 'user', text };
    setAgentMessages(prev => [...prev, newUserMsg]);

    const responseText = `收到！关于你提到的“${text.substring(0, 10)}...”，我建议可以根据当前的推演方向进行更细致的延展。需要我为你生成具体的文本片段并填入草稿吗？`;
    
    // Mock context detection
    let context: any = 'general';
    if (text.includes('人') || text.includes('设定')) context = 'character';
    if (text.includes('图') || text.includes('地')) context = 'map';
    if (text.includes('世') || text.includes('界')) context = 'world';

    simulateAgentTraceResponse(responseText, context);
  };

  const handleAddAgentAIResponse = (text: string, context?: 'world' | 'character' | 'map' | 'plot' | 'general') => {
    // Force simulation for onboarding steps to ensure UI synchronization
    simulateAgentTraceResponse(text, context || 'general');
  };
  
  // Update sidebar expansion state based on its current size
  const handleSidebarResize = (size: { asPercentage: number }) => {
    const isCollapsed = size.asPercentage === 0;
    if (isCollapsed && isSidebarExpanded) setIsSidebarExpanded(false);
    else if (!isCollapsed && !isSidebarExpanded) setIsSidebarExpanded(true);
  };
  const [theme, setTheme] = useState<ThemeMode>('ink');
  const [isMockLoadingEnabled, setIsMockLoadingEnabled] = useState(true);
  const [currentStoryTitle, setCurrentStoryTitle] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyticsVisible, setIsAnalyticsVisible] = useState(false);
  const [isAnalyticsCollapsed, setIsAnalyticsCollapsed] = useState(false);
  const [analyticsHeight, setAnalyticsHeight] = useState(30);
  const [isAIPanelVisible, setIsAIPanelVisible] = useState(false);
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const isInternalToggleRef = useRef(false);
  const analyticsPanelRef = useRef<any>(null);
  const aiPanelRef = useRef<any>(null);
  const sidebarPanelRef = useRef<any>(null);
  
  const [novels, setNovels] = useState([
    { id: '1', title: '修真界的都市访客', lastEdited: '2小时前', wordCount: 1245, status: '连载中' },
    { id: '2', title: '赛博朋克：霓虹之雨', lastEdited: '昨天', wordCount: 45200, status: '已完结' },
  ]);

  // Scrollbar auto-show effect
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList?.contains('custom-scrollbar')) {
        target.classList.add('is-scrolling');
        
        // Use a persistent timeout on the element to avoid flickering
        const timeoutId = (target as any)._scrollTimeout;
        if (timeoutId) clearTimeout(timeoutId);
        
        (target as any)._scrollTimeout = setTimeout(() => {
          target.classList.remove('is-scrolling');
        }, 1200); 
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const [savedNovels, setSavedNovels] = useState([...novels]);

  const toggleMockData = () => {
    if (novels.length > 0) {
      setSavedNovels([...novels]);
      setNovels([]);
    } else {
      setNovels([...savedNovels]);
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove('light-theme', 'classic-theme');
    if (theme === 'paper') {
      document.documentElement.classList.add('light-theme');
    } else if (theme === 'classic') {
      document.documentElement.classList.add('classic-theme');
    }
  }, [theme]);

  const toggleTheme = (newTheme: ThemeMode) => setTheme(newTheme);
  const isDarkMode = theme === 'ink';

  const [groupHeight, setGroupHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const group = document.querySelector('[data-panel-group-id="middle-v-group"]');
      if (group) setGroupHeight(group.getBoundingClientRect().height);
    };

    const ob = new ResizeObserver(updateHeight);
    const target = document.querySelector('[data-panel-group-id="middle-v-group"]');
    if (target) ob.observe(target);
    updateHeight();
    return () => ob.disconnect();
  }, [isAnalyticsVisible]);

  const getHeaderPercentage = () => {
    if (groupHeight <= 0) return 6;
    // 70px accounts for the 48px header (h-12) + container padding (p-4 = 16px) + safe buffer
    return (70 / groupHeight) * 100;
  };

  const getContextHeaderPercentage = () => {
    return getHeaderPercentage();
  };

  const toggleAnalyticsVisibility = () => {
    setIsAnalyticsVisible(!isAnalyticsVisible);
  };

  const handleAnalyticsClose = () => {
    setIsAnalyticsVisible(false);
  };

  const handleOpenAgent = () => {
    setIsAgentMode(true);
    setAgentStatus('panel_open');
    if (aiPanelRef.current) {
      const isCollapsed = aiPanelRef.current.isCollapsed();
      if (isCollapsed) {
        aiPanelRef.current.expand(30);
      }
    }
  };

  const startAgentProcess = () => {
    setAgentStatus('starting');
    
    // Step 1: Initial Launch
    setTimeout(() => {
      setAgentStatus('running');
      
      const messageId = `agent_${Date.now()}`;
      const initialMessage: AgentMessage = {
        id: messageId,
        role: 'ai',
        content: '“墨枢”自动化协同推演模式已激活。正在扫描当前章节脉络与因果逻辑...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        trace: [
          { id: 'scan_1', label: '世界观稳定性因果校验', status: 'thinking', type: 'check' },
          { id: 'scan_2', label: '角色动机一致性检索', status: 'pending', type: 'check' },
          { id: 'scan_3', label: '高纬度剧情分支推演', status: 'pending', type: 'logic' }
        ]
      };

      setAgentMessages(prev => [...prev, initialMessage]);

      // Progress Trace Step 1 -> Completed, Step 2 -> Thinking
      setTimeout(() => {
        setAgentMessages(prev => prev.map(msg => 
          msg.id === messageId ? {
            ...msg,
            trace: msg.trace?.map(s => 
              s.id === 'scan_1' ? { ...s, status: 'completed' } :
              s.id === 'scan_2' ? { ...s, status: 'thinking' } : s
            )
          } : msg
        ));

        // Progress Trace Step 2 -> Completed, Step 3 -> Thinking + Suggestions
        setTimeout(() => {
          setAgentMessages(prev => prev.map(msg => 
            msg.id === messageId ? {
              ...msg,
              trace: msg.trace?.map(s => 
                s.id === 'scan_2' ? { ...s, status: 'completed' } :
                s.id === 'scan_3' ? { ...s, status: 'thinking', label: '高纬度剧情分支推演中...' } : s
              ),
              suggestions: [
                {
                  id: 'suggest_branch_1',
                  title: '引入“墨家”隐世机关术',
                  content: '在主角陷入绝境时，由于对古籍的特殊理解触发了机关室的隐藏防御机制，这不仅解决了眼前的危机，还为接下来的“机关城”副本埋下伏笔。',
                  type: 'plot',
                  isRecommended: true
                },
                {
                  id: 'suggest_branch_2',
                  title: '揭示“守门人”的真实身份',
                  content: '通过一段破碎的回忆杀，暗示守门人其实是上一任掌门的残魂，这种情感层面的反转会增加剧情的厚度，并引导主角产生强烈使命感。',
                  type: 'character'
                }
              ]
            } : msg
          ));
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    // 1. Clear suggestions immediately to make cards disappear
    // AND keep Scan 3 thinking
    setAgentMessages(prev => {
      const messages = [...prev];
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].suggestions && messages[i].suggestions!.length > 0) {
          messages[i] = { ...messages[i], suggestions: [] };
          // Ensure scan_3 is still 'thinking'
          if (messages[i].trace) {
             messages[i].trace = messages[i].trace!.map(s => 
               s.id === 'scan_3' ? { ...s, status: 'thinking' as const, label: '正在应用决策并重构因果...' } : s
             );
          }
          break;
        }
      }
      return messages;
    });

    // 2. Delay the final completion to simulate "applying" work
    setTimeout(() => {
      setAgentStatus('completed');
      
      setAgentMessages(prev => {
        const messages = [...prev];
        // 1. Update the trace to completed
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].role === 'ai' && messages[i].trace) {
            const newTrace = (messages[i].trace || []).map(step => 
              step.id === 'scan_3' ? { ...step, status: 'completed' as const, label: '推演决策已确认并成功应用' } : step
            );
            messages[i] = { ...messages[i], trace: newTrace };
            break;
          }
        }
        
        // 2. Add final confirmation
        const confirmation: AgentMessage = {
          id: `confirm_${Date.now()}`,
          role: 'ai',
          content: `方案已合并至主推演分支。系统监测到剧情一致性提升 12%，正在进入静默观察模式。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return [...messages, confirmation];
      });
    }, 2500);
  };

  const handleToggleAgent = () => {
    if (aiPanelRef.current) {
      const isCollapsed = aiPanelRef.current.isCollapsed();
      
      // Case 1: Panel is open and currently in Agent Mode -> Close it
      if (!isCollapsed && isAgentMode) {
        aiPanelRef.current.collapse();
      } 
      // Case 2: Panel is open but in Toolbox Mode -> Switch to Agent
      else if (!isCollapsed && !isAgentMode) {
        setIsAgentMode(true);
      }
      // Case 3: Panel is closed -> Open it and force Agent Mode
      else if (isCollapsed) {
        setIsAgentMode(true);
        aiPanelRef.current.expand();
      }
    }
  };

  const toggleAIPanelVisibility = () => {
    if (aiPanelRef.current) {
      const isCollapsed = aiPanelRef.current.isCollapsed();
      if (isCollapsed) aiPanelRef.current.expand();
      else aiPanelRef.current.collapse();
    }
  };

  const handleAIPanelClose = () => {
    if (aiPanelRef.current) aiPanelRef.current.collapse();
  };

  const handleCancelAgentProcess = () => {
    setAgentStatus('idle');
  };

  const handleAIPanelMinimize = () => {
    if (aiPanelRef.current) {
      const isCollapsed = aiPanelRef.current.isCollapsed();
      if (isCollapsed) aiPanelRef.current.expand();
      else aiPanelRef.current.collapse();
    }
  };

  const toggleSidebarVisibility = () => {
    if (sidebarPanelRef.current) {
      const isCollapsed = sidebarPanelRef.current.isCollapsed();
      if (isCollapsed) sidebarPanelRef.current.expand();
      else sidebarPanelRef.current.collapse();
    }
  };

  const handleSetAnalyticsSize = (percentage: number) => {
    setIsAnalyticsCollapsed(false);
    setAnalyticsHeight(percentage);
  };

  const handleSidebarTabChange = (tab: SidebarTab) => {
    if (tab === 'settings') {
      setIsSettingsOpen(true);
      return;
    }
    
    if (activeSidebarTab === tab) {
      if (sidebarPanelRef.current) {
        const isCollapsed = sidebarPanelRef.current.isCollapsed();
        if (isCollapsed) sidebarPanelRef.current.expand();
        else sidebarPanelRef.current.collapse();
      }
    } else {
      setActiveSidebarTab(tab);
      if (sidebarPanelRef.current) {
        sidebarPanelRef.current.expand();
      }
    }
  };

  const handleAITabChange = (tab: SidebarTab) => {
    // If we click a specific tool tab, we should exit Agent mode
    setIsAgentMode(false);
    
    if (activeAITab === tab) {
      if (aiPanelRef.current) {
        const isCollapsed = aiPanelRef.current.isCollapsed();
        if (isCollapsed) aiPanelRef.current.expand();
        else aiPanelRef.current.collapse();
      }
    } else {
      setActiveAITab(tab);
      if (aiPanelRef.current) {
        aiPanelRef.current.expand();
      }
    }
  };

  const findChapter = (book: NovelBook, id: string): Chapter | undefined => {
    for (const volume of book.volumes) {
      for (const stage of volume.stages) {
        const found = stage.chapters.find(c => c.id === id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const activeChapter = findChapter(book, activeChapterId) || book.volumes[0].stages[0].chapters[0];
  
  // Check if agent panel is effectively visible to the user
  const isAgentPanelVisible = isAIPanelVisible;

  // Get the latest trace to sync across multiple locations
  const latestAIWithTrace = [...agentMessages].reverse().find(m => m.role === 'ai' && m.trace);
  const activeTraceSteps = latestAIWithTrace?.trace || [];
  const isActiveThinking = !!latestAIWithTrace?.isThinking;

  const handleContentChange = (newContent: string) => {
    setBook(prev => ({
      ...prev,
      volumes: prev.volumes.map(vol => ({
        ...vol,
        stages: vol.stages.map(stage => ({
          ...stage,
          chapters: stage.chapters.map(chap => 
            chap.id === activeChapterId 
              ? { ...chap, content: newContent, wordCount: newContent.replace(/<[^>]*>/g, '').length } 
              : chap
          )
        }))
      }))
    }));
  };

  const handleStartNew = (title: string) => {
    setCurrentStoryTitle(title);
    setView('onboarding');
    // SINGLE SOURCE OF TRUTH: Trigger THE FIRST AI response here
    handleAddAgentAIResponse(
      `已完成“世界观”的初步生成。你可以审阅左侧的设定项。如果你对某个部分不满意，或者想针对某些细节进行更深度的推演（例如具体的地理风貌或社会矛盾），可以直接咨询我。`,
      'world'
    );
  };

  const handleSelectNovel = (id: string) => {
    const novel = novels.find(n => n.id === id);
    if (novel) setCurrentStoryTitle(novel.title);
    setView('editor');
  };

  const bottomOffset = isAnalyticsVisible ? (isAnalyticsCollapsed ? 70 : `${analyticsHeight}%`) : 0;
  const topOffset = 0;

  return (
    <div 
      className={cn(
        "h-screen w-screen overflow-hidden bg-app-bg text-text-main font-sans selection:bg-brand-red/30",
        theme === 'paper' && "light-theme",
        theme === 'classic' && "classic-theme"
      )}
      style={{ 
        transition: 'background-color 0.8s cubic-bezier(0.23, 1, 0.32, 1), color 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
        willChange: 'background-color, color'
      }}
    >
      <AnimatePresence mode="popLayout">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            <LandingPage 
              onStartNew={handleStartNew}
              onSelectNovel={handleSelectNovel}
              existingNovels={novels}
              onToggleMockData={toggleMockData}
              onOpenSettings={() => setIsSettingsOpen(true)}
              theme={theme}
              onThemeChange={toggleTheme}
            />
          </motion.div>
        )}

        {view === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            <Onboarding 
              storyTitle={currentStoryTitle} 
              isMockLoadingEnabled={isMockLoadingEnabled}
              onComplete={() => {
                setView('editor');
                setIsAgentMode(true); // Automatically enter agent mode for continuity
              }} 
              onBackToLanding={() => setView('landing')}
              messages={agentMessages}
              onSendMessage={handleSendAgentMessage}
              onAddAIMessage={handleAddAgentAIResponse}
            />
          </motion.div>
        )}

        {view === 'editor' && (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col"
          >
            <div className="flex-1 flex overflow-hidden">
              <ActivityBar 
                activeTab={activeSidebarTab} 
                onTabChange={handleSidebarTabChange}
                theme={theme}
                onThemeChange={toggleTheme}
              />
              
              <div className="flex-1 h-full w-full min-w-0 overflow-hidden relative">
                <Group 
                  key="STABLE_FRAME"
                  id="PLOT_PILOT_STABLE_V6"
                  onLayoutChanged={onLayoutChanged}
                  direction="horizontal"
                >
                  <Panel 
                    id="sidebar"
                    defaultSize={20}
                    minSize={10}
                    collapsible={true}
                    collapsedSize={0}
                    onResize={(size) => {
                      if (size.asPercentage > 2) {
                        setIsSidebarExpanded(true);
                      } else {
                        setIsSidebarExpanded(false);
                      }
                    }}
                    panelRef={sidebarPanelRef}
                    ref={sidebarPanelRef}
                  >
                    <div className={cn(
                      "h-full overflow-hidden flex flex-col bg-panel-bg/80 backdrop-blur-md border-r border-hud-border/40",
                      !isSidebarExpanded ? "opacity-0 invisible" : "opacity-100 visible"
                    )}>
                      {/* Fluid container to allow content to flow with panel width */}
                      <div className="w-full h-full flex flex-col overflow-hidden">
                        <SidebarHeader 
                          onLogoClick={() => setView('landing')}
                          onToggleSidebar={toggleSidebarVisibility}
                          theme={theme}
                        />
                        
                        <div className="flex-1 w-full overflow-hidden">
                          {activeSidebarTab === 'chapters' ? (
                            <div className="h-full">
                              <Sidebar 
                                book={book} 
                                activeChapterId={activeChapterId} 
                                onChapterSelect={setActiveChapterId} 
                              />
                            </div>
                          ) : activeSidebarTab === 'branch' ? (
                            <div className="h-full">
                              <BranchPanel isMockLoadingEnabled={isMockLoadingEnabled} />
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-text p-8 text-center">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-hud-border">
                                <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                              </div>
                              <span className="font-sans font-bold text-[10px] uppercase tracking-[0.3em]">模块扩展中</span>
                              <span className="font-mono text-[9px] mt-2 opacity-40 uppercase tracking-widest">Under Construction</span>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                </Panel>

                  <Separator 
                    className="w-1 bg-transparent hover:bg-brand-red/20 transition-all duration-300 cursor-col-resize z-40 relative after:content-[''] after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-hud-border/10 after:-translate-x-1/2" 
                  />
                  
                  <Panel 
                    id="content" 
                    defaultSize={50}
                    minSize={20}
                    onResize={() => {}}
                  >
                    <div className="h-full w-full min-w-0 overflow-hidden bg-app-bg flex flex-col relative">
                      <MainHeader 
                        isAnalyticsVisible={isAnalyticsVisible}
                        onToggleAnalytics={toggleAnalyticsVisibility}
                        isAIPanelVisible={isAIPanelVisible}
                        onToggleAIPanel={toggleAIPanelVisibility}
                        theme={theme}
                        onToggleSidebar={toggleSidebarVisibility}
                        isSidebarVisible={isSidebarExpanded}
                      />

                      <div className="flex-1 min-w-[600px] w-full overflow-hidden relative">
                        {/* Base Layer: Immersive Editor - Natural Flow to respect physical boundaries */}
                        <motion.div 
                          className="absolute inset-0 z-0"
                          initial={false}
                        >
                          <Editor 
                            title={activeChapter.title}
                            content={activeChapter.content}
                            onChange={handleContentChange}
                            topOffset={topOffset}
                            bottomOffset={bottomOffset}
                            onToggleAnalytics={toggleAnalyticsVisibility}
                            isAnalyticsVisible={isAnalyticsVisible}
                            isDarkMode={isDarkMode}
                          />
                        </motion.div>

                        {/* Narrow HUD Utility Panel - Decoupled from isAnalyticsVisible for separate control */}
                        <AnimatePresence>
                          {!(isAIPanelVisible && isAgentMode) && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                              className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-auto transition-all duration-500 ease-[0.23,1,0.32,1]"
                              style={{ 
                                bottom: isAnalyticsVisible 
                                  ? (isAnalyticsCollapsed ? '78px' : `calc(${analyticsHeight}% + 8px)`)
                                  : '24px', // Standard bottom spacing when chart is hidden
                                width: 'calc(100% - 2rem)',
                                maxWidth: (isAnalyticsVisible && !isAnalyticsCollapsed) ? '48rem' : '28rem'
                              }}
                            >
                              <ProcessMonitor 
                                isThinking={isActiveThinking}
                                isCompleted={!isActiveThinking}
                                steps={activeTraceSteps}
                                onIconClick={handleOpenAgent}
                                isPanelOpen={isAIPanelVisible}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Bottom HUD Layer: Analytics Panel */}
                        {isAnalyticsVisible && (
                          <div 
                            className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none transition-[height] duration-300 ease-out"
                            style={{ 
                              height: isAnalyticsCollapsed ? '70px' : `${analyticsHeight}%`,
                              willChange: 'height'
                            }}
                          >
                            <AnalyticsPanel 
                              isCollapsed={isAnalyticsCollapsed}
                              onToggle={() => {
                              if (isAnalyticsCollapsed) {
                                setIsAnalyticsCollapsed(false);
                                setAnalyticsHeight(30);
                              } else {
                                setIsAnalyticsCollapsed(true);
                              }
                            }}
                            onClose={handleAnalyticsClose}
                            onSetSize={(size) => {
                              setIsAnalyticsCollapsed(false);
                              setAnalyticsHeight(size);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>
                
                  <Separator 
                    className="w-1 bg-transparent hover:bg-brand-red/20 transition-all duration-300 cursor-col-resize z-40 relative after:content-[''] after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-hud-border/10 after:-translate-x-1/2" 
                  />
                  
                  <Panel 
                    id="ai" 
                    defaultSize={30}
                    minSize={15}
                    collapsible={true}
                    collapsedSize={0}
                    onResize={(size) => {
                      if (size.asPercentage > 2) {
                        setIsAIPanelVisible(true);
                      } else {
                        setIsAIPanelVisible(false);
                      }
                    }}
                    panelRef={aiPanelRef}
                    ref={aiPanelRef}
                  >
                  <div className={cn(
                    "h-full overflow-hidden transition-opacity duration-300", 
                    "bg-transparent",
                    !isAIPanelVisible ? "opacity-0 invisible" : "opacity-100 visible"
                  )}>
                    {isAgentMode ? (
                      <div className="h-full w-full p-4 overflow-hidden">
                        <AgentCoreView 
                          messages={agentMessages}
                          onSendMessage={handleSendAgentMessage}
                          theme={theme}
                          isMockLoadingEnabled={isMockLoadingEnabled}
                          activeTraceSteps={activeTraceSteps}
                          status={agentStatus}
                          onStartProcess={startAgentProcess}
                          onApplySuggestion={handleApplySuggestion}
                          onClose={handleAIPanelClose}
                          onCancelProcess={handleCancelAgentProcess}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full overflow-hidden">
                        <AIPanel 
                          theme={theme} 
                          isMockLoadingEnabled={isMockLoadingEnabled}
                          onClose={handleAIPanelClose}
                          onMinimize={handleAIPanelMinimize}
                        />
                      </div>
                    )}
                  </div>
                </Panel>
                </Group>
            </div>
            <AIActivityBar 
              activeTab={activeAITab} 
              onTabChange={handleAITabChange} 
              onToggleAgent={handleToggleAgent}
              isAgentMode={isAgentMode}
              isPanelVisible={isAIPanelVisible}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        isMockLoadingEnabled={isMockLoadingEnabled}
        setIsMockLoadingEnabled={setIsMockLoadingEnabled}
      />
      <FloatingAgent 
        isDarkMode={isDarkMode} 
        status={agentStatus}
        onClick={handleOpenAgent}
      />
    </div>
  );
}







