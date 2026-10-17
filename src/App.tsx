import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TOPICS } from './data/topics';
import { TopicId, PracticeMode, ComparisonResult } from './types';
import { Header } from './components/Header';
import { TopicSelector } from './components/TopicSelector';
import { PronunciationCard } from './components/PronunciationCard';
import { MicTestModal } from './components/MicTestModal';
import { CompletedModal } from './components/CompletedModal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { comparePronunciation } from './utils/speechComparator';
import { soundEffects } from './utils/audio';

const STORAGE_KEY = 'starters_pronunciation_coach_progress_v1';

export default function App() {
  const [activeTopicId, setActiveTopicId] = useState<TopicId>('school');
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('word');
  const [speechRate, setSpeechRate] = useState<number>(0.85); // 0.85 default is optimal for 3rd graders

  const [completedWordIds, setCompletedWordIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.completedWordIds || [];
      }
    } catch (e) {}
    return [];
  });

  const [starsByWord, setStarsByWord] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.starsByWord || {};
      }
    } catch (e) {}
    return {};
  });

  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isMicTestOpen, setIsMicTestOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Current topic and current word
  const currentTopic = useMemo(() => {
    return TOPICS.find((t) => t.id === activeTopicId) || TOPICS[0];
  }, [activeTopicId]);

  const currentWord = useMemo(() => {
    return currentTopic.words[currentWordIndex] || currentTopic.words[0];
  }, [currentTopic, currentWordIndex]);

  // Persist progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedWordIds,
          starsByWord,
        })
      );
    } catch (e) {}
  }, [completedWordIds, starsByWord]);

  // Total stars calculated across all words
  const totalStars = useMemo(() => {
    return Object.values(starsByWord).reduce((sum, s) => sum + s, 0);
  }, [starsByWord]);

  // Handle evaluation when speech recognition returns a spoken transcript
  const handleSpeechResult = useCallback(
    (spokenText: string) => {
      const targetText = practiceMode === 'word' ? currentWord.word : currentWord.exampleSentence;
      const result = comparePronunciation(spokenText, targetText, practiceMode === 'sentence');
      setComparisonResult(result);

      if (result.score === 'excellent') {
        soundEffects.playSuccess();
        // Update stars and completed words
        setCompletedWordIds((prev) =>
          prev.includes(currentWord.id) ? prev : [...prev, currentWord.id]
        );
        setStarsByWord((prev) => ({
          ...prev,
          [currentWord.id]: Math.max(prev[currentWord.id] || 0, 3),
        }));

        // Check if this was the last word of the topic
        const willCompleteTopic = currentTopic.words.every(
          (w) => w.id === currentWord.id || completedWordIds.includes(w.id)
        );

        if (willCompleteTopic && currentWordIndex === currentTopic.words.length - 1) {
          setTimeout(() => {
            setIsCompletedModalOpen(true);
          }, 1000);
        }
      } else if (result.score === 'good') {
        soundEffects.playStarDing();
        setCompletedWordIds((prev) =>
          prev.includes(currentWord.id) ? prev : [...prev, currentWord.id]
        );
        setStarsByWord((prev) => ({
          ...prev,
          [currentWord.id]: Math.max(prev[currentWord.id] || 0, 2),
        }));
      } else {
        soundEffects.playTryAgain();
      }
    },
    [currentWord, currentTopic, practiceMode, currentWordIndex, completedWordIds]
  );

  const {
    isSupported,
    isListening,
    transcript,
    error: speechError,
    audioLevel,
    startListening,
    stopListening,
    resetTranscript,
    requestPermission,
    simulateSpeech,
  } = useSpeechRecognition(handleSpeechResult);

  // Change word
  const goToWord = (index: number) => {
    soundEffects.playClick();
    stopListening();
    resetTranscript();
    setComparisonResult(null);
    setCurrentWordIndex(Math.max(0, Math.min(currentTopic.words.length - 1, index)));
  };

  const handleNextWord = () => {
    if (currentWordIndex < currentTopic.words.length - 1) {
      goToWord(currentWordIndex + 1);
    } else {
      // Reached end of topic
      setIsCompletedModalOpen(true);
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      goToWord(currentWordIndex - 1);
    }
  };

  const handleSelectTopic = (topicId: TopicId) => {
    soundEffects.playClick();
    stopListening();
    resetTranscript();
    setComparisonResult(null);
    setActiveTopicId(topicId);
    setCurrentWordIndex(0);
  };

  const handleResetTopic = () => {
    soundEffects.playClick();
    const topicWordIds = currentTopic.words.map((w) => w.id);
    setCompletedWordIds((prev) => prev.filter((id) => !topicWordIds.includes(id)));
    setStarsByWord((prev) => {
      const copy = { ...prev };
      topicWordIds.forEach((id) => delete copy[id]);
      return copy;
    });
    setComparisonResult(null);
    setCurrentWordIndex(0);
  };

  const handleToggleSpeechRate = () => {
    soundEffects.playClick();
    setSpeechRate((prev) => (prev <= 0.85 ? 1.0 : 0.75));
  };

  const handleNextTopic = () => {
    setIsCompletedModalOpen(false);
    const topicIds: TopicId[] = ['school', 'animals', 'food', 'colours', 'numbers'];
    const currentIndex = topicIds.indexOf(activeTopicId);
    const nextIndex = (currentIndex + 1) % topicIds.length;
    handleSelectTopic(topicIds[nextIndex]);
  };

  // Progress calculations for current topic
  const topicCompletedCount = useMemo(() => {
    return currentTopic.words.filter((w) => completedWordIds.includes(w.id)).length;
  }, [currentTopic, completedWordIds]);

  const topicEarnedStars = useMemo(() => {
    return currentTopic.words.reduce((sum, w) => sum + (starsByWord[w.id] || 0), 0);
  }, [currentTopic, starsByWord]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-yellow-50/60 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        totalStars={totalStars}
        onOpenMicTest={() => setIsMicTestOpen(true)}
        speechRate={speechRate}
        onToggleSpeechRate={handleToggleSpeechRate}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-5">
        {/* Public Access Direct Notice */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-teal-500/10 border-2 border-emerald-300/80 rounded-2xl px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎒</span>
            <span className="font-extrabold text-emerald-900">
              Chào mừng bé đến với bài luyện phát âm!
            </span>
            <span className="text-slate-600 font-semibold hidden sm:inline">
              Mở link là học ngay • Không cần đăng nhập • Không cần email.
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-700 bg-white/90 px-2.5 py-1 rounded-xl border border-emerald-200">
            <span>✨</span>
            <span>Mở là học ngay</span>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wider">
              Chọn chủ đề ôn thi Pre A1:
            </span>
            <span className="text-xs font-bold text-amber-700">
              Đang học: {currentTopic.emoji} {currentTopic.titleEn} ({topicCompletedCount}/{currentTopic.words.length} từ)
            </span>
          </div>
          <TopicSelector
            activeTopicId={activeTopicId}
            onSelectTopic={handleSelectTopic}
            completedWordIds={completedWordIds}
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-amber-100 rounded-full h-3.5 p-0.5 border border-amber-200 shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500 shadow-xs"
            style={{
              width: `${Math.max(5, (topicCompletedCount / currentTopic.words.length) * 100)}%`,
            }}
          />
        </div>

        {/* Main Pronunciation Card */}
        <PronunciationCard
          word={currentWord}
          currentIndex={currentWordIndex}
          totalWords={currentTopic.words.length}
          practiceMode={practiceMode}
          onToggleMode={setPracticeMode}
          isListening={isListening}
          audioLevel={audioLevel}
          speechError={speechError}
          comparisonResult={comparisonResult}
          onStartListening={startListening}
          onStopListening={stopListening}
          onNextWord={handleNextWord}
          onPrevWord={handlePrevWord}
          onResetTopic={handleResetTopic}
          onSimulateWord={simulateSpeech}
          speechRate={speechRate}
          isPassed={completedWordIds.includes(currentWord.id)}
          earnedStars={starsByWord[currentWord.id] || 0}
        />

        {/* Word Quick Navigation Strip */}
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 border-2 border-amber-200/80 shadow-xs">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2 px-1">
            Danh sách từ vựng chủ đề {currentTopic.titleEn}:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {currentTopic.words.map((w, idx) => {
              const isSelected = idx === currentWordIndex;
              const isDone = completedWordIds.includes(w.id);
              const stars = starsByWord[w.id] || 0;

              return (
                <button
                  key={w.id}
                  onClick={() => goToWord(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all active:scale-95 border-2 ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-105'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  <span>{w.badgeEmoji}</span>
                  <span className="capitalize">{w.word}</span>
                  {isDone && <span className="text-[10px] text-amber-500">⭐{stars}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pedagogical & Privacy Disclaimer */}
        <DisclaimerBanner />
      </main>

      {/* Mic Test Modal */}
      <MicTestModal
        isOpen={isMicTestOpen}
        onClose={() => setIsMicTestOpen(false)}
        onRequestPermission={requestPermission}
        isSpeechSupported={isSupported}
      />

      {/* Completed Topic Celebration Modal */}
      <CompletedModal
        isOpen={isCompletedModalOpen}
        topic={currentTopic}
        earnedStars={topicEarnedStars}
        totalWords={currentTopic.words.length}
        onRestartTopic={() => {
          setIsCompletedModalOpen(false);
          handleResetTopic();
        }}
        onNextTopic={handleNextTopic}
        onClose={() => setIsCompletedModalOpen(false)}
      />

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-amber-200/60 bg-amber-50/60">
        <p className="font-semibold">
          Starters Pronunciation Coach – Luyện phát âm cùng AI © Cambridge Pre A1 Starters dành cho học sinh Lớp 3
        </p>
      </footer>
    </div>
  );
}
