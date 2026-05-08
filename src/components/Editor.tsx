import { Sparkles, Wand2, FileText, History, Edit3, Activity, Play, Pause, Maximize2, User, MapPin } from 'lucide-react';
import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { characterData, geographyData } from '../constants/storyData';

// New Component for the Entity Capsule
const EntityCapsule = ({ name, type, isDarkMode }: { name: string, type: 'char' | 'loc', isDarkMode: boolean, key?: string }) => {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 mx-1 rounded-full border text-[0.85em] font-display font-medium tracking-wide transition-all cursor-default select-none align-middle shadow-sm",
        type === 'char' 
          ? (isDarkMode ? "bg-brand-red/10 border-brand-red/30 text-brand-red shadow-brand-red/10" : "bg-brand-red/5 border-brand-red/20 text-brand-red shadow-brand-red/5")
          : (isDarkMode ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-blue-500/10" : "bg-blue-500/5 border-blue-500/20 text-blue-600 shadow-blue-500/5")
      )}
    >
      {type === 'char' ? <User className="w-[1.1em] h-[1.1em]" /> : <MapPin className="w-[1.1em] h-[1.1em]" />}
      {name}
    </motion.span>
  );
};

// Component to render enriched content
const EnrichedContent = ({ content, isDarkMode }: { content: string, isDarkMode: boolean }) => {
  const renderedParts = useMemo(() => {
    if (!content) return null;

    // Build a list of all names to search for
    const charNames = characterData.map(c => ({ name: c.name, type: 'char' as const }));
    const locNames = geographyData.map(l => ({ name: l.name, type: 'loc' as const }));
    const allEntities = [...charNames, ...locNames].sort((a, b) => b.name.length - a.name.length);

    if (allEntities.length === 0) return content;

    // Create a regex to match any of the names
    const regex = new RegExp(`(${allEntities.map(e => e.name).join('|')})`, 'g');
    
    // Split content by regex and map to elements
    const parts = content.split(regex);
    
    return parts.map((part, index) => {
      const entity = allEntities.find(e => e.name === part);
      if (entity) {
        return <EntityCapsule key={`${part}-${index}`} name={part} type={entity.type} isDarkMode={isDarkMode} />;
      }
      return part;
    });
  }, [content, isDarkMode]);

  return <div className="whitespace-pre-wrap">{renderedParts}</div>;
};

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  status?: 'draft' | 'completed' | 'processing';
  topOffset?: string | number;
  bottomOffset?: string | number;
  onToggleAnalytics?: () => void;
  isAnalyticsVisible?: boolean;
  isDarkMode?: boolean;
  forcePlaying?: boolean;
  onStartAutomation?: () => void;
}

export default function Editor({ 
  content, 
  onChange, 
  title, 
  status = 'draft',
  topOffset = 0, 
  bottomOffset = 0,
  onToggleAnalytics,
  isAnalyticsVisible,
  isDarkMode = true,
  forcePlaying = false,
  onStartAutomation
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');
  const [fontSize, setFontSize] = useState<'standard' | 'compact'>('standard');
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamIndex, setStreamIndex] = useState(0);
  const [isEnrichedMode, setIsEnrichedMode] = useState(false);

  // Sync forced playing state
  useEffect(() => {
    if (forcePlaying) {
      setIsPlaying(true);
    } else if (!forcePlaying && forcePlaying !== undefined) {
      // If forcePlaying was active and is now explicitly disabled, stop playing
      // We check undefined for initial mount safety if needed, though prop is usually boolean
      setIsPlaying(false);
    }
  }, [forcePlaying]);

  // High-quality mock streaming text for the "Processing" state simulation
  const STREAM_CONTENT = `林墨站在田垄边，看着手中那把刚打磨好的青铜耒耜。尽管这只是对大秦农具的微小改良，但在他眼中，这却是撬动这个时代的第一根杠杆。
夕阳如血，斜斜地划过巴邑的黄土地，将他的影子拉得极长。伍老头裹着破烂的麻布袍子，蹲在不远处的土堆上吸着旱烟，浑浊的眼中在那一刻闪过一丝不易察觉的精芒。

“这东西，真的能让收成翻倍？”伍老头闷声问道，声音像是一块干燥的枯木。

林墨没回头，他指着远处那片干裂的农田：“大秦之强，在于耕战。律法虽严，却管不住老天爷的旱涝。但我这耒耜，能让深耕入土三寸，便是给这土地留了一线生机。”

就在这时，远处传来一阵急促的马蹄声。那是负责巡视的秦吏——李拓。他那身漆黑的劲装在晚风中猎猎作响，腰间的秦律竹简因马蹄的颠簸发出沉闷的碰撞声。

李拓勒住马，居高临下地俯视着这对奇怪的组合。他的目光在林墨改良的农具上停留了数秒，随后猛地凝固。那不是普通的铁匠活，那种规整、那种力度，分明透着一股不属于这穷乡僻壤的“势”。

“私改农具，可知在大秦律下该当何罪？”李拓的声音冷若冰霜。

林墨缓缓抬起头，目光平静而深邃：“改农具是有罪，但若能为大秦献上万石军粮，这罪，能否抵作功？”

李拓的瞳孔骤然收缩，在那一瞬间，他仿佛从这个少年眼中看到了某种比秦律更加冰冷、更加宏大的东西……`;

  // Handle streaming simulation
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (status === 'processing' && isPlaying && streamIndex < STREAM_CONTENT.length) {
      // Logic for variable speed typing (30ms to 120ms for better flow)
      const randomSpeed = Math.floor(Math.random() * 90) + 30;
      
      timeout = setTimeout(() => {
        const nextChar = STREAM_CONTENT[streamIndex];
        const newContent = content === '<p>内容加载中...</p>' ? nextChar : content + nextChar;
        
        onChange(newContent);
        setStreamIndex(prev => prev + 1);

        // Auto-scroll logic
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }, randomSpeed);
    }

    return () => clearTimeout(timeout);
  }, [status, isPlaying, streamIndex, content, onChange]);

  // Reset stream index if content is cleared externally
  useEffect(() => {
    if (content === '<p>内容加载中...</p>' || content === '') {
      setStreamIndex(0);
    }
  }, [content]);

  // Close immersive mode on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImmersive) {
        setIsImmersive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImmersive]);

  // Restart stream if play is toggled back and it was finished (optional reset)
  useEffect(() => {
    if (status === 'processing' && !isPlaying) {
      // Potential for pause logic if needed
    }
  }, [isPlaying, status]);

  // Use a cleaner cleanup for the content to avoid ghost data expansion
  const cleanContent = content.replace(/<[^>]*>/g, '').trim();

  const syncHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      // Ensure it doesn't collapse too much and reflects true content height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.max(200, scrollHeight)}px`;
    }
  }, []);

  // Sync height on content change with a frame delay for browser layout stability
  useEffect(() => {
    const frameId = requestAnimationFrame(syncHeight);
    return () => cancelAnimationFrame(frameId);
  }, [cleanContent, syncHeight]);

  const fontClass = fontFamily === 'serif' ? 'font-serif' : 'font-sans';
  const sizeClass = fontSize === 'standard' ? 'text-[18px]' : 'text-[16px]';

  return (
    <div className="h-full flex flex-col bg-editor-bg overflow-hidden relative">
      <div className="h-12 bg-editor-bg shrink-0 z-20 sticky top-0">
        <div className="w-full h-full flex items-center justify-between pl-12 pr-12">
          <div className="flex items-center gap-4">
            <h2 className="text-text-main font-sans font-semibold tracking-wide">{title}</h2>
            
            {status === 'completed' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">
                <span>已收稿</span>
                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
              </div>
            )}

            {status === 'processing' && (
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ opacity: isPlaying ? [0.6, 1, 0.6] : 1, scale: isPlaying ? [0.97, 1, 0.97] : 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-[9px] text-brand-red font-mono font-bold uppercase tracking-tighter shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                >
                  <span>收稿中</span>
                  <div className={cn("w-1 h-1 rounded-full bg-brand-red shadow-[0_0_5px_rgba(220,38,38,0.8)]", isPlaying && "animate-pulse")} />
                </motion.div>

                <button
                  onClick={() => {
                    if (status === 'processing' && !isPlaying) {
                      onStartAutomation?.();
                    } else {
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-muted-text hover:text-brand-red hover:bg-brand-red/10 hover:border-brand-red/30 transition-all duration-300"
                  title={isPlaying ? "暂停生成" : "继续生成"}
                >
                  {isPlaying ? (
                    <Pause className="w-2.5 h-2.5 fill-current" />
                  ) : (
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            )}

            {status === 'draft' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-500 font-mono font-bold uppercase tracking-tighter">
                <span>未收稿</span>
                <div className="w-1 h-1 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">


            {/* Capsule Mode Toggle */}
            <button 
              onClick={() => setIsEnrichedMode(!isEnrichedMode)}
              className={cn(
                "h-[32px] px-3 flex items-center gap-2 transition-all duration-200 rounded-[8px] border",
                isEnrichedMode 
                  ? "bg-brand-red text-white border-transparent" 
                  : (isDarkMode ? "bg-transparent text-muted-text border-white/10 hover:bg-white/5 hover:text-white" : "bg-transparent text-muted-text border-hud-border/40 hover:bg-black/5 hover:text-text-main")
              )}
              title="标签识别模式"
            >
              <Sparkles className={cn("w-3.5 h-3.5", isEnrichedMode && "fill-current animate-pulse")} />
              <span className="text-[10px] font-display font-bold uppercase tracking-widest">胶囊</span>
            </button>

            <div className={cn("w-px h-4 mx-1", isDarkMode ? "bg-white/10" : "bg-hud-border/30")} />
            
            {/* Font Settings Drawer */}
            <div className="relative">
              <button 
                onClick={() => setShowFontSettings(!showFontSettings)}
                className={cn(
                  "w-[32px] h-[32px] flex items-center justify-center transition-all duration-200 rounded-[8px] border",
                  showFontSettings 
                    ? (isDarkMode ? "bg-white text-black border-transparent" : "bg-black text-white border-transparent")
                    : (isDarkMode ? "bg-transparent text-muted-text border-white/10 hover:bg-white/5 hover:text-white" : "bg-transparent text-muted-text border-hud-border/40 hover:bg-black/5 hover:text-text-main")
                )}
                title="字体设置"
              >
                <span className="font-sans font-black text-sm tracking-tighter">A</span>
              </button>

              <AnimatePresence>
                {showFontSettings && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFontSettings(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-10 w-28 bg-panel-bg/95 backdrop-blur-xl border border-hud-border/50 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1"
                    >
                      <button 
                        onClick={() => { setFontFamily('sans'); setShowFontSettings(false); }}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg text-[11px] font-sans flex items-center justify-between transition-colors",
                          fontFamily === 'sans' ? "bg-brand-red/20 text-brand-red font-bold" : "text-muted-text hover:bg-white/5"
                        )}
                      >
                        <span>黑</span>
                      </button>
                      <button 
                        onClick={() => { setFontFamily('serif'); setShowFontSettings(false); }}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg text-[11px] font-serif flex items-center justify-between transition-colors",
                          fontFamily === 'serif' ? "bg-brand-red/20 text-brand-red font-bold" : "text-muted-text hover:bg-white/5"
                        )}
                      >
                        <span>宋</span>
                      </button>

                      <div className="h-px bg-hud-border/30 my-0.5 mx-1" />

                      <button 
                        onClick={() => { setFontSize('standard'); setShowFontSettings(false); }}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg flex items-center justify-between transition-colors",
                          fontSize === 'standard' ? "bg-brand-red/20 text-brand-red font-bold" : "text-muted-text hover:bg-white/5"
                        )}
                      >
                        <span className="text-sm font-bold">A</span>
                        <span className="text-[9px] opacity-30 mt-0.5 uppercase tracking-tighter">标准 18</span>
                      </button>
                      <button 
                        onClick={() => { setFontSize('compact'); setShowFontSettings(false); }}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg flex items-center justify-between transition-colors",
                          fontSize === 'compact' ? "bg-brand-red/20 text-brand-red font-bold" : "text-muted-text hover:bg-white/5"
                        )}
                      >
                        <span className="text-xs font-bold">a</span>
                        <span className="text-[9px] opacity-30 mt-0.5 uppercase tracking-tighter">紧凑 16</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Expand Editor Button */}
            <button 
              onClick={() => setIsImmersive(true)}
              className={cn(
                "w-[32px] h-[32px] flex items-center justify-center transition-all duration-200 rounded-[8px] border ml-0.5",
                isDarkMode ? "bg-transparent text-muted-text border-white/10 hover:bg-white/5 hover:text-white" : "bg-transparent text-muted-text border-hud-border/40 hover:bg-black/5 hover:text-text-main"
              )}
              title="沉浸式阅读"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
        
        {/* Progress Bar for Automation/Typewriter mode */}
        {status === 'processing' && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red/10 overflow-hidden">
            <motion.div 
              className="h-full bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.8)]"
              initial={{ width: "0%" }}
              animate={{ 
                width: isPlaying ? `${(streamIndex / STREAM_CONTENT.length) * 100}%` : `${(streamIndex / STREAM_CONTENT.length) * 100}%`,
                transition: { duration: 0.1 }
              }}
            />
          </div>
        )}
      </div>

      <div 
        className="flex-1 overflow-y-auto custom-scrollbar relative px-12"
        style={{
          paddingTop: typeof topOffset === 'string' ? topOffset : `${topOffset}px`,
          paddingBottom: typeof bottomOffset === 'string' ? `calc(${bottomOffset} + 40vh)` : `calc(${bottomOffset}% + 40vh)`,
        }}
      >
        {/* HUD Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
          <div className="w-full h-px bg-brand-red animate-scanline" />
        </div>
        
        <div className="flex flex-col items-center w-full relative group min-h-full py-12">
          <div className="w-full max-w-3xl relative">
            <AnimatePresence mode="wait">
              {isEnrichedMode ? (
                <motion.div
                  key="enriched"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "w-full leading-relaxed pr-4",
                    fontClass,
                    sizeClass
                  )}
                >
                  <EnrichedContent content={content} isDarkMode={isDarkMode} />
                </motion.div>
              ) : (
                <motion.div
                  key="textarea"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <textarea
                    ref={textareaRef}
                    value={status === 'processing' && isPlaying ? content + "▋" : content}
                    onChange={(e) => onChange(e.target.value)}
                    readOnly={status === 'processing' && isPlaying}
                    className={cn(
                      "w-full bg-transparent border-none outline-none resize-none text-text-main leading-relaxed placeholder:text-muted-text selection:bg-brand-red/30 pr-4 overflow-hidden transition-all duration-300",
                      fontClass,
                      sizeClass,
                      status === 'processing' && isPlaying && "caret-transparent"
                    )}
                    placeholder="开始你的创作..."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Immersive Reading Mode Overlay (Teleported to body for true fullscreen) */}
      {typeof document !== 'undefined' && isImmersive && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-[9999] flex flex-col items-center justify-center p-8 md:p-20 overflow-hidden",
              isDarkMode ? "bg-black" : "bg-[#f4f1ea]"
            )}
          >
            {/* Immersive Controls */}
            <div className="absolute top-8 right-10 flex items-center gap-4 z-[200]">
              <button 
                onClick={() => setIsImmersive(false)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-display tracking-widest uppercase transition-all pointer-events-auto",
                  isDarkMode 
                    ? "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white" 
                    : "bg-black/5 border-black/10 text-black/40 hover:bg-black/10 hover:text-black"
                )}
              >
                退出沉浸模式 <span className="opacity-30">退出键</span>
              </button>
            </div>

            {/* Immersive Fixed Header */}
            <div className="absolute top-0 left-0 right-0 z-[120] pt-12 pb-16 flex flex-col items-center pointer-events-none">
              {/* Gradient mask to hide scrolling text behind title */}
              <div className={cn(
                "absolute inset-0 z-[-1] h-[220px]",
                isDarkMode 
                  ? "bg-gradient-to-b from-black via-black/95 to-transparent" 
                  : "bg-gradient-to-b from-[#f4f1ea] via-[#f4f1ea]/95 to-transparent"
              )} />
              
              <div className="text-center space-y-4 px-6">
                <h1 className={cn(
                  "text-3xl md:text-4xl font-display font-black tracking-[0.2em] drop-shadow-sm",
                  isDarkMode ? "text-white/90" : "text-black"
                )}>
                  {title}
                </h1>
                <div className="flex items-center justify-center gap-4 opacity-40">
                  <div className="h-px w-12 bg-current" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.5em]">沉浸式阅读模式</span>
                  <div className="h-px w-12 bg-current" />
                </div>
              </div>
            </div>

            <div className="w-full max-w-4xl flex-1 overflow-y-auto pt-52 pb-24 px-6 custom-scrollbar scroll-smooth relative z-[105]">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={cn(
                  "prose dark:prose-invert transition-all duration-500 mx-auto",
                  fontFamily === 'serif' ? "font-serif" : "font-sans",
                  "text-xl md:text-2xl leading-[2] tracking-wide",
                  isDarkMode ? "text-white/90 selection:bg-brand-red/40" : "text-black/80 selection:bg-brand-red/20"
                )}
                >
                  <EnrichedContent content={content} isDarkMode={isDarkMode} />
                </motion.div>
              
              <div className="h-40" /> {/* Extra space at bottom */}
            </div>

            {/* Subtle bottom progress marker */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-display uppercase tracking-[0.4em] opacity-30">墨枢 · 沉浸阅读</span>
                <div className="h-0.5 w-12 bg-brand-red rounded-full" />
              </div>
              <div className="text-[10px] font-mono opacity-20 uppercase tracking-widest">
                © {new Date().getFullYear()} PLOT PILOT
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}


