import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, RefreshCw, Sparkles, User, AtSign, MessageSquare } from 'lucide-react';
import { ResumeData } from '../types';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface MailWindowProps {
  resume: ResumeData;
  showToast: (msg: string) => void;
}

export const MailWindow: React.FC<MailWindowProps> = ({ resume, showToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Backend SDE Opportunity / Interview for Rakesh Kayal',
    category: 'Job Opportunity',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentDetails, setSentDetails] = useState<{ id?: string; time?: string }>({});
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    playClickSound();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, Message).');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `[${formData.category}] ${formData.subject}`,
          message: formData.message,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsSuccess(true);
        setSentDetails({ id: data.messageId, time: new Date().toLocaleTimeString() });
        playSuccessChime();
        showToast(`Message dispatched to ${resume.email}!`);
      } else {
        setErrorMsg(data.error || 'Unable to deliver message right now. You can use direct mailto link.');
      }
    } catch {
      setErrorMsg('Network error while transmitting message. Fallback to direct mail link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      subject: 'Backend SDE Opportunity / Interview for Rakesh Kayal',
      category: 'Job Opportunity',
      message: '',
    });
  };

  const mailtoLink = `mailto:${resume.email}?subject=${encodeURIComponent(
    `[${formData.category}] ${formData.subject}`
  )}&body=${encodeURIComponent(
    `Hi Rakesh,\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`
  )}`;

  return (
    <div className="flex flex-col h-full w-full bg-slate-950/80 text-slate-100">
      {/* Mail Toolbar */}
      <div className="h-10 px-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-white">New Message</span>
          <span className="text-[10px] text-white/50 hidden sm:inline">to {resume.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={mailtoLink}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-[11px] text-sky-300 border border-white/10 flex items-center gap-1"
          >
            <span>Open in Mail Client</span>
          </a>
        </div>
      </div>

      {/* Main Mail Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-4">
        {isSuccess ? (
          <div className="mac-glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/30 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Your message has been directly delivered to Rakesh Kayal's inbox:
              </p>
              <p className="text-sm font-mono text-emerald-400 font-semibold">{resume.email}</p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white/70 max-w-sm mx-auto text-left space-y-1">
              <p>Recipient: {resume.email}</p>
              <p>Reference ID: {sentDetails.id || 'N/A'}</p>
              <p>Delivered At: {sentDetails.time}</p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Send Another Message</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Recipient info strip */}
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono text-sky-400 font-bold">To:</span>
                <span className="font-semibold text-white">{resume.name}</span>
                <span className="font-mono text-sky-300 text-[11px]">&lt;{resume.email}&gt;</span>
              </div>
              <span className="text-[10px] text-emerald-400 hidden sm:inline">Active &amp; Monitored</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Sender Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-mono text-white/60 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-sky-400" />
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono text-white/60 mb-1 flex items-center gap-1">
                  <AtSign className="w-3 h-3 text-sky-400" />
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. david@techrecruiting.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Category & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-mono text-white/60 mb-1">Inquiry Type</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Job Opportunity">Job Opportunity (Full-time)</option>
                  <option value="Contract Role">Contract / Freelance</option>
                  <option value="Technical Interview">Interview Invitation</option>
                  <option value="General Connect">General Discussion</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase font-mono text-white/60 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] uppercase font-mono text-white/60 mb-1 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-sky-400" />
                Message Content *
              </label>
              <textarea
                required
                rows={6}
                placeholder="Hi Rakesh, I noticed your background in Java, Spring Boot, and FastAPI..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sky-400 resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[10px] text-white/40 font-mono">
                Direct dispatch to <span className="text-white/70">rakeshkayal276@gmail.com</span>
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Rakesh's Inbox</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
