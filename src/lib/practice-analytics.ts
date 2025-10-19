/**
 * Practice Analytics System
 * Tracks user progress, calculates accuracy per letter, and suggests personalized lessons
 */

import { LetterProgress } from './asl-feedback';

export interface PracticeSession {
  id: string;
  timestamp: number;
  targetSentence: string;
  progress: LetterProgress[];
  accuracy: number;
  duration: number; // in seconds
  completedAt?: number;
}

export interface LetterStats {
  letter: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  lastPracticed: number;
}

export interface LessonSuggestion {
  priority: 'high' | 'medium' | 'low';
  letters: string[];
  reason: string;
  suggestedSentences: string[];
}

export class PracticeAnalytics {
  private storageKey = 'asl_practice_sessions';

  /**
   * Save a practice session to localStorage
   */
  savePracticeSession(session: PracticeSession): void {
    const sessions = this.getAllSessions();
    sessions.push(session);
    
    // Keep only last 100 sessions to avoid storage bloat
    const recentSessions = sessions.slice(-100);
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(recentSessions));
    } catch (error) {
      console.error('Failed to save practice session:', error);
    }
  }

  /**
   * Get all practice sessions
   */
  getAllSessions(): PracticeSession[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load practice sessions:', error);
      return [];
    }
  }

  /**
   * Get sessions from the last N days
   */
  getRecentSessions(days: number = 7): PracticeSession[] {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.getAllSessions().filter(s => s.timestamp >= cutoffTime);
  }

  /**
   * Calculate statistics for each letter
   */
  getLetterStats(): Map<string, LetterStats> {
    const sessions = this.getAllSessions();
    const statsMap = new Map<string, LetterStats>();

    sessions.forEach(session => {
      session.progress.forEach(letterProgress => {
        const letter = letterProgress.letter.toUpperCase();
        
        // Skip spaces
        if (letter === ' ') return;

        const existing = statsMap.get(letter) || {
          letter,
          totalAttempts: 0,
          correctAttempts: 0,
          accuracy: 0,
          lastPracticed: 0
        };

        existing.totalAttempts++;
        if (letterProgress.isCorrect) {
          existing.correctAttempts++;
        }
        existing.accuracy = (existing.correctAttempts / existing.totalAttempts) * 100;
        existing.lastPracticed = Math.max(existing.lastPracticed, session.timestamp);

        statsMap.set(letter, existing);
      });
    });

    return statsMap;
  }

  /**
   * Get letters that need more practice (lowest accuracy)
   */
  getWeakLetters(minAttempts: number = 3): string[] {
    const stats = Array.from(this.getLetterStats().values())
      .filter(s => s.totalAttempts >= minAttempts)
      .sort((a, b) => a.accuracy - b.accuracy);

    return stats.slice(0, 5).map(s => s.letter);
  }

  /**
   * Get letters that haven't been practiced recently
   */
  getUnpracticedLetters(daysSince: number = 7): string[] {
    const cutoffTime = Date.now() - (daysSince * 24 * 60 * 60 * 1000);
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const stats = this.getLetterStats();

    return allLetters.filter(letter => {
      const stat = stats.get(letter);
      return !stat || stat.lastPracticed < cutoffTime;
    });
  }

  /**
   * Generate personalized lesson suggestions
   */
  getSuggestedLessons(): LessonSuggestion[] {
    const suggestions: LessonSuggestion[] = [];
    const weakLetters = this.getWeakLetters(3);
    const unpracticed = this.getUnpracticedLetters(3);
    const stats = this.getLetterStats();

    // High priority: Letters with low accuracy
    if (weakLetters.length > 0) {
      suggestions.push({
        priority: 'high',
        letters: weakLetters,
        reason: 'These letters have low accuracy. Focus on improving them!',
        suggestedSentences: this.generatePracticeSentences(weakLetters)
      });
    }

    // Medium priority: Unpracticed letters
    const recentlyUnpracticed = unpracticed.slice(0, 5);
    if (recentlyUnpracticed.length > 0) {
      suggestions.push({
        priority: 'medium',
        letters: recentlyUnpracticed,
        reason: 'Practice these letters to maintain your skills.',
        suggestedSentences: this.generatePracticeSentences(recentlyUnpracticed)
      });
    }

    // Low priority: Advanced practice with all letters
    const wellPracticedLetters = Array.from(stats.values())
      .filter(s => s.accuracy >= 80 && s.totalAttempts >= 5)
      .map(s => s.letter);

    if (wellPracticedLetters.length >= 5) {
      suggestions.push({
        priority: 'low',
        letters: wellPracticedLetters.slice(0, 8),
        reason: 'Great job! Try more complex sentences.',
        suggestedSentences: [
          'HELLO WORLD',
          'PRACTICE MAKES PERFECT',
          'NEURAL HANDS ROCKS',
          'LEARN ASL TODAY'
        ]
      });
    }

    return suggestions;
  }

  /**
   * Generate practice sentences using specific letters
   */
  private generatePracticeSentences(letters: string[]): string[] {
    const sentences: string[] = [];
    
    // Create sentences that focus on the target letters
    const letterSet = new Set(letters.map(l => l.toUpperCase()));
    
    // Simple words/sentences using these letters
    const commonWords: Record<string, string[]> = {
      A: ['CAT', 'HAT', 'BAT', 'DAD', 'MAD'],
      B: ['BOB', 'BED', 'BAD', 'BIG'],
      C: ['CAR', 'CAN', 'CAT', 'COW'],
      D: ['DOG', 'DAD', 'DIG', 'DAY'],
      E: ['EGG', 'END', 'EAR', 'EYE'],
      F: ['FAN', 'FUN', 'FAR', 'FOX'],
      G: ['GIG', 'GAG', 'GO', 'GET'],
      H: ['HAT', 'HIT', 'HOT', 'HUG'],
      I: ['ILL', 'ICE', 'INK', 'IT'],
      J: ['JAM', 'JOB', 'JOY', 'JIG'],
      K: ['KID', 'KEY', 'KIT'],
      L: ['LAB', 'LEG', 'LIT', 'LOW'],
      M: ['MAD', 'MOM', 'MAN', 'MAP'],
      N: ['NAN', 'NAP', 'NET', 'NOW'],
      O: ['ODD', 'OLD', 'OWN', 'ON'],
      P: ['PAD', 'PAN', 'PIG', 'POT'],
      Q: ['QUIT', 'QUIZ', 'QUICK'],
      R: ['RAT', 'RED', 'RUN', 'ROW'],
      S: ['SAD', 'SIT', 'SUN', 'SKY'],
      T: ['TAP', 'TEN', 'TOP', 'TUG'],
      U: ['UP', 'USE', 'URN'],
      V: ['VAN', 'VET', 'VOW'],
      W: ['WAR', 'WET', 'WIN', 'WOW'],
      X: ['BOX', 'WAX', 'SIX'],
      Y: ['YES', 'YAK', 'YAM', 'YET'],
      Z: ['ZOO', 'ZAP', 'ZIP', 'ZEN']
    };

    // Generate sentences focusing on target letters
    letters.slice(0, 3).forEach(letter => {
      const words = commonWords[letter] || [];
      if (words.length > 0) {
        sentences.push(words[0]);
      }
    });

    // Combine letters into a practice phrase
    const phrase = letters.slice(0, 6).join(' ');
    sentences.push(phrase);

    return sentences.slice(0, 4);
  }

  /**
   * Calculate overall accuracy trend (last 7 days)
   */
  getAccuracyTrend(days: number = 7): number[] {
    const sessions = this.getRecentSessions(days);
    const dayBuckets: Map<string, number[]> = new Map();

    sessions.forEach(session => {
      const date = new Date(session.timestamp).toDateString();
      if (!dayBuckets.has(date)) {
        dayBuckets.set(date, []);
      }
      dayBuckets.get(date)!.push(session.accuracy);
    });

    // Calculate average accuracy per day
    const trend: number[] = [];
    const sortedDates = Array.from(dayBuckets.keys()).sort();
    
    sortedDates.forEach(date => {
      const accuracies = dayBuckets.get(date)!;
      const avg = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
      trend.push(avg);
    });

    return trend;
  }

  /**
   * Get overall statistics
   */
  getOverallStats() {
    const sessions = this.getAllSessions();
    const recentSessions = this.getRecentSessions(7);
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalPracticeTime: 0,
        averageAccuracy: 0,
        recentAccuracy: 0,
        lettersLearned: 0,
        totalLettersPracticed: 0
      };
    }

    const totalPracticeTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
    const recentAccuracy = recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length
      : 0;

    const letterStats = this.getLetterStats();
    const lettersLearned = Array.from(letterStats.values())
      .filter(s => s.accuracy >= 80)
      .length;

    const totalLettersPracticed = Array.from(letterStats.values())
      .reduce((sum, s) => sum + s.totalAttempts, 0);

    return {
      totalSessions: sessions.length,
      totalPracticeTime: Math.round(totalPracticeTime),
      averageAccuracy: Math.round(avgAccuracy),
      recentAccuracy: Math.round(recentAccuracy),
      lettersLearned,
      totalLettersPracticed
    };
  }

  /**
   * Clear all practice data
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear practice data:', error);
    }
  }
}

// Singleton instance
export const practiceAnalytics = new PracticeAnalytics();
