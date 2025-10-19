/**
 * ASL Corrective Feedback System
 * Provides real-time feedback for learning ASL signs
 */

export interface FeedbackMessage {
  correct: string;
  incorrect: string;
}

// Feedback dictionary for A-Z signs (from v2_newjoinee.py)
export const ASL_FEEDBACK: Record<string, FeedbackMessage> = {
  A: { correct: "Perfect A!", incorrect: "Keep fingers closed, thumb on side." },
  B: { correct: "Nice B!", incorrect: "Straighten all fingers, thumb across palm." },
  C: { correct: "Good C!", incorrect: "Curve hand like C." },
  D: { correct: "Well done D!", incorrect: "Index up, others touching thumb." },
  E: { correct: "Nice E!", incorrect: "Curl fingers slightly inward." },
  F: { correct: "Perfect F!", incorrect: "Touch thumb to index, other fingers up." },
  G: { correct: "Great G!", incorrect: "Point sideways with index and thumb." },
  H: { correct: "Good H!", incorrect: "Index and middle together, sideways." },
  I: { correct: "Well done I!", incorrect: "Pinkie up, rest down." },
  J: { correct: "Perfect J!", incorrect: "Draw a J with pinkie." },
  K: { correct: "Great K!", incorrect: "Thumb under middle, index up." },
  L: { correct: "Nice L!", incorrect: "Form L with thumb and index." },
  M: { correct: "Well done M!", incorrect: "Three fingers over thumb, tight." },
  N: { correct: "Perfect N!", incorrect: "Two fingers over thumb, others down." },
  O: { correct: "Good O!", incorrect: "Curve all fingers into circle." },
  P: { correct: "Nice P!", incorrect: "Thumb under middle, point down." },
  Q: { correct: "Well done Q!", incorrect: "Thumb under index, point down." },
  R: { correct: "Perfect R!", incorrect: "Cross index over middle." },
  S: { correct: "Good S!", incorrect: "Make a fist, thumb in front." },
  T: { correct: "Well done T!", incorrect: "Thumb between index and middle." },
  U: { correct: "Nice U!", incorrect: "Index and middle together, up." },
  V: { correct: "Perfect V!", incorrect: "Separate index and middle." },
  W: { correct: "Great W!", incorrect: "Raise index, middle, ring." },
  X: { correct: "Good X!", incorrect: "Bend index, others down." },
  Y: { correct: "Nice Y!", incorrect: "Thumb and pinkie out, others down." },
  Z: { correct: "Well done Z!", incorrect: "Draw Z in air with index." },
};

// Practice sentences for learning mode
export const PRACTICE_SENTENCES = [
  "HELLO MY G",
  "I LOVE JA",
  "LEARN INTELLIBUS",
  "NEURAL HANDS",
  "ASL IS FUN",
  "PRACTICE MAKES PERFECT"
];

export interface LetterProgress {
  letter: string;
  isCorrect: boolean;
  attemptedLetter?: string;
}

/**
 * Get feedback message for a detected sign vs target letter
 */
export function getFeedbackMessage(
  detectedSign: string,
  targetLetter: string
): { message: string; isCorrect: boolean } {
  const upperDetected = detectedSign.toUpperCase();
  const upperTarget = targetLetter.toUpperCase();
  
  if (upperDetected === upperTarget) {
    return {
      message: ASL_FEEDBACK[upperTarget]?.correct || "Nice job!",
      isCorrect: true
    };
  } else {
    return {
      message: ASL_FEEDBACK[upperTarget]?.incorrect || "Adjust your hand shape.",
      isCorrect: false
    };
  }
}

/**
 * Check if sentence is complete
 */
export function isSentenceComplete(
  progress: LetterProgress[],
  targetSentence: string
): boolean {
  return progress.length >= targetSentence.length;
}

/**
 * Get next target letter
 */
export function getNextTargetLetter(
  progress: LetterProgress[],
  targetSentence: string
): string | null {
  if (progress.length >= targetSentence.length) {
    return null;
  }
  return targetSentence[progress.length];
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(progress: LetterProgress[]): number {
  if (progress.length === 0) return 0;
  const correctCount = progress.filter(p => p.isCorrect).length;
  return (correctCount / progress.length) * 100;
}
