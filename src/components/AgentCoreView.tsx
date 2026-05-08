import { useState, useRef, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronRight, Send, Activity, CheckCircle2, Wand2, Sparkles, Loader2, X } from 'lucide-react';
import { AgentStatus, AgentMessage, TraceStep, ThemeMode, AISuggestion } from '../types';
import { cn } from '../lib/utils';
import { MessageTrace } from './MessageTrace';
import { ProcessMonitor } from './ProcessMonitor';
import { TaskStageNavigator } from './TaskStageNavigator';

interface AgentCoreViewProps {
  messages: AgentMessage[];
  onSendMessage: (text: string) => void;
  onClose?: () => void;
  onCancelProcess?: () => void;
  theme: ThemeMode;
  isMockLoadingEnabled?: boolean;
  activeTraceSteps?: TraceStep[];
  status?: AgentStatus;
  onStartProcess?: () => void;
  onApplySuggestion?: (id: string) => void;
}

export default function AgentCoreView({ 
  messages, 
  onSendMessage, 
  onClose, 
  onCancelProcess,
  theme,
  isMockLoadingEnabled = true,
  activeTraceSteps = [],
  status = 'idle',
  onStartProcess,
  onApplySuggestion
}: AgentCoreViewProps) {
  const isDarkMode = theme === 'ink';
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const suggestionKey = messages.map(m => m.suggestions?.length || 0).join('|');
  const traceKey = messages.map(m => m.trace?.map(s => s.status).join(',')).join('|');
  const contextKey = messages.length + suggestionKey + traceKey;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [contextKey]);

  return (
    <div className="h-full hud-panel flex flex-col overflow-hidden border-hud-border/40">
      {/* Header */}
      <div className="p-2.5 px-3 border-b border-hud-border/30 flex items-center justify-between shrink-0 bg-gradient-to-r from-brand-red/[0.02] to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-red/20 blur-md rounded-full group-hover:bg-brand-red/30 transition-all duration-700" />
            <div className="relative w-9 h-9 bg-bubble-bg flex items-center justify-center rounded-xl border border-brand-red/30 shadow-[inset_0_0_10px_rgba(220,38,38,0.2)]">
              <Bot className="w-5 h-5 text-brand-red" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-bubble-bg" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-text-main tracking-[0.2em]">墨枢 Agent</h3>
            <div className="text-[9px] font-display text-green-500/80 flex items-center gap-1.5 uppercase tracking-widest mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              在线
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors group"
              title="收起对话"
            >
              <X className="w-5 h-5 text-muted-text group-hover:text-text-main" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar"
      >
        {messages.map((msg, i) => {
          const lastAIWithTraceIndex = [...messages].reverse().findIndex(m => m.role === 'ai' && m.trace);
          const isLatestTrace = lastAIWithTraceIndex !== -1 && (messages.length - 1 - i) === lastAIWithTraceIndex;
          const isThinking = msg.role === 'ai' && msg.isThinking;

          // Calculate current system message index for step numbering
          const systemIndex = messages.slice(0, i + 1).filter(m => m.isSystem).length;
          const stepLabel = `NODE ${String(systemIndex).padStart(2, '0')}`;

          return (
            <div 
              key={`msg-${msg.id || i}-${i}`}
              className={cn("flex flex-col w-full", msg.role === 'user' ? 'items-end' : 'items-start')}
            >
              {/* System Protocol Card */}
              {msg.isSystem ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="max-w-[88%] mb-4 px-1"
                >
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 relative overflow-hidden backdrop-blur-sm group/sys-card">
                    <div className="flex items-center gap-2 mb-1.5">
                       <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-[0.2em]">{stepLabel}</span>
                       <span className="text-[9px] font-display font-medium text-emerald-500/40 uppercase tracking-widest ml-1">逻辑同步</span>
                    </div>
                    <h4 className="text-[13px] font-display font-bold text-text-main mb-1 tracking-wider uppercase">
                      {msg.content?.split('\n')[0]}
                    </h4>
                    <p className="text-[11px] font-sans text-muted-text/70 leading-relaxed text-left">
                      {msg.content?.split('\n').slice(1).join('\n')}
                    </p>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* 1. Message Bubble (AI Text or User Text) FIRST */}
                  <AnimatePresence mode="wait">
                    {msg.role === 'ai' && isThinking ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex gap-1 p-4 rounded-2xl mr-4"
                      >
                        <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce" />
                      </motion.div>
                    ) : (msg.role === 'user' || (msg.role === 'ai' && !isThinking && msg.content)) && (
                      <motion.div 
                        initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className={cn(
                          "max-w-[90%] text-sm leading-relaxed font-sans transition-all duration-500",
                          msg.role === 'user' 
                            ? 'p-4 bg-brand-red text-white ml-4 rounded-2xl rounded-tr-none shadow-lg shadow-brand-red/10' 
                            : cn(
                                "pt-2.5 px-3 pb-1.5 rounded-2xl relative group/ai-msg border border-hud-border/40 transition-colors",
                                isDarkMode ? "bg-bubble-bg/60" : "bg-bubble-bg shadow-sm"
                              )
                        )}
                      >
                        {msg.role === 'ai' && (
                           <div className="flex items-center gap-2 mb-2 opacity-60 group-hover/ai-msg:opacity-100 transition-all duration-500">
                             <div className="relative w-5 h-5 flex items-center justify-center">
                                <div className="absolute inset-0 bg-brand-red/20 blur-[2px] rounded-md" />
                                <div className="relative w-full h-full bg-bubble-bg border border-brand-red/40 flex items-center justify-center rounded-md shadow-sm">
                                  <Bot className="w-3 h-3 text-brand-red" />
                                </div>
                             </div>
                             <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-text/80">墨枢</span>
                             {msg.timestamp && <span className="text-[9px] font-mono opacity-30 ml-auto tracking-tighter">{msg.timestamp}</span>}
                           </div>
                        )}
                        <p className={cn(
                          msg.role === 'ai' ? "font-sans text-[14px] leading-relaxed" : ""
                        )}>
                          {msg.content || msg.text}
                        </p>

                        {/* 2. Message Trace SECOND (Inside bubble) */}
                        {msg.role === 'ai' && msg.trace && isLatestTrace && (
                          <div className="mt-1.5 mb-0">
                            <MessageTrace 
                              steps={msg.trace} 
                              isThinking={!!msg.isThinking} 
                              isCompleted={!msg.isThinking} 
                              theme={theme}
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 3. AI Suggestions (Scenario C: TaskStageNavigator) THIRD */}
                  {msg.role === 'ai' && msg.suggestions && (
                    <div className="w-full">
                      <TaskStageNavigator 
                        suggestions={msg.suggestions}
                        onApply={(id) => onApplySuggestion?.(id)}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Persistent Agent Control Card moved here to be AFTER history */}
        {(status === 'panel_open' || status === 'starting') && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-3.5 border border-hud-border/20 rounded-xl relative overflow-hidden mt-1.5 group transition-colors",
              isDarkMode ? "bg-bubble-bg/40 backdrop-blur-sm" : "bg-bubble-bg/80 shadow-sm"
            )}
          >
            {/* Close Button */}
            {onCancelProcess && (
              <button 
                onClick={onCancelProcess}
                className="absolute top-3 right-3 p-1.5 text-muted-text/40 hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-hud-border/20 rounded-lg transition-all z-20"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex flex-col items-center text-center gap-1.5 py-0.5">
              <motion.div 
                className="relative"
              >
                <div className="absolute inset-0 bg-brand-red/5 blur-lg rounded-full" />
                <div className="relative w-9 h-9 bg-bubble-bg border border-hud-border/30 flex items-center justify-center rounded-lg shadow-md">
                   <Sparkles className="w-3 h-3 text-brand-red" />
                  <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-brand-red rounded-full" />
                </div>
              </motion.div>
              
              <div className="space-y-0.5">
                <h4 className="text-sm font-display font-bold text-text-main tracking-tight">自动化协同模式</h4>
                <p className="text-[11px] font-sans leading-relaxed text-muted-text/50 max-w-[240px] mx-auto">
                  Agent 将介入剧情演绎，同步推演后续分支。
                </p>
              </div>

              <button 
                onClick={onStartProcess}
                disabled={status === 'starting'}
                className={cn(
                  "w-full max-w-[160px] py-1.5 mt-1.5 relative overflow-hidden rounded-lg transition-all active:scale-[0.98] border font-display font-bold text-[9px] tracking-[0.1em] group/btn",
                  status === 'starting' 
                    ? "bg-transparent border-hud-border/20 text-muted-text/30 cursor-not-allowed" 
                    : "bg-brand-red border-brand-red text-white shadow shadow-brand-red/10 hover:brightness-110"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-sweep pointer-events-none" />
                {status === 'starting' ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>同步中...</span>
                  </div>
                ) : (
                  <span className="relative z-10">启动协同</span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Input */}
      <div className={cn(
        "p-2 border-t border-hud-border/30 shrink-0",
        isDarkMode ? "bg-panel-bg/20" : "bg-panel-bg/60"
      )}>
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="向 AI 追问细节..."
            className={cn(
              "w-full border border-hud-border/50 pl-4 pr-12 py-2 text-sm focus:outline-none focus:border-brand-red/50 transition-all font-sans rounded-xl",
              isDarkMode ? "bg-app-bg/50" : "bg-white"
            )}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-text hover:text-brand-red transition-colors rounded-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-1.5 flex gap-4 text-[9px] font-mono text-muted-text/30 tracking-wider uppercase">
          <span>Enter 发送</span>
          <span>逻辑同步中</span>
        </div>
      </div>
    </div>
  );
}
