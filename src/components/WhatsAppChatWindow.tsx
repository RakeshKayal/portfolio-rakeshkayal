import React, { useState } from 'react';
import { Send, Phone, MessageSquare, ExternalLink, CheckCheck, Sparkles, Copy, Check } from 'lucide-react';
import { ResumeData } from '../types';
import { RakeshAvatar } from './RakeshAvatar';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface WhatsAppChatWindowProps {
  resume: ResumeData;
  showToast: (msg: string) => void;
}

export const WhatsAppChatWindow: React.FC<WhatsAppChatWindowProps> = ({ resume, showToast }) => {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'rakesh' | 'user'; text: string; time: string }>>([
    {
      sender: 'rakesh',
      text: "Hi there! 👋 I'm Rakesh Kayal. Thanks for visiting my macOS portfolio! Feel free to send me a message here. Clicking 'Send to WhatsApp' will directly dispatch it to my phone (+91 8768799345) so we can chat immediately.",
      time: 'Just now',
    },
  ]);

  // Clean WhatsApp number
  const rawPhone = resume.phone || '+91-8768799345';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');

  const quickPrompts = [
    'Hi Rakesh! I reviewed your backend projects and would like to discuss an opportunity.',
    'Hey Rakesh, are you available for a quick discussion regarding a Java / Spring Boot role?',
    'Hi! I loved your macOS portfolio design and high-throughput WebSocket chat project.',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || message;
    if (!text.trim()) {
      showToast('Please enter a message to send to WhatsApp');
      return;
    }

    playSuccessChime();

    // Append to visual chat
    const now = new Date();
    const time = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${
      now.getHours() >= 12 ? 'PM' : 'AM'
    }`;
    setChatHistory((prev) => [...prev, { sender: 'user', text, time }]);
    setMessage('');

    // Generate WhatsApp direct deep link
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    showToast(`Redirecting to WhatsApp (${rawPhone})...`);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawPhone);
      setCopied(true);
      showToast(`Phone number ${rawPhone} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0c1317] text-slate-100 select-none overflow-hidden font-sans">
      {/* WhatsApp Header */}
      <div className="h-14 px-4 bg-[#202c33] border-b border-white/10 flex items-center justify-between gap-3 select-none flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <RakeshAvatar size="sm" showUploadPrompt={false} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#202c33]"></span>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <span>Rakesh Kayal</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </h3>
            <p className="text-[11px] text-white/50">{rawPhone} • Typically replies instantly</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyNumber}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 text-xs transition-colors cursor-pointer"
            title="Copy WhatsApp Number"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Number'}</span>
          </button>

          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-medium text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-semibold">Open WhatsApp Web</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Chat Messages Body with WhatsApp Subtle Pattern */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        style={{
          backgroundColor: '#0b141a',
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(37, 211, 102, 0.03) 0%, transparent 80%)`,
        }}
      >
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full bg-[#182229] border border-white/5 text-[10px] text-white/50 uppercase tracking-wider font-mono">
            Direct End-to-End Chat via WhatsApp ({rawPhone})
          </span>
        </div>

        {chatHistory.map((item, idx) => (
          <div
            key={idx}
            className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in`}
          >
            <div
              className={`max-w-md sm:max-w-lg rounded-2xl p-3.5 shadow-md text-xs leading-relaxed relative ${
                item.sender === 'user'
                  ? 'bg-[#005c4b] text-white rounded-tr-none'
                  : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-white/5'
              }`}
            >
              <p className="whitespace-pre-line">{item.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-white/50 font-mono">
                <span>{item.time}</span>
                {item.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
              </div>
            </div>
          </div>
        ))}

        {/* Quick Suggestion Chips */}
        <div className="pt-2">
          <span className="text-[11px] text-white/40 block mb-2 font-mono uppercase tracking-wider">
            Quick Prompts (Click to Fill &amp; Send):
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  playClickSound();
                  setMessage(prompt);
                }}
                className="text-left px-3 py-1.5 rounded-xl bg-[#202c33] hover:bg-[#2a3942] border border-white/10 text-white/80 hover:text-white text-[11px] transition-colors cursor-pointer"
              >
                💬 {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-[#202c33] border-t border-white/10 flex items-end gap-2 sm:gap-3 flex-shrink-0">
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type your message to send directly to Rakesh Kayal's WhatsApp..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-[#2a3942] border border-white/10 text-white text-xs placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
        />

        <button
          onClick={() => handleSendMessage()}
          className="h-10 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer flex-shrink-0"
          title="Send to WhatsApp"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
