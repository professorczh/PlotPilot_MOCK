import { Book, FileText, Search, Globe, GitBranch, Settings, LucideIcon, Sun, Moon, Terminal, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import { SidebarTab, ThemeMode } from '../types';

interface ActivityBarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

interface NavItem {
  id: SidebarTab;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'chapters', icon: FileText, label: '章节目录' },
  { id: 'branch', icon: GitBranch, label: '分支管理' },
  { id: 'search', icon: Search, label: '全局搜索' },
  { id: 'world', icon: Globe, label: '世界百科' },
];

export default function ActivityBar({ activeTab, onTabChange, theme, onThemeChange }: ActivityBarProps) {
  const [isThemeHovered, setIsThemeHovered] = useState(false);
  const isDarkMode = theme === 'ink';
  const isPaperMode = theme === 'paper';
  const isClassicMode = theme === 'classic';

  return (
    <div className="w-[48px] bg-app-bg flex flex-col items-center pb-4 z-50 relative border-r border-hud-border/20">
      {/* Logo Section */}
      <div className={`h-14 w-full flex items-center justify-center shrink-0 bg-app-bg transition-colors duration-300`}>
        <button 
          onClick={() => window.location.hash = '#landing'} 
          className="text-brand-red hover:opacity-80 transition-opacity active:scale-90 p-2 rounded-xl"
        >
          <Book className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Items Section */}
        <div className="flex-1 w-full flex flex-col items-center gap-4 pt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "group relative p-2.5 transition-all duration-300 rounded-lg",
                activeTab === item.id 
                  ? "text-brand-red bg-brand-red/10" 
                  : "text-muted-text hover:text-text-main hover:bg-white/5"
              )}
              title={item.label}
            >
              <item.icon className={cn(
                "w-[18px] h-[18px] transition-transform duration-300",
                activeTab === item.id ? "scale-110" : "scale-100 group-hover:scale-110"
              )} />
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-4 mt-auto w-full">
          {/* Theme Selector Container */}
          <div 
            className="relative w-full flex justify-center"
            onMouseEnter={() => setIsThemeHovered(true)}
            onMouseLeave={() => setIsThemeHovered(false)}
          >
            <button 
              className={cn(
                "p-2.5 transition-all duration-300 text-muted-text hover:text-text-main hover:bg-white/5 relative overflow-hidden group rounded-lg",
                isThemeHovered && "bg-white/5 text-text-main"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? (
                    <Moon className="w-[18px] h-[18px] transition-colors group-hover:text-blue-400" />
                  ) : isPaperMode ? (
                    <Sun className="w-[18px] h-[18px] transition-colors group-hover:text-amber-500" />
                  ) : (
                    <Monitor className="w-[18px] h-[18px] transition-colors group-hover:text-blue-500" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Expanded Theme Menu */}
            <AnimatePresence>
              {isThemeHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  className="absolute left-full ml-2 flex items-center bg-panel-bg border border-hud-border/40 rounded-lg p-1 shadow-2xl backdrop-blur-xl z-[60]"
                >
                  <div className="flex items-center gap-1">
                    <ThemeButton 
                      isActive={isDarkMode} 
                      onClick={() => onThemeChange('ink')} 
                      icon={Moon} 
                      label="深色模式 (Ink)"
                      colorClass="text-blue-400"
                    />
                    <ThemeButton 
                      isActive={isPaperMode} 
                      onClick={() => onThemeChange('paper')} 
                      icon={Sun} 
                      label="浅色模式 (Paper)"
                      colorClass="text-amber-500"
                    />
                    <div className="w-px h-4 bg-hud-border/40 mx-1" />
                    <ThemeButton 
                      isActive={isClassicMode} 
                      onClick={() => onThemeChange('classic')} 
                      icon={Terminal} 
                      label="浅色清爽 (Classic)"
                      colorClass="text-blue-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => onTabChange('settings')}
            className={cn(
              "p-2.5 transition-all duration-300 text-muted-text hover:text-text-main hover:bg-white/5 rounded-lg",
              activeTab === 'settings' && "text-brand-red bg-brand-red/10"
            )}
            title="设置"
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ThemeButton({ isActive, onClick, icon: Icon, label, colorClass }: { 
  isActive: boolean; 
  onClick: () => void; 
  icon: LucideIcon; 
  label: string;
  colorClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded transition-all group whitespace-nowrap",
        isActive 
          ? "bg-white/10 text-text-main" 
          : "text-muted-text hover:bg-white/5 hover:text-text-main"
      )}
      title={label}
    >
      <Icon className={cn("w-4 h-4 transition-colors", isActive ? colorClass : "group-hover:" + colorClass)} />
      <span className="text-[11px] font-medium font-sans">{label.split(' ')[0]}</span>
    </button>
  );
}
