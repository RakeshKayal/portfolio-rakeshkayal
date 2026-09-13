import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WindowId } from '../types';
import { playClickSound } from '../utils/audio';

interface WindowFrameProps {
  id: WindowId;
  title: string;
  subtitle?: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onFocus: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onMaximize: (id: WindowId) => void;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  title,
  subtitle,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  headerRight,
  children,
  icon,
}) => {
  return (
    <AnimatePresence>
      {isOpen && !isMinimized && (
        <motion.div
          id={`window-${id}`}
          onClick={() => onFocus(id)}
          style={{ zIndex }}
          initial={{ opacity: 0, scale: 0.88, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ 
            opacity: 0, 
            scale: 0.86, 
            y: 35, 
            transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] } 
          }}
          transition={{
            type: 'spring',
            stiffness: 360,
            damping: 29,
            mass: 0.7,
          }}
          className={`absolute flex flex-col mac-glass rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.65)] overflow-hidden border border-white/20 select-text ${
            isMaximized
              ? 'inset-x-2 top-2 bottom-16 sm:inset-x-4 sm:top-3 sm:bottom-20'
              : id === 'safari'
              ? 'inset-x-2 top-2 bottom-16 sm:inset-x-8 sm:top-5 sm:bottom-20 max-w-6xl mx-auto'
              : id === 'terminal'
              ? 'inset-x-2 top-3 bottom-16 sm:inset-x-12 sm:top-8 sm:bottom-20 max-w-5xl mx-auto'
              : id === 'settings'
              ? 'inset-x-2 top-4 bottom-16 sm:inset-x-16 sm:top-10 sm:bottom-20 max-w-3xl mx-auto max-h-[620px]'
              : id === 'mail'
              ? 'inset-x-2 top-3 bottom-16 sm:inset-x-16 sm:top-8 sm:bottom-20 max-w-4xl mx-auto'
              : 'inset-x-2 top-4 bottom-16 sm:inset-x-16 sm:top-8 sm:bottom-20 max-w-4xl mx-auto'
          }`}
        >
          {/* Window Header / Title Bar */}
          <div
            className="h-10 px-3.5 flex items-center justify-between bg-black/40 border-b border-white/10 select-none cursor-default"
            onDoubleClick={() => onMaximize(id)}
          >
            {/* macOS Traffic Lights */}
            <div className="flex items-center gap-2 w-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  onClose(id);
                }}
                className="w-3 h-3 rounded-full bg-[#ff5f56] border border-red-700/50 hover:opacity-85 active:scale-90 flex items-center justify-center text-black/60 group cursor-pointer"
                title="Close"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold">✕</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  onMinimize(id);
                }}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-amber-700/50 hover:opacity-85 active:scale-90 flex items-center justify-center text-black/60 group cursor-pointer"
                title="Minimize"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold">−</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  onMaximize(id);
                }}
                className="w-3 h-3 rounded-full bg-[#27c93f] border border-emerald-700/50 hover:opacity-85 active:scale-90 flex items-center justify-center text-black/60 group cursor-pointer"
                title="Zoom / Toggle Maximize"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold">+</span>
              </button>
            </div>

            {/* Center Title */}
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90 truncate">
              {icon}
              <span className="truncate">{title}</span>
              {subtitle && <span className="text-[10px] text-white/50 font-normal hidden sm:inline">— {subtitle}</span>}
            </div>

            {/* Right Header Area */}
            <div className="w-20 flex items-center justify-end">{headerRight}</div>
          </div>

          {/* Window Body */}
          <div className="flex-1 overflow-hidden relative flex flex-col">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
