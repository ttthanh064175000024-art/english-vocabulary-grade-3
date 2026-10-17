import React, { useState } from 'react';
import { Star, Mic, Sparkles, Share2, Check, ShieldCheck } from 'lucide-react';

interface Props {
  totalStars: number;
  onOpenMicTest: () => void;
  speechRate: number;
  onToggleSpeechRate: () => void;
}

export const Header: React.FC<Props> = ({
  totalStars,
  onOpenMicTest,
  speechRate,
  onToggleSpeechRate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <header className="bg-white border-b-4 border-amber-300 shadow-sm sticky top-0 z-30 px-3 py-2.5 sm:px-6 sm:py-3.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-200 text-xl sm:text-2xl transform hover:rotate-6 transition-transform">
            🌟
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-extrabold text-base sm:text-xl text-slate-800 tracking-tight leading-tight">
                Starters Pronunciation Coach
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Pre A1 Lớp 3
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Không cần đăng nhập
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-amber-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
              Luyện phát âm cùng AI – Tự tin đạt Khiên Starters
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Copy link button for teachers / parents */}
          <button
            onClick={handleCopyLink}
            title="Sao chép đường link công khai để gửi cho học sinh"
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-800 hover:bg-amber-100 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline text-emerald-700">Đã chép link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-700" />
                <span className="hidden md:inline">Chia sẻ link</span>
              </>
            )}
          </button>

          {/* Speech Rate Button */}
          <button
            onClick={onToggleSpeechRate}
            title="Đổi tốc độ đọc mẫu"
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-indigo-50 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
          >
            <span className="text-sm sm:text-base">{speechRate <= 0.85 ? '🐢' : '🐇'}</span>
            <span className="hidden md:inline">{speechRate <= 0.85 ? 'Đọc chậm' : 'Đọc vừa'}</span>
          </button>

          {/* Mic Test Button */}
          <button
            onClick={onOpenMicTest}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-sky-50 border-2 border-sky-200 text-sky-700 hover:bg-sky-100 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
          >
            <Mic className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Kiểm tra Micro</span>
          </button>

          {/* Stars Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-sm sm:text-base shadow-md shadow-amber-200/60 border border-amber-300">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-100 text-amber-900 animate-pulse" />
            <span>{totalStars}</span>
            <span className="hidden sm:inline text-xs font-bold text-amber-900/80">sao</span>
          </div>
        </div>
      </div>
    </header>
  );
};
