import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';
import { ResumeData, WindowId } from '../types';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface SiriWindowProps {
  resume: ResumeData;
  onOpenWindow: (id: WindowId) => void;
  showToast: (msg: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const SiriWindow: React.FC<SiriWindowProps> = ({ resume, onOpenWindow, showToast }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am Rakesh's portfolio intelligence assistant. Ask me about his Java & Spring Boot experience, FastAPI services, high-concurrency WebSocket projects (500+ users), or 400+ LeetCode problems!`,
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const getKnowledgeResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language')) {
      return `Rakesh is a Backend Software Engineer specialized in Java (Spring Boot, Spring Data JPA, Hibernate, Spring Security) and Python (FastAPI, SQLAlchemy, Pydantic). For databases & infrastructure, he works with MySQL, AWS (EC2, IAM), Docker, and Apache JMeter.`;
    }

    if (q.includes('project') || q.includes('chat') || q.includes('websocket') || q.includes('work')) {
      return `Rakesh built two flagship systems:
1) Real-Time Communication System: WebSocket + STOMP messaging platform load-tested with Apache JMeter supporting 500+ concurrent users with 45 requests/second throughput and 0% error rate.
2) UPI Offline Mesh Simulator: A distributed payment system modeling offline transaction routing with cryptographic replay protection and idempotent locking.`;
    }

    if (q.includes('leetcode') || q.includes('dsa') || q.includes('algorithm') || q.includes('coding')) {
      return `Rakesh has solved 400+ algorithmic problems on LeetCode focusing on Data Structures, Graphs, Dynamic Programming, and Concurrency. Profile: ${resume.socials.leetcode}`;
    }

    if (q.includes('hire') || q.includes('available') || q.includes('role') || q.includes('job') || q.includes('experience')) {
      return `Yes! Rakesh is actively open to work for Backend Software Engineer, Cloud Computing, and Distributed Systems roles. He has industry experience at T-Web Exponent Services (FastAPI backend), TechnoExponent (AWS Cloud), and AI-LAB (Spring Boot REST & OAuth2).`;
    }

    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('interview')) {
      return `You can reach Rakesh directly at rakeshkayal276@gmail.com or by phone at ${resume.phone}. You can also open the Mail app in this macOS desktop to send a direct message!`;
    }

    if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('cgpa')) {
      return `Rakesh is pursuing his B.Tech in Computer Science and Engineering with a Specialization in Cyber Security at The Neotia University (2022–2026) with an outstanding CGPA of 8.7 / 10.`;
    }

    return `Rakesh Kayal is a Backend Software Engineer with hands-on experience in Java, Spring Boot, and FastAPI. He has solved 400+ LeetCode problems and designed high-throughput messaging architectures. Feel free to contact him at rakeshkayal276@gmail.com!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    playClickSound();
    setInputVal('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      const replyText = getKnowledgeResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
      playSuccessChime();
    }, 450);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950/85 text-slate-100 select-none">
      {/* Siri Header */}
      <div className="h-10 px-4 bg-slate-900/90 border-b border-purple-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-sky-400 via-purple-500 to-pink-500 animate-spin"></div>
          <span className="font-semibold text-white">Apple Intelligence • Rakesh AI</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
          Neural Model Active
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] sm:max-w-[75%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                  : 'mac-glass-card border border-white/10 text-slate-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-white text-xs flex-shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-white/50 text-xs pl-9">
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-sky-400 to-purple-500 animate-spin"></div>
            <span>Evaluating candidate repository &amp; resume...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 bg-slate-900/40 border-t border-white/5 space-y-1.5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 font-semibold">
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleSendMessage("What are Rakesh's top backend skills?")}
            className="px-2.5 py-1 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-[11px] text-purple-200 transition-colors text-left"
          >
            ⚡ Backend Tech Stack?
          </button>
          <button
            onClick={() => handleSendMessage('Tell me about the 500+ concurrent user project.')}
            className="px-2.5 py-1 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-[11px] text-sky-200 transition-colors text-left"
          >
            🚀 WebSocket Messaging System?
          </button>
          <button
            onClick={() => handleSendMessage('Is Rakesh available for full-time backend roles?')}
            className="px-2.5 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-[11px] text-emerald-200 transition-colors text-left"
          >
            💼 Hiring Availability?
          </button>
          <button
            onClick={() => handleSendMessage('How can I contact Rakesh or send an email?')}
            className="px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-[11px] text-amber-200 transition-colors text-left"
          >
            ✉️ Contact Details?
          </button>
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask anything about Rakesh's experience or projects..."
          className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-400/70"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg active:scale-95 transition-transform cursor-pointer"
          title="Send query"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
