import React, { useState } from 'react';
import { WindowId, WindowState, UserRole } from '../types';
import { playClickSound } from '../utils/audio';
import {
  MacFinderIcon,
  MacSafariIcon,
  MacTerminalIcon,
  MacMailIcon,
  MacSettingsIcon,
  MacFolderIcon,
  MacSiriIcon,
  MacTrashIcon,
  MacWhatsAppIcon,
} from './MacIcons';

interface DockProps {
  windows: Record<WindowId, WindowState>;
  activeWindow: WindowId;
  onToggleWindow: (id: WindowId) => void;
  onLockScreen: () => void;
  onDownloadResume?: () => void;
  userRole?: UserRole;
}

export const Dock: React.FC<DockProps> = ({
  windows,
  activeWindow,
  onToggleWindow,
  onLockScreen,
  onDownloadResume,
  userRole = 'visitor',
}) => {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const handleDockClick = (id: WindowId) => {
    playClickSound();
    onToggleWindow(id);
  };

  return (
    <footer className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-4 pointer-events-none select-none">
      <div className="mac-dock pointer-events-auto px-3 py-2 sm:px-4 sm:py-2.5 rounded-3xl flex items-center gap-2 sm:gap-3.5 shadow-2xl transition-all duration-300">
        {/* Finder (Projects Explorer) */}
        <div className="relative flex flex-col items-center">
          {hoveredApp === 'finder' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] text-white font-medium shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
              Finder — Projects
            </div>
          )}
          <button
            onClick={() => handleDockClick('finder')}
            onMouseEnter={() => setHoveredApp('finder')}
            onMouseLeave={() => setHoveredApp(null)}
            className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-2.5 active:scale-90 cursor-pointer"
            title="Finder"
          >
            <MacFinderIcon size={46} />
            <span
              className={`w-1 h-1 rounded-full mt-1 transition-all ${
                windows.finder?.isOpen ? 'bg-white opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'
              }`}
            ></span>
          </button>
        </div>

        {/* Safari (Interactive Resume) */}
        <div className="relative flex flex-col items-center">
          {hoveredApp === 'safari' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] text-white font-medium shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
              Safari — Resume
            </div>
          )}
          <button
            onClick={() => handleDockClick('safari')}
            onMouseEnter={() => setHoveredApp('safari')}
            onMouseLeave={() => setHoveredApp(null)}
            className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-2.5 active:scale-90 cursor-pointer"
            title="Safari"
          >
            <MacSafariIcon size={46} />
            <span
              className={`w-1 h-1 rounded-full mt-1 transition-all ${
                windows.safari?.isOpen ? 'bg-white opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'
              }`}
            ></span>
          </button>
        </div>

        {/* Terminal (CMD / CLI) */}
        <div className="relative flex flex-col items-center">
          {hoveredApp === 'terminal' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] text-white font-medium shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
              Terminal — CMD / Zsh
            </div>
          )}
          <button
            onClick={() => handleDockClick('terminal')}
            onMouseEnter={() => setHoveredApp('terminal')}
            onMouseLeave={() => setHoveredApp(null)}
            className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-2.5 active:scale-90 cursor-pointer"
            title="Terminal"
          >
            <MacTerminalIcon size={46} />
            <span
              className={`w-1 h-1 rounded-full mt-1 transition-all ${
                windows.terminal?.isOpen ? 'bg-white opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'
              }`}
            ></span>
          </button>
        </div>

        {/* Mail (Direct Inbox Contact) */}
        <div className="relative flex flex-col items-center">
          {hoveredApp === 'mail' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] text-white font-medium shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
              Mail — Contact Inbox
            </div>
          )}
          <button
            onClick={() => handleDockClick('mail')}
            onMouseEnter={() => setHoveredApp('mail')}
            onMouseLeave={() => setHoveredApp(null)}
            className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-2.5 active:scale-90 cursor-pointer"
            title="Mail"
          >
            <MacMailIcon size={46} />
            <span
              className={`w-1 h-1 rounded-full mt-1 transition-all ${
                windows.mail?.isOpen ? 'bg-white opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'
              }`}
            ></span>
          </button>
        </div>

        {/* WhatsApp (Direct Chat with Rakesh) - Hidden from Admin view */}
        {userRole !== 'admin' && (
          <div className="relative flex flex-col items-center">
            {hoveredApp === 'whatsapp' && (
              <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] text-white font-medium shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
                WhatsApp — Chat Directly
              </div>
            )}
            <button
              onClick={() => handleDockClick('whatsapp')}
              onMouseEnter={() => setHoveredApp('whatsapp')}
              onMouseLeave={() => setHoveredApp(null)}
              className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-2.5 active:scale-90 cursor-pointer"
              title="WhatsApp Chat"
            >
              <MacWhatsAppIcon size={46} />
              <span
                className={`w-1 h-1 rounded-full mt-1 transition-all ${
                  windows.whatsapp?.isOpen ? 'bg-white opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'
                }`}
              ></span>
            </button>
          </div>
        )}

        {/* System Settings (with Red '1' Notification Badge!) */}
        <div className="relative flex flex-col items-center">
          {hoveredApp === 'settings' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] text-white font-medium shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
              System Settings — Wallpaper &amp; Specs
            </div>
          )}
          <button
            onClick={() => handleDockClick('settings')}
            onMouseEnter={() => setHoveredApp('settings')}
            onMouseLeave={() => setHoveredApp(null)}
            className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-2.5 active:scale-90 cursor-pointer"
            title="System Settings"
          >
            <MacSettingsIcon size={46} showBadge={true} />
            <span
              className={`w-1 h-1 rounded-full mt-1 transition-all ${
                windows.settings?.isOpen ? 'bg-white opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'
              }`}
            ></span>
          </button>
        </div>

        {/* Siri / Apple Intelligence */}
        <div className="relative flex flex-col items-center">
          {hoveredApp === 'siri' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] text-white font-medium shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
              Siri — AI Assistant
            </div>
          )}
          <button
            onClick={() => handleDockClick('siri')}
            onMouseEnter={() => setHoveredApp('siri')}
            onMouseLeave={() => setHoveredApp(null)}
            className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-2.5 active:scale-90 cursor-pointer"
            title="Siri"
          >
            <MacSiriIcon size={46} />
            <span
              className={`w-1 h-1 rounded-full mt-1 transition-all ${
                windows.siri?.isOpen ? 'bg-white opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'
              }`}
            ></span>
          </button>
        </div>

        {/* Dock Divider */}
        <div className="h-8 w-[1px] bg-white/20 mx-1"></div>

        {/* Downloads Folder (3D Sky Blue macOS Folder with arrow) */}
        <div className="relative flex flex-col items-center">
          {hoveredApp === 'downloads' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] text-white font-medium shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
              Downloads — PDF Resume
            </div>
          )}
          <button
            onClick={() => {
              playClickSound();
              if (onDownloadResume) onDownloadResume();
              else handleDockClick('finder');
            }}
            onMouseEnter={() => setHoveredApp('downloads')}
            onMouseLeave={() => setHoveredApp(null)}
            className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-2.5 active:scale-90 cursor-pointer"
            title="Downloads"
          >
            <MacFolderIcon size={46} badge="download" />
            <span className="w-1 h-1 rounded-full mt-1 bg-transparent"></span>
          </button>
        </div>

        {/* Trash Can */}
        <div className="relative flex flex-col items-center">
          {hoveredApp === 'trash' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] text-white font-medium shadow-lg border border-white/10 pointer-events-none whitespace-nowrap">
              Trash (Clean)
            </div>
          )}
          <button
            onClick={() => {
              playClickSound();
              onLockScreen();
            }}
            onMouseEnter={() => setHoveredApp('trash')}
            onMouseLeave={() => setHoveredApp(null)}
            className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-2.5 active:scale-90 cursor-pointer"
            title="Trash"
          >
            <MacTrashIcon size={46} />
            <span className="w-1 h-1 rounded-full mt-1 bg-transparent"></span>
          </button>
        </div>
      </div>
    </footer>
  );
};
