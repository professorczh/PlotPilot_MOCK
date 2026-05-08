/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, Group, Separator, useDefaultLayout } from 'react-resizable-panels';
import { Sparkles, Terminal } from 'lucide-react';
import type { Layout } from 'react-resizable-panels';
import { cn } from './lib/utils';
import ActivityBar from './components/ActivityBar';
import AIActivityBar from './components/AIActivityBar';
import WorldExplorer from './components/WorldExplorer';
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
import WorkflowSidebar from './components/WorkflowSidebar';
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
            { id: 'chap_1', title: '第1章 荒野之变', status: 'completed', wordCount: 4796, relatedCharacters: ['1'], relatedLocations: ['1'], content: `林墨揪着被巴邑的数学练习册从教学楼后侧的杂物巷走出来的时候，帆布鞋尖还沾着张磊刚泼在地上的矿泉水印。左脸的巴掌印热辣辣地疼，黑框眼镜的镜腿刚才被打的时候蹬了一道划痕，架在鼻梁上总往下滑。

他不敢去医务室，更不敢找老师，去年有个高一的学生告张磊霸凌，转头就被安了个“寻衅滋事”的名头劝退，谁都知道张磊他爸是学校的大金主，校领导都要让三分。

天色渐暗，咸阳城的影子在夕阳下斜斜拉长，如同古代某种巨大的爬行兽。林墨深吸一口气，心中却满是冷冽。他知道，这荒野之上的变革，才刚刚开始。在这个时代的洪流中，没有人能独善其身。` },
            { id: 'chap_2', title: '第2章 暗流涌动', status: 'completed', wordCount: 4694, relatedCharacters: ['1', '2'], relatedLocations: ['1', '2'], content: `章台宫的深夜，灯火摇曳。始皇帝的影子投射在巨大的屏风上，显得孤寂而威严。

李拓跪在大殿中央，额头贴在冰冷的汉白玉砖面上，汗珠顺着鬓角滑落。他怀里揣着那本关于“改良农具”的密报，那是他翻身的唯一机会。

“陛下，林墨此人，虽处江湖之远，却怀经纬之才。”李拓的声音因紧张而略显嘶哑，“臣亲眼所见，他所造之物，能使关中沃野再增三成产出。”

咸阳城的风，似乎在这一刻停止了流动。每个人都在等待着那个足以改变命运的裁决。` },
            { id: 'chap_3', title: '第3章 利益交换', status: 'completed', wordCount: 4333, relatedCharacters: ['2', '3'], relatedLocations: ['2', '3'], content: `伍老坐在田垄上，浑浊的眼睛里闪过一丝精光。他看着在田间忙碌的林墨，心中五味杂陈。

“娃子，你这手艺，是要招祸的。”伍老抽了一口旱烟，吐出的烟雾在晨光中缓缓散开。

林墨没有停下手里的活计，只是淡淡一笑：“伍老，祸起于贪，而福源于德。这农具是给百姓用的，不是给权贵摆设的。”

就在这时，远处马蹄声飞扬，一队禁卫军在李拓的带领下正疾驰而来。林墨知道，这场关于权力与利益的博弈，已经让他彻底卷入其中，无法回头。` },
            { id: 'chap_4', title: '第4章 律法之教', status: 'completed', wordCount: 4275, relatedCharacters: ['1', '4'], relatedLocations: ['4', '1'], content: `《秦律》重如泰山，每一个刻在竹简上的字，都带着某种难以名状的压力。

李拓将一卷厚厚的律法推向林墨：“想要活下去，不仅要会锄头，更要懂法。在大秦，法就是唯一的规矩。”

林墨翻开竹简，那些晦涩难懂的文字，在他现代大脑的解析下，竟然产生了一种奇妙的共鸣。他发现，这不仅是惩戒的工具，更是治理国家的精密逻辑。

“刑过不避大臣，赏善不遗匹夫。”林墨低声诵读着，眼神越来越明亮。他不仅在学法，他是在寻找这个庞大帝国的破绽与生机。` },
            { id: 'chap_5', title: '第5章 初显峥嵘', status: 'processing', wordCount: 3992, relatedCharacters: ['1', '3', '4'], relatedLocations: ['1', '5'], content: `咸阳宫内，群臣屏息。

林墨一袭青衫，站在朝堂中央，面对着那些掌握帝国生杀大权的巨头，神色从容不迫。

“改良之法，不在于力，而在于序。”林墨展开手中的图纸，那不仅仅是农具的设计，更是一整套关于资源调度与舆情处理的超前方案。

扶苏坐在始皇帝下首，目光深邃地盯着这个名不见经传的年轻人。他隐约感觉到，大秦的未来，或许会因为这个不速之客，走向一个完全不同的分叉口。` },
          ]
        },
        {
          id: 'stage_2',
          title: '卷二、织',
          description: '林墨为阿拾改良织机以应付苛捐，被郡尉赵亥盯上，赵亥以“六国细作”罪名进行盘查。',
          chapters: [
            { id: 'chap_6', title: '第6章 机杼变法', status: 'draft', wordCount: 0, content: '' },
            { id: 'chap_7', title: '第7章 织机惊梦', status: 'draft', wordCount: 0, content: '' },
            { id: 'chap_8', title: '第8章 酷吏入村', status: 'draft', wordCount: 0, content: '' },
            { id: 'chap_9', title: '第9章 莫须之罪', status: 'draft', wordCount: 0, content: '' },
            { id: 'chap_10', title: '第10章 危局待解', status: 'draft', wordCount: 0, content: '' },
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
  const [activeChapterId, setActiveChapterId] = useState('chap_1');
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('chapters');
  const [activeAITab, setActiveAITab] = useState<SidebarTab>('ai-chat');
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
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
  const simulateAgentTraceResponse = (text: string, context: 'world' | 'character' | 'map' | 'plot' | 'general' = 'general', isSystem: boolean = false) => {
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

    const messageId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const initialSteps = traceTemplates[context].map((s, idx) => ({ 
      ...s, 
      id: `${s.id}-${messageId}-${idx}`,
      status: (idx === 0 ? 'thinking' : 'pending') as any 
    }));
    
    // Create mock suggestions to show within the Agent message
    const mockSuggestions = [
      { 
        id: `s_01-${messageId}-${Date.now()}`, 
        title: '候选方案_01', 
        isRecommended: true,
        content: '“秘密基地不仅是一个藏身处，更是一个时空锚点。当主角林墨踏入此地，周围的空气开始液化，历史的重影在此交叠...”'
      },
      { 
        id: `s_02-${messageId}-${Date.now()}`, 
        title: '候选方案_02', 
        isRecommended: false,
        content: '张磊的挑衅其实是“暗影”组织的一次压力测试，旨在观测主角在极端情绪下的灵力波动数值。'
      }
    ];

        // Add the thinking message
    const thinkingMsg: AgentMessage = { 
      id: messageId,
      role: 'ai', 
      text: '', 
      trace: initialSteps, 
      isThinking: true,
      isSystem: isSystem
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
    const newUserMsg: AgentMessage = { 
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      role: 'user', 
      text 
    };
    setAgentMessages(prev => [...prev, newUserMsg]);

    const responseText = `收到！关于你提到的“${text.substring(0, 10)}...”，我建议可以根据当前的推演方向进行更细致的延展。需要我为你生成具体的文本片段并填入草稿吗？`;
    
    // Mock context detection
    let context: any = 'general';
    if (text.includes('人') || text.includes('设定')) context = 'character';
    if (text.includes('图') || text.includes('地')) context = 'map';
    if (text.includes('世') || text.includes('界')) context = 'world';

    simulateAgentTraceResponse(responseText, context);
  };

  const handleAddAgentAIResponse = (text: string, context?: 'world' | 'character' | 'map' | 'plot' | 'general', isSystem: boolean = false) => {
    // Force simulation for onboarding steps to ensure UI synchronization
    simulateAgentTraceResponse(text, context || 'general', isSystem);
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
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('none');
  const isInternalToggleRef = useRef(false);
  const analyticsPanelRef = useRef<any>(null);
  const aiPanelRef = useRef<any>(null);
  const sidebarPanelRef = useRef<any>(null);
  
  const [novels, setNovels] = useState([
    { id: 'novel_1', title: '修真界的都市访客', lastEdited: '2小时前', wordCount: 1245, status: '连载中' },
    { id: 'novel_2', title: '赛博朋克：霓虹之雨', lastEdited: '昨天', wordCount: 45200, status: '已完结' },
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
    if (agentStatus === 'writing') {
      setAgentStatus('completed');
      return;
    }
    setIsAgentMode(true);
    if (!isAIPanelVisible) {
      setIsAIPanelVisible(true);
      if (aiPanelRef.current) aiPanelRef.current.expand(30);
    }
    setAgentStatus('panel_open');
  };

  const handleAgentCoreClick = () => {
    handleOpenAgent();
    // No longer automatically trigger process, let the user click the card
  };

  const handleStartAutomation = () => {
    // Open AI Panel and ensure status is panel_open to show the card
    setIsAgentMode(true);
    if (!isAIPanelVisible) {
      setIsAIPanelVisible(true);
      if (aiPanelRef.current) aiPanelRef.current.expand(30);
    }
    setAgentStatus('panel_open');
  };

  useEffect(() => {
    (window as any).startAutomation = handleStartAutomation;
    return () => { delete (window as any).startAutomation; };
  }, [handleStartAutomation]);

  const startAgentProcess = () => {
    setAgentStatus('starting');
    
    // Step 1: Initial Launch
    setTimeout(() => {
      setAgentStatus('running');
      
      const processId = Date.now();
      const messageId = `agent_${processId}`;
      const initialMessage: AgentMessage = {
        id: messageId,
        role: 'ai',
        content: '“墨枢”自动化协同推演模式已激活。正在扫描当前章节脉络与因果逻辑...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        trace: [
          { id: `scan_1_${processId}`, label: '世界观稳定性因果校验', status: 'thinking', type: 'check' },
          { id: `scan_2_${processId}`, label: '角色动机一致性检索', status: 'pending', type: 'check' },
          { id: `scan_3_${processId}`, label: '高纬度剧情分支推演', status: 'pending', type: 'logic' }
        ]
      };

      setAgentMessages(prev => [...prev, initialMessage]);

      // Progress Trace Step 1 -> Completed, Step 2 -> Thinking
      setTimeout(() => {
        setAgentMessages(prev => prev.map(msg => 
          msg.id === messageId ? {
            ...msg,
            trace: msg.trace?.map(s => 
              s.id === `scan_1_${processId}` ? { ...s, status: 'completed' } :
              s.id === `scan_2_${processId}` ? { ...s, status: 'thinking' } : s
            )
          } : msg
        ));

        // Progress Trace Step 2 -> Completed, Step 3 -> Thinking + Suggestions
        setTimeout(() => {
          setAgentMessages(prev => prev.map(msg => 
            msg.id === messageId ? {
              ...msg,
              trace: msg.trace?.map(s => 
                s.id === `scan_2_${processId}` ? { ...s, status: 'completed' } :
                s.id === `scan_3_${processId}` ? { ...s, status: 'thinking', label: '高纬度剧情分支推演中...' } : s
              ),
              suggestions: [
                {
                  id: `suggest_branch_1_${processId}`,
                  title: '引入“墨家”隐世机关术',
                  content: '在主角陷入绝境时，由于对古籍的特殊理解触发了机关室的隐藏防御机制，这不仅解决了眼前的危机，还为接下来的“机关城”副本埋下伏笔。',
                  type: 'plot',
                  isRecommended: true
                },
                {
                  id: `suggest_branch_2_${processId}`,
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
      setAgentStatus('writing');
      setActiveChapterId('chap_5');
      
      setAgentMessages(prev => {
        const messages = [...prev];
        // 1. Update the trace to completed
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].role === 'ai' && messages[i].trace) {
            const newTrace = (messages[i].trace || []).map(step => 
              step.id.includes('scan_3') ? { ...step, status: 'completed' as const, label: '推演决策已确认，正在自动撰写章节' } : step
            );
            messages[i] = { ...messages[i], trace: newTrace };
            break;
          }
        }
        
        // 2. Add final confirmation
        const confirmation: AgentMessage = {
          id: `confirm_${Date.now()}`,
          role: 'ai',
          content: `方案已合并并进入自动化撰写阶段。正在重构“第5章 初显峥嵘”的文本脉络。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return [...messages, confirmation];
      });

      // Completion after writing period
      setTimeout(() => {
        setAgentStatus('completed');
      }, 120000);
    }, 2500);
  };

  const handleToggleAgent = () => {
    if (aiPanelRef.current) {
      const isCurrentlyAgent = isAgentMode;
      const isExpanded = !aiPanelRef.current.isCollapsed();
      
      // If already in Agent mode and expanded, then collapse
      if (isCurrentlyAgent && isExpanded) {
        aiPanelRef.current.collapse();
        if (agentStatus === 'panel_open' || agentStatus === 'idle') {
          setAgentStatus('none');
        }
      } 
      // Otherwise switch to Agent mode and expand
      else {
        setIsAgentMode(true);
        setAgentStatus('panel_open');
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
    if (agentStatus === 'panel_open' || agentStatus === 'idle') {
      setAgentStatus('none');
    }
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

  const handleShowLogs = () => {
    if (aiPanelRef.current) {
      const isCurrentlyLogs = activeAITab === 'ai-logs' && !isAgentMode;
      const isExpanded = !aiPanelRef.current.isCollapsed();
      
      if (isCurrentlyLogs && isExpanded) {
        aiPanelRef.current.collapse();
      } else {
        setIsAgentMode(false);
        setActiveAITab('ai-logs');
        aiPanelRef.current.expand();
      }
    }
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
    if (aiPanelRef.current) {
      const isCurrentlySameTab = activeAITab === tab && !isAgentMode;
      const isExpanded = !aiPanelRef.current.isCollapsed();

      // If already on the same tool tab and expanded, then collapse
      if (isCurrentlySameTab && isExpanded) {
        aiPanelRef.current.collapse();
      } 
      // Otherwise switch to this tool tab and expand
      else {
        setIsAgentMode(false);
        setActiveAITab(tab);
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
      `世界观解析协议已就绪\n深度推演引擎已完成底层架构映射，请审阅核心设定。`,
      'world',
      true
    );
  };

  const handleSelectNovel = (id: string) => {
    const novel = novels.find(n => n.id === id);
    if (novel) setCurrentStoryTitle(novel.title);
    setActiveChapterId('chap_1');
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
              theme={theme}
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
                <WorldExplorer 
                  isOpen={isExplorerOpen} 
                  onClose={() => setIsExplorerOpen(false)} 
                  theme={theme}
                />
                
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
                                theme={theme}
                              />
                            </div>
                          ) : activeSidebarTab === 'branch' ? (
                            <div className="h-full">
                              <BranchPanel isMockLoadingEnabled={isMockLoadingEnabled} />
                            </div>
                          ) : activeSidebarTab === 'world' ? (
                            <div className="h-full">
                              <WorkflowSidebar theme={theme} />
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-text p-8 text-center">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-hud-border">
                                <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                              </div>
                              <span className="font-sans font-bold text-[10px] uppercase tracking-[0.3em]">模块扩展中</span>
                              <span className="font-mono text-[9px] mt-2 opacity-40 uppercase tracking-widest">构建中</span>
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
                            status={activeChapter.status}
                            content={activeChapter.content}
                            onChange={handleContentChange}
                            topOffset={topOffset}
                            bottomOffset={bottomOffset}
                            onToggleAnalytics={toggleAnalyticsVisibility}
                            isAnalyticsVisible={isAnalyticsVisible}
                            isDarkMode={isDarkMode}
                            forcePlaying={agentStatus === 'writing' && activeChapterId === 'chap_5'}
                            onStartAutomation={handleStartAutomation}
                          />
                        </motion.div>

                        {/* Narrow HUD Utility Panel - Main ProcessMonitor */}
                        <AnimatePresence>
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                            className="absolute left-1/2 -translate-x-1/2 z-[45] pointer-events-auto"
                            style={{ 
                              bottom: isAnalyticsVisible 
                                ? (isAnalyticsCollapsed ? '78px' : `calc(${analyticsHeight}% + 8px)`)
                                : '24px'
                            }}
                          >
                            <ProcessMonitor 
                              isThinking={isActiveThinking}
                              isCompleted={!isActiveThinking}
                              steps={activeTraceSteps}
                              onIconClick={handleOpenAgent}
                              isPanelOpen={false}
                              status={agentStatus}
                              theme={theme}
                              isAnalyticsVisible={isAnalyticsVisible}
                              isAnalyticsCollapsed={isAnalyticsCollapsed}
                            />
                          </motion.div>
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
                        if (agentStatus === 'panel_open' || agentStatus === 'idle') {
                          setAgentStatus('none');
                        }
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
                    ) : activeAITab === 'ai-logs' ? (
                      <div className="h-full w-full p-4 overflow-hidden flex flex-col">
                        <div className="flex-1 flex flex-col hud-panel overflow-hidden border-hud-border/40">
                          {/* Log Header */}
                          <div className="p-3 border-b border-hud-border/30 flex items-center justify-between shrink-0 bg-gradient-to-r from-brand-red/[0.02] to-transparent">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-red/10 border border-brand-red/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                                <span className="text-[10px] font-display uppercase tracking-widest text-brand-red font-bold">推演中</span>
                              </div>
                              <h3 className={cn(
                                "text-sm font-display uppercase tracking-widest",
                                isDarkMode ? "text-white/90" : "text-black/80"
                              )}>
                                核心推演日志
                              </h3>
                            </div>
                            <span className="text-[10px] font-mono text-muted-text">v2.4.0-稳定版</span>
                          </div>

                          {/* Logs Container */}
                          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar font-mono text-[11px]">
                          {[
                            { time: '18:41:58.210', level: '系统', msg: '正在验证 Gemini-Pro 模型凭证...', details: '{ provider: "Google", region: "asia-east1" }', color: 'text-brand-red' },
                            { time: '18:41:59.450', level: '错误', msg: '模型服务连接超时', details: 'Timeout after 5000ms. Check network/proxy.', color: 'text-red-500' },
                            { time: '18:42:00.100', level: '系统', msg: '自动执行指数退避重试 (Retry 1/3)...', details: '{ delay: "1000ms" }', color: 'text-brand-red' },
                            { time: '18:42:00.900', level: '成功', msg: '连接已建立，节点握手成功', details: '{ latency: "142ms", encryption: "TLS 1.3" }', color: 'text-emerald-500' },
                            { time: '18:42:01.034', level: '系统', msg: '核心推演引擎初始化成功', details: '{ mode: "creative_narrative", depth: 4 }', color: 'text-brand-red' },
                            { time: '18:42:02.112', level: '信息', msg: '语义空间向量检索中...', details: 'query: "墨染山河 - 冲突节点"', color: 'text-blue-400' },
                            { time: '18:42:03.567', level: '追踪', msg: '角色 [李寒秋] 心理状态更新', details: '{ motivation: "revenge", tension: 0.85 }', color: 'text-emerald-400' },
                            { time: '18:42:04.200', level: '信息', msg: '检测到逻辑分支冲突', details: 'node_id: "cliff_edge_v2"', color: 'text-blue-400' },
                            { time: '18:42:04.201', level: '警告', msg: '情节合理性校验不通过: 物理引擎限制', details: 'Gravity variance detected in gravity-free scene.', color: 'text-amber-500' },
                            { time: '18:42:05.102', level: '操作', msg: '执行启发式重写策略', details: 'Strategy: "The Hero Journey Restructure"', color: 'text-purple-400' },
                            { time: '18:42:06.884', level: '成功', msg: '生成 4 个备选剧情分支', details: '[ "坠崖生还", "暗器截获", "援兵突至" ]', color: 'text-emerald-500' },
                            { time: '18:42:07.129', level: '信息', msg: '开始注入环境氛围描述', details: 'Style: "Chinese Ink - Dark"', color: 'text-blue-400' },
                          ].map((log, i) => (
                            <div key={`app-log-${i}-${log.time}`} className={cn(
                              "group border-l-2 pl-3 py-1.5 transition-all duration-300 rounded-r-lg",
                              isDarkMode ? "border-white/5 hover:bg-white/5" : "border-black/5 hover:bg-black/5"
                            )}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="opacity-30 text-[9px] tabular-nums font-mono">{log.time}</span>
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded border text-[9px] font-bold tracking-wider",
                                  log.color,
                                  isDarkMode ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"
                                )}>
                                  {log.level}
                                </span>
                                <span className={cn(
                                  "font-sans text-[12px]",
                                  isDarkMode ? "text-white/80" : "text-black/80"
                                )}>{log.msg}</span>
                              </div>
                              <div className={cn(
                                "text-[10px] text-muted-text p-2 rounded-lg border",
                                isDarkMode ? "bg-white/[0.03] border-white/5" : "bg-black/[0.03] border-black/5"
                              )}>
                                <span className="opacity-40 mr-2 uppercase text-[8px] font-bold tracking-widest">Payload:</span>
                                <code className="font-mono">{log.details}</code>
                              </div>
                            </div>
                          ))}

                          <div className="flex items-center gap-2 pt-4 opacity-40 animate-pulse pb-10">
                            <span className="text-[9px] font-mono">18:42:08.000</span>
                            <span className="text-[9px] font-bold">等待</span>
                            <span className="text-[10px]">监听数据流输入中...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                      <div className="w-full h-full overflow-hidden">
                        <AIPanel 
                          theme={theme} 
                          isMockLoadingEnabled={isMockLoadingEnabled}
                          activeChapter={activeChapter}
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
              onShowLogs={handleShowLogs}
              onOpenExplorer={() => setIsExplorerOpen(true)}
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
        onClick={handleAgentCoreClick}
      />
    </div>
  );
}







