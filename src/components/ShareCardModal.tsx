import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Download, Github, Loader2, Check } from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { cn } from '../lib/utils';

// Accurate Brand Icons
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.909 6.909 0 0 0-1.04.053 6.32 6.32 0 0 0-5.32 6.32 6.343 6.343 0 0 0 10.857 4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.737a4.85 4.85 0 0 1-1.037-.051z" />
  </svg>
);

const BilibiliIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.813 4.653h.854c1.51.054 2.767.57 3.707 1.49.95.914 1.455 2.158 1.513 3.73l.013 1.122v7.1c-.13 1.764-.72 3.1-1.78 4.02-.95.822-2.22 1.258-3.79 1.304l-1.354.012H7.031c-1.554-.012-2.824-.447-3.774-1.27-.92-.81-1.454-1.956-1.594-3.41l-.013-1.077V10.74c.03-1.636.564-2.922 1.574-3.83.92-.835 2.144-1.295 3.654-1.378h.844L6.151 3.52c-.324-.31-.334-.814-.024-1.138.31-.324.814-.334 1.138-.024l2.56 2.454h4.354l2.56-2.454h1.034a2.667 2.667 0 0 1 2.667 2.667V18.3a2.667 2.667 0 0 1-2.667 2.667h-8A2.667 2.667 0 0 1 5.334 18.3V10a2.667 2.667 0 0 1 2.667-2.667h8zM9 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
  </svg>
);

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'ink' | 'paper';
}

export default function ShareCardModal({ isOpen, onClose, theme = 'ink' }: ShareCardModalProps) {
  const isDarkMode = theme === 'ink';
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsCopied(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  const socialLinks = [
    { label: 'GitHub 仓库', value: 'github.com/shenminglinyi/PlotPilot', icon: Github },
    { label: '抖音 (Douyin)', value: '抖音：91472902104', icon: TikTokIcon },
    { label: 'B 站 (Bilibili)', value: 'space.bilibili.com/3706976383011690', icon: BilibiliIcon },
  ];

  const handleCopyImage = useCallback(async () => {
    if (cardRef.current === null || isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      // Focus window to ensure clipboard access inside iframe
      window.focus();

      // Ensure fonts are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      // We use the modern ClipboardItem with a Promise to maintain user gesture context.
      // This is the key fix for "Write permission denied" after a delay.
      const blobPromise = (async () => {
        // Small delay to ensure styles are applied
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return await toBlob(cardRef.current!, { 
          cacheBust: true, 
          backgroundColor: 'transparent', // Explicit transparency for corners
          pixelRatio: 2,
          style: {
            backgroundColor: isDarkMode ? '#111111' : '#fcfaf7',
            borderRadius: '24px',
            boxShadow: 'none',
            overflow: 'hidden',
            margin: '0', 
          }
        });
      })();

      // Wrap in a timeout to prevent infinite hanging
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Capture timed out')), 15000)
      );

      // We call write IMMEDIATELY after the click (in the same tick or very close)
      // by passing the promise to ClipboardItem.
      const clipboardItem = new ClipboardItem({
        'image/png': Promise.race([blobPromise, timeoutPromise]) as Promise<Blob>
      });

      await navigator.clipboard.write([clipboardItem]);
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
    } finally {
      setIsSaving(false);
    }
  }, [cardRef, isDarkMode, isSaving]);

  const handleSaveImage = useCallback(async () => {
    if (cardRef.current === null || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));

      const capturePromise = toPng(cardRef.current, { 
        cacheBust: true, 
        backgroundColor: 'transparent', // Explicit transparency for corners
        pixelRatio: 2,
        style: {
          backgroundColor: isDarkMode ? '#111111' : '#fcfaf7',
          borderRadius: '24px',
          boxShadow: 'none',
          overflow: 'hidden',
          margin: '0',
        }
      });

      // 15 second timeout safety for font loading
      const timeoutPromise = new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Capture timed out')), 15000)
      );

      const dataUrl = await Promise.race([capturePromise, timeoutPromise]);

      const link = document.createElement('a');
      link.download = `PlotPilot-ShareCard-${new Date().getTime()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to save image:', err);
    } finally {
      setIsSaving(false);
    }
  }, [cardRef, isDarkMode, isSaving]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="share-card-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 hover:bg-brand-red/20 flex items-center justify-center text-white/40 hover:text-brand-red transition-all border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            key="share-card-container"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative flex flex-col items-center gap-6"
          >
            {/* The actual Card to be captured */}
            <div
              ref={cardRef}
              className={cn(
                "w-[440px] rounded-3xl overflow-hidden shadow-[0_48px_120px_rgba(0,0,0,0.6)] border flex flex-col relative",
                isDarkMode 
                  ? "bg-[#111111] border-white/5" 
                  : "bg-[#fcfaf7] border-black/5"
              )}
            >
              {/* Subtle Texture Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

              {/* Refined Header - Minimalist with Brand Seal */}
              <div className="pt-10 pb-6 px-10 flex flex-col items-center relative gap-4">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center">
                    <span className="text-brand-red font-brush text-4xl tracking-tighter drop-shadow-sm leading-none">墨枢</span>
                    <div className="h-0.5 w-6 bg-brand-red mt-1 opacity-50" />
                  </div>
                  <div className="w-px h-10 bg-brand-red/20 rotate-[15deg]" />
                  <div className="flex flex-col">
                    <h2 className="text-xl font-display uppercase tracking-[0.3em] font-bold text-text-main">PLOT PILOT</h2>
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.4em] mt-0.5">叙事引擎</span>
                  </div>
                </div>
              </div>

              <div className="px-10 pb-10 flex flex-col items-center gap-10">
                {/* QR Code Section - Focus Frame Design */}
                <div className="relative group">
                  {/* Decorative Corners */}
                  <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-brand-red opacity-40" />
                  <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-brand-red opacity-40" />
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-brand-red opacity-40" />
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-brand-red opacity-40" />

                  <div className={cn(
                    "p-5 rounded-xl border flex items-center justify-center relative",
                    isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-black/[0.02] border-black/5"
                  )}>
                    <img 
                      src="/qrcode.png" 
                      alt="二维码"
                      crossOrigin="anonymous"
                      className="w-44 h-44 rounded-lg grayscale brightness-110 object-contain mix-blend-screen"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://github.com/shenminglinyi/PlotPilot`;
                        (e.target as HTMLImageElement).crossOrigin = "anonymous";
                      }}
                    />
                  </div>
                </div>

                {/* Social Links - Minimalist Meta Rows */}
                <div className="w-full space-y-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-red/20 to-transparent" />
                    <span className="text-[10px] font-display text-brand-red/60 uppercase tracking-[0.3em]">联系开发者</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-red/20 to-transparent" />
                  </div>
                  
                  {socialLinks.map((link, idx) => (
                    <div 
                      key={`share-social-link-${link.label}-${idx}`}
                      className="flex items-center gap-4 px-2 py-1.5 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red/60 group-hover:text-brand-red transition-colors border border-brand-red/10">
                        <link.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0 border-b border-dashed border-white/5 group-hover:border-white/10 pb-1.5 transition-colors">
                        <div className="text-[12px] font-mono text-text-main opacity-60 group-hover:opacity-100 transition-opacity truncate">
                          {link.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Quote */}
                <div className="mt-2 opacity-30">
                  <p className="text-[10px] font-serif italic text-text-muted text-center tracking-wide">
                    "墨韵书香，静待君启。"
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons (NOT in cardRef) */}
            <div className="w-full flex gap-3">
              <button 
                onClick={handleSaveImage}
                disabled={isSaving}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-white text-sm font-bold transition-all shadow-xl shadow-brand-red/20",
                  isSaving ? "bg-brand-red/50 cursor-not-allowed" : "bg-brand-red hover:bg-brand-red/90 active:scale-95"
                )}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isSaving ? "正在生成..." : "保存图片"}
              </button>
              <button 
                onClick={handleCopyImage}
                disabled={isSaving}
                title="复制图片到剪切板"
                className={cn(
                  "px-5 py-4 rounded-2xl bg-white/5 border transition-all",
                  isCopied 
                    ? "border-green-500/50 text-green-500 bg-green-500/5" 
                    : isSaving
                      ? "border-white/10 text-white/30"
                      : "border-white/10 text-white/50 hover:text-brand-red hover:border-brand-red/30"
                )}
              >
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
