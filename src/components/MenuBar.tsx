import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Wifi, Battery, Sparkles, Sliders, CheckCircle, Download, RotateCcw, User, Lock, MessageCircle } from 'lucide-react';
import { WindowId, UserRole } from '../types';
import { playClickSound, setAudioEnabled, isAudioEnabled } from '../utils/audio';
import { MacAppleIcon } from './MacIcons';

interface MenuBarProps {
  activeWindow: WindowId;
  onOpenWindow: (id: WindowId) => void;
  onLockScreen: () => void;
  onDownloadResume: () => void;
  showToast: (msg: string) => void;
  userRole?: UserRole;
  onSwitchUser?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  activeWindow,
  onOpenWindow,
  onLockScreen,
  onDownloadResume,
  showToast,
  userRole = 'visitor',
  onSwitchUser,
}) => {
  const [timeStr, setTimeStr] = useState('9:41 AM');
  const [dateStr, setDateStr] = useState('Sun Sep 13');
  const [soundOn, setSoundOn] = useState(isAudioEnabled());
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes} ${ampm}`);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setDateStr(`${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setAudioEnabled(next);
    showToast(next ? 'Sound effects enabled' : 'Sound effects muted');
  };

  const getAppName = (id: WindowId) => {
    switch (id) {
      case 'safari':
        return 'Safari';
      case 'terminal':
        return 'Terminal';
      case 'finder':
        return 'Finder';
      case 'mail':
        return 'Mail';
      case 'siri':
        return 'Apple Intelligence';
      case 'settings':
        return 'System Settings';
      case 'whatsapp':
        return 'WhatsApp';
      default:
        return 'Safari';
    }
  };

  return (
    <header className="relative z-40 w-full h-7 px-3 flex items-center justify-between text-[11px] font-medium text-white/90 bg-black/50 backdrop-blur-xl border-b border-white/10 select-none">
      {/* Left Menu Items */}
      <div className="flex items-center gap-3">
        {/* Apple Logo */}
        <div className="relative">
          <button
            id="apple-menu-btn"
            onClick={() => {
              playClickSound();
              setShowAppleMenu(!showAppleMenu);
              setShowControlCenter(false);
            }}
            className="flex items-center text-white/90 hover:text-white transition-opacity px-1 py-0.5 rounded hover:bg-white/10"
            title="Apple System Menu"
          >
            <MacAppleIcon size={16} color="currentColor" />
          </button>

          {/* Apple Dropdown Menu */}
          {showAppleMenu && (
            <div
              className="absolute left-0 top-8 w-56 mac-glass rounded-xl p-1.5 shadow-2xl border border-white/20 z-50 text-slate-200 text-xs"
              onClick={() => setShowAppleMenu(false)}
            >
              <div className="px-3 py-1.5 border-b border-white/10 mb-1">
                <p className="font-semibold text-white">About Rakesh Kayal</p>
                <p className="text-[10px] text-white/50">macOS Sequoia Portfolio 15.3</p>
              </div>
              <button
                onClick={() => onOpenWindow('settings')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-2"
              >
                <span>⚙️</span> System Settings...
              </button>
              <button
                onClick={() => onOpenWindow('safari')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-2"
              >
                <span>🧭</span> Open Safari Resume
              </button>
              <button
                onClick={() => onOpenWindow('terminal')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-2"
              >
                <span>💻</span> Launch CMD Terminal
              </button>
              <button
                onClick={() => onOpenWindow('mail')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-2"
              >
                <span>✉️</span> Message Rakesh (Mail)
              </button>
              {userRole !== 'admin' && (
                <button
                  onClick={() => onOpenWindow('whatsapp')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-2 text-emerald-300"
                >
                  <span>💬</span> WhatsApp Direct Chat
                </button>
              )}
              <button
                onClick={onDownloadResume}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-2 text-sky-300"
              >
                <Download className="w-3.5 h-3.5" /> Download Resume PDF
              </button>
              <div className="h-[1px] bg-white/10 my-1"></div>
              <button
                onClick={onLockScreen}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-2 text-amber-300"
              >
                <Lock className="w-3.5 h-3.5" /> Lock Screen
              </button>
            </div>
          )}
        </div>

        {/* Current Active Window Name */}
        <span className="font-semibold text-white">{getAppName(activeWindow)}</span>

        {/* Navigation Quick Switches */}
        <div className="hidden sm:flex items-center gap-3 text-white/70">
          <button
            onClick={() => {
              playClickSound();
              onOpenWindow('safari');
            }}
            className={`hover:text-white px-1.5 py-0.5 rounded ${activeWindow === 'safari' ? 'text-white bg-white/10' : ''}`}
          >
            Resume
          </button>
          <button
            onClick={() => {
              playClickSound();
              onOpenWindow('terminal');
            }}
            className={`hover:text-white px-1.5 py-0.5 rounded ${activeWindow === 'terminal' ? 'text-white bg-white/10' : ''}`}
          >
            Terminal (CMD)
          </button>
          <button
            onClick={() => {
              playClickSound();
              onOpenWindow('finder');
            }}
            className={`hover:text-white px-1.5 py-0.5 rounded ${activeWindow === 'finder' ? 'text-white bg-white/10' : ''}`}
          >
            Projects
          </button>
          {userRole !== 'admin' && (
            <button
              onClick={() => {
                playClickSound();
                onOpenWindow('whatsapp');
              }}
              className={`hover:text-emerald-300 px-1.5 py-0.5 rounded flex items-center gap-1 ${
                activeWindow === 'whatsapp' ? 'text-emerald-300 bg-emerald-500/20' : ''
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              WhatsApp
            </button>
          )}
          <button
            onClick={() => {
              playClickSound();
              onOpenWindow('mail');
            }}
            className={`hover:text-white px-1.5 py-0.5 rounded ${activeWindow === 'mail' ? 'text-white bg-white/10' : ''}`}
          >
            Contact
          </button>
          <button
            onClick={() => {
              playClickSound();
              onOpenWindow('siri');
            }}
            className={`hover:text-white px-1.5 py-0.5 rounded ${activeWindow === 'siri' ? 'text-white bg-white/10' : ''}`}
          >
            AI Assistant
          </button>
        </div>
      </div>

      {/* Right Menu Status Items (No admin or visitor labels per user instructions) */}
      <div className="flex items-center gap-2 sm:gap-3 text-white/80">
        {/* Open to Work Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Open to Work</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={soundOn ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          className="hover:text-white p-0.5 rounded hover:bg-white/10"
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5 text-white/90" /> : <VolumeX className="w-3.5 h-3.5 text-white/50" />}
        </button>

        {/* Battery */}
        <div className="hidden sm:flex items-center gap-1">
          <span className="text-[10px]">100%</span>
          <Battery className="w-3.5 h-3.5 text-white/80" />
        </div>

        {/* Wi-Fi */}
        <Wifi className="w-3.5 h-3.5 text-white/80" />

        {/* Date & Time */}
        <span className="hidden md:inline text-white/70">{dateStr}</span>
        <span id="menu-clock" className="font-semibold text-white">
          {timeStr}
        </span>

        {/* Control Center Toggle */}
        <button
          onClick={() => {
            playClickSound();
            setShowControlCenter(!showControlCenter);
            setShowAppleMenu(false);
          }}
          className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
          title="Control Center"
        >
          <Sliders className="w-3 h-3" />
        </button>
      </div>

      {/* Control Center Popover */}
      {showControlCenter && (
        <div className="absolute right-2 top-8 w-64 mac-glass rounded-2xl p-3 shadow-2xl border border-white/20 z-50 text-slate-200">
          <p className="text-xs font-semibold text-white mb-2">Control Center</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              onClick={toggleSound}
              className="mac-glass-card p-2.5 rounded-xl cursor-pointer hover:bg-white/10 flex flex-col items-center text-center gap-1"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-white/50" />}
              <span className="text-[11px] font-medium">{soundOn ? 'Audio On' : 'Muted'}</span>
            </div>
            <div
              onClick={() => onOpenWindow('mail')}
              className="mac-glass-card p-2.5 rounded-xl cursor-pointer hover:bg-white/10 flex flex-col items-center text-center gap-1"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-medium">Contact Inbox</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-white/10 text-[10px] text-white/60 space-y-1">
            <p>Target: rakeshkayal276@gmail.com</p>
            <p>Phone: +91-8768799345</p>
            <p>LeetCode: 400+ Solved</p>
          </div>
        </div>
      )}
    </header>
  );
};
