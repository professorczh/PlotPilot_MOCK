import { Sparkles, MessageSquare, Briefcase, Brain, Lightbulb, Wand2, History, Trash2, Terminal, Map, LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { SidebarTab } from '../types';

interface AIActivityBarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onToggleAgent: () => void;
  onShowLogs: () => void;
  onOpenExplorer?: () => void;
  isAgentMode?: boolean;
  isPanelVisible?: boolean;
}

interface NavItem {
  id: SidebarTab;
  icon: LucideIcon;
  label: string;
}

const aiNavItems: NavItem[] = [
  { id: 'ai-chat', icon: Briefcase, label: '灵感工具' },
  { id: 'ai-deduce', icon: Map, label: '世界架构' },
  { id: 'ai-suggest', icon: Lightbulb, label: '创作建议' },
];

export default function AIActivityBar({ activeTab, onTabChange, onToggleAgent, onShowLogs, onOpenExplorer, isAgentMode, isPanelVisible }: AIActivityBarProps) {
  const isAgentActive = isAgentMode && isPanelVisible;
  const isLogsActive = activeTab === 'ai-logs' && isPanelVisible && !isAgentMode;

  return (
    <div className="w-[48px] bg-app-bg flex flex-col items-center pb-4 z-10 relative">
      {/* AI Logo Section (56px high to match Header) */}
      <div className="h-14 w-full flex items-center justify-center shrink-0 bg-app-bg">
        <button 
          onClick={onToggleAgent}
          className={cn(
            "transition-all duration-500 active:scale-90 p-1.5 rounded-lg",
            isAgentActive ? "text-brand-red bg-brand-red/10" : "text-muted-text hover:text-brand-red"
          )}
          title={isAgentActive ? "关闭墨枢灵感核心" : "开启墨枢灵感核心 (Agent)"}
        >
          <Sparkles className={cn(
            "w-5 h-5",
            isAgentActive ? "" : "opacity-60"
          )} />
        </button>
      </div>

      {/* Main Container for AI items */}
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Items Section */}
        <div className="flex-1 w-full flex flex-col items-center gap-4 pt-4">
          {aiNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'ai-chat') {
                  onTabChange(item.id);
                } else if (item.id === 'ai-deduce') {
                  onOpenExplorer?.();
                }
              }}
              className={cn(
                "group relative p-2.5 transition-all duration-300 rounded-lg",
                (activeTab === item.id && isPanelVisible && !isAgentMode)
                  ? "text-brand-red bg-brand-red/10" 
                  : "text-muted-text hover:text-text-main hover:bg-white/5",
                (item.id !== 'ai-chat' && item.id !== 'ai-deduce') && "cursor-not-allowed opacity-60"
              )}
              title={(item.id === 'ai-chat' || item.id === 'ai-deduce') ? item.label : `${item.label} (开发中)`}
            >
              <item.icon className={cn(
                "w-[18px] h-[18px] transition-transform duration-300",
                (activeTab === item.id && isPanelVisible && !isAgentMode) ? "scale-110" : "scale-100 group-hover:scale-110",
                (item.id !== 'ai-chat' && item.id !== 'ai-deduce') && "group-hover:scale-100"
              )} />
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pb-2">
          <button 
            onClick={onShowLogs}
            className={cn(
              "group relative p-2.5 transition-all duration-300 rounded-lg",
              isLogsActive 
                ? "text-brand-red bg-brand-red/10" 
                : "text-muted-text hover:text-text-main hover:bg-white/5"
            )}
            title="系统日志"
          >
            <Terminal className={cn(
              "w-[18px] h-[18px] transition-transform duration-300",
              isLogsActive ? "scale-110" : "group-hover:scale-110"
            )} />
          </button>
        </div>

      </div>
    </div>
  );
}
