import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface NotificationToastProps {
  message: string | null;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      id="mac-toast"
      className="fixed top-10 right-4 z-50 max-w-sm rounded-2xl mac-glass p-3 shadow-2xl flex items-center gap-3 border border-white/20 text-white animate-in fade-in slide-in-from-top-4 duration-300 select-none"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
        <Sparkles className="w-4 h-4 text-amber-200" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-xs text-white">System Notification</p>
        <p className="text-[11px] text-slate-300 truncate">{message}</p>
      </div>
    </div>
  );
};
