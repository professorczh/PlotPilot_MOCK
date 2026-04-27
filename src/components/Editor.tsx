import { Sparkles, Wand2, FileText, History, Edit3, Activity } from 'lucide-react';
import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  topOffset?: string | number;
  bottomOffset?: string | number;
  onToggleAnalytics?: () => void;
  isAnalyticsVisible?: boolean;
  isDarkMode?: boolean;
}

export default function Editor({ 
  content, 
  onChange, 
  title, 
  topOffset = 0, 
  bottomOffset = 0,
  onToggleAnalytics,
  isAnalyticsVisible,
  isDarkMode = true
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('serif');
  const [fontSize, setFontSize] = useState<'standard' | 'compact'>('standard');

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
    <div className="h-full flex flex-col bg-app-bg overflow-hidden relative">
      <div className="h-12 bg-app-bg shrink-0 z-20 sticky top-0">
        <div className="w-full h-full flex items-center justify-between pl-12 pr-12">
          <div className="flex items-center gap-4">
            <h2 className="text-text-main font-sans font-semibold tracking-wide uppercase">{title}</h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">
              <span>已收稿</span>
              <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">


            <button 
              onClick={onToggleAnalytics}
              className={cn(
                "h-[32px] flex items-center gap-2 px-3 transition-all duration-200 rounded-[8px] border font-medium text-[13px] tracking-tight group",
                isAnalyticsVisible 
                  ? (isDarkMode ? "bg-white text-black border-transparent" : "bg-black text-white border-transparent")
                  : (isDarkMode ? "bg-white/5 text-muted-text border-white/10 hover:bg-white/10 hover:text-white" : "bg-white text-muted-text border-hud-border/40 hover:bg-black/5 hover:text-text-main")
              )}
              title={isAnalyticsVisible ? "隐藏张力心电图" : "显示张力心电图"}
            >
              <Activity className={cn("w-3.5 h-3.5 transition-all", isAnalyticsVisible ? "stroke-[2px]" : "stroke-[1.5px]")} />
              <span className="whitespace-nowrap">张力心电图</span>
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

            <button className={cn(
              "w-[32px] h-[32px] flex items-center justify-center transition-all duration-200 rounded-[8px] border",
              isDarkMode ? "bg-transparent text-muted-text border-white/10 hover:bg-white/5 hover:text-white" : "bg-transparent text-muted-text border-hud-border/40 hover:bg-black/5 hover:text-text-main"
            )}>
              <History className="w-3.5 h-3.5 stroke-[1.5px]" />
            </button>
            <button className={cn(
              "w-[32px] h-[32px] flex items-center justify-center transition-all duration-200 rounded-[8px] border",
              isDarkMode ? "bg-transparent text-muted-text border-white/10 hover:bg-white/5 hover:text-white" : "bg-transparent text-muted-text border-hud-border/40 hover:bg-black/5 hover:text-text-main"
            )}>
              <FileText className="w-3.5 h-3.5 stroke-[1.5px]" />
            </button>
          </div>
        </div>
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
            <textarea
              ref={textareaRef}
              value={cleanContent}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                "w-full bg-transparent border-none outline-none resize-none text-text-main leading-relaxed placeholder:text-muted-text selection:bg-brand-red/30 pr-4 overflow-hidden transition-all duration-300",
                fontClass,
                sizeClass
              )}
              placeholder="开始你的创作..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}


