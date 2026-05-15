export type MoodType = 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'frustrated' | 'tired' | 'angry'

export interface MoodConfig {
  label: string
  emoji: string
  score: number
  color: string
}

export const MOOD_CONFIG: Record<MoodType, MoodConfig> = {
  happy: {
    label: 'Bahagia',
    emoji: '😄',
    score: 9,
    color: '#FFD93D'
  },
  calm: {
    label: 'Tenang',
    emoji: '😌',
    score: 7,
    color: '#6BCB77'
  },
  neutral: {
    label: 'Biasa Saja',
    emoji: '😐',
    score: 5,
    color: '#9EA7D8'
  },
  sad: {
    label: 'Sedih',
    emoji: '😔',
    score: 3,
    color: '#FF6B9D'
  },
  anxious: {
    label: 'Cemas',
    emoji: '😰',
    score: 2,
    color: '#B983FF'
  },
  frustrated: {
    label: 'Frustrasi',
    emoji: '😤',
    score: 3,
    color: '#FFA07A'
  },
  tired: {
    label: 'Kelelahan',
    emoji: '😴',
    score: 4,
    color: '#A8DADC'
  },
  angry: {
    label: 'Marah',
    emoji: '😡',
    score: 2,
    color: '#FF6B6B'
  }
}

export const MOOD_TYPES = Object.keys(MOOD_CONFIG) as MoodType[]

export const MAX_MOOD_EDITS = 2
