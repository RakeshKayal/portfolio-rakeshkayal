import React, { useState, useEffect, useCallback } from 'react';
import resumeDataRaw from './data/resume.json';
import { ResumeData, WindowId, WindowState, UserRole } from './types';
import { BootScreen } from './components/BootScreen';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { WindowFrame } from './components/WindowFrame';
import { SafariWindow } from './components/SafariWindow';
import { TerminalWindow } from './components/TerminalWindow';
import { FinderWindow } from './components/FinderWindow';
import { MailWindow } from './components/MailWindow';
import { SiriWindow } from './components/SiriWindow';
import { SettingsWindow } from './components/SettingsWindow';
import { WhatsAppChatWindow } from './components/WhatsAppChatWindow';
import { AddProjectModal } from './components/AddProjectModal';
import { NotificationToast } from './components/NotificationToast';
import { playClickSound, playSuccessChime, setAudioEnabled } from './utils/audio';
import { generateResumePdf } from './utils/generateResumePdf';
import {
  MacSafariIcon,
  MacTerminalIcon,
  MacMailIcon,
  MacFolderIcon,
  MacSettingsIcon,
  MacWhatsAppIcon,
} from './components/MacIcons';

export default function App() {
  const [resume, setResume] = useState<ResumeData>(resumeDataRaw as ResumeData);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [showDesktopIcons, setShowDesktopIcons] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [activeWindow, setActiveWindow] = useState<WindowId>('safari');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeout, setToastTimeout] = useState<any>(null);
  const [currentWallpaper, setCurrentWallpaper] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCbWiNOfR3rcdhFDMw9wv-9h-Ci_jGdduxJhwrbTLGXtDlrhRIGi9caS4LpAUlvnQc7RfX1R-wEotjK_P8iLdluxPj-q867zdQRhfDY9M3zegW8vfJTFxOzcZpwwOMQD44LrcfLMUzcAOE9_AYp-XEbBkv54UlyF1VLEAhcL7HWiAglktltA3Hg_qCTSMd4N-O_TFRPJGRK5hSF3XPNxKg0pzGlz5d1QO2LA1QGdVb8HWu_4_pBs4My'
  );

  // Window states
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    safari: {
      id: 'safari',
      title: 'Safari',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 20,
    },
    terminal: {
      id: 'terminal',
      title: 'Terminal — zsh',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 15,
    },
    finder: {
      id: 'finder',
      title: 'Finder — Projects',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 16,
    },
    mail: {
      id: 'mail',
      title: 'Mail — Direct Contact',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 17,
    },
    whatsapp: {
      id: 'whatsapp',
      title: 'WhatsApp',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 18,
    },
    siri: {
      id: 'siri',
      title: 'Apple Intelligence',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 19,
    },
    settings: {
      id: 'settings',
      title: 'System Settings',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 21,
    },
  });

  // Fetch dynamic resume from /api/resume
  const fetchResume = useCallback(() => {
    fetch('/api/resume')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.name) {
          setResume(data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch system settings from /api/settings
  useEffect(() => {
    fetchResume();

    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((settings) => {
        if (settings) {
          if (settings.wallpaper) {
            setCurrentWallpaper(settings.wallpaper);
          }
          if (typeof settings.soundEnabled === 'boolean') {
            setAudioEnabled(settings.soundEnabled);
          }
        }
      })
      .catch(() => {});
  }, [fetchResume]);

  const showToast = (msg: string) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    setToastMessage(msg);
    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    setToastTimeout(timeout);
  };

  const bringToFront = (id: WindowId) => {
    setActiveWindow(id);
    setWindows((prev) => {
      const maxZ = Math.max(...(Object.values(prev) as WindowState[]).map((w) => w.zIndex), 10);
      return {
        ...prev,
        [id]: {
          ...prev[id],
          isOpen: true,
          isMinimized: false,
          zIndex: maxZ + 1,
        },
      };
    });
  };

  const openWindow = (id: WindowId) => {
    bringToFront(id);
  };

  const closeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }));
    const winTitle = windows[id]?.title || 'Window';
    showToast(`${winTitle} minimized`);
  };

  const toggleMaximizeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
    bringToFront(id);
  };

  const toggleWindowFromDock = (id: WindowId) => {
    const current = windows[id];
    if (!current?.isOpen) {
      openWindow(id);
    } else if (current.isMinimized) {
      bringToFront(id);
    } else if (activeWindow === id) {
      minimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  // Official PDF Resume Generation using jsPDF
  const handleDownloadResume = () => {
    playSuccessChime();
    showToast('Generating official Rakesh_Kayal_Backend_Resume.pdf...');
    try {
      generateResumePdf(resume);
      showToast('PDF Resume downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Error generating PDF resume. Please try again.');
    }
  };

  // Admin Delete Project / Item Handler
  const handleDeleteProject = async (projectTitle: string) => {
    if (!resume) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete "${projectTitle}" from your portfolio?`);
    if (!confirmDelete) return;

    const filteredProjects = (resume.projects || []).filter(
      (p) => p.title.toLowerCase() !== projectTitle.toLowerCase() && p.id !== projectTitle
    );
    const updated = {
      ...resume,
      projects: filteredProjects,
    };
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setResume(updated);
      playSuccessChime();
      showToast(`Project "${projectTitle}" deleted from portfolio.`);
    } catch (err) {
      showToast('Error deleting project. Please try again.');
    }
  };

  const handleUnlock = (role: UserRole) => {
    setUserRole(role);
    setIsUnlocked(true);
    if (role === 'admin') {
      showToast('Welcome back, Rakesh! Administrator privileges active.');
    } else {
      showToast('Welcome to Rakesh Kayal’s Portfolio (Visitor Mode)');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 font-sans select-none flex flex-col">
      {/* 1. Multilingual Hello Boot Screen & Dual-User macOS Lock Screen Overlay */}
      <BootScreen isUnlocked={isUnlocked} onUnlock={handleUnlock} />

      {/* 2. Desktop Environment with Fluid macOS Sequoia Wallpaper */}
      <div
        className="relative flex-1 w-full h-full flex flex-col overflow-hidden bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('${currentWallpaper}')`,
        }}
      >
        {/* Ambient Darkened Backdrop Filter */}
        <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[0.5px] pointer-events-none"></div>

        {/* 2A. Top Menu Bar */}
        <MenuBar
          activeWindow={activeWindow}
          onOpenWindow={openWindow}
          onLockScreen={handleLock}
          onDownloadResume={handleDownloadResume}
          showToast={showToast}
          userRole={userRole}
          onSwitchUser={handleLock}
        />

        {/* 2B. Desktop Staging Canvas */}
        <main className="relative flex-1 w-full h-full overflow-hidden p-2 sm:p-4">
          {/* Desktop Canvas Icons (Right Side) - hidden by default to keep clean desktop */}
          {showDesktopIcons && (
            <div className="absolute right-3 sm:right-5 top-3 sm:top-5 flex flex-col gap-4 z-10 select-none">
              {/* Safari Resume */}
              <div
                onClick={() => {
                  playClickSound();
                  openWindow('safari');
                }}
                className="group flex flex-col items-center w-18 cursor-pointer"
                title="Safari Resume"
              >
                <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-200">
                  <MacSafariIcon size={44} />
                </div>
                <span className="text-[10px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1 px-1.5 py-0.5 rounded bg-black/40 text-center truncate max-w-full">
                  Resume.pdf
                </span>
              </div>

              {/* Terminal CMD */}
              <div
                onClick={() => {
                  playClickSound();
                  openWindow('terminal');
                }}
                className="group flex flex-col items-center w-18 cursor-pointer"
                title="Terminal Shell"
              >
                <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-200">
                  <MacTerminalIcon size={44} />
                </div>
                <span className="text-[10px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1 px-1.5 py-0.5 rounded bg-black/40 text-center truncate max-w-full">
                  cli_shell
                </span>
              </div>

              {/* Direct WhatsApp Chat (Hidden for Admin) */}
              {userRole !== 'admin' && (
                <div
                  onClick={() => {
                    playClickSound();
                    openWindow('whatsapp');
                  }}
                  className="group flex flex-col items-center w-18 cursor-pointer"
                  title="Chat with Rakesh on WhatsApp"
                >
                  <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 p-1 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-200">
                    <MacWhatsAppIcon size={44} />
                  </div>
                  <span className="text-[10px] font-medium text-emerald-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1 px-1.5 py-0.5 rounded bg-black/40 text-center truncate max-w-full">
                    WhatsApp
                  </span>
                </div>
              )}

              {/* Direct Contact / Mail */}
              <div
                onClick={() => {
                  playClickSound();
                  openWindow('mail');
                }}
                className="group flex flex-col items-center w-18 cursor-pointer"
                title="Direct Mail"
              >
                <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-200">
                  <MacMailIcon size={44} />
                </div>
                <span className="text-[10px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1 px-1.5 py-0.5 rounded bg-black/40 text-center truncate max-w-full">
                  Contact.app
                </span>
              </div>

              {/* Projects Finder */}
              <div
                onClick={() => {
                  playClickSound();
                  openWindow('finder');
                }}
                className="group flex flex-col items-center w-18 cursor-pointer"
                title="Projects Finder"
              >
                <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-200">
                  <MacFolderIcon size={44} />
                </div>
                <span className="text-[10px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1 px-1.5 py-0.5 rounded bg-black/40 text-center truncate max-w-full">
                  Projects
                </span>
              </div>

              {/* System Settings */}
              <div
                onClick={() => {
                  playClickSound();
                  openWindow('settings');
                }}
                className="group flex flex-col items-center w-18 cursor-pointer"
                title="System Settings"
              >
                <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-200">
                  <MacSettingsIcon size={44} showBadge={true} />
                </div>
                <span className="text-[10px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1 px-1.5 py-0.5 rounded bg-black/40 text-center truncate max-w-full">
                  Settings
                </span>
              </div>
            </div>
          )}

          {/* WINDOW 1: Safari Browser Window (Resume) */}
          <WindowFrame
            id="safari"
            title="Safari"
            subtitle="Rakesh Kayal — Professional Resume"
            isOpen={windows.safari.isOpen}
            isMinimized={windows.safari.isMinimized}
            isMaximized={windows.safari.isMaximized}
            zIndex={windows.safari.zIndex}
            onFocus={bringToFront}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximizeWindow}
            icon={<MacSafariIcon size={18} />}
          >
            <SafariWindow
              resume={resume}
              onOpenWindow={openWindow}
              onDownloadResume={handleDownloadResume}
              showToast={showToast}
              userRole={userRole}
              onOpenAddProject={() => setIsAddProjectOpen(true)}
              onDeleteProject={handleDeleteProject}
            />
          </WindowFrame>

          {/* WINDOW 2: Terminal CMD Shell Window */}
          <WindowFrame
            id="terminal"
            title="Terminal"
            subtitle="rakesh@sequoia: ~"
            isOpen={windows.terminal.isOpen}
            isMinimized={windows.terminal.isMinimized}
            isMaximized={windows.terminal.isMaximized}
            zIndex={windows.terminal.zIndex}
            onFocus={bringToFront}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximizeWindow}
            icon={<MacTerminalIcon size={18} />}
          >
            <TerminalWindow resume={resume} showToast={showToast} />
          </WindowFrame>

          {/* WINDOW 3: Mail App Window (Direct Contact to rakeshkayal276@gmail.com) */}
          <WindowFrame
            id="mail"
            title="Mail"
            subtitle="Direct Inbox Dispatcher"
            isOpen={windows.mail.isOpen}
            isMinimized={windows.mail.isMinimized}
            isMaximized={windows.mail.isMaximized}
            zIndex={windows.mail.zIndex}
            onFocus={bringToFront}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximizeWindow}
            icon={<MacMailIcon size={18} />}
          >
            <MailWindow resume={resume} showToast={showToast} />
          </WindowFrame>

          {/* WINDOW 4: WhatsApp Direct Chat Window */}
          <WindowFrame
            id="whatsapp"
            title="WhatsApp"
            subtitle={`Chat with Rakesh (${resume.phone})`}
            isOpen={windows.whatsapp.isOpen}
            isMinimized={windows.whatsapp.isMinimized}
            isMaximized={windows.whatsapp.isMaximized}
            zIndex={windows.whatsapp.zIndex}
            onFocus={bringToFront}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximizeWindow}
            icon={<MacWhatsAppIcon size={18} />}
          >
            <WhatsAppChatWindow resume={resume} showToast={showToast} />
          </WindowFrame>

          {/* WINDOW 5: Finder Window (Projects Showcase) */}
          <WindowFrame
            id="finder"
            title="Finder"
            subtitle="Projects &amp; System Files"
            isOpen={windows.finder.isOpen}
            isMinimized={windows.finder.isMinimized}
            isMaximized={windows.finder.isMaximized}
            zIndex={windows.finder.zIndex}
            onFocus={bringToFront}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximizeWindow}
            icon={<MacFolderIcon size={18} />}
          >
            <FinderWindow
              resume={resume}
              onOpenWindow={openWindow}
              onDownloadResume={handleDownloadResume}
              showToast={showToast}
              onOpenAddProject={userRole === 'admin' ? () => setIsAddProjectOpen(true) : undefined}
              onDeleteProject={handleDeleteProject}
              userRole={userRole}
            />
          </WindowFrame>

          {/* WINDOW 6: Apple Intelligence / Siri Window */}
          <WindowFrame
            id="siri"
            title="Apple Intelligence"
            subtitle="Rakesh Kayal Candidate Agent"
            isOpen={windows.siri.isOpen}
            isMinimized={windows.siri.isMinimized}
            isMaximized={windows.siri.isMaximized}
            zIndex={windows.siri.zIndex}
            onFocus={bringToFront}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximizeWindow}
            icon={<span className="text-sm">🧠</span>}
          >
            <SiriWindow resume={resume} onOpenWindow={openWindow} showToast={showToast} />
          </WindowFrame>

          {/* WINDOW 7: System Settings Window */}
          <WindowFrame
            id="settings"
            title="System Settings"
            subtitle="Sequoia Configuration &amp; Specs"
            isOpen={windows.settings.isOpen}
            isMinimized={windows.settings.isMinimized}
            isMaximized={windows.settings.isMaximized}
            zIndex={windows.settings.zIndex}
            onFocus={bringToFront}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximizeWindow}
            icon={<MacSettingsIcon size={18} />}
          >
            <SettingsWindow
              resume={resume}
              currentWallpaper={currentWallpaper}
              onSelectWallpaper={setCurrentWallpaper}
              showToast={showToast}
              userRole={userRole}
              onPromoteToAdmin={() => setUserRole('admin')}
              onOpenAddProject={() => setIsAddProjectOpen(true)}
            />
          </WindowFrame>
        </main>

        {/* 2C. macOS Luxury Frosted Glass Bottom Dock */}
        <Dock
          windows={windows}
          activeWindow={activeWindow}
          onToggleWindow={toggleWindowFromDock}
          onLockScreen={handleLock}
          onDownloadResume={handleDownloadResume}
          userRole={userRole}
        />

        {/* 2D. Admin Add Project & File Modal */}
        <AddProjectModal
          isOpen={isAddProjectOpen}
          onClose={() => setIsAddProjectOpen(false)}
          resume={resume}
          onUpdateResume={async (updated) => {
            const res = await fetch('/api/resume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updated),
            });
            if (!res.ok) throw new Error('Failed to update resume');
            setResume(updated);
            fetchResume();
          }}
          showToast={showToast}
        />

        {/* 2E. Native System Toast */}
        <NotificationToast message={toastMessage} />
      </div>
    </div>
  );
}
