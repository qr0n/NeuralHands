/**
 * ASL Learning Analytics Dashboard
 * Shows practice analytics, progress tracking, and personalized lesson suggestions
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { practiceAnalytics, LetterStats, LessonSuggestion } from '@/lib/practice-analytics';
import Link from 'next/link';

export default function AnalyticsDashboard() {
  const [overallStats, setOverallStats] = useState<any>(null);
  const [letterStats, setLetterStats] = useState<Map<string, LetterStats>>(new Map());
  const [suggestions, setSuggestions] = useState<LessonSuggestion[]>([]);
  const [accuracyTrend, setAccuracyTrend] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load analytics data
  useEffect(() => {
    setMounted(true);
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setOverallStats(practiceAnalytics.getOverallStats());
    setLetterStats(practiceAnalytics.getLetterStats());
    setSuggestions(practiceAnalytics.getSuggestedLessons());
    setAccuracyTrend(practiceAnalytics.getAccuracyTrend(7));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading dashboard...</p>
      </div>
    );
  }

  if (!overallStats || overallStats.totalSessions === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur rounded-2xl p-12 shadow-2xl"
          >
            <div className="text-6xl mb-6">📊</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              No Practice Data Yet
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Start practicing to see your progress, accuracy trends, and personalized lessons!
            </p>
            <Link href="/practice">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg"
              >
                Start Practicing 🎓
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const letterStatsArray = Array.from(letterStats.values())
    .sort((a, b) => b.accuracy - a.accuracy);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-blue-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '✨';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            📊 Your Learning Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Track your progress and get personalized lesson recommendations
          </p>
        </motion.div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Sessions</span>
              <span className="text-3xl">🎯</span>
            </div>
            <p className="text-4xl font-bold text-white">{overallStats.totalSessions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Average Accuracy</span>
              <span className="text-3xl">📈</span>
            </div>
            <p className="text-4xl font-bold text-green-400">{overallStats.averageAccuracy}%</p>
            {overallStats.recentAccuracy > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                Last 7 days: {overallStats.recentAccuracy}%
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Letters Mastered</span>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-4xl font-bold text-purple-400">{overallStats.lettersLearned}/26</p>
            <p className="text-sm text-gray-400 mt-1">
              {Math.round((overallStats.lettersLearned / 26) * 100)}% complete
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Practice Time</span>
              <span className="text-3xl">⏱️</span>
            </div>
            <p className="text-4xl font-bold text-blue-400">
              {Math.floor(overallStats.totalPracticeTime / 60)}m
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {overallStats.totalPracticeTime % 60}s
            </p>
          </motion.div>
        </div>

        {/* Personalized Lesson Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              🎯 Personalized Lessons
            </h2>
            <div className="space-y-4">
              {suggestions.map((suggestion, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className={`bg-gradient-to-r ${getPriorityColor(suggestion.priority)} p-6 rounded-xl shadow-xl`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{getPriorityIcon(suggestion.priority)}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {suggestion.priority === 'high' ? 'Priority Practice' :
                           suggestion.priority === 'medium' ? 'Recommended Practice' :
                           'Advanced Practice'}
                        </h3>
                        <p className="text-white/90">{suggestion.reason}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-white/80 text-sm mb-2">Focus Letters:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestion.letters.map(letter => (
                        <span
                          key={letter}
                          className="px-3 py-1 bg-white/20 backdrop-blur rounded-lg text-white font-semibold"
                        >
                          {letter}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-white/80 text-sm mb-2">Suggested Sentences:</p>
                    <div className="space-y-2">
                      {suggestion.suggestedSentences.map((sentence, sidx) => (
                        <div
                          key={sidx}
                          className="px-4 py-2 bg-white/10 backdrop-blur rounded-lg text-white font-mono"
                        >
                          {sentence}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href="/practice">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      Start This Lesson →
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Letter-by-Letter Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            📝 Letter Performance
          </h2>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {letterStatsArray.map((stat) => (
                <motion.div
                  key={stat.letter}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-lg shadow-md ${
                    stat.accuracy >= 80 ? 'bg-green-500/20 border-2 border-green-500' :
                    stat.accuracy >= 60 ? 'bg-yellow-500/20 border-2 border-yellow-500' :
                    'bg-red-500/20 border-2 border-red-500'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white mb-2">{stat.letter}</p>
                    <p className={`text-2xl font-semibold mb-1 ${
                      stat.accuracy >= 80 ? 'text-green-300' :
                      stat.accuracy >= 60 ? 'text-yellow-300' :
                      'text-red-300'
                    }`}>
                      {Math.round(stat.accuracy)}%
                    </p>
                    <p className="text-xs text-gray-400">
                      {stat.correctAttempts}/{stat.totalAttempts} correct
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <Link href="/practice">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg"
            >
              Continue Practicing 🎓
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (confirm('Are you sure you want to clear all practice data? This cannot be undone.')) {
                practiceAnalytics.clearAllData();
                loadAnalytics();
              }
            }}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-lg shadow-lg"
          >
            Clear Data 🗑️
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
