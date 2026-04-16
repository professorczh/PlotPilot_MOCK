import { Sparkles, Wand2, FileText, History, Edit3 } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
}

export default function Editor({ content, onChange, title }: EditorProps) {
  return (
    <div className="h-full flex flex-col bg-app-bg overflow-hidden relative">
      <div className="h-12 border-b border-hud-border flex items-center justify-between px-6 bg-panel-bg/80 backdrop-blur-md shrink-0 z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <h2 className="text-text-main font-display font-semibold tracking-wide uppercase">{title}</h2>
          <div className="flex items-center gap-1 text-[10px] text-muted-text font-mono uppercase tracking-tighter">
            <span>Synced</span>
            <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1 rounded bg-panel-bg border border-hud-border text-[10px] font-mono uppercase text-muted-text hover:text-emerald-400 hover:border-emerald-400/50 transition-all group">
            <Sparkles className="w-3 h-3 group-hover:animate-pulse" />
            <span>Analyze</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded bg-panel-bg border border-hud-border text-[10px] font-mono uppercase text-muted-text hover:text-blue-400 hover:border-blue-400/50 transition-all group">
            <Wand2 className="w-3 h-3 group-hover:animate-pulse" />
            <span>Polish</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded bg-brand-red/10 border border-brand-red/30 text-[10px] font-mono uppercase text-brand-red hover:bg-brand-red/20 transition-all shadow-[0_0_10px_rgba(220,38,38,0.1)]">
            <Edit3 className="w-3 h-3" />
            <span>Continue</span>
          </button>
          <div className="w-px h-4 bg-hud-border mx-1" />
          <button className="p-1.5 text-muted-text hover:text-text-main transition-colors">
            <History className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-text hover:text-text-main transition-colors">
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 relative">
        {/* HUD Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
          <div className="w-full h-px bg-brand-red animate-scanline" />
        </div>
        
        <div className="max-w-4xl mx-auto min-h-full bg-panel-bg/40 p-8 lg:p-16 rounded-xl shadow-2xl border border-hud-border/50 backdrop-blur-sm relative group">
          {/* HUD Corner Accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-red/30 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-brand-red/30 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-red/30 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-brand-red/30 rounded-br-xl" />

          <textarea
            value={content.replace(/<[^>]*>/g, '')}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[500px] bg-transparent border-none outline-none resize-none text-text-main text-lg leading-relaxed font-sans placeholder:text-muted-text selection:bg-brand-red/30 pr-4"
            placeholder="Start your creation..."
          />
        </div>
      </div>
    </div>
  );
}


