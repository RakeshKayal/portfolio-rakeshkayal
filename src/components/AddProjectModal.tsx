import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Save,
  Trash2,
  Edit3,
  Check,
  RefreshCw,
  Download,
  FolderPlus,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  FileText,
} from 'lucide-react';
import { ResumeData, ResumeProject, ResumeExperience } from '../types';
import { playClickSound, playSuccessChime } from '../utils/audio';
import { generateResumePdf } from '../utils/generateResumePdf';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume?: ResumeData;
  onUpdateResume: (updated: ResumeData) => Promise<void>;
  showToast: (msg: string) => void;
  initialTab?: 'add-project' | 'manage-items' | 'edit-resume';
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  resume,
  onUpdateResume,
  showToast,
  initialTab = 'add-project',
}) => {
  const [activeTab, setActiveTab] = useState<'add-project' | 'manage-items' | 'edit-resume'>(initialTab);
  const [saving, setSaving] = useState(false);

  // Tab 1: New Project State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [techString, setTechString] = useState('Java, Spring Boot, PostgreSQL, Docker');
  const [githubUrl, setGithubUrl] = useState('https://github.com/RakeshKayal');
  const [highlightsString, setHighlightsString] = useState(
    'Architected high-throughput REST APIs with sub-50ms latency.\nImplemented JWT authentication and role-based access control.'
  );

  // Tab 2: Manage & Edit Item in Place State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editTech, setEditTech] = useState('');
  const [editHighlights, setEditHighlights] = useState('');
  const [editGithub, setEditGithub] = useState('');

  // Tab 3: Full Resume Editing State
  const [resumeSummary, setResumeSummary] = useState(resume?.summary || '');
  const [resumePhone, setResumePhone] = useState(resume?.phone || '+91-8768799345');
  const [resumeEmail, setResumeEmail] = useState(resume?.email || 'rakeshkayal276@gmail.com');
  const [resumeLinkedin, setResumeLinkedin] = useState(resume?.socials?.linkedin || 'https://linkedin.com/in/rakesh-kayal');
  const [resumeGithub, setResumeGithub] = useState(resume?.socials?.github || 'https://github.com/RakeshKayal');
  const [resumeLeetcode, setResumeLeetcode] = useState(resume?.socials?.leetcode || 'https://leetcode.com/u/RAKESH_kayal09');

  // Education state
  const [eduInstitution, setEduInstitution] = useState(resume?.education?.institution || 'The Neotia University');
  const [eduDegree, setEduDegree] = useState(resume?.education?.degree || 'B.Tech in Computer Science and Engineering');
  const [eduSpecialization, setEduSpecialization] = useState(resume?.education?.specialization || 'Specialization in Cyber Security');
  const [eduGrade, setEduGrade] = useState(resume?.education?.grade || 'CGPA: 8.7/10');
  const [eduDuration, setEduDuration] = useState(resume?.education?.duration || '2022 – 2026');
  const [eduLocation, setEduLocation] = useState(resume?.education?.location || 'West Bengal, India');

  // Skills string state
  const [skillLanguages, setSkillLanguages] = useState('Java, Python, SQL');
  const [skillFrameworks, setSkillFrameworks] = useState('Spring Boot, Spring Data JPA, Hibernate, Spring Security, FastAPI');
  const [skillBackend, setSkillBackend] = useState('REST APIs, WebSocket, JWT Authentication, OAuth2');
  const [skillCoreCS, setSkillCoreCS] = useState('Data Structures, Algorithms, OOP, DBMS, Operating Systems');
  const [skillCloud, setSkillCloud] = useState('AWS (EC2, IAM)');
  const [skillTools, setSkillTools] = useState('Git, GitHub, Maven, Postman, Docker');

  // Sync state whenever resume prop changes or modal opens
  useEffect(() => {
    if (resume) {
      setResumeSummary(resume.summary || '');
      setResumePhone(resume.phone || '+91-8768799345');
      setResumeEmail(resume.email || 'rakeshkayal276@gmail.com');
      if (resume.socials) {
        setResumeLinkedin(resume.socials.linkedin || '');
        setResumeGithub(resume.socials.github || '');
        setResumeLeetcode(resume.socials.leetcode || '');
      }
      if (resume.education) {
        setEduInstitution(resume.education.institution || '');
        setEduDegree(resume.education.degree || '');
        setEduSpecialization(resume.education.specialization || '');
        setEduGrade(resume.education.grade || '');
        setEduDuration(resume.education.duration || '');
        setEduLocation(resume.education.location || '');
      }
    }
  }, [resume, isOpen]);

  if (!isOpen) return null;

  // 1. Add New Project Handler
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      showToast('Please provide a project title and summary');
      return;
    }

    setSaving(true);
    playClickSound();

    const newProject: ResumeProject = {
      title: title.trim(),
      summary: summary.trim(),
      technologies: techString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      highlights: highlightsString
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
      githubUrl: githubUrl.trim() || resume?.socials?.github || 'https://github.com/RakeshKayal',
      featured: true,
    };

    const currentProjects = resume?.projects || [];
    const updatedProjects = [newProject, ...currentProjects];
    const updatedResume: ResumeData = {
      ...(resume as ResumeData),
      projects: updatedProjects,
    };

    try {
      await onUpdateResume(updatedResume);
      playSuccessChime();
      showToast(`Project "${newProject.title}" published and set in place!`);
      setTitle('');
      setSummary('');
      setActiveTab('manage-items');
    } catch (err) {
      showToast('Failed to save project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // 2. Delete Project / Item Handler
  const handleDeleteItem = async (index: number) => {
    if (!resume || !resume.projects) return;
    const targetProject = resume.projects[index];
    const confirmDelete = window.confirm(`Are you sure you want to delete "${targetProject.title}" from your portfolio?`);
    if (!confirmDelete) return;

    setSaving(true);
    playClickSound();

    const updatedProjects = resume.projects.filter((_, idx) => idx !== index);
    const updatedResume: ResumeData = {
      ...resume,
      projects: updatedProjects,
    };

    try {
      await onUpdateResume(updatedResume);
      playSuccessChime();
      showToast(`"${targetProject.title}" has been deleted.`);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    } catch (err) {
      showToast('Failed to delete item.');
    } finally {
      setSaving(false);
    }
  };

  // 3. Start Editing Project in Place
  const handleStartEditItem = (index: number) => {
    if (!resume || !resume.projects) return;
    const item = resume.projects[index];
    setEditingIndex(index);
    setEditTitle(item.title);
    setEditSummary(item.summary || '');
    setEditTech((item.technologies || []).join(', '));
    setEditHighlights((item.highlights || []).join('\n'));
    setEditGithub(item.githubUrl || '');
  };

  // 4. Save Edited Project in Place
  const handleSaveEditItem = async (index: number) => {
    if (!resume || !resume.projects) return;
    setSaving(true);
    playClickSound();

    const updatedProjects = [...resume.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      title: editTitle.trim(),
      summary: editSummary.trim(),
      technologies: editTech.split(',').map((t) => t.trim()).filter(Boolean),
      highlights: editHighlights.split('\n').map((h) => h.trim()).filter(Boolean),
      githubUrl: editGithub.trim(),
    };

    const updatedResume: ResumeData = {
      ...resume,
      projects: updatedProjects,
    };

    try {
      await onUpdateResume(updatedResume);
      playSuccessChime();
      showToast(`"${editTitle}" updated in place!`);
      setEditingIndex(null);
    } catch (err) {
      showToast('Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  // 5. Save Full Resume Handler
  const handleSaveFullResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) return;

    setSaving(true);
    playClickSound();

    const updatedResume: ResumeData = {
      ...resume,
      summary: resumeSummary.trim(),
      phone: resumePhone.trim(),
      email: resumeEmail.trim(),
      socials: {
        linkedin: resumeLinkedin.trim(),
        github: resumeGithub.trim(),
        leetcode: resumeLeetcode.trim(),
      },
      education: {
        institution: eduInstitution.trim(),
        degree: eduDegree.trim(),
        specialization: eduSpecialization.trim(),
        grade: eduGrade.trim(),
        duration: eduDuration.trim(),
        location: eduLocation.trim(),
      },
    };

    try {
      await onUpdateResume(updatedResume);
      playSuccessChime();
      showToast('Full resume updated and saved in place!');
    } catch (err) {
      showToast('Failed to save resume updates.');
    } finally {
      setSaving(false);
    }
  };

  // Download Exact Format PDF from modal
  const handleDownloadExactPdf = () => {
    if (resume) {
      generateResumePdf(resume);
      showToast('Downloading exact LaTeX format resume PDF...');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-sans animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Window Header */}
        <div className="h-12 px-4 bg-slate-800/90 border-b border-white/10 flex items-center justify-between select-none flex-shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 cursor-pointer"
              onClick={onClose}
              title="Close"
            ></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-white ml-2 flex items-center gap-1.5">
              <FolderPlus className="w-3.5 h-3.5 text-sky-400" />
              <span>Developer Studio — Portfolio &amp; Resume Manager</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadExactPdf}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download exact format PDF"
            >
              <Download className="w-3 h-3 text-sky-400" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Main Action Tabs */}
        <div className="h-11 px-4 bg-slate-950 border-b border-white/10 flex items-center gap-2 text-xs flex-shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('add-project')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'add-project'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project / Item</span>
          </button>

          <button
            onClick={() => setActiveTab('manage-items')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'manage-items'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-300" />
            <span>Manage &amp; Delete Items ({resume?.projects?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('edit-resume')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'edit-resume'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>Edit Full Resume</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: ADD NEW PROJECT
           ========================================================= */}
        {activeTab === 'add-project' && (
          <form onSubmit={handleAddProject} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-[11px] leading-relaxed">
              💡 Adding a project or file here immediately saves it to the backend and makes it available in Finder, Safari, and Terminal across all visitor sessions.
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-1">Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Task Queue Engine"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-1">Summary / Architecture Overview</label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Engineered an event-driven worker pipeline..."
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 font-medium mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={techString}
                  onChange={(e) => setTechString(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-1">Bullet Points / Metrics (one per line)</label>
              <textarea
                rows={3}
                value={highlightsString}
                onChange={(e) => setHighlightsString(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 leading-relaxed font-mono text-[11px]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{saving ? 'Publishing...' : 'Publish to Portfolio & Set in Place'}</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            TAB 2: MANAGE & DELETE ITEMS (Direct Admin Control)
           ========================================================= */}
        {activeTab === 'manage-items' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-white/10 text-white/70 text-[11px] leading-relaxed flex items-center justify-between">
              <span>
                🗑️ <strong>Admin Controls:</strong> You can delete any project, edit it in place, or remove test items. Changes take effect across all windows immediately.
              </span>
            </div>

            {(!resume?.projects || resume.projects.length === 0) && (
              <div className="p-8 text-center text-white/40">
                No projects found. Use &quot;Add Project / Item&quot; above to create one.
              </div>
            )}

            <div className="space-y-3">
              {resume?.projects?.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-all space-y-2.5"
                >
                  {editingIndex === idx ? (
                    /* Inline Editing Mode */
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-white/60 uppercase font-mono">Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-blue-500/60 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/60 uppercase font-mono">Summary</label>
                        <textarea
                          rows={2}
                          value={editSummary}
                          onChange={(e) => setEditSummary(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-blue-500/60 text-white text-xs leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/60 uppercase font-mono">Tech Stack</label>
                        <input
                          type="text"
                          value={editTech}
                          onChange={(e) => setEditTech(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-blue-500/60 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/60 uppercase font-mono">Highlights (one per line)</label>
                        <textarea
                          rows={2}
                          value={editHighlights}
                          onChange={(e) => setEditHighlights(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-blue-500/60 text-white text-xs font-mono"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEditItem(idx)}
                          disabled={saving}
                          className="px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode with Delete & Edit Actions */
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-semibold text-sm">{proj.title}</h4>
                          {proj.featured && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 text-xs line-clamp-2">{proj.summary}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(proj.technologies || []).map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-[10px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Delete & Edit Buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleStartEditItem(idx)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                          title="Edit project details in place"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-colors cursor-pointer"
                          title="Delete this item from portfolio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: EDIT FULL RESUME (LaTeX & Academic Format Synchronization)
           ========================================================= */}
        {activeTab === 'edit-resume' && (
          <form onSubmit={handleSaveFullResume} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-[11px] leading-relaxed flex items-center justify-between">
              <span>
                📄 <strong>Full Resume Editor:</strong> Editing these fields updates the live data. When downloaded, the resume renders in the exact 1-page standard LaTeX format provided.
              </span>
              <button
                type="button"
                onClick={handleDownloadExactPdf}
                className="ml-2 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-medium flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-white/80 font-medium mb-1">Professional Summary</label>
              <textarea
                rows={3}
                value={resumeSummary}
                onChange={(e) => setResumeSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resumePhone}
                  onChange={(e) => setResumePhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-white/80 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={resumeEmail}
                  onChange={(e) => setResumeEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-white/80 font-medium mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={resumeLinkedin}
                  onChange={(e) => setResumeLinkedin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-white/80 font-medium mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={resumeGithub}
                  onChange={(e) => setResumeGithub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-white/80 font-medium mb-1">LeetCode URL</label>
                <input
                  type="text"
                  value={resumeLeetcode}
                  onChange={(e) => setResumeLeetcode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Education */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-[11px] uppercase font-mono tracking-wider text-sky-400 font-semibold block">
                Education
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Institution</label>
                  <input
                    type="text"
                    value={eduInstitution}
                    onChange={(e) => setEduInstitution(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Duration &amp; Location</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={eduDuration}
                      onChange={(e) => setEduDuration(e.target.value)}
                      placeholder="2022 – 2026"
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={eduLocation}
                      onChange={(e) => setEduLocation(e.target.value)}
                      placeholder="West Bengal, India"
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Degree &amp; Specialization</label>
                  <input
                    type="text"
                    value={`${eduDegree}, ${eduSpecialization}`}
                    onChange={(e) => setEduDegree(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Grade / CGPA</label>
                  <input
                    type="text"
                    value={eduGrade}
                    onChange={(e) => setEduGrade(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving Full Resume...' : 'Save Full Resume & Set in Place'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
