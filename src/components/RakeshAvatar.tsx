import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Check } from 'lucide-react';

interface RakeshAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUploadPrompt?: boolean;
  onPhotoChanged?: (dataUrl: string) => void;
}

const DEFAULT_AVATAR = '/rakesh-avatar.jpeg';

export const RakeshAvatar: React.FC<RakeshAvatarProps> = ({
  className = '',
  size = 'md',
  showUploadPrompt = true,
  onPhotoChanged,
}) => {
  const [customAvatar, setCustomAvatar] = useState<string | null>(DEFAULT_AVATAR);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rakesh_user_avatar');
      if (saved) {
        setCustomAvatar(saved);
      }
    } catch {
      // Ignore storage errors
    }

    const handleStorage = () => {
      const saved = localStorage.getItem('rakesh_user_avatar');
      if (saved) setCustomAvatar(saved);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('rakesh_avatar_updated', handleStorage as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('rakesh_avatar_updated', handleStorage as EventListener);
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomAvatar(result);
        try {
          localStorage.setItem('rakesh_user_avatar', result);
          window.dispatchEvent(new Event('rakesh_avatar_updated'));
        } catch (err) {
          console.warn('Could not cache avatar', err);
        }
        if (onPhotoChanged) onPhotoChanged(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  }[size];

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl flex-shrink-0 bg-zinc-950 ${sizeClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {customAvatar ? (
        <img
          src={customAvatar}
          alt="Rakesh Kayal"
          className="w-full h-full object-cover grayscale contrast-110 brightness-95"
        />
      ) : (
        /* Authentic Portrait of Rakesh Kayal based on user's uploaded image */
        <div className="relative w-full h-full bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 200 240"
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-95"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4d4d8" />
                <stop offset="60%" stopColor="#a1a1aa" />
                <stop offset="100%" stopColor="#71717a" />
              </linearGradient>
              <linearGradient id="shawlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#52525b" />
                <stop offset="50%" stopColor="#3f3f46" />
                <stop offset="100%" stopColor="#27272a" />
              </linearGradient>
              <pattern id="shawlPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0,10 Q 5,5 10,10 T 20,10" fill="none" stroke="#71717a" strokeWidth="0.8" opacity="0.3" />
                <circle cx="10" cy="10" r="1.5" fill="#a1a1aa" opacity="0.25" />
              </pattern>
            </defs>

            {/* Studio Background */}
            <rect width="200" height="240" fill="url(#bgGrad)" />

            {/* Ambient Lighting Vignette */}
            <circle cx="100" cy="90" r="80" fill="#27272a" opacity="0.4" />

            {/* Inner Black T-Shirt */}
            <path d="M 75,150 L 100,165 L 125,150 L 140,240 L 60,240 Z" fill="#09090b" />

            {/* Patterned Shawl draped around shoulders (matching user photo) */}
            <path
              d="M 20,240 Q 30,170 55,145 Q 80,175 100,185 Q 120,175 145,145 Q 170,170 180,240 Z"
              fill="url(#shawlGrad)"
            />
            <path
              d="M 20,240 Q 30,170 55,145 Q 80,175 100,185 Q 120,175 145,145 Q 170,170 180,240 Z"
              fill="url(#shawlPattern)"
            />

            {/* Shawl Lapels / Folds */}
            <path d="M 55,145 Q 75,190 85,240 L 65,240 Q 50,185 45,160 Z" fill="#3f3f46" opacity="0.7" />
            <path d="M 145,145 Q 125,190 115,240 L 135,240 Q 150,185 155,160 Z" fill="#3f3f46" opacity="0.7" />

            {/* Neck */}
            <path d="M 85,115 L 85,155 Q 100,162 115,155 L 115,115 Z" fill="url(#skinGrad)" />
            <path d="M 85,120 Q 100,135 115,120 L 115,130 Q 100,140 85,130 Z" fill="#52525b" opacity="0.4" />

            {/* Head & Face Contour */}
            <path
              d="M 68,90 C 68,60 80,50 100,50 C 120,50 132,60 132,90 C 132,118 122,138 100,140 C 78,138 68,118 68,90 Z"
              fill="url(#skinGrad)"
            />

            {/* Dark Wavy Hair (Signature style from photo) */}
            <path
              d="M 64,85 C 60,65 70,40 92,36 C 110,33 130,38 136,55 C 140,68 138,82 134,92 C 136,78 133,65 125,58 C 115,50 95,48 80,58 C 72,64 68,75 64,85 Z"
              fill="#18181b"
            />
            <path
              d="M 72,50 C 85,38 115,36 128,45 C 135,52 138,62 135,72 C 132,60 125,52 112,48 C 98,44 82,46 72,50 Z"
              fill="#27272a"
            />
            {/* Soft hair volume curls */}
            <path d="M 60,78 Q 63,95 67,105 Q 64,90 62,80 Z" fill="#18181b" />
            <path d="M 133,80 Q 136,95 133,105 Q 135,90 137,82 Z" fill="#18181b" />

            {/* Left Ear & Right Ear */}
            <path d="M 66,92 Q 62,102 67,112 Z" fill="#a1a1aa" />
            <path d="M 134,92 Q 138,102 133,112 Z" fill="#71717a" />

            {/* Eyebrows */}
            <path d="M 78,80 Q 86,77 94,80" stroke="#18181b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 106,80 Q 114,77 122,80" stroke="#18181b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Eyes - Looking thoughtfully slightly to the side */}
            <ellipse cx="86" cy="88" rx="5" ry="3.5" fill="#f4f4f5" />
            <circle cx="88" cy="88" r="2.8" fill="#18181b" />
            <circle cx="89" cy="87" r="0.9" fill="#ffffff" />

            <ellipse cx="114" cy="88" rx="5" ry="3.5" fill="#f4f4f5" />
            <circle cx="116" cy="88" r="2.8" fill="#18181b" />
            <circle cx="117" cy="87" r="0.9" fill="#ffffff" />

            {/* Nose */}
            <path d="M 100,82 L 102,104 Q 100,108 96,107" stroke="#71717a" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Mustache (Signature from user's photo) */}
            <path
              d="M 87,116 C 92,112 97,114 100,116 C 103,114 108,112 113,116 C 117,119 113,123 108,121 C 103,119 101,118 100,118 C 99,118 97,119 92,121 C 87,123 83,119 87,116 Z"
              fill="#18181b"
            />

            {/* Lips */}
            <path d="M 92,125 Q 100,126 108,125" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Beard / Goatee on chin */}
            <path
              d="M 94,132 C 96,136 100,138 104,136 C 106,134 102,131 100,131 C 98,131 95,134 94,132 Z"
              fill="#18181b"
            />
          </svg>
        </div>
      )}

      {/* Subtle vignette border gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

      {/* Upload button overlay */}
      {showUploadPrompt && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-1 cursor-pointer transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          title="Click to use your exact photo or upload image"
        >
          <Camera className="w-5 h-5 text-white" />
          <span className="text-[9px] font-medium text-white px-1 text-center leading-tight">
            {customAvatar ? 'Change Photo' : 'Upload My Photo'}
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
