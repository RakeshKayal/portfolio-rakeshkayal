import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, Code, FileText, Sparkles, Mail } from 'lucide-react';
import { ResumeData, TerminalOutputItem } from '../types';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface TerminalWindowProps {
  resume: ResumeData;
  showToast: (msg: string) => void;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ resume, showToast }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalOutputItem[]>([
    {
      id: 'init-1',
      type: 'system',
      content: (
        <div className="space-y-1 text-slate-400">
          <p className="text-zinc-500">Last login: Sun Sep 13 09:41:00 on ttys001</p>
          <p className="text-emerald-400 font-semibold">
            ➜ Darwin 24.3.0 arm64 • macOS Sequoia 15.3 [Rakesh Kayal Developer Shell]
          </p>
          <p className="text-zinc-400">
            Type <span className="text-amber-300 font-bold">help</span> to view available commands, or tap quick pills below.
          </p>
        </div>
      ),
    },
  ]);

  const outputEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = async (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    playClickSound();

    // Echo command
    const cmdEntry: TerminalOutputItem = {
      id: `cmd-${Date.now()}`,
      type: 'command',
      content: (
        <div className="flex items-center gap-2 text-white">
          <span className="text-emerald-400 font-bold">rakesh@sequoia ~ %</span>
          <span>{cmd}</span>
        </div>
      ),
    };

    const lower = cmd.toLowerCase();
    let resultEntry: TerminalOutputItem | null = null;

    if (lower === 'clear') {
      setHistory([]);
      return;
    } else if (lower === 'help') {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="p-3 bg-white/5 rounded-xl space-y-2 text-xs border border-white/10 font-mono">
            <p className="text-amber-300 font-bold">Available Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
              <p><span className="text-cyan-400 font-bold">bio</span> / <span className="text-cyan-400">cat bio.txt</span>: Read executive background</p>
              <p><span className="text-cyan-400 font-bold">skills</span> / <span className="text-cyan-400">npm run skills</span>: Core tech stack &amp; tools</p>
              <p><span className="text-cyan-400 font-bold">projects</span> / <span className="text-cyan-400">ls projects</span>: Real-time messaging &amp; mesh simulator</p>
              <p><span className="text-cyan-400 font-bold">exp</span> / <span className="text-cyan-400">cat experience.log</span>: Engineering work history</p>
              <p><span className="text-cyan-400 font-bold">cat resume.json</span>: View dynamically imported JSON data</p>
              <p><span className="text-cyan-400 font-bold">leetcode</span>: Problem solving statistics</p>
              <p><span className="text-cyan-400 font-bold">contact</span>: Show phone, email &amp; socials</p>
              <p><span className="text-cyan-400 font-bold">sendmail &lt;name&gt; &lt;msg&gt;</span>: Send email to rakeshkayal276@gmail.com</p>
              <p><span className="text-cyan-400 font-bold">clear</span>: Clear terminal console</p>
            </div>
          </div>
        ),
      };
    } else if (lower === 'bio' || lower === 'cat bio.txt') {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="p-3 bg-blue-500/10 border-l-4 border-blue-400 text-xs space-y-1 text-slate-200">
            <p className="font-bold text-white text-sm">{resume.name} — {resume.title}</p>
            <p className="text-slate-300">{resume.summary}</p>
            <p className="text-sky-300 text-[11px] pt-1">📍 Location: {resume.location} • Status: {resume.status}</p>
          </div>
        ),
      };
    } else if (lower === 'skills' || lower === 'npm run skills') {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="p-3 bg-white/5 rounded-xl space-y-2 text-xs border border-white/10 font-mono">
            <p className="text-emerald-400 font-bold">➜ Technical Repertoire:</p>
            {resume.skills.map((grp, i) => (
              <div key={i}>
                <span className="text-sky-400 font-semibold">{grp.category}: </span>
                <span className="text-slate-300">{grp.skills.join(', ')}</span>
              </div>
            ))}
            <div className="pt-1">
              <span className="text-purple-400 font-semibold">Core CS: </span>
              <span className="text-slate-300">{resume.coreCS.join(', ')}</span>
            </div>
            <div>
              <span className="text-amber-400 font-semibold">Dev Tools: </span>
              <span className="text-slate-300">{resume.tools.join(', ')}</span>
            </div>
          </div>
        ),
      };
    } else if (lower === 'projects' || lower === 'ls projects') {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="p-3 bg-white/5 rounded-xl space-y-3 text-xs border border-white/10 font-mono">
            <p className="text-sky-400 font-bold">➜ Production Projects in /home/rakesh/projects:</p>
            {resume.projects.map((p) => (
              <div key={p.id} className="border-l-2 border-sky-400/60 pl-3 space-y-1">
                <p className="text-white font-bold">{p.title} <span className="text-white/40 font-normal">[{p.category}]</span></p>
                <p className="text-slate-300">{p.summary}</p>
                <p className="text-emerald-400 text-[11px]">Stack: {p.technologies.join(', ')}</p>
                {p.githubUrl && (
                  <p className="text-blue-400 underline text-[11px]">Repo: {p.githubUrl}</p>
                )}
              </div>
            ))}
          </div>
        ),
      };
    } else if (lower === 'exp' || lower === 'cat experience.log') {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="p-3 bg-white/5 rounded-xl space-y-3 text-xs border border-white/10 font-mono">
            <p className="text-purple-400 font-bold">➜ Career Log:</p>
            {resume.experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <p className="text-white font-bold">
                  {exp.role} @ {exp.company} <span className="text-emerald-400 text-[11px]">({exp.duration})</span>
                </p>
                {exp.bullets.map((b, bIdx) => (
                  <p key={bIdx} className="text-slate-300 pl-3">• {b}</p>
                ))}
              </div>
            ))}
          </div>
        ),
      };
    } else if (lower === 'cat resume.json') {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="p-3 bg-black/70 rounded-xl max-h-72 overflow-y-auto border border-emerald-500/30 text-emerald-300 text-[11px] font-mono whitespace-pre-wrap">
            {JSON.stringify(resume, null, 2)}
          </div>
        ),
      };
    } else if (lower === 'leetcode') {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="p-3 bg-amber-500/10 border-l-4 border-amber-400 text-xs space-y-1 text-slate-200 font-mono">
            <p className="font-bold text-amber-300 text-sm">LeetCode Stats &amp; Profile</p>
            <p>Problems Solved: <span className="text-white font-bold">{resume.stats.leetcodeSolved}</span></p>
            <p>Focus Areas: Data Structures, Dynamic Programming, Graphs, Concurrency, Tree Algorithms</p>
            <p className="text-sky-300">Profile URL: {resume.socials.leetcode}</p>
          </div>
        ),
      };
    } else if (lower === 'contact' || lower === 'curl portfolio/contact') {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="p-3 bg-white/5 rounded-xl space-y-1.5 text-xs border border-white/10 font-mono">
            <p className="text-sky-400 font-bold">➜ Contact Rakesh Kayal:</p>
            <p className="text-slate-200">Email: <span className="text-sky-300 font-bold">{resume.email}</span></p>
            <p className="text-slate-200">Phone: <span className="text-emerald-300 font-bold">{resume.phone}</span></p>
            <p className="text-slate-200">LinkedIn: <span className="text-blue-300">{resume.socials.linkedin}</span></p>
            <p className="text-slate-200">GitHub: <span className="text-purple-300">{resume.socials.github}</span></p>
            <p className="text-amber-300 pt-1 text-[11px]">
              Tip: You can send a direct message via CMD with: <code className="text-white bg-white/10 px-1 py-0.5 rounded">sendmail YourName YourMessage</code>
            </p>
          </div>
        ),
      };
    } else if (lower.startsWith('sendmail')) {
      const parts = cmd.split(' ');
      if (parts.length < 3) {
        resultEntry = {
          id: `out-${Date.now()}`,
          type: 'error',
          content: (
            <p className="text-rose-400 text-xs font-mono">
              Syntax: sendmail &lt;YourName&gt; &lt;YourMessage...&gt;
              <br />
              Example: <code className="text-white">sendmail Recruiter_Sarah Great resume! Let's schedule an interview.</code>
            </p>
          ),
        };
      } else {
        const senderName = parts[1];
        const msgText = parts.slice(2).join(' ');

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: senderName,
              email: `${senderName.toLowerCase()}@terminal-user.com`,
              subject: 'Direct Terminal Message for Rakesh Kayal',
              message: msgText,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            playSuccessChime();
            showToast('Terminal message sent to rakeshkayal276@gmail.com');
            resultEntry = {
              id: `out-${Date.now()}`,
              type: 'success',
              content: (
                <div className="p-3 bg-emerald-500/10 border-l-4 border-emerald-400 text-xs space-y-1 font-mono text-emerald-200">
                  <p className="font-bold text-emerald-300">✓ Message successfully delivered!</p>
                  <p>Dispatched to: <span className="text-white font-bold">{data.dispatchedTo}</span></p>
                  <p>Message ID: {data.messageId}</p>
                </div>
              ),
            };
          } else {
            resultEntry = {
              id: `out-${Date.now()}`,
              type: 'error',
              content: <p className="text-rose-400 text-xs font-mono">Error: {data.error || 'Failed to dispatch'}</p>,
            };
          }
        } catch {
          resultEntry = {
            id: `out-${Date.now()}`,
            type: 'error',
            content: <p className="text-rose-400 text-xs font-mono">Failed to communicate with contact server.</p>,
          };
        }
      }
    } else if (lower.startsWith('sudo')) {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'error',
        content: (
          <p className="text-rose-400 text-xs font-mono">
            guest is not in the sudoers file. This incident will be reported to Rakesh Kayal :)
          </p>
        ),
      };
    } else {
      resultEntry = {
        id: `out-${Date.now()}`,
        type: 'error',
        content: (
          <p className="text-rose-400 text-xs font-mono">
            zsh: command not found: {cmd}. Type <span className="text-amber-300 font-bold">help</span> for valid commands.
          </p>
        ),
      };
    }

    setHistory((prev) => [...prev, cmdEntry, ...(resultEntry ? [resultEntry] : [])]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal;
    setInputVal('');
    executeCommand(cmd);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/95 text-slate-100 font-mono text-xs">
      {/* Terminal Quick Shortcuts Bar */}
      <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center gap-1.5 overflow-x-auto text-[11px] select-none">
        <span className="text-zinc-500 font-sans text-[10px] uppercase font-bold flex items-center gap-1 pl-1">
          <Terminal className="w-3 h-3 text-emerald-400" />
          Quick Run:
        </span>
        <button
          onClick={() => executeCommand('cat bio.txt')}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-sky-300 border border-zinc-700 transition-colors flex-shrink-0 cursor-pointer"
        >
          cat bio.txt
        </button>
        <button
          onClick={() => executeCommand('npm run skills')}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 transition-colors flex-shrink-0 cursor-pointer"
        >
          npm run skills
        </button>
        <button
          onClick={() => executeCommand('projects')}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 transition-colors flex-shrink-0 cursor-pointer"
        >
          ls projects
        </button>
        <button
          onClick={() => executeCommand('cat resume.json')}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-purple-300 border border-zinc-700 transition-colors flex-shrink-0 cursor-pointer"
        >
          cat resume.json
        </button>
        <button
          onClick={() => executeCommand('contact')}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-blue-300 border border-zinc-700 transition-colors flex-shrink-0 cursor-pointer"
        >
          contact
        </button>
        <button
          onClick={() => executeCommand('clear')}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-rose-400 border border-zinc-700 transition-colors flex-shrink-0 cursor-pointer"
        >
          clear
        </button>
      </div>

      {/* Terminal Output Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {history.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
        <div ref={outputEndRef} />
      </div>

      {/* Command Input Prompt Form */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
        <span className="text-emerald-400 font-bold whitespace-nowrap">rakesh@sequoia ~ %</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="type 'help', 'skills', 'projects', 'cat resume.json'..."
          className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-zinc-600"
          autoFocus
        />
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs flex items-center gap-1 font-mono transition-colors"
        >
          <span>Run</span>
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
