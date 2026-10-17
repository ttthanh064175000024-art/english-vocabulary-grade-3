export type TopicId = 'school' | 'animals' | 'food' | 'colours' | 'numbers';

export interface WordItem {
  id: string;
  word: string;
  ipa: string;
  vietnamese: string;
  exampleSentence: string;
  sentenceIpa: string;
  sentenceMeaning: string;
  pronunciationTip?: string; // e.g. "Chú ý âm cuối /k/ nhẹ ở cuối nhé!"
  color: string;
  badgeEmoji: string;
  iconName: string;
}

export interface Topic {
  id: TopicId;
  titleEn: string;
  titleVi: string;
  emoji: string;
  color: string;
  accentBg: string;
  words: WordItem[];
}

export type PracticeMode = 'word' | 'sentence';

export type PronunciationScore = 'excellent' | 'good' | 'retry' | 'none';

export interface ComparisonResult {
  score: PronunciationScore;
  similarity: number; // 0 - 100
  spokenText: string;
  targetText: string;
  praiseTitle: string;
  feedbackMessage: string;
  earnedStars: number; // 1, 2, or 3
}

export interface UserProgress {
  completedWordIds: string[];
  starsByWord: Record<string, number>;
  totalStars: number;
}
