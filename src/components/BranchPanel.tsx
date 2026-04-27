import { useState } from 'react';
import { GitBranch, GitCommit, GitMerge, Clock, Plus, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface BranchPanelProps {
  isMockLoadingEnabled?: boolean;
}

interface Commit {
  id: string;
  message: string;
  timestamp: string;
  author: string;
}

interface Branch {
  id: string;
  name: string;
  isMain: boolean;
  commits: Commit[];
}

export default function BranchPanel({ isMockLoadingEnabled = true }: BranchPanelProps) {
  const [commitMessage, setCommitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBranchId, setActiveBranchId] = useState('main');

  const [branches] = useState<Branch[]>([
    {
      id: 'main',
      name: 'main',
      isMain: true,
      commits: [
        { id: 'c1', message: '初始大纲架构完成', timestamp: '2026-04-18 14:20', author: '系统' },
        { id: 'c2', message: '第一章：天台法阵逻辑修正', timestamp: '2026-04-19 10:15', author: '您' },
        { id: 'c3', message: '第二章：邂逅神秘老者情节铺垫', timestamp: '2026-04-19 15:47', author: '您' },
      ]
    },
    {
      id: 'ending-a',
      name: 'ENDING-A-EXPERIMENT',
      isMain: false,
      commits: [
        { id: 'c4', message: '角色张磊结局A：最终和解', timestamp: '2026-04-19 11:30', author: 'AI-推演' },
        { id: 'c5', message: '修正：和解后的情感共鸣描写', timestamp: '2026-04-19 12:00', author: '您' },
      ]
    },
    {
      id: 'dark-timeline',
      name: 'DARK-TIMELINE',
      isMain: false,
      commits: [
        { id: 'c6', message: '暗黑结局设定：全员覆灭', timestamp: '2026-04-19 09:00', author: 'AI-推演' },
      ]
    }
  ]);

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    
    setIsSubmitting(true);
    const delay = isMockLoadingEnabled ? 1200 : 100;
    
    setTimeout(() => {
      setIsSubmitting(false);
      setCommitMessage('');
      // In a real app, we would update the branches state here
    }, delay);
  };

  return (
    <div className="w-full bg-panel-bg/50 backdrop-blur-sm flex flex-col h-full overflow-hidden border-r border-hud-border">
      {/* Header */}
      <div className="p-4 border-b border-hud-border flex items-center gap-2 text-muted-text bg-black/5">
        <GitBranch className="w-4 h-4 text-brand-red" />
        <span className="text-xs font-sans font-bold uppercase tracking-[0.2em]">分支管理 (BRANCHES)</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* PANEL A: Commit Section */}
        <section className="p-4 border-b border-hud-border space-y-4">
          <div className="flex items-center gap-2 text-muted-text mb-2">
            <GitCommit className="w-3.5 h-3.5" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest">镌刻提交 (COMMIT CHANGES)</span>
          </div>
          
          <div className="space-y-3">
            <div className="relative group">
              <textarea 
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="输入本次情节改动摘要..." 
                className="w-full h-24 bg-app-bg/50 border border-hud-border rounded-lg p-3 text-xs text-text-main placeholder:text-muted-text/30 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/20 transition-all font-sans resize-none"
              />
              <div className="absolute bottom-2 right-2 flex gap-1 pointer-events-none">
                <div className="w-1 h-1 bg-hud-border rounded-full" />
                <div className="w-1 h-1 bg-hud-border rounded-full" />
                <div className="w-1 h-1 bg-hud-border rounded-full" />
              </div>
            </div>

            <button 
              onClick={handleCommit}
              disabled={!commitMessage.trim() || isSubmitting}
              className={cn(
                "w-full py-2 rounded-lg text-[10px] font-sans font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.1)] active:scale-[0.98] relative overflow-hidden",
                commitMessage.trim() 
                  ? "bg-brand-red text-white hover:bg-red-700" 
                  : "bg-hud-border text-muted-text cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>正在镌刻...</span>
                </div>
              ) : (
                "镌刻当前节点 (SUBMIT)"
              )}
              {isSubmitting && isMockLoadingEnabled && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 animate-[loading_1.2s_linear]" style={{ width: '100%' }} />
              )}
            </button>
          </div>
        </section>

        {/* PANEL B: Timeline/Branches Section */}
        <section className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-muted-text">
              <GitMerge className="w-3.5 h-3.5" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest">时空节点 (TIMELINE)</span>
            </div>
            <button className="p-1 px-2 rounded-lg bg-white/5 border border-hud-border text-[9px] font-mono text-muted-text hover:text-brand-red hover:border-brand-red/30 transition-all active:scale-95">
              + NEW
            </button>
          </div>

          <div className="space-y-6 pl-2 relative">
            {/* Timeline Line */}
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-hud-border/40" />

            {branches.map((branch) => (
              <div key={branch.id} className="relative pl-6 space-y-2">
                {/* Branch Node */}
                <div className={cn(
                  "absolute left-[-4px] top-1.5 w-4 h-4 rounded-full border-2 border-panel-bg z-10",
                  activeBranchId === branch.id ? "bg-brand-red shadow-[0_0_8px_rgba(220,38,38,0.5)]" : "bg-hud-border"
                )} />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-mono font-bold uppercase tracking-wider",
                      activeBranchId === branch.id ? "text-text-main" : "text-muted-text"
                    )}>
                      {branch.name}
                    </span>
                    {branch.isMain && (
                      <span className="text-[8px] px-1 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-sm">HEAD</span>
                    )}
                  </div>
                  {activeBranchId !== branch.id && (
                    <button 
                      onClick={() => setActiveBranchId(branch.id)}
                      className="text-[9px] font-sans font-bold uppercase text-brand-red hover:text-red-400 transition-colors px-1 hover:bg-black/5 rounded"
                    >
                      [ 切换 checkout ]
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {branch.commits.slice(0, 2).map((commit, cIdx) => (
                    <div key={commit.id} className={cn(
                      "group relative rounded-lg p-2 transition-all border",
                      activeBranchId === branch.id 
                        ? "bg-white/5 border-white/5" 
                        : "bg-black/10 border-transparent"
                    )}>
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="text-[9px] font-mono text-muted-text opacity-50">{commit.id}</span>
                        <div className="flex items-center gap-1 text-[8px] text-muted-text opacity-40">
                          <Clock className="w-2.5 h-2.5" />
                          {commit.timestamp}
                        </div>
                      </div>
                      <p className={cn(
                        "text-[10px] leading-relaxed font-sans",
                        activeBranchId === branch.id ? "text-text-main/80" : "text-muted-text"
                      )}>
                        {commit.message}
                      </p>
                    </div>
                  ))}
                  {branch.commits.length > 2 && (
                    <button className="text-[9px] text-muted-text/40 hover:text-muted-text pl-2 transition-colors rounded hover:bg-black/5 px-1">
                      查看更多提交 ({branch.commits.length - 2})...
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-hud-border bg-black/10">
        <div className="flex items-center justify-between text-[9px] font-mono text-muted-text mb-1 tracking-tighter uppercase opacity-40">
          <span>存储容量 (SNAP STORAGE)</span>
          <span>42%</span>
        </div>
        <div className="h-1 bg-hud-border rounded-full overflow-hidden">
          <div className="h-full bg-brand-red/50 w-[42%]" />
        </div>
      </div>
    </div>
  );
}
