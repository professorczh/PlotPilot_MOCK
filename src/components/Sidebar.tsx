import { Search, List, ChevronRight, Plus, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  chapters: { id: string; title: string; wordCount: number }[];
  activeChapterId: string;
  onChapterSelect: (id: string) => void;
}

export default function Sidebar({ chapters, activeChapterId, onChapterSelect }: SidebarProps) {
  return (
    <div className="w-full bg-panel-bg/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-text">
            <List className="w-4 h-4" />
            <span className="text-xs font-display font-bold uppercase tracking-[0.2em]">Navigation</span>
          </div>
          <button className="p-1 text-muted-text hover:text-brand-red transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-brand-red transition-colors" />
          <input 
            type="text" 
            placeholder="Search chapters..." 
            className="w-full bg-app-bg/50 border border-hud-border rounded-md py-1.5 pl-9 pr-3 text-xs text-text-main placeholder:text-muted-text focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/20 transition-all font-sans"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
        <div className="space-y-0.5">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => onChapterSelect(chapter.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all border border-transparent group",
                activeChapterId === chapter.id 
                  ? "bg-brand-red/10 border-brand-red/30 text-text-main shadow-[inset_0_0_10px_rgba(220,38,38,0.05)]" 
                  : "text-muted-text hover:bg-brand-red/5 hover:text-text-main"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-xs font-mono px-1.5 py-0.5 rounded border transition-colors",
                  activeChapterId === chapter.id 
                    ? "bg-brand-red border-brand-red text-white" 
                    : "bg-app-bg border-hud-border text-muted-text group-hover:border-brand-red/50"
                )}>
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <span className="text-xs font-medium truncate max-w-[120px]">{chapter.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {chapter.wordCount.toLocaleString()}
                </span>
                <ChevronRight className={cn("w-3 h-3 transition-transform", activeChapterId === chapter.id ? "rotate-90 text-brand-red" : "text-muted-text")} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-hud-border bg-app-bg/30">
        <div className="flex items-center justify-between text-xs font-mono text-muted-text mb-2 tracking-tighter">
          <span>SYSTEM STATUS</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
        <div className="h-1 bg-hud-border rounded-full overflow-hidden">
          <div className="h-full bg-brand-red w-3/4 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
        </div>
      </div>
    </div>
  );
}

