import { Sparkles, MessageSquare, Briefcase, Brain, Lightbulb, Wand2, History, Trash2, LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { SidebarTab } from '../types';

interface AIActivityBarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onToggleAgent: () => void;
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
  { id: 'ai-deduce', icon: Brain, label: '剧情推演' },
  { id: 'ai-suggest', icon: Lightbulb, label: '创作建议' },
  { id: 'ai-polish', icon: Wand2, label: '文字润色' },
];

export default function AIActivityBar({ activeTab, onTabChange, onToggleAgent, isAgentMode, isPanelVisible }: AIActivityBarProps) {
  const isAgentActive = isAgentMode && isPanelVisible;

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
                }
              }}
              className={cn(
                "group relative p-2.5 transition-all duration-300 rounded-lg",
                (activeTab === item.id && isPanelVisible && !isAgentMode)
                  ? "text-brand-red bg-brand-red/10" 
                  : "text-muted-text hover:text-text-main hover:bg-white/5",
                item.id !== 'ai-chat' && "cursor-not-allowed opacity-60"
              )}
              title={item.id === 'ai-chat' ? item.label : `${item.label} (开发中)`}
            >
              <item.icon className={cn(
                "w-[18px] h-[18px] transition-transform duration-300",
                (activeTab === item.id && isPanelVisible && !isAgentMode) ? "scale-110" : "scale-100 group-hover:scale-110",
                item.id !== 'ai-chat' && "group-hover:scale-100"
              )} />
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-4 mt-auto">
          <button 
            className="p-2.5 transition-all duration-300 text-muted-text hover:text-text-main hover:bg-white/5 rounded-lg"
            title="历史记录"
          >
            <History className="w-[18px] h-[18px]" />
          </button>

          <button
            className="p-2.5 transition-all duration-300 text-muted-text hover:text-red-400 hover:bg-red-500/5 rounded-lg"
            title="清空上下文"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
