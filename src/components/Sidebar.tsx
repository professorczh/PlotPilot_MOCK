import { useState } from 'react';
import { Search, ChevronRight, Plus, Library, Book, FileText, ChevronDown, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { NovelBook, ThemeMode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  book: NovelBook;
  activeChapterId: string;
  onChapterSelect: (id: string) => void;
  theme?: ThemeMode;
}

export default function Sidebar({ book, activeChapterId, onChapterSelect, theme = 'ink' }: SidebarProps) {
  const isDarkMode = theme === 'ink';
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([book.id, book.volumes[0].id, book.volumes[0].stages[0].id]));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedIds(next);
  };

  const isExpanded = (id: string) => expandedIds.has(id);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="p-4 space-y-4 shrink-0">
        <div className="flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-2 text-muted-text overflow-hidden">
            <Library className="w-4 h-4 shrink-0" />
            <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] truncate">章节目录</span>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-brand-red transition-colors" />
          <input 
            type="text" 
            placeholder="搜索章节..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-bg/50 border border-hud-border rounded-lg py-1.5 pl-9 pr-3 text-xs text-text-main placeholder:text-muted-text focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/20 transition-all font-sans"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
        <div className="space-y-1">
          {/* Level 1: Book */}
          <div className="space-y-1">
            <button 
              onClick={() => toggleExpand(book.id)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors group",
                isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"
              )}
            >
              {isExpanded(book.id) ? <ChevronDown className="w-3.5 h-3.5 text-muted-text" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-text" />}
              <Library className="w-4 h-4 text-brand-red" />
              <span className="text-xs font-bold font-sans tracking-wider truncate text-text-main">{book.title}</span>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded(book.id) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-1 ml-2 border-l border-hud-border/40 pl-2"
                >
                  {/* Level 2: Volumes */}
                  {book.volumes.map(volume => (
                    <div key={`sidebar-vol-${volume.id}`} className="space-y-1">
                      <button 
                        onClick={() => toggleExpand(volume.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors group",
                          isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"
                        )}
                      >
                        {isExpanded(volume.id) ? <ChevronDown className="w-3 h-3 text-muted-text" /> : <ChevronRight className="w-3 h-3 text-muted-text" />}
                        <Book className="w-3.5 h-3.5 text-brand-red opacity-80" />
                        <span className="text-xs font-medium truncate text-text-main/90">{volume.title}</span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded(volume.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-1 ml-2 border-l border-hud-border/40 pl-2"
                          >
                            {/* Level 3: Stages */}
                            {volume.stages.map(stage => (
                              <div key={`sidebar-stage-${stage.id}`} className="space-y-1">
                                <button 
                                  onClick={() => toggleExpand(stage.id)}
                                  className={cn(
                                    "w-full flex flex-col px-2 py-2 rounded-lg transition-colors group",
                                    isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    {isExpanded(stage.id) ? <ChevronDown className="w-2.5 h-2.5 text-muted-text" /> : <ChevronRight className="w-2.5 h-2.5 text-muted-text" />}
                                    <span className="text-[11px] font-bold text-text-main/80 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                                      {stage.title}
                                    </span>
                                  </div>
                                  {stage.description && (
                                    <p className="text-[10px] text-muted-text mt-1 pl-4 leading-relaxed line-clamp-2 opacity-60 font-sans text-left">
                                      {stage.description}
                                    </p>
                                  )}
                                </button>

                                <AnimatePresence initial={false}>
                                  {isExpanded(stage.id) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden space-y-0.5 ml-4 border-l border-hud-border/30 pl-3"
                                    >
                                      {/* Level 4: Chapters */}
                                      {stage.chapters.map((chapter) => (
                                        <div
                                          key={`sidebar-chap-${chapter.id}`}
                                          onClick={() => onChapterSelect(chapter.id)}
                                          role="button"
                                          tabIndex={0}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                              onChapterSelect(chapter.id);
                                            }
                                          }}
                                          className={cn(
                                            "w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all group cursor-pointer",
                                            activeChapterId === chapter.id 
                                              ? "bg-brand-red/10 text-text-main" 
                                              : cn("text-muted-text hover:text-text-main", isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5")
                                          )}
                                        >
                                          <div className="flex-1 min-w-0 flex items-center gap-2">
                                            <FileText className={cn("w-3 h-3 flex-shrink-0", activeChapterId === chapter.id ? "text-brand-red" : "text-muted-text/50")} />
                                            <span className="text-[11px] truncate">{chapter.title}</span>
                                          </div>
                                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                            {chapter.status === 'completed' && (
                                              <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">已收稿</span>
                                            )}
                                            {chapter.status === 'processing' && (
                                              <div className="flex items-center gap-1.5">
                                                <motion.span 
                                                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1, 0.98] }}
                                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                  className="text-[8px] bg-brand-red/10 text-brand-red px-1.5 py-0.5 rounded-full border border-brand-red/20 font-bold uppercase shadow-[0_0_8px_rgba(220,38,38,0.2)]"
                                                >
                                                  收稿中
                                                </motion.span>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    // This will trigger the same automation flow
                                                    onChapterSelect(chapter.id);
                                                    setTimeout(() => {
                                                       (window as any).startAutomation?.();
                                                    }, 100);
                                                  }}
                                                  className="w-5 h-5 flex items-center justify-center rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red hover:bg-brand-red hover:text-white transition-all duration-300"
                                                  title="启动协同模式"
                                                >
                                                   <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                                                </button>
                                              </div>
                                            )}
                                            {chapter.status === 'draft' && (
                                              <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-full border border-amber-500/20 font-bold uppercase">未收稿</span>
                                            )}
                                            {chapter.wordCount > 0 && (
                                              <span className="text-[9px] font-mono opacity-40">{chapter.wordCount}</span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-hud-border bg-app-bg/30">
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-text mb-1 tracking-tighter uppercase opacity-60">
          <span>逻辑节点状态</span>
          <span className="text-emerald-400">在线</span>
        </div>
        <div className="h-1 bg-hud-border rounded-full overflow-hidden">
          <div className="h-full bg-brand-red w-3/4 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
        </div>
      </div>
    </div>
  );
}

