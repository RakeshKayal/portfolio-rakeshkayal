import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code2, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Terminal,
  Share2,
  RefreshCw,
  Lock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sidebar,
  BookOpen,
  Plus,
  Compass,
  FileText,
  Trash2,
  Edit3
} from 'lucide-react';
import { ResumeData, WindowId, UserRole } from '../types';
import { playClickSound, playSuccessChime } from '../utils/audio';
import { RakeshAvatar } from './RakeshAvatar';

interface SafariWindowProps {
  resume: ResumeData;
  onOpenWindow: (id: WindowId) => void;
  onDownloadResume: () => void;
  showToast: (msg: string) => void;
  onOpenAddProject?: () => void;
  onDeleteProject?: (projectTitle: string) => Promise<void>;
  userRole?: UserRole;
}

export const SafariWindow: React.FC<SafariWindowProps> = ({
  resume,
  onOpenWindow,
  onDownloadResume,
  showToast,
  onOpenAddProject,
  onDeleteProject,
  userRole = 'visitor',
}) => {
  // View mode: Interactive Portfolio vs Authentic 1-Page LaTeX Document
  const [viewMode, setViewMode] = useState<'interactive' | 'exact-resume'>('interactive');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    playClickSound();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitSuccess(true);
        playSuccessChime();
        showToast('Message sent to Rakesh Kayal (rakeshkayal276@gmail.com)');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMessage(data.error || 'Failed to dispatch message. Please try again or use direct email.');
      }
    } catch (err: any) {
      setErrorMessage('Network error dispatching message. Opening email client fallback.');
      window.location.href = `mailto:rakeshkayal276@gmail.com?subject=${encodeURIComponent(
        formData.subject || 'Portfolio Inquiry'
      )}&body=${encodeURIComponent(formData.message)}`;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950/80 text-slate-100">
      {/* macOS Safari Tab Bar */}
      <div className="h-8 px-3 bg-slate-900/95 border-b border-white/10 flex items-center gap-1.5 select-none text-xs">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-t-lg border-t border-x border-white/15 text-white max-w-xs truncate shadow-sm">
          <Compass className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
          <span className="truncate text-[11px] font-medium">
            {viewMode === 'exact-resume' ? 'Rakesh_Kayal_Resume.pdf' : 'Rakesh Kayal — Backend Portfolio'}
          </span>
          <span className="text-[10px] text-white/40 hover:text-white ml-1">✕</span>
        </div>
        <button
          onClick={() => showToast('Opened new Safari Tab')}
          className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white"
          title="New Tab"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Safari Unified Navigation & Address Bar */}
      <div className="h-11 px-3 py-1.5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between gap-3 text-xs select-none">
        {/* Left Navigation Buttons */}
        <div className="flex items-center gap-1 text-white/60">
          <button
            onClick={() => showToast('Safari Sidebar')}
            className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
            title="Toggle Sidebar"
          >
            <Sidebar className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'interactive' ? 'exact-resume' : 'interactive')}
            className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"
            title="Switch View"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'interactive' ? 'exact-resume' : 'interactive')}
            className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"
            title="Switch View"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Centered Capsule Address Bar */}
        <div className="flex-1 max-w-xl mx-auto h-7 px-3 rounded-full bg-black/60 border border-white/15 flex items-center justify-between gap-2 text-[11px] text-white/80 font-mono shadow-inner">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span className="text-white/40 text-[10px]">https://</span>
            <span className="text-white font-medium truncate">
              {viewMode === 'exact-resume' ? 'rakeshkayal.dev/official-resume.pdf' : 'rakeshkayal.dev/resume'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white/50 flex-shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setViewMode(viewMode === 'interactive' ? 'exact-resume' : 'interactive');
              }}
              className="hover:text-white cursor-pointer"
              title={viewMode === 'interactive' ? 'View 1-Page LaTeX Resume' : 'View Interactive Portfolio'}
            >
              <BookOpen className="w-3 h-3" />
            </button>
            <RefreshCw
              onClick={() => showToast('Refreshed Safari View')}
              className="w-3 h-3 hover:text-white cursor-pointer"
              title="Reload Page"
            />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 text-white/80">
          <button
            onClick={onDownloadResume}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium shadow-md transition-all active:scale-95 cursor-pointer"
            title="Download Official PDF Resume"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast('Portfolio link copied to clipboard!');
              }
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
            title="Share Portfolio"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Safari View Mode & Bookmarks Bar */}
      <div className="h-8 px-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between text-[11px] text-white/70 select-none overflow-x-auto scrollbar-none">
        {/* Toggle between Interactive and Official LaTeX Resume */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg">
          <button
            onClick={() => {
              playClickSound();
              setViewMode('interactive');
            }}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              viewMode === 'interactive' ? 'bg-blue-600 text-white shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            Interactive Web View
          </button>
          <button
            onClick={() => {
              playClickSound();
              setViewMode('exact-resume');
            }}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'exact-resume' ? 'bg-emerald-600 text-white shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Official LaTeX Resume (1-Page)</span>
          </button>
        </div>

        {viewMode === 'interactive' ? (
          <div className="hidden sm:flex items-center gap-3 text-white/60">
            <span className="text-white/40 font-mono text-[10px] uppercase tracking-wider">Jump to:</span>
            <a href="#overview" className="hover:text-sky-300 transition-colors">Overview</a>
            <a href="#skills" className="hover:text-sky-300 transition-colors">Technical Skills</a>
            <a href="#experience" className="hover:text-sky-300 transition-colors">Experience</a>
            <a href="#projects" className="hover:text-sky-300 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-sky-300 transition-colors">Contact</a>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {userRole === 'admin' && onOpenAddProject && (
              <button
                onClick={onOpenAddProject}
                className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono hover:bg-amber-500/30 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Full Resume</span>
              </button>
            )}
            <span className="text-[10px] text-emerald-400 font-mono">1:1 Academic Standard</span>
          </div>
        )}
      </div>

      {/* =========================================================
          VIEW MODE A: AUTHENTIC 1-PAGE LATEX RESUME (Exact User Format)
          Renders 1:1 replica of user's uploaded LaTeX resume document
         ========================================================= */}
      {viewMode === 'exact-resume' ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-900/90 flex flex-col items-center select-text">
          {/* Action Bar Above Paper */}
          <div className="w-full max-w-3xl mb-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-white/70">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[11px]">Rakesh_Kayal_Backend_Engineer_Resume.pdf (LaTeX / Times New Roman)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onDownloadResume}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 shadow transition-all cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Exact PDF</span>
              </button>
            </div>
          </div>

          {/* Authentic White Paper Sheet */}
          <div
            className="w-full max-w-3xl bg-white text-black shadow-2xl p-8 sm:p-12 font-serif text-[13px] leading-[1.35] select-text"
            style={{ fontFamily: '"Times New Roman", Times, Georgia, serif', minHeight: '1100px' }}
          >
            {/* Header */}
            <div className="text-center space-y-1 pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-black">
                {resume.name}
              </h1>
              <div className="text-xs sm:text-[13px] text-neutral-800 flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1">
                <span>{resume.phone}</span>
                <span>|</span>
                <a href={`mailto:${resume.email}`} className="text-blue-700 hover:underline">
                  {resume.email}
                </a>
                <span>|</span>
                <a href={resume.socials?.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                  LinkedIn
                </a>
                <span>|</span>
                <a href={resume.socials?.github} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                  GitHub
                </a>
                <span>|</span>
                <a href={resume.socials?.leetcode} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                  LeetCode
                </a>
              </div>
            </div>

            {/* SECTION 1: SUMMARY */}
            <div className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b-[1.5px] border-black pb-0.5">
                Summary
              </h2>
              <p className="mt-1.5 text-justify text-neutral-900 leading-normal text-xs sm:text-[13px]">
                {resume.summary}
              </p>
            </div>

            {/* SECTION 2: EXPERIENCE */}
            <div className="mt-4 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b-[1.5px] border-black pb-0.5">
                Experience
              </h2>

              {resume.experience?.map((exp, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-black text-xs sm:text-[13px]">
                    <div>
                      <span>{exp.company}</span>
                      {exp.subName && <span className="font-normal text-neutral-700 text-xs"> — {exp.subName}</span>}
                    </div>
                    <span className="font-normal text-neutral-700 text-xs">{exp.duration}</span>
                  </div>

                  <div className="flex justify-between items-baseline italic text-neutral-800 text-xs sm:text-[13px]">
                    <span>{exp.role}</span>
                    <span className="not-italic text-neutral-600 text-xs">{exp.location || 'Remote'}</span>
                  </div>

                  <ul className="list-disc pl-5 space-y-0.5 mt-1 text-neutral-900 text-xs sm:text-[12.5px] leading-snug">
                    {exp.bullets?.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* SECTION 3: PROJECTS */}
            <div className="mt-4 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b-[1.5px] border-black pb-0.5">
                Projects
              </h2>

              {resume.projects?.map((proj, pIdx) => (
                <div key={pIdx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-black text-xs sm:text-[13px]">
                      <span>{proj.title}</span>
                      {proj.technologies && (
                        <span className="font-normal text-neutral-700 text-xs">
                          {' '}| {proj.technologies.join(', ')}
                        </span>
                      )}
                    </div>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-blue-700 text-xs hover:underline">
                        [Link]
                      </a>
                    )}
                  </div>

                  {proj.summary && (
                    <p className="text-neutral-800 text-xs italic pl-1">{proj.summary}</p>
                  )}

                  <ul className="list-disc pl-5 space-y-0.5 mt-0.5 text-neutral-900 text-xs sm:text-[12.5px] leading-snug">
                    {proj.highlights?.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* SECTION 4: TECHNICAL SKILLS */}
            <div className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b-[1.5px] border-black pb-0.5">
                Technical Skills
              </h2>
              <div className="mt-1.5 space-y-0.5 text-neutral-900 text-xs sm:text-[13px]">
                <div>
                  <span className="font-bold">Languages: </span>
                  <span>Java, Python, SQL</span>
                </div>
                <div>
                  <span className="font-bold">Frameworks: </span>
                  <span>Spring Boot, Spring Data JPA, Hibernate, Spring Security, FastAPI</span>
                </div>
                <div>
                  <span className="font-bold">Backend: </span>
                  <span>REST APIs, WebSocket, JWT Authentication, OAuth2</span>
                </div>
                <div>
                  <span className="font-bold">Core CS: </span>
                  <span>Data Structures, Algorithms, OOP, DBMS, Operating Systems</span>
                </div>
                <div>
                  <span className="font-bold">Cloud: </span>
                  <span>AWS (EC2, IAM)</span>
                </div>
                <div>
                  <span className="font-bold">Tools: </span>
                  <span>Git, GitHub, Maven, Postman, Docker</span>
                </div>
              </div>
            </div>

            {/* SECTION 5: EDUCATION */}
            <div className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b-[1.5px] border-black pb-0.5">
                Education
              </h2>
              <div className="mt-1.5 space-y-0.5 text-neutral-900 text-xs sm:text-[13px]">
                <div className="flex justify-between items-baseline font-bold">
                  <span>{resume.education?.institution}</span>
                  <span className="font-normal text-neutral-700 text-xs">{resume.education?.duration}</span>
                </div>
                <div className="flex justify-between items-baseline italic text-neutral-800 text-xs sm:text-[13px]">
                  <span>{resume.education?.degree}, {resume.education?.specialization}</span>
                  <span className="not-italic text-neutral-600 text-xs">{resume.education?.location}</span>
                </div>
                <div className="text-neutral-700 text-xs">
                  <span>{resume.education?.grade}</span>
                </div>
              </div>
            </div>

            {/* SECTION 6: CERTIFICATIONS & ACHIEVEMENTS */}
            <div className="mt-4 pb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b-[1.5px] border-black pb-0.5">
                Certifications &amp; Achievements
              </h2>
              <ul className="list-disc pl-5 space-y-0.5 mt-1.5 text-neutral-900 text-xs sm:text-[12.5px]">
                {resume.certifications?.map((cert, cIdx) => (
                  <li key={cIdx}>
                    <span className="font-bold">{cert.title}</span> – <span>{cert.issuer}</span> ({cert.year})
                  </li>
                ))}
                <li>
                  <span className="font-bold">LeetCode: </span>
                  <span>Solved 500+ algorithmic problems demonstrating strong core data structures &amp; algorithmic logic.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            VIEW MODE B: INTERACTIVE MODERN PORTFOLIO
           ========================================================= */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto w-full">
          {/* Profile Hero Card */}
          <div id="overview" className="mac-glass-card rounded-2xl p-5 sm:p-7 border border-white/15 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar Portrait of Rakesh Kayal */}
            <RakeshAvatar size="lg" className="sm:w-28 sm:h-28" />

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{resume.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-mono font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {resume.status}
                </span>
              </div>

              <p className="text-sm sm:text-base text-sky-400 font-medium">{resume.title}</p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">{resume.summary}</p>

              {/* Quick Contact & Social Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-white/70">
                <a
                  href={`mailto:${resume.email}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{resume.email}</span>
                </a>
                <a
                  href={`tel:${resume.phone}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{resume.phone}</span>
                </a>
                <span className="flex items-center gap-1.5 text-white/50 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{resume.location}</span>
                </span>
              </div>

              {/* Social URLs */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                <a
                  href={resume.socials?.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={resume.socials?.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={resume.socials?.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-xs transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>LeetCode (500+)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
            <div className="mac-glass-card p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-mono text-white/50 block">LeetCode Solved</span>
              <span className="text-lg sm:text-xl font-bold text-amber-400">500+</span>
            </div>
            <div className="mac-glass-card p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-mono text-white/50 block">Concurrent virtual Users Tested</span>
              <span className="text-lg sm:text-xl font-bold text-sky-400">10,000+</span>
            </div>
            <div className="mac-glass-card p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-mono text-white/50 block">Throughput Benchmark</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400">632.9 req/s</span>
            </div>
            <div className="mac-glass-card p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-mono text-white/50 block">B.Tech CGPA</span>
              <span className="text-lg sm:text-xl font-bold text-purple-400">8.7 / 10</span>
            </div>
          </div>

          {/* Technical Skills Bento Grid */}
          <div id="skills" className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-sky-400" />
              Technical Competencies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mac-glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-sky-300 font-semibold block">Languages &amp; Core</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Java (Core, OOP, Multithreading)', 'Python', 'SQL (PostgreSQL, MySQL)', 'Data Structures', 'Algorithms'].map((s, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-sky-500/10 text-sky-200 border border-sky-400/20 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mac-glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-emerald-300 font-semibold block">Frameworks &amp; Architecture</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Spring Boot', 'Spring Data JPA', 'Hibernate', 'Spring Security', 'FastAPI', 'Microservices', 'RESTful APIs'].map((s, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-200 border border-emerald-400/20 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mac-glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-purple-300 font-semibold block">DevOps, Cloud &amp; Real-Time</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Docker', 'AWS (EC2, IAM)', 'WebSocket', 'JWT Authentication', 'Git/GitHub', 'Postman', 'Maven'].map((s, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-purple-500/10 text-purple-200 border border-purple-400/20 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Work Experience */}
          <div id="experience" className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-sky-400" />
              Work Experience
            </h2>

            <div className="space-y-4">
              {resume.experience?.map((exp, idx) => (
                <div key={idx} className="mac-glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {exp.company}
                        {exp.subName && <span className="text-white/60 font-normal text-xs"> — {exp.subName}</span>}
                      </h3>
                      <p className="text-xs text-sky-400 font-medium">{exp.role}</p>
                    </div>
                    <div className="text-right sm:text-right">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                        {exp.duration}
                      </span>
                      <span className="text-[10px] text-white/40 block mt-0.5">{exp.location || 'Remote'}</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-300 leading-relaxed">
                    {exp.bullets?.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>

                  {exp.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {exp.tags.map((t, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-white/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Backend Projects with Admin Delete & Edit Controls */}
          <div id="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                Featured Engineering Projects
              </h2>

              {userRole === 'admin' && onOpenAddProject && (
                <button
                  onClick={onOpenAddProject}
                  className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resume.projects?.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="mac-glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 group hover:border-sky-400/40 transition-colors relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                        {proj.category || 'Backend Architecture'}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white/60 hover:text-white p-1"
                            title="GitHub Repo"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}

                        {/* Admin Delete & Edit Controls */}
                        {userRole === 'admin' && (
                          <>
                            {onOpenAddProject && (
                              <button
                                onClick={onOpenAddProject}
                                className="p-1 rounded text-white/40 hover:text-sky-300 transition-colors"
                                title="Edit in Studio"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDeleteProject && (
                              <button
                                onClick={() => onDeleteProject(proj.title)}
                                className="p-1 rounded text-rose-400/60 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                                title="Delete Project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white">{proj.title || 'Untitled Project'}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.summary || proj.description || ''}</p>

                    <ul className="space-y-1 pl-4 list-disc text-[11px] text-slate-400">
                      {(proj.highlights || []).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                    {(proj.technologies || proj.techStack || []).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/80">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mac-glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <h2 className="text-sm uppercase tracking-wider font-semibold text-white/60 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                Education
              </h2>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">{resume.education?.institution}</h3>
                <p className="text-xs text-sky-400 font-medium">
                  {resume.education?.degree}, {resume.education?.specialization}
                </p>
                <div className="flex items-center justify-between text-xs text-white/60 pt-1">
                  <span>{resume.education?.duration}</span>
                  <span className="font-mono text-purple-300 font-semibold">{resume.education?.grade}</span>
                </div>
                <p className="text-[11px] text-white/40">{resume.education?.location}</p>
              </div>
            </div>

            <div className="mac-glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <h2 className="text-sm uppercase tracking-wider font-semibold text-white/60 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Certifications &amp; Credentials
              </h2>
              <div className="space-y-2 text-xs">
                {resume.certifications?.map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-white/5 last:border-none">
                    <div>
                      <span className="font-semibold text-white block">{c.title}</span>
                      <span className="text-[10px] text-white/50">{c.issuer}</span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-300">{c.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="mac-glass-card p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                Get in Touch with Rakesh Kayal
              </h2>
              <p className="text-xs text-white/60">
                Direct contact form. Messages are dispatched immediately to <code className="text-sky-300">rakeshkayal276@gmail.com</code>.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Message Dispatched Successfully!</p>
                  <p className="text-[11px] text-emerald-300">Thank you for reaching out. Rakesh will respond shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. recruiter@company.com"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. SDE Backend Role Opportunity"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Message *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hi Rakesh, we reviewed your distributed systems and Spring Boot projects..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-blue-400 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message to Rakesh'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
