import { Level, LessonType } from '@prisma/client';

// Badge color utilities
export function getLevelBadgeColor(level: Level) {
  const badges: Record<Level, string> = {
    PRE_PRELIMINARY: 'bg-blue-100 text-blue-800',
    PRELIMINARY: 'bg-blue-200 text-blue-800',
    PRE_JUVENILE: 'bg-indigo-100 text-indigo-800',
    JUVENILE: 'bg-indigo-200 text-indigo-800',
    INTERMEDIATE: 'bg-purple-100 text-purple-800',
    NOVICE: 'bg-purple-200 text-purple-800',
    JUNIOR: 'bg-green-100 text-green-800',
    SENIOR: 'bg-green-200 text-green-800'
  };
  return badges[level];
}

export function getLessonTypeColor(type: LessonType) {
  const colors: Record<LessonType, string> = {
    PRIVATE: 'bg-blue-100 text-blue-800',
    GROUP: 'bg-green-100 text-green-800',
    CHOREOGRAPHY: 'bg-purple-100 text-purple-800',
    COMPETITION_PREP: 'bg-amber-100 text-amber-800'
  };
  return colors[type];
}
