import { ChevronDown, BarChart2, Sparkles, PanelLeft, Briefcase, Activity } from 'lucide-react';
import { ThemeMode } from '../types';

interface SidebarHeaderProps {
  onLogoClick: () => void;
  onToggleSidebar: () => void;
  theme: ThemeMode;
}

export function SidebarHeader({ onLogoClick, onToggleSidebar, theme }: SidebarHeaderProps) {
  return (
    <div className={`h-14 bg-app-bg flex items-center justify-between px-4 text-text-main shrink-0 transition-colors duration-300`}>
      <div className="flex items-center gap-2">
        <button 
          onClick={onLogoClick}
          className="font-sans font-bold text-brand-red tracking-wider text-xl uppercase hover:opacity-80 transition-opacity active:scale-95 shrink-0"
        >
          PLOT PILOT
        </button>
      </div>
      
      <button 
        onClick={onToggleSidebar}
        className="text-muted-text hover:text-brand-red transition-colors p-1.5 rounded-lg hover:bg-white/5 active:scale-90" 
        title="收起侧边栏"
      >
        <PanelLeft className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
}

interface MainHeaderProps {
  isAnalyticsVisible: boolean;
  onToggleAnalytics: () => void;
  isAIPanelVisible: boolean;
  onToggleAIPanel: () => void;
  theme: ThemeMode;
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
}

export function MainHeader({ 
  isAnalyticsVisible, 
  onToggleAnalytics, 
  isAIPanelVisible, 
  onToggleAIPanel, 
  theme,
  onToggleSidebar,
  isSidebarVisible
}: MainHeaderProps) {
  return (
    <div className={`h-14 bg-app-bg flex items-center justify-between px-6 text-text-main shrink-0 transition-colors duration-300`}>
      <div className="flex items-center gap-4 overflow-hidden">
        {!isSidebarVisible && (
          <button 
            onClick={onToggleSidebar}
            className="text-muted-text hover:text-brand-red transition-colors p-1.5 rounded-lg hover:bg-white/5 active:scale-90 shrink-0" 
            title="展开侧边栏"
          >
            <PanelLeft className="w-[18px] h-[18px]" />
          </button>
        )}
        
        <div className="flex items-center gap-2 bg-app-bg/50 px-3 py-1.5 rounded-lg border border-hud-border cursor-pointer hover:border-brand-red/50 transition-all group shrink-0">
          <span className="text-muted-text group-hover:text-text-main transition-colors text-sm font-sans tracking-tight">重生之我在大秦审PR</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:text-brand-red shrink-0" />
        </div>

        {/* Container for bulk movement */}
        <div id="stats-wrapper" className="flex items-center text-xs font-mono uppercase tracking-widest">
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="text-muted-text">字数统计</span>
              <span className="text-text-main font-medium">197,145</span>
            </div>
            <div className="flex flex-col items-center hidden sm:flex">
              <span className="text-muted-text">章节总数</span>
              <span className="text-text-main font-medium">65/65</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-text">创作进度</span>
              <span className="text-brand-red font-bold">100.0%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleAnalytics}
          className={`flex items-center gap-2 transition-colors group px-2 py-1 rounded-lg cursor-pointer ${isAnalyticsVisible ? 'text-brand-red bg-brand-red/10' : 'text-muted-text hover:text-brand-red'}`}
          title={isAnalyticsVisible ? "隐藏分析面板" : "显示分析面板"}
        >
          <Activity className={`w-3.5 h-3.5 ${isAnalyticsVisible ? '' : 'group-hover:animate-pulse'}`} />
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest hidden md:inline">分析面板</span>
        </button>

        <button 
          onClick={onToggleAIPanel}
          className={`flex items-center gap-2 transition-colors group px-2 py-1 rounded-lg cursor-pointer ${isAIPanelVisible ? 'text-brand-red bg-brand-red/10' : 'text-muted-text hover:text-brand-red'}`}
          title={isAIPanelVisible ? "隐藏工具面板" : "显示工具面板"}
        >
          <Briefcase className={`w-3.5 h-3.5 ${isAIPanelVisible ? '' : 'group-hover:animate-pulse'}`} />
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest hidden md:inline">工具面板</span>
        </button>
      </div>
    </div>
  );
}
