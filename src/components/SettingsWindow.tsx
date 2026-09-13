import React, { useState } from 'react';
import { 
  Laptop, 
  Image as ImageIcon, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Wifi, 
  Monitor, 
  User, 
  Check, 
  Sparkles,
  Info,
  RefreshCw,
  Sliders,
  Lock,
  Unlock,
  Plus,
  Key,
  FolderPlus
} from 'lucide-react';
import { ResumeData, UserRole } from '../types';
import { RakeshAvatar } from './RakeshAvatar';
import { isAudioEnabled, setAudioEnabled, playClickSound, playSuccessChime } from '../utils/audio';

interface SettingsWindowProps {
  resume: ResumeData;
  currentWallpaper: string;
  onSelectWallpaper: (url: string) => void;
  showToast: (msg: string) => void;
  userRole?: UserRole;
  onPromoteToAdmin?: () => void;
  onOpenAddProject?: () => void;
}

export const WALLPAPERS = [
  {
    id: 'monterey',
    name: 'macOS Monterey Waves',
    desc: 'Iconic vibrant purple & magenta abstract landscape from screenshot',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    previewColor: 'from-fuchsia-600 via-purple-700 to-indigo-900',
  },
  {
    id: 'sequoia',
    name: 'macOS Sequoia Abstract',
    desc: 'Apple Sequoia liquid glass & atmospheric gradient',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbWiNOfR3rcdhFDMw9wv-9h-Ci_jGdduxJhwrbTLGXtDlrhRIGi9caS4LpAUlvnQc7RfX1R-wEotjK_P8iLdluxPj-q867zdQRhfDY9M3zegW8vfJTFxOzcZpwwOMQD44LrcfLMUzcAOE9_AYp-XEbBkv54UlyF1VLEAhcL7HWiAglktltA3Hg_qCTSMd4N-O_TFRPJGRK5hSF3XPNxKg0pzGlz5d1QO2LA1QGdVb8HWu_4_pBs4My',
    previewColor: 'from-amber-600 via-rose-700 to-sky-900',
  },
  {
    id: 'sonoma',
    name: 'macOS Sonoma Horizon',
    desc: 'Deep blue and teal oceanic aerial flow',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-cyan-600 via-blue-700 to-slate-950',
  },
  {
    id: 'ventura',
    name: 'macOS Ventura Bloom',
    desc: 'Radiant golden orange & vibrant amber floral gradient',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-amber-500 via-orange-600 to-rose-700',
  },
  {
    id: 'big-sur',
    name: 'macOS Big Sur Dunes',
    desc: 'Twilight pastels and sweeping Pacific coastal silhouettes',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-indigo-600 via-purple-700 to-pink-500',
  },
  {
    id: 'catalina',
    name: 'macOS Catalina Dusk',
    desc: 'Dramatic Pacific ocean waters bathed in sunset hues',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-blue-700 via-indigo-800 to-slate-900',
  },
  {
    id: 'mojave-night',
    name: 'macOS Mojave Night',
    desc: 'Silent starfield and moonlit desert sand ridges',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-slate-900 via-blue-950 to-indigo-950',
  },
  {
    id: 'yosemite',
    name: 'macOS Yosemite Peak',
    desc: 'Iconic granite cliffs bathed in morning mountain mist',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-emerald-800 via-teal-900 to-slate-900',
  },
  {
    id: 'aurora',
    name: 'Nordic Aurora Borealis',
    desc: 'Electric emerald and cyan ribbons illuminating Arctic night',
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-teal-500 via-emerald-700 to-slate-950',
  },
  {
    id: 'liquid-abstract',
    name: 'Apple 3D Fluid Glass',
    desc: 'Curved iridescent chromatic refraction and velvet shadows',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-fuchsia-500 via-rose-600 to-purple-800',
  },
  {
    id: 'dark-minimal',
    name: 'macOS Dark Minimal Space',
    desc: 'Pure dark luxury carbon backdrop for low-distraction coding',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-zinc-900 via-zinc-950 to-black',
  },
  {
    id: 'deep-nebula',
    name: 'Deep Cosmos Nebula',
    desc: 'Ultra high-definition interstellar cosmic clouds & starlight',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2560&auto=format&fit=crop',
    previewColor: 'from-blue-600 via-violet-800 to-black',
  },
];

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  resume,
  currentWallpaper,
  onSelectWallpaper,
  showToast,
  userRole = 'visitor',
  onPromoteToAdmin,
  onOpenAddProject,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'wallpaper' | 'sound' | 'projects' | 'specs'>('profile');
  const [soundOn, setSoundOn] = useState(isAudioEnabled());
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authUsername, setAuthUsername] = useState('Rakesh Kayal');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const saveSettingsToServer = async (updates: { wallpaper?: string; soundEnabled?: boolean }) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      // ignore
    }
  };

  const handleSelectWallpaper = (url: string) => {
    onSelectWallpaper(url);
    saveSettingsToServer({ wallpaper: url });
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setAudioEnabled(next);
    saveSettingsToServer({ soundEnabled: next });
    if (next) playSuccessChime();
    showToast(`System audio effects ${next ? 'enabled' : 'muted'}`);
  };

  const handleUnlockAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(false);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'admin',
          username: authUsername,
          password: authPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        playSuccessChime();
        if (onPromoteToAdmin) onPromoteToAdmin();
        setShowAuthModal(false);
        setAuthPassword('');
        showToast('Settings unlocked as Administrator (Rakesh Kayal)');
      } else {
        setAuthError(true);
        playClickSound();
      }
    } catch {
      // Fallback check in case network glitch
      if (authPassword === 'Rakesh@2003') {
        playSuccessChime();
        if (onPromoteToAdmin) onPromoteToAdmin();
        setShowAuthModal(false);
        setAuthPassword('');
        showToast('Settings unlocked as Administrator (Rakesh Kayal)');
      } else {
        setAuthError(true);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="relative flex h-full w-full bg-slate-950/85 text-slate-100 select-none">
      {/* Left Settings Sidebar */}
      <div className="w-48 sm:w-56 bg-slate-900/90 border-r border-white/10 p-3 flex flex-col justify-between text-xs">
        <div className="space-y-3">
          {/* User mini badge */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
            <RakeshAvatar size="sm" showUploadPrompt={false} />
            <div className="min-w-0">
              <p className="font-semibold text-white text-xs truncate">{resume.name}</p>
              <p className="text-[10px] text-white/50 truncate">
                {userRole === 'admin' ? 'Administrator' : 'Guest Account'}
              </p>
            </div>
          </div>

          <div className="space-y-0.5 pt-1">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('profile');
              }}
              className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'profile' ? 'bg-blue-600/30 text-white font-medium border border-blue-400/30' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 text-sky-400" />
              <span>Profile &amp; Avatar</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('wallpaper');
              }}
              className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'wallpaper' ? 'bg-blue-600/30 text-white font-medium border border-blue-400/30' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span>Wallpaper</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('sound');
              }}
              className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'sound' ? 'bg-blue-600/30 text-white font-medium border border-blue-400/30' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Sound Effects</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('projects');
              }}
              className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'projects' ? 'bg-blue-600/30 text-white font-medium border border-blue-400/30' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <FolderPlus className="w-4 h-4 text-blue-400" />
              <span>Projects &amp; Files</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab('specs');
              }}
              className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'specs' ? 'bg-blue-600/30 text-white font-medium border border-blue-400/30' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Laptop className="w-4 h-4 text-emerald-400" />
              <span>About This Mac</span>
            </button>
          </div>
        </div>

        {/* Lock / Unlock Bar at bottom of sidebar */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          {userRole === 'admin' ? (
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center gap-2 text-blue-200 text-[11px]">
              <Unlock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="font-medium truncate">Unlocked (Admin)</span>
            </div>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                setShowAuthModal(true);
              }}
              className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 flex items-center gap-2 text-white/80 hover:text-white text-[11px] transition-colors cursor-pointer"
              title="Click the lock to make changes as Rakesh Kayal"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">Click lock to edit</span>
            </button>
          )}

          <div className="px-1 text-[10px] text-white/40 space-y-0.5">
            <p className="text-white/60 font-medium">macOS Sequoia 15.3</p>
            <p>Kernel Darwin 24.3.0</p>
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
        {/* TAB 1: Profile & Avatar */}
        {activeTab === 'profile' && (
          <div className="space-y-5 max-w-lg">
            <div>
              <h2 className="text-lg font-bold text-white">Profile &amp; Appearance</h2>
              <p className="text-xs text-white/60">
                Your portrait appears on the Safari Resume, Menu Bar, and System Login.
              </p>
            </div>

            <div className="mac-glass-card rounded-2xl p-4 border border-white/10 flex items-center gap-5">
              <RakeshAvatar size="lg" showUploadPrompt={true} />
              <div className="space-y-1.5 flex-1">
                <h3 className="font-bold text-white text-base">{resume.name}</h3>
                <p className="text-sky-400 text-xs font-medium">{resume.title}</p>
                <p className="text-[11px] text-emerald-300 font-mono">📍 {resume.location}</p>
                <p className="text-[11px] text-white/50 pt-1">
                  Hover over the portrait to upload or change your photo file anytime.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white/80 uppercase font-mono tracking-wider">
                Account Information
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <span className="text-white/60">Primary Email:</span>
                  <span className="text-white font-mono font-medium">{resume.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <span className="text-white/60">Phone Contact:</span>
                  <span className="text-white font-mono font-medium">{resume.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <span className="text-white/60">Professional Status:</span>
                  <span className="text-emerald-400 font-medium">{resume.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Wallpapers */}
        {activeTab === 'wallpaper' && (
          <div className="space-y-4 max-w-xl">
            <div>
              <h2 className="text-lg font-bold text-white">Desktop Wallpaper</h2>
              <p className="text-xs text-white/60">
                Choose from genuine macOS system wallpapers, including Monterey purple waves.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {WALLPAPERS.map((wp) => {
                const isSelected = currentWallpaper === wp.url;
                return (
                  <div
                    key={wp.id}
                    onClick={() => {
                      playClickSound();
                      handleSelectWallpaper(wp.url);
                      showToast(`Wallpaper set to ${wp.name}`);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-400 shadow-xl scale-[1.02]'
                        : 'mac-glass-card border-white/10 hover:border-white/30 hover:scale-[1.01]'
                    }`}
                  >
                    <div
                      className={`h-24 rounded-xl bg-cover bg-center overflow-hidden relative shadow-inner bg-gradient-to-tr ${wp.previewColor}`}
                      style={{ backgroundImage: `url('${wp.url}')` }}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-white flex items-center gap-1.5">
                        <span>{wp.name}</span>
                        {isSelected && <span className="text-[10px] text-sky-400 font-mono">• Active</span>}
                      </p>
                      <p className="text-[10px] text-white/50 line-clamp-1">{wp.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Wallpaper URL Input for Rakesh */}
            <div className="pt-2">
              <div className="mac-glass-card p-4 rounded-xl border border-white/10 space-y-2.5">
                <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Custom Wallpaper Link</span>
                </h3>
                <p className="text-[11px] text-white/50">
                  Paste any direct image URL (Unsplash, imgur, GitHub) to set as system background.
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={customWallpaperUrl}
                    onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={() => {
                      if (customWallpaperUrl.trim()) {
                        handleSelectWallpaper(customWallpaperUrl.trim());
                        showToast('Custom wallpaper applied & saved!');
                        setCustomWallpaperUrl('');
                      }
                    }}
                    disabled={!customWallpaperUrl.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-medium cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Sound */}
        {activeTab === 'sound' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <h2 className="text-lg font-bold text-white">Sound Effects</h2>
              <p className="text-xs text-white/60">
                Configure authentic macOS interface acoustics and synthesized boot chimes.
              </p>
            </div>

            <div className="mac-glass-card rounded-2xl p-4 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-white">Interface Audio Feedback</p>
                  <p className="text-[11px] text-white/50">
                    Play feedback on button presses, window open, and commands
                  </p>
                </div>
                <button
                  onClick={toggleSound}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    soundOn ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {soundOn ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Muted</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-white/60">Synthesizer Engine:</span>
                <span className="font-mono text-emerald-400 text-[11px]">Web Audio API (Polyphonic)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Projects & Files */}
        {activeTab === 'projects' && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Projects &amp; Portfolio Files</h2>
                <p className="text-xs text-white/60">
                  {userRole === 'admin'
                    ? 'Manage your live projects and updates. Changes sync to visitor sessions.'
                    : 'Projects curated by Rakesh Kayal.'}
                </p>
              </div>

              {userRole === 'admin' ? (
                <button
                  onClick={() => {
                    playClickSound();
                    if (onOpenAddProject) onOpenAddProject();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-md cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    playClickSound();
                    setShowAuthModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/15 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Unlock to Add Files</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {(resume?.projects || []).map((proj, idx) => (
                <div
                  key={proj?.title || idx}
                  className="p-3.5 rounded-xl mac-glass-card border border-white/10 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs text-white">{proj?.title || 'Untitled Project'}</h4>
                      {proj?.metrics && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                          {proj.metrics}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/60 line-clamp-2">{proj?.description || proj?.summary || ''}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(proj?.techStack || proj?.technologies || []).slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/70">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: About This Mac (Specs) */}
        {activeTab === 'specs' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <h2 className="text-lg font-bold text-white">About This Mac</h2>
              <p className="text-xs text-white/60">Developer Hardware &amp; System Specifications.</p>
            </div>

            <div className="mac-glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-700 to-zinc-900 border border-white/20 flex items-center justify-center shadow-xl">
                  <Laptop className="w-10 h-10 text-sky-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">MacBook Pro 16-inch</h3>
                  <p className="text-xs text-white/60">Apple M3 Pro Chip (12-Core CPU, 18-Core GPU)</p>
                  <p className="text-[11px] font-mono text-sky-400">macOS Sequoia 15.3 (24D70)</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/50">Memory:</span>
                  <span className="font-medium text-white">36 GB Unified Memory</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Primary Architecture:</span>
                  <span className="font-medium text-white">arm64 (Apple Silicon)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Concurrency Benchmark:</span>
                  <span className="font-medium text-emerald-400 font-mono">500+ Concurrent STOMP Users</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">LeetCode Solved:</span>
                  <span className="font-medium text-amber-300 font-mono">400+ Problems</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Target Roles:</span>
                  <span className="font-medium text-sky-300">Backend Software Engineer</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Authentic macOS Admin Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-sm rounded-2xl bg-slate-900/95 border border-white/20 shadow-2xl p-5 text-slate-100 ${
              authError ? 'animate-shake' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Lock className="w-6 h-6 text-slate-950" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">System Settings is trying to unlock preferences.</h3>
                <p className="text-xs text-white/70">
                  Enter administrator credentials for Rakesh Kayal to make changes.
                </p>
              </div>
            </div>

            <form onSubmit={handleUnlockAdmin} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-white/60 mb-1">User Name:</label>
                <input
                  type="text"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/60 mb-1">Password:</label>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter administrator password"
                  value={authPassword}
                  onChange={(e) => {
                    setAuthPassword(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
                />
              </div>

              {authError && (
                <p className="text-[11px] text-rose-400">
                  Incorrect password. (Hint: <span className="font-mono font-medium">Rakesh@2003</span>)
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    setAuthPassword('');
                    setAuthError(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow transition-colors cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? 'Unlocking...' : 'Unlock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
