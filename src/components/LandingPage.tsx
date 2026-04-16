import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, BookOpen, Clock, Trash2, Settings } from 'lucide-react';

interface Novel {
  id: string;
  title: string;
  lastEdited: string;
  wordCount: number;
  status: string;
}

interface LandingPageProps {
  onStartNew: (title: string) => void;
  onSelectNovel: (id: string) => void;
  existingNovels: Novel[];
  onToggleMockData: () => void;
  onOpenSettings: () => void;
}

export default function LandingPage({ onStartNew, onSelectNovel, existingNovels, onToggleMockData, onOpenSettings }: LandingPageProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation variants for sequential loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.23, 1, 0.32, 1] }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 1.5, ease: [0.23, 1, 0.32, 1] }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onStartNew(inputValue.trim());
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-main font-sans relative overflow-hidden flex flex-col">
      {/* 1. Background Ink Drifting (Subtle & Blurred) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Rice Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
        
        {/* Drifting Ink Blobs */}
        <motion.div 
          animate={{ 
            x: [0, 50, -30, 0], 
            y: [0, -30, 40, 0],
            scale: isFocused ? [1.1, 1.2, 1.1] : [1, 1.1, 0.9, 1],
            opacity: isFocused ? 0.15 : 0.05
          }}
          transition={{ duration: isFocused ? 10 : 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-brand-red/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -60, 40, 0], 
            y: [0, 50, -20, 0],
            scale: isFocused ? [1, 1.1, 1] : [1, 0.9, 1.1, 1],
            opacity: isFocused ? 0.15 : 0.05
          }}
          transition={{ duration: isFocused ? 15 : 35, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] bg-text-muted/5 blur-[150px] rounded-full"
        />
      </div>

      {/* Top Right Actions */}
      <div className="absolute top-6 right-8 z-50 flex items-center gap-4">
        <button 
          onClick={onOpenSettings}
          className="p-3 rounded-xl bg-panel-bg/20 border border-hud-border/50 text-muted-text hover:text-brand-red hover:border-brand-red/30 transition-all group backdrop-blur-md shadow-xl"
          title="API Settings"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* Main Hero Section */}
      <motion.div 
        layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 transition-all duration-700 ease-[0.23,1,0.32,1]"
      >
        <motion.div layout className="flex flex-col items-center text-center max-w-4xl w-full">
          {/* Logo & Title */}
          <motion.div 
            layout
            variants={logoVariants}
            className="mb-8 relative"
          >
            <motion.div 
              className="absolute inset-0 bg-brand-red/5 blur-3xl rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <h1 className="text-7xl md:text-8xl font-brush text-text-main mb-2 tracking-[0.2em] relative">
              墨枢
            </h1>
            <motion.div 
              layout
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex items-center justify-center gap-4 overflow-hidden whitespace-nowrap"
            >
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-hud-border" />
              <span className="text-xl md:text-2xl font-display font-light tracking-[0.5em] text-muted-text uppercase">
                Plot Pilot
              </span>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-hud-border" />
            </motion.div>
          </motion.div>

          {/* Slogan with Letter Spacing Animation */}
          <motion.p 
            layout
            variants={itemVariants}
            className="text-lg md:text-xl font-serif italic text-muted-text mb-16 tracking-[0.5em]"
          >
            —— 作者的领航员 ——
          </motion.p>

          {/* Input Area */}
          <motion.form 
            layout
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-red/10 via-hud-border/10 to-brand-red/10 rounded-xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
            <div className="relative flex items-center bg-panel-bg/30 backdrop-blur-xl border border-hud-border/50 rounded-xl p-2 shadow-2xl transition-all group-focus-within:border-brand-red/30">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="在此处输入你的故事原点..."
                className="flex-1 bg-transparent border-none px-6 py-4 text-lg focus:outline-none placeholder:text-muted-text/30 font-serif caret-brand-red"
                style={{ caretColor: 'var(--brand-red)' }} // The Cinnabar Dot (caret)
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                onMouseDown={(e) => {
                  // Prevent input blur before click is registered
                  if (inputValue.trim()) e.preventDefault();
                }}
                className="bg-brand-red text-white p-4 rounded-lg hover:bg-red-700 transition-all disabled:opacity-20 shadow-[0_0_15px_rgba(220,38,38,0.2)] active:scale-95"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
            
            {/* Subtle Hint */}
            <div className="mt-4 flex justify-center gap-8 text-[9px] font-mono text-muted-text/40 tracking-[0.3em] uppercase">
              <span className="flex items-center gap-1">INITIATE PROTOCOL</span>
              <span className="flex items-center gap-1">LOGIC READY</span>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>

      {/* Library Section (Shelf) */}
      <AnimatePresence>
        {existingNovels.length > 0 && !isFocused && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: 50 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 100 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="w-full bg-panel-bg/10 border-t border-hud-border/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="p-8 pb-12">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-sm font-display font-bold tracking-[0.3em] text-muted-text uppercase flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-red" />
                    我的作品库
                  </h2>
                  <span className="text-[10px] font-mono text-muted-text">{existingNovels.length} PROJECTS FOUND</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {existingNovels.map((novel) => (
                    <button
                      key={novel.id}
                      onClick={() => onSelectNovel(novel.id)}
                      className="group relative bg-panel-bg/40 border border-hud-border rounded-xl p-6 text-left transition-all hover:border-brand-red/50 hover:bg-panel-bg/60 hover:shadow-[0_0_30px_rgba(220,38,38,0.05)] overflow-hidden"
                    >
                      {/* Decorative Brush Stroke Background */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl rounded-full group-hover:bg-brand-red/10 transition-colors" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[9px] font-mono text-brand-red border border-brand-red/30 px-2 py-0.5 rounded uppercase">
                            {novel.status}
                          </span>
                          <div className="flex items-center gap-1 text-[9px] font-mono text-muted-text">
                            <Clock className="w-3 h-3" />
                            {novel.lastEdited}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-brush text-text-main mb-2 group-hover:text-brand-red transition-colors">
                          {novel.title}
                        </h3>
                        
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-hud-border/30">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-mono text-muted-text uppercase">Word Count</span>
                            <span className="text-xs font-medium">{novel.wordCount.toLocaleString()}</span>
                          </div>
                          <div className="p-2 rounded-full bg-hud-border/20 text-muted-text group-hover:bg-brand-red group-hover:text-white transition-all">
                            <Plus className="w-4 h-4 rotate-45" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Accents */}
      <div className="p-6 flex justify-between items-center text-[9px] font-mono text-muted-text tracking-tighter shrink-0">
        <div className="flex gap-4 items-center">
          <span className="opacity-50">INK-TECH PROTOCOL V1.0</span>
          <span className="opacity-50">SYSTEM: STABLE</span>
          <button 
            onClick={onToggleMockData}
            className="ml-4 px-2 py-1 border border-hud-border hover:border-brand-red hover:text-brand-red transition-all rounded uppercase"
          >
            {existingNovels.length > 0 ? "隐藏作品库 (测试无作品状态)" : "恢复作品库 (测试有作品状态)"}
          </button>
        </div>
        <span className="opacity-50">© 2026 PLOT PILOT | 墨枢</span>
      </div>
    </div>
  );
}
