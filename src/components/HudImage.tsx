import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface HudImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  isDarkMode: boolean;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export default function HudImage({ 
  src, 
  alt, 
  className, 
  containerClassName,
  isDarkMode,
  referrerPolicy = "no-referrer"
}: HudImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className={cn("relative w-full h-full overflow-hidden", containerClassName)}>
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {/* Shimmer Base */}
          <div className={cn(
            "absolute inset-0",
            isDarkMode ? "bg-white/5" : "bg-black/5"
          )} />
          
          {/* Moving Shimmer/Scanline */}
          <motion.div 
            animate={{ 
              x: ['-100%', '100%'],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className={cn(
              "absolute inset-0 w-1/2 -skew-x-12 blur-xl",
              isDarkMode ? "bg-white/[0.08]" : "bg-black/[0.1]"
            )}
          />
          
          {/* Icon Placeholder */}
          <ImageIcon className={cn(
            "w-5 h-5 opacity-20 animate-pulse",
             isDarkMode ? "text-white" : "text-black"
          )} />
        </div>
      )}
      
      <img 
        src={src} 
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-700",
          !isLoaded ? "opacity-0 scale-105" : "opacity-100",
          className
        )}
        referrerPolicy={referrerPolicy}
      />
    </div>
  );
}
