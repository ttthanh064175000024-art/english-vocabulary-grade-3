import React, { useState } from 'react';
import { WordItem, PracticeMode, ComparisonResult } from '../types';
import { WordIllustration } from './WordIllustration';
import {
  Volume2,
  Mic,
  MicOff,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Star,
  CheckCircle,
  HelpCircle,
  Volume1,
  Award
} from 'lucide-react';
import { soundEffects, speakWordOrSentence } from '../utils/audio';

interface Props {
  word: WordItem;
  currentIndex: number;
  totalWords: number;
  practiceMode: PracticeMode;
  onToggleMode: (mode: PracticeMode) => void;
  isListening: boolean;
  audioLevel: number;
  speechError: string | null;
  comparisonResult: ComparisonResult | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onNextWord: () => void;
  onPrevWord: () => void;
  onResetTopic: () => void;
  onSimulateWord: (text: string) => void;
  speechRate: number;
  isPassed: boolean;
  earnedStars: number;
}

export const PronunciationCard: React.FC<Props> = ({
  word,
  currentIndex,
  totalWords,
  practiceMode,
  onToggleMode,
  isListening,
  audioLevel,
  speechError,
  comparisonResult,
  onStartListening,
  onStopListening,
  onNextWord,
  onPrevWord,
  onResetTopic,
  onSimulateWord,
  speechRate,
  isPassed,
  earnedStars,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingSlowAudio, setIsPlayingSlowAudio] = useState(false);

  const targetText = practiceMode === 'word' ? word.word : word.exampleSentence;
  const targetIpa = practiceMode === 'word' ? word.ipa : word.sentenceIpa;
  const targetMeaning = practiceMode === 'word' ? word.vietnamese : word.sentenceMeaning;

  const handlePlayNormalAudio = () => {
    soundEffects.playClick();
    setIsPlayingAudio(true);
    speakWordOrSentence(targetText, speechRate, () => {
      setIsPlayingAudio(false);
    });
  };

  const handlePlaySlowAudio = () => {
    soundEffects.playClick();
    setIsPlayingSlowAudio(true);
    speakWordOrSentence(targetText, 0.7, () => {
      setIsPlayingSlowAudio(false);
    });
  };

  const handleMicToggle = () => {
    if (isListening) {
      onStopListening();
    } else {
      soundEffects.playClick();
      onStartListening();
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-200/90 shadow-xl overflow-hidden transition-all duration-300">
      {/* Top bar with mode switcher and step counter */}
      <div className="bg-amber-100/60 px-4 py-3 sm:px-6 flex items-center justify-between border-b-2 border-amber-200 flex-wrap gap-2">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-wide bg-amber-200/70 px-3 py-1 rounded-full">
            Từ {currentIndex + 1} / {totalWords}
          </span>
          {isPassed && (
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
              <CheckCircle className="w-3.5 h-3.5" />
              Đã vượt qua ({earnedStars} ⭐)
            </span>
          )}
        </div>

        {/* Practice Mode Switcher (Từ vựng vs Mẫu câu) */}
        <div className="flex items-center bg-amber-200/60 p-1 rounded-2xl gap-1">
          <button
            onClick={() => onToggleMode('word')}
            className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              practiceMode === 'word'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            Luyện từ vựng
          </button>
          <button
            onClick={() => onToggleMode('sentence')}
            className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              practiceMode === 'sentence'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            Luyện mẫu câu
          </button>
        </div>
      </div>

      {/* Main content body */}
      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Illustration */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="w-44 h-44 sm:w-56 sm:h-56 p-4 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 border-4 border-dashed border-amber-200/80 flex items-center justify-center relative group">
              <WordIllustration iconName={word.iconName} badgeEmoji={word.badgeEmoji} />
              <div className="absolute top-2 right-2 text-2xl">{word.badgeEmoji}</div>
            </div>
            {/* Vietnamese meaning pill */}
            <div className="mt-3 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-bold text-sm sm:text-base border border-slate-200 text-center shadow-xs">
              {targetMeaning}
            </div>
          </div>

          {/* Right: Word details & Listen options */}
          <div className="md:col-span-7 flex flex-col gap-4 text-center md:text-left">
            {/* English word/sentence */}
            <div>
              <div className="inline-block px-3 py-1 rounded-lg bg-orange-100 text-orange-800 text-xs font-black uppercase mb-1">
                Cambridge Pre A1 Starters
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none capitalize">
                {targetText}
              </h2>
              <div className="mt-1.5 text-base sm:text-xl font-bold text-indigo-600 font-mono tracking-wide">
                {targetIpa}
              </div>
            </div>

            {/* Pronunciation tip */}
            {word.pronunciationTip && (
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 text-sky-900 text-xs sm:text-sm flex items-start gap-2.5 text-left">
                <span className="text-lg">💡</span>
                <div>
                  <span className="font-extrabold text-sky-950">Mẹo phát âm chuẩn: </span>
                  <span className="font-medium">{word.pronunciationTip}</span>
                </div>
              </div>
            )}

            {/* Model Speech Buttons (Nghe phát âm chuẩn & Nghe chậm) */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
              <button
                onClick={handlePlayNormalAudio}
                disabled={isPlayingAudio}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm sm:text-base text-white shadow-md transition-all active:scale-95 ${
                  isPlayingAudio
                    ? 'bg-amber-400 ring-4 ring-amber-200 scale-105'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-orange-200'
                }`}
              >
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>{isPlayingAudio ? 'Đang đọc...' : 'Nghe phát âm mẫu'}</span>
              </button>

              <button
                onClick={handlePlaySlowAudio}
                disabled={isPlayingSlowAudio}
                title="Nghe tốc độ chậm rãi hơn"
                className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl font-extrabold text-sm sm:text-base text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 transition-all active:scale-95 ${
                  isPlayingSlowAudio ? 'ring-4 ring-indigo-200' : ''
                }`}
              >
                <span className="text-lg">🐢</span>
                <span>Nghe chậm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recording section */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-amber-200 flex flex-col items-center">
          <div className="text-center mb-4">
            <span className="text-xs sm:text-sm font-extrabold text-slate-500 uppercase tracking-wider block">
              Đến lượt bé luyện nói
            </span>
            <p className="text-slate-700 font-bold text-sm sm:text-base">
              Bấm nút Micro màu đỏ và đọc to từ <span className="text-amber-600 font-extrabold">"{targetText}"</span> nhé!
            </p>
          </div>

          {/* Big Interactive Microphone Button */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing halo when recording */}
            {isListening && (
              <>
                <div
                  className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-rose-400/30 animate-ping"
                  style={{ transform: `scale(${1 + audioLevel / 100})` }}
                />
                <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-rose-500/20 animate-pulse" />
              </>
            )}

            <button
              onClick={handleMicToggle}
              className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-95 shadow-xl ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white ring-8 ring-rose-200 scale-105'
                  : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-rose-200/80 hover:scale-105'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                  <span className="text-[10px] font-black uppercase mt-0.5 tracking-wider">Đang nghe...</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
                  <span className="text-[10px] font-black uppercase mt-0.5 tracking-wider">Bấm để nói</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time sound wave bars when speaking */}
          {isListening && (
            <div className="mt-4 flex items-center gap-1.5 h-8">
              {[0.4, 0.7, 1.0, 0.6, 0.9, 0.5, 0.8, 1.1, 0.4].map((multiplier, i) => {
                const height = Math.max(6, Math.min(30, (audioLevel * multiplier) / 3));
                return (
                  <span
                    key={i}
                    className="w-1.5 bg-rose-500 rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          )}

          {/* Error notice if micro blocked or error occurred */}
          {speechError && (
            <div className="mt-4 p-3 max-w-md bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-2xl text-xs sm:text-sm font-semibold text-center flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>{speechError}</span>
            </div>
          )}

          {/* Evaluation & Feedback Result Card */}
          {comparisonResult && (
            <div
              className={`mt-6 w-full max-w-xl p-4 sm:p-5 rounded-3xl border-3 shadow-md transition-all ${
                comparisonResult.score === 'excellent'
                  ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                  : comparisonResult.score === 'good'
                  ? 'bg-amber-50/90 border-amber-400 text-amber-950'
                  : 'bg-rose-50/90 border-rose-300 text-rose-950'
              }`}
            >
              {/* Header with stars */}
              <div className="flex items-center justify-between border-b border-black/10 pb-2.5 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl">
                    {comparisonResult.score === 'excellent'
                      ? '🎉'
                      : comparisonResult.score === 'good'
                      ? '👏'
                      : '💪'}
                  </span>
                  <span className="font-black text-base sm:text-lg">
                    {comparisonResult.praiseTitle}
                  </span>
                </div>

                {/* Stars awarded */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((starNum) => (
                    <Star
                      key={starNum}
                      className={`w-5 h-5 ${
                        starNum <= comparisonResult.earnedStars
                          ? 'fill-amber-400 text-amber-500 animate-bounce'
                          : 'fill-slate-200 text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Comparison details: What system heard vs Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm bg-white/70 p-3 rounded-2xl mb-3">
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-500 uppercase text-[11px]">
                    Hệ thống nghe được:
                  </span>
                  <span className="font-black text-slate-800 text-base">
                    "{comparisonResult.spokenText || '...'}"
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-500 uppercase text-[11px]">
                    Từ / Câu mục tiêu:
                  </span>
                  <span className="font-black text-indigo-700 text-base">
                    "{comparisonResult.targetText}"
                  </span>
                </div>
              </div>

              {/* Feedback Advice */}
              <p className="text-xs sm:text-sm font-bold leading-relaxed">
                {comparisonResult.feedbackMessage}
              </p>
            </div>
          )}

          {/* Quick simulator tester for teacher / reviewer / zero-mic device */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-medium">Thử nhanh kết quả:</span>
            <button
              onClick={() => onSimulateWord(targetText)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 font-bold border border-slate-200 transition-colors"
            >
              Nói đúng ("{targetText}")
            </button>
            <button
              onClick={() => onSimulateWord(targetText.slice(0, 3) + '...')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-700 font-bold border border-slate-200 transition-colors"
            >
              Nói gần đúng
            </button>
          </div>
        </div>

        {/* Action Controls Footer: Nghe lại, Đọc lại, Làm lại bài, Từ tiếp theo */}
        <div className="mt-8 pt-6 border-t-2 border-amber-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {/* Prev button */}
            <button
              onClick={onPrevWord}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Từ trước</span>
            </button>

            {/* Reset Topic button */}
            <button
              onClick={onResetTopic}
              title="Làm lại tất cả các từ trong chủ đề này"
              className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-xs sm:text-sm border border-amber-200 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Làm lại bài</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Nghe lại */}
            <button
              onClick={handlePlayNormalAudio}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe lại</span>
            </button>

            {/* Đọc lại */}
            <button
              onClick={handleMicToggle}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
            >
              <Mic className="w-4 h-4" />
              <span>Đọc lại</span>
            </button>

            {/* Next word button */}
            <button
              onClick={onNextWord}
              className={`flex items-center gap-1 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 shadow-md ${
                isPassed || comparisonResult?.score === 'excellent'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200 animate-pulse hover:from-emerald-600 hover:to-teal-600'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-200 hover:from-amber-600 hover:to-orange-600'
              }`}
            >
              <span>{currentIndex + 1 === totalWords ? 'Hoàn thành!' : 'Từ tiếp theo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
