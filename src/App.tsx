/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, Group, Separator } from 'react-resizable-panels';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AIPanel from './components/AIPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';
import SettingsModal from './components/SettingsModal';
import { Chapter } from './types';

const INITIAL_CHAPTERS: Chapter[] = [
  { 
    id: '1', 
    title: '第一章：觉醒', 
    content: '<p>林墨揪着被巴邑的数学练习册从教学楼后侧的杂物巷走出来的时候，帆布鞋尖还沾着张磊刚泼在地上的矿泉水印。左脸的巴掌印热辣辣地疼，黑框眼镜的镜腿刚才被打的时候蹬了一道划痕，架在鼻梁上总往下滑。他不敢去医务室，更不敢找老师，去年有个高一的学生告张磊霸凌，转头就被安了个“寻衅滋事”的名头劝退，谁都知道张磊他爸是学校的大金主，校领导都要让三分。</p><p>他沿着刷着暗绿色油漆的消防通道往上走，声控灯坏了两盏，他咳了两声才震亮最上面那盏昏黄的灯。爬到顶楼的时候，他推开那扇锈得掉渣的铁门，风瞬间涌过来，吹得他洗得发白的蓝白校服衣角猎猎作响。这是他偷偷发现的秘密基地，天台的挂锁松了半扣，刚好能容他钻进来，没人会来这里找他的麻烦。</p><p>林墨靠在冰冷的水泥栏杆上，把怀里的练习册拿出来，封皮上还留着半个清晰的鞋印，是张磊刚才踩的。他指尖拂过练习册封皮上自己写的名字，又摸了摸左脸的红印，疼得嘶了一声。远处的操场闹哄哄的，刚放学的学生抱着篮球往校门跑，张磊的黑色越野车就停在校门口最显眼的位置，他隔着老远都能看见张磊搂着小弟的肩膀上车，按了两下喇叭，吓跑了两个背着粉色书包的低年级女生。</p>',
    wordCount: 1245
  },
  { id: '2', title: '第二章：神秘老者', content: '<p>内容加载中...</p>', wordCount: 2100 },
  { id: '3', title: '第三章：传送阵', content: '<p>内容加载中...</p>', wordCount: 1850 },
  { id: '4', title: '第四章：异界初探', content: '<p>内容加载中...</p>', wordCount: 2300 },
  { id: '5', title: '第五章：血脉觉醒', content: '<p>内容加载中...</p>', wordCount: 1980 },
];

type ViewState = 'landing' | 'onboarding' | 'editor';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [activeChapterId, setActiveChapterId] = useState('1');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentStoryTitle, setCurrentStoryTitle] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [novels, setNovels] = useState([
    { id: '1', title: '修真界的都市访客', lastEdited: '2小时前', wordCount: 1245, status: '连载中' },
    { id: '2', title: '赛博朋克：霓虹之雨', lastEdited: '昨天', wordCount: 45200, status: '已完结' },
  ]);

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
    if (!isDarkMode) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];

  const handleContentChange = (newContent: string) => {
    setChapters(prev => prev.map(c => 
      c.id === activeChapterId ? { ...c, content: newContent, wordCount: newContent.replace(/<[^>]*>/g, '').length } : c
    ));
  };

  const handleStartNew = (title: string) => {
    setCurrentStoryTitle(title);
    setView('onboarding');
  };

  const handleSelectNovel = (id: string) => {
    const novel = novels.find(n => n.id === id);
    if (novel) setCurrentStoryTitle(novel.title);
    setView('editor');
  };

  return (
    <div className={`h-screen bg-app-bg text-text-main font-sans selection:bg-brand-red/30 transition-colors duration-300 ${!isDarkMode ? 'light-theme' : ''}`}>
      <AnimatePresence mode="wait">
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
            <Onboarding storyTitle={currentStoryTitle} onComplete={() => setView('editor')} />
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
            <Header 
              isDarkMode={isDarkMode} 
              onToggleTheme={toggleTheme} 
              onLogoClick={() => setView('landing')} 
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
            
            <div className="flex-1 overflow-hidden">
              <Group 
                orientation="horizontal"
              >
                {/* Sidebar */}
                <Panel defaultSize={25} minSize={0}>
                  <Sidebar 
                    chapters={chapters} 
                    activeChapterId={activeChapterId} 
                    onChapterSelect={setActiveChapterId} 
                  />
                </Panel>
                
                <Separator className="w-1 bg-hud-border hover:bg-brand-red transition-colors cursor-col-resize" />
                
                {/* Main Content Area */}
                <Panel defaultSize={50} minSize={0}>
                  <Group 
                    orientation="vertical"
                  >
                    <Panel defaultSize={70} minSize={0}>
                      <Editor 
                        title={activeChapter.title}
                        content={activeChapter.content}
                        onChange={handleContentChange}
                      />
                    </Panel>
                    
                    <Separator className="h-1 bg-hud-border hover:bg-brand-red transition-colors cursor-row-resize" />
                    
                    <Panel defaultSize={30} minSize={0}>
                      <AnalyticsPanel />
                    </Panel>
                  </Group>
                </Panel>
                
                <Separator className="w-1 bg-hud-border hover:bg-brand-red transition-colors cursor-col-resize" />
                
                {/* AI Panel */}
                <Panel defaultSize={25} minSize={0}>
                  <AIPanel />
                </Panel>
              </Group>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}







