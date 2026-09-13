import React, { useState } from 'react';
import { 
  FileCode, 
  FileText, 
  Award, 
  Grid, 
  List, 
  ExternalLink, 
  Github, 
  ShieldCheck, 
  ChevronRight,
  Database,
  Cpu,
  Download,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { ResumeData, WindowId, UserRole } from '../types';
import { playClickSound } from '../utils/audio';
import { MacFolderIcon } from './MacIcons';

interface FinderWindowProps {
  resume: ResumeData;
  onOpenWindow: (id: WindowId) => void;
  onDownloadResume: () => void;
  showToast: (msg: string) => void;
  onOpenAddProject?: () => void;
  onDeleteProject?: (projectTitle: string) => Promise<void>;
  userRole?: UserRole;
}

export const FinderWindow: React.FC<FinderWindowProps> = ({
  resume,
  onOpenWindow,
  onDownloadResume,
  showToast,
  onOpenAddProject,
  onDeleteProject,
  userRole = 'visitor',
}) => {
  const [selectedFolder, setSelectedFolder] = useState<'all' | 'backend' | 'certs' | 'docs'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Dynamically map all projects from resume.projects so new files & projects appear here!
  const projectItems = (resume?.projects || []).map((proj, idx) => ({
    id: `project-${idx}-${(proj?.title || `item-${idx}`).toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: proj?.title || 'Untitled Project',
    category: 'backend' as const,
    type: 'project' as const,
    icon: idx === 0 ? '💬' : idx === 1 ? '⚡' : idx === 2 ? '🏥' : '🚀',
    desc: proj?.summary || proj?.description || '',
    tech: proj?.technologies || proj?.techStack || [],
    link: proj?.githubUrl || proj?.link,
    highlights: proj?.highlights || [],
  }));

  const docItems = [
    {
      id: 'resume-json',
      title: 'resume.json',
      category: 'docs' as const,
      type: 'file' as const,
      icon: '📄',
      desc: 'Dynamically imported JSON schema file powering this interactive portfolio.',
      tech: ['JSON', 'TypeScript'],
      action: () => onOpenWindow('terminal'),
    },
    {
      id: 'resume-pdf',
      title: 'Rakesh_Kayal_Backend_Resume.pdf',
      category: 'docs' as const,
      type: 'file' as const,
      icon: '📑',
      desc: 'Full one-page professional resume format.',
      tech: ['PDF', 'Vector Layout'],
      action: onDownloadResume,
    },
  ];

  const certItems = [
    {
      id: 'cert-aws',
      title: 'AWS Academy Cloud Foundations (2025)',
      category: 'certs' as const,
      type: 'cert' as const,
      icon: '☁️',
      desc: 'Certified cloud fundamentals and architecture by AWS Academy.',
      tech: ['AWS', 'EC2', 'IAM'],
      link: 'https://aws.amazon.com/training/aws-academy/',
    },
    {
      id: 'cert-oci',
      title: 'Oracle OCI AI Foundations Associate (2025)',
      category: 'certs' as const,
      type: 'cert' as const,
      icon: '🤖',
      desc: 'Certified Artificial Intelligence & Machine Learning foundations by Oracle Cloud Infrastructure.',
      tech: ['Oracle Cloud', 'AI'],
      link: 'https://education.oracle.com/',
    },
  ];

  const finderItems = [...projectItems, ...docItems, ...certItems];

  const activeItemId = selectedItem || finderItems[0]?.id;
  const activeItemDetails = finderItems.find((i) => i.id === activeItemId);

  const filteredItems = finderItems.filter((item) => {
    if (selectedFolder === 'all') return true;
    return item.category === selectedFolder;
  });

  return (
    <div className="flex h-full w-full bg-slate-950/80 text-slate-100 select-none">
      {/* Sidebar */}
      <div className="w-44 sm:w-52 bg-slate-900/90 border-r border-white/10 p-3 flex flex-col justify-between text-xs">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 px-2 font-semibold">
              Favorites
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  playClickSound();
                  setSelectedFolder('all');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedFolder === 'all' ? 'bg-blue-600/30 text-white font-medium' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <MacFolderIcon size={16} />
                <span>All Items</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setSelectedFolder('backend');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedFolder === 'backend' ? 'bg-blue-600/30 text-white font-medium' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <MacFolderIcon size={16} />
                <span>Projects ({resume.projects.length})</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setSelectedFolder('certs');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedFolder === 'certs' ? 'bg-blue-600/30 text-white font-medium' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Certifications</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setSelectedFolder('docs');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedFolder === 'docs' ? 'bg-blue-600/30 text-white font-medium' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <MacFolderIcon size={16} badge="download" />
                <span>Documents</span>
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 px-2 font-semibold">
              Tags
            </span>
            <div className="mt-1 space-y-1 text-[11px] px-2 text-white/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Java &amp; Spring
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> FastAPI &amp; Python
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> AWS &amp; Cloud
              </span>
            </div>
          </div>
        </div>

        {/* Storage info */}
        <div className="p-2 rounded-xl bg-white/5 text-[10px] text-white/50 border border-white/5 space-y-1">
          <p className="font-semibold text-white/80">Developer Drive</p>
          <p>500+ Concurrent Tests</p>
          <p>400+ LeetCode Solutions</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Finder Toolbar */}
        <div className="h-10 px-4 bg-slate-900/60 border-b border-white/10 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
            <span>Macintosh HD</span>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span>Developer</span>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white font-medium capitalize">{selectedFolder}</span>
          </div>

          {/* View Toggles and Admin Actions */}
          <div className="flex items-center gap-2">
            {onOpenAddProject && (
              <button
                onClick={() => {
                  playClickSound();
                  onOpenAddProject();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Add New Project or File"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project / File</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
                title="Icon View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Items Explorer */}
          <div className="flex-1 overflow-y-auto p-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedItem(item.id);
                    }}
                    onDoubleClick={() => {
                      if (item.action) item.action();
                      else if (item.link) window.open(item.link, '_blank');
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center text-center gap-2 cursor-pointer transition-all ${
                      selectedItem === item.id
                        ? 'bg-blue-600/25 border-blue-400/50 shadow-lg'
                        : 'mac-glass-card border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <MacFolderIcon size={44} badge={item.id === 'resume-pdf' ? 'download' : undefined} />
                      <span className="absolute bottom-1 right-0 text-sm">{item.icon}</span>
                    </div>
                    <span className="text-xs font-semibold text-white line-clamp-1">{item.title}</span>
                    <span className="text-[10px] text-white/50 line-clamp-1">{item.tech.join(', ')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedItem(item.id);
                    }}
                    onDoubleClick={() => {
                      if (item.action) item.action();
                      else if (item.link) window.open(item.link, '_blank');
                    }}
                    className={`px-3 py-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      selectedItem === item.id
                        ? 'bg-blue-600/30 text-white font-medium border border-blue-400/30'
                        : 'hover:bg-white/5 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/50 text-[11px] font-mono">
                      <span>{Array.isArray(item.tech) ? item.tech.slice(0, 2).join(', ') : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Item Preview Inspector */}
          {activeItemDetails && (
            <div className="w-56 sm:w-64 border-l border-white/10 bg-slate-900/60 p-4 flex flex-col justify-between text-xs overflow-y-auto hidden md:flex">
              <div className="space-y-3">
                <div className="text-center pt-2">
                  <span className="text-5xl block mb-2">{activeItemDetails.icon}</span>
                  <h3 className="font-bold text-white text-sm leading-tight">{activeItemDetails.title || 'Project Details'}</h3>
                  <span className="text-[10px] uppercase font-mono text-sky-400 block mt-1">
                    {activeItemDetails.category}
                  </span>
                </div>

                <div className="h-[1px] bg-white/10"></div>

                <div className="space-y-1.5 text-slate-300">
                  <span className="text-[10px] uppercase font-mono text-white/50">Information</span>
                  <p className="text-xs leading-relaxed">{activeItemDetails.desc}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-white/50">Technologies</span>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(activeItemDetails.tech) && activeItemDetails.tech.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                {activeItemDetails.link && (
                  <a
                    href={activeItemDetails.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Open External Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {activeItemDetails.action && (
                  <button
                    onClick={activeItemDetails.action}
                    className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Open / Run</span>
                  </button>
                )}

                {/* Admin direct item actions */}
                {userRole === 'admin' && activeItemDetails.type === 'project' && (
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono text-amber-400 block">
                      Admin Item Controls
                    </span>
                    {onDeleteProject && (
                      <button
                        onClick={() => onDeleteProject(activeItemDetails.title)}
                        className="w-full py-1.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                        title="Delete project from portfolio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Item</span>
                      </button>
                    )}
                    {onOpenAddProject && (
                      <button
                        onClick={onOpenAddProject}
                        className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Edit in Studio</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
