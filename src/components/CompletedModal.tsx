import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Topic } from '../types';
import { Trophy, Star, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Props {
  isOpen: boolean;
  topic: Topic;
  earnedStars: number;
  totalWords: number;
  onRestartTopic: () => void;
  onNextTopic: () => void;
  onClose: () => void;
}

export const CompletedModal: React.FC<Props> = ({
  isOpen,
  topic,
  earnedStars,
  totalWords,
  onRestartTopic,
  onNextTopic,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEffects.playFanfare();

      // Launch cheerful confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full border-4 border-amber-300 shadow-2xl p-6 text-center relative animate-in fade-in zoom-in duration-300">
        {/* Big celebratory trophy */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-200 border-4 border-amber-200 mb-4 animate-bounce">
          <Trophy className="w-12 h-12 text-amber-950" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 uppercase tracking-wider mb-2">
          Chúc mừng bé yêu! 🎉
        </span>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Hoàn thành chủ đề
        </h3>
        <p className="text-lg font-extrabold text-amber-600 mt-1">
          {topic.emoji} {topic.titleEn} ({topic.titleVi})
        </p>

        {/* Stars summary card */}
        <div className="my-5 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-around">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900 flex items-center justify-center gap-1">
              <Star className="w-6 h-6 fill-amber-400 text-amber-500 inline" />
              <span>{earnedStars}</span>
            </div>
            <span className="text-xs font-bold text-slate-500">Sao đạt được</span>
          </div>
          <div className="w-px h-10 bg-amber-200" />
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {totalWords}/{totalWords}
            </div>
            <span className="text-xs font-bold text-slate-500">Từ vựng đã luyện</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6">
          Bé đã nỗ lực luyện nói rất tuyệt vời! Hãy tiếp tục rèn luyện mỗi ngày để sẵn sàng cho kỳ thi Cambridge Pre A1 Starters nhé! ⭐
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onRestartTopic}
            className="w-full sm:w-1/2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại bài này</span>
          </button>

          <button
            onClick={onNextTopic}
            className="w-full sm:w-1/2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Chủ đề tiếp theo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
