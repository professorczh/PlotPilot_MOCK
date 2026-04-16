import { Book, ChevronDown, Plus, Trash2, User, BarChart2, Sun, Moon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogoClick: () => void;
  onOpenSettings: () => void;
}

export default function Header({ isDarkMode, onToggleTheme, onLogoClick, onOpenSettings }: HeaderProps) {
  return (
    <header className={`h-14 border-b ${!isDarkMode ? 'border-brand-red' : 'border-hud-border'} bg-panel-bg/90 backdrop-blur-md flex items-center justify-between px-4 text-text-main z-50 transition-colors duration-300`}>
      <div className="flex items-center gap-6">
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 font-display font-bold text-brand-red tracking-wider text-xl uppercase hover:opacity-80 transition-opacity active:scale-95"
        >
          <Book className="w-6 h-6" />
          <span>Plot Pilot</span>
        </button>
        
        <div className="flex items-center gap-4 text-sm font-sans">
          <div className="flex items-center gap-2 bg-app-bg/50 px-3 py-1 rounded-md border border-hud-border cursor-pointer hover:border-brand-red/50 transition-all group">
            <span className="text-muted-text group-hover:text-text-main transition-colors">修真界的都市访客</span>
            <ChevronDown className="w-4 h-4 opacity-50 group-hover:text-brand-red" />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 bg-brand-red hover:bg-red-700 text-white px-3 py-1 rounded-md transition-all shadow-[0_0_10px_rgba(220,38,38,0.2)] active:scale-95">
              <Plus className="w-4 h-4" />
              <span className="font-medium">新建小说</span>
            </button>
            <button className="p-1.5 text-muted-text hover:text-brand-red transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 text-xs font-mono uppercase tracking-widest">
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-muted-text">Word Count</span>
            <span className="text-text-main font-medium">197,145</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-text">Chapters</span>
            <span className="text-text-main font-medium">65/65</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-text">Progress</span>
            <span className="text-brand-red font-bold">100.0%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-text">Views</span>
            <span className="text-text-main font-medium">3,033</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-hud-border pl-6">
          {/* Theme Toggle */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleTheme();
            }}
            className="p-2 rounded-full hover:bg-app-bg transition-colors relative overflow-hidden group z-[60] pointer-events-auto"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDarkMode ? 'dark' : 'light'}
                initial={{ y: 20, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-muted-text group-hover:text-blue-400 transition-colors" />
                ) : (
                  <Sun className="w-4 h-4 text-muted-text group-hover:text-amber-500 transition-colors" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>

          <div className="flex items-center gap-2 text-muted-text hover:text-brand-red cursor-pointer transition-colors group">
            <BarChart2 className="w-4 h-4 group-hover:animate-pulse" />
            <span className="font-display tracking-tighter">Fullscreen</span>
          </div>

          <button 
            onClick={onOpenSettings}
            className="p-2 rounded-full hover:bg-app-bg transition-colors text-muted-text hover:text-brand-red group"
            title="API Settings"
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          </button>

          <div className="w-8 h-8 rounded-full bg-app-bg flex items-center justify-center border border-hud-border cursor-pointer hover:border-brand-red transition-all shadow-inner">
            <User className="w-4 h-4 text-muted-text" />
          </div>
        </div>
      </div>
    </header>
  );
}

