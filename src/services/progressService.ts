import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@itqan_user_progress_v2';
const TOTAL_QURAN_AYAHS = 6236;

export interface AyahProgressRecord {
  score: number;
  timestamp: string;
}

export interface SurahProgressMeta {
  completedAyahs: number;
  totalAyahs: number;
  percent: number;
}

export interface UserProgress {
  overallProgressPercent: number; // 0 to 100 (%)
  completedAyahsCount: number; // 0 to 6236
  totalQuranAyahs: number; // 6236
  streakDays: number; // 0 initially
  averageScore: number; // 0% initially
  masteredMakharijCount: number; // 0 to 28
  masteredMakharijLetters: string[];
  completedAyahs: Record<string, AyahProgressRecord>; // key: `${surahNumber}:${ayahNumber}`
  surahProgress: Record<number, SurahProgressMeta>;
  lastActiveDate: string | null;
}

export const INITIAL_PROGRESS: UserProgress = {
  overallProgressPercent: 0,
  completedAyahsCount: 0,
  totalQuranAyahs: TOTAL_QURAN_AYAHS,
  streakDays: 0,
  averageScore: 0,
  masteredMakharijCount: 0,
  masteredMakharijLetters: [],
  completedAyahs: {},
  surahProgress: {},
  lastActiveDate: null,
};

type ProgressListener = (progress: UserProgress) => void;

class UserProgressManager {
  private currentProgress: UserProgress = { ...INITIAL_PROGRESS };
  private isLoaded: boolean = false;
  private listeners: Set<ProgressListener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private async loadFromStorage(): Promise<UserProgress> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.currentProgress = {
          ...INITIAL_PROGRESS,
          ...parsed,
          totalQuranAyahs: TOTAL_QURAN_AYAHS,
        };
      } else {
        this.currentProgress = { ...INITIAL_PROGRESS };
      }
    } catch (e) {
      console.warn('Could not load progress from storage, using initial 0% state:', e);
      this.currentProgress = { ...INITIAL_PROGRESS };
    } finally {
      this.isLoaded = true;
      this.notifyListeners();
    }
    return this.currentProgress;
  }

  public async getProgress(): Promise<UserProgress> {
    if (!this.isLoaded) {
      await this.loadFromStorage();
    }
    return { ...this.currentProgress };
  }

  public getCachedProgress(): UserProgress {
    return { ...this.currentProgress };
  }

  public subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.currentProgress });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const copy = { ...this.currentProgress };
    this.listeners.forEach((fn) => {
      try {
        fn(copy);
      } catch (err) {
        console.error('Progress listener error:', err);
      }
    });
  }

  public async recordRecitation(
    surahNumber: number,
    ayahNumber: number,
    totalAyahsInSurah: number,
    score: number,
    makharijLettersChecked: string[] = []
  ): Promise<UserProgress> {
    if (!this.isLoaded) {
      await this.loadFromStorage();
    }

    const key = `${surahNumber}:${ayahNumber}`;
    const prevRecord = this.currentProgress.completedAyahs[key];
    const bestScore = prevRecord ? Math.max(prevRecord.score, score) : score;

    const updatedCompleted = {
      ...this.currentProgress.completedAyahs,
      [key]: {
        score: bestScore,
        timestamp: new Date().toISOString(),
      },
    };

    const completedCount = Object.keys(updatedCompleted).length;
    // Calculate progress from 0% to 100%
    const overallPercent = Math.min(
      100,
      Math.round((completedCount / TOTAL_QURAN_AYAHS) * 100 * 10) / 10
    );

    // Calculate running average score
    const scores = Object.values(updatedCompleted).map((v) => v.score);
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    // Update Surah progress
    let surahCompletedCount = 0;
    for (let a = 1; a <= totalAyahsInSurah; a++) {
      if (updatedCompleted[`${surahNumber}:${a}`]) {
        surahCompletedCount++;
      }
    }
    const surahPercent = Math.min(
      100,
      Math.round((surahCompletedCount / totalAyahsInSurah) * 100)
    );

    const updatedSurahProgress = {
      ...this.currentProgress.surahProgress,
      [surahNumber]: {
        completedAyahs: surahCompletedCount,
        totalAyahs: totalAyahsInSurah,
        percent: surahPercent,
      },
    };

    // Update mastered Makharij letters
    const currentLettersSet = new Set(this.currentProgress.masteredMakharijLetters);
    if (score >= 70) {
      makharijLettersChecked.forEach((l) => {
        if (l && l.trim().length > 0) currentLettersSet.add(l.trim());
      });
    }
    const masteredLetters = Array.from(currentLettersSet);
    const makharijCount = Math.min(28, masteredLetters.length);

    // Update streak logic
    const today = new Date().toISOString().split('T')[0];
    let newStreak = this.currentProgress.streakDays;
    const lastDate = this.currentProgress.lastActiveDate;

    if (!lastDate) {
      newStreak = 1;
    } else if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    this.currentProgress = {
      overallProgressPercent: overallPercent,
      completedAyahsCount: completedCount,
      totalQuranAyahs: TOTAL_QURAN_AYAHS,
      streakDays: newStreak,
      averageScore: avgScore,
      masteredMakharijCount: makharijCount,
      masteredMakharijLetters: masteredLetters,
      completedAyahs: updatedCompleted,
      surahProgress: updatedSurahProgress,
      lastActiveDate: today,
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentProgress));
    } catch (e) {
      console.warn('Failed to persist progress to storage:', e);
    }

    this.notifyListeners();
    return { ...this.currentProgress };
  }

  public async resetProgress(): Promise<UserProgress> {
    this.currentProgress = { ...INITIAL_PROGRESS };
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    this.notifyListeners();
    return { ...this.currentProgress };
  }
}

export const ProgressService = new UserProgressManager();
