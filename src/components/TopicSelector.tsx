import React from 'react';
import { TOPICS } from '../data/topics';
import { TopicId } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  activeTopicId: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  completedWordIds: string[];
}

export const TopicSelector: React.FC<Props> = ({
  activeTopicId,
  onSelectTopic,
  completedWordIds,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max px-1">
        {TOPICS.map((topic) => {
          const isSelected = topic.id === activeTopicId;
          const completedCount = topic.words.filter(w => completedWordIds.includes(w.id)).length;
          const isAllCompleted = completedCount === topic.words.length && topic.words.length > 0;

          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 active:scale-95 shadow-sm border-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-orange-600 shadow-md shadow-orange-200 -translate-y-0.5'
                  : 'bg-white hover:bg-amber-50/70 text-slate-700 border-amber-200/80 hover:border-amber-300'
              }`}
            >
              <span className="text-xl sm:text-2xl drop-shadow-sm">{topic.emoji}</span>
              <div className="text-left">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-extrabold">{topic.titleEn}</span>
                  {isAllCompleted && (
                    <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-amber-200' : 'text-emerald-500'}`} />
                  )}
                </div>
                <div className={`text-xs ${isSelected ? 'text-amber-100 font-medium' : 'text-slate-400 font-normal'}`}>
                  {completedCount}/{topic.words.length} từ
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
