export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  signs: string[]; // List of signs taught in this lesson
  completed: boolean;
  score?: number; // 0-100
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  thumbnail: string; // emoji or icon
  totalLessons: number;
  completedLessons: number;
  progress: number; // 0-100
  estimatedTime: number; // total minutes
  prerequisites?: string[]; // Course IDs that should be completed first
  lessons: Lesson[];
  category: "alphabet" | "numbers" | "phrases" | "conversation";
}

export interface UserProgress {
  userId: string;
  courseProgress: {
    [courseId: string]: {
      completedLessons: string[];
      currentLesson?: string;
      lastAccessed: Date;
      overallScore: number;
    };
  };
}

// Mock Courses Data
export const MOCK_COURSES: Course[] = [
  {
    id: "course-001",
    title: "ASL Alphabet Basics",
    description: "Master the fundamentals of ASL fingerspelling. Learn all 26 letters with proper hand shapes and positions.",
    difficulty: "beginner",
    thumbnail: "✋",
    totalLessons: 6,
    completedLessons: 0,
    progress: 0,
    estimatedTime: 90,
    category: "alphabet",
    lessons: [
      {
        id: "lesson-001-01",
        title: "Letters A-E",
        description: "Introduction to fingerspelling with the first 5 letters",
        duration: 15,
        signs: ["A", "B", "C", "D", "E"],
        completed: false,
      },
      {
        id: "lesson-001-02",
        title: "Letters F-J",
        description: "Continue building your alphabet foundation",
        duration: 15,
        signs: ["F", "G", "H", "I", "J"],
        completed: false,
      },
      {
        id: "lesson-001-03",
        title: "Letters K-O",
        description: "Mid-alphabet signs with focus on finger positions",
        duration: 15,
        signs: ["K", "L", "M", "N", "O"],
        completed: false,
      },
      {
        id: "lesson-001-04",
        title: "Letters P-T",
        description: "Advanced hand shapes and orientations",
        duration: 15,
        signs: ["P", "Q", "R", "S", "T"],
        completed: false,
      },
      {
        id: "lesson-001-05",
        title: "Letters U-Z",
        description: "Complete your alphabet mastery",
        duration: 15,
        signs: ["U", "V", "W", "X", "Y", "Z"],
        completed: false,
      },
      {
        id: "lesson-001-06",
        title: "Alphabet Review & Speed",
        description: "Practice full alphabet with speed drills",
        duration: 15,
        signs: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        completed: false,
      },
    ],
  },
  {
    id: "course-002",
    title: "Numbers 0-100",
    description: "Learn to express numbers in ASL, from basic counting to complex numerical expressions.",
    difficulty: "beginner",
    thumbnail: "🔢",
    totalLessons: 4,
    completedLessons: 0,
    progress: 0,
    estimatedTime: 60,
    category: "numbers",
    lessons: [
      {
        id: "lesson-002-01",
        title: "Numbers 0-10",
        description: "Foundation of ASL number system",
        duration: 15,
        signs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        completed: false,
      },
      {
        id: "lesson-002-02",
        title: "Numbers 11-20",
        description: "Teens and compound numbers",
        duration: 15,
        signs: ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
        completed: false,
      },
      {
        id: "lesson-002-03",
        title: "Numbers 21-50",
        description: "Multiples and counting patterns",
        duration: 15,
        signs: ["21", "25", "30", "35", "40", "45", "50"],
        completed: false,
      },
      {
        id: "lesson-002-04",
        title: "Numbers 51-100",
        description: "Higher numbers and practical applications",
        duration: 15,
        signs: ["60", "70", "80", "90", "100"],
        completed: false,
      },
    ],
  },
  {
    id: "course-003",
    title: "Everyday Greetings",
    description: "Common phrases for daily interactions. Perfect for beginners wanting to start conversations.",
    difficulty: "beginner",
    thumbnail: "👋",
    totalLessons: 5,
    completedLessons: 0,
    progress: 0,
    estimatedTime: 75,
    prerequisites: ["course-001"],
    category: "phrases",
    lessons: [
      {
        id: "lesson-003-01",
        title: "Hello & Goodbye",
        description: "Basic greetings and farewells",
        duration: 15,
        signs: ["HELLO", "HI", "GOODBYE", "BYE", "SEE-YOU"],
        completed: false,
      },
      {
        id: "lesson-003-02",
        title: "Please & Thank You",
        description: "Polite expressions and manners",
        duration: 15,
        signs: ["PLEASE", "THANK-YOU", "YOU'RE-WELCOME", "EXCUSE-ME", "SORRY"],
        completed: false,
      },
      {
        id: "lesson-003-03",
        title: "How Are You?",
        description: "Asking about wellbeing and responding",
        duration: 15,
        signs: ["HOW", "YOU", "FINE", "GOOD", "BAD", "SO-SO"],
        completed: false,
      },
      {
        id: "lesson-003-04",
        title: "Nice to Meet You",
        description: "Introduction phrases and social niceties",
        duration: 15,
        signs: ["NICE", "MEET", "YOU", "NAME", "MY", "WHAT"],
        completed: false,
      },
      {
        id: "lesson-003-05",
        title: "Common Questions",
        description: "WH-questions and yes/no questions",
        duration: 15,
        signs: ["WHERE", "WHEN", "WHO", "WHY", "WHAT", "HOW", "YES", "NO"],
        completed: false,
      },
    ],
  },
  {
    id: "course-004",
    title: "Family & Relationships",
    description: "Learn to describe your family members and important relationships in your life.",
    difficulty: "intermediate",
    thumbnail: "👨‍👩‍👧‍👦",
    totalLessons: 4,
    completedLessons: 0,
    progress: 0,
    estimatedTime: 60,
    prerequisites: ["course-001", "course-003"],
    category: "phrases",
    lessons: [
      {
        id: "lesson-004-01",
        title: "Immediate Family",
        description: "Parents, siblings, and children",
        duration: 15,
        signs: ["FAMILY", "MOTHER", "FATHER", "SISTER", "BROTHER", "SON", "DAUGHTER"],
        completed: false,
      },
      {
        id: "lesson-004-02",
        title: "Extended Family",
        description: "Grandparents, aunts, uncles, and cousins",
        duration: 15,
        signs: ["GRANDMOTHER", "GRANDFATHER", "AUNT", "UNCLE", "COUSIN"],
        completed: false,
      },
      {
        id: "lesson-004-03",
        title: "Relationships",
        description: "Friends, partners, and acquaintances",
        duration: 15,
        signs: ["FRIEND", "BOYFRIEND", "GIRLFRIEND", "HUSBAND", "WIFE", "PARTNER"],
        completed: false,
      },
      {
        id: "lesson-004-04",
        title: "Describing People",
        description: "Age, appearance, and personality",
        duration: 15,
        signs: ["OLD", "YOUNG", "TALL", "SHORT", "NICE", "MEAN", "FUNNY"],
        completed: false,
      },
    ],
  },
  {
    id: "course-005",
    title: "Time & Scheduling",
    description: "Express time, days, months, and schedule-related concepts in ASL.",
    difficulty: "intermediate",
    thumbnail: "⏰",
    totalLessons: 5,
    completedLessons: 0,
    progress: 0,
    estimatedTime: 75,
    prerequisites: ["course-002", "course-003"],
    category: "phrases",
    lessons: [
      {
        id: "lesson-005-01",
        title: "Days of the Week",
        description: "Monday through Sunday",
        duration: 15,
        signs: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
        completed: false,
      },
      {
        id: "lesson-005-02",
        title: "Months of the Year",
        description: "All 12 months and seasonal references",
        duration: 15,
        signs: ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
        completed: false,
      },
      {
        id: "lesson-005-03",
        title: "Time Expressions",
        description: "Hours, minutes, morning, afternoon, night",
        duration: 15,
        signs: ["TIME", "HOUR", "MINUTE", "MORNING", "AFTERNOON", "EVENING", "NIGHT"],
        completed: false,
      },
      {
        id: "lesson-005-04",
        title: "Past, Present, Future",
        description: "Temporal references and tense",
        duration: 15,
        signs: ["NOW", "TODAY", "YESTERDAY", "TOMORROW", "PAST", "FUTURE", "BEFORE", "AFTER"],
        completed: false,
      },
      {
        id: "lesson-005-05",
        title: "Scheduling & Appointments",
        description: "Making plans and discussing schedules",
        duration: 15,
        signs: ["SCHEDULE", "APPOINTMENT", "MEETING", "BUSY", "FREE", "AVAILABLE", "CANCEL"],
        completed: false,
      },
    ],
  },
  {
    id: "course-006",
    title: "Food & Dining",
    description: "Vocabulary for meals, restaurants, and food preferences. Essential for social situations.",
    difficulty: "intermediate",
    thumbnail: "🍽️",
    totalLessons: 4,
    completedLessons: 0,
    progress: 0,
    estimatedTime: 60,
    prerequisites: ["course-003"],
    category: "phrases",
    lessons: [
      {
        id: "lesson-006-01",
        title: "Basic Foods",
        description: "Common foods and ingredients",
        duration: 15,
        signs: ["FOOD", "WATER", "MILK", "BREAD", "MEAT", "CHEESE", "EGG"],
        completed: false,
      },
      {
        id: "lesson-006-02",
        title: "Fruits & Vegetables",
        description: "Healthy foods and produce",
        duration: 15,
        signs: ["APPLE", "BANANA", "ORANGE", "CARROT", "TOMATO", "LETTUCE", "POTATO"],
        completed: false,
      },
      {
        id: "lesson-006-03",
        title: "Meals & Eating",
        description: "Breakfast, lunch, dinner, and eating actions",
        duration: 15,
        signs: ["BREAKFAST", "LUNCH", "DINNER", "EAT", "DRINK", "HUNGRY", "THIRSTY", "FULL"],
        completed: false,
      },
      {
        id: "lesson-006-04",
        title: "Restaurant & Preferences",
        description: "Ordering food and expressing preferences",
        duration: 15,
        signs: ["RESTAURANT", "MENU", "ORDER", "LIKE", "DON'T-LIKE", "DELICIOUS", "FAVORITE"],
        completed: false,
      },
    ],
  },
  {
    id: "course-007",
    title: "Conversational ASL",
    description: "Advanced conversation skills, storytelling, and natural signing flow. Build fluency.",
    difficulty: "advanced",
    thumbnail: "💬",
    totalLessons: 6,
    completedLessons: 0,
    progress: 0,
    estimatedTime: 120,
    prerequisites: ["course-003", "course-004", "course-005"],
    category: "conversation",
    lessons: [
      {
        id: "lesson-007-01",
        title: "Classifiers Basics",
        description: "Using classifiers to describe objects and actions",
        duration: 20,
        signs: ["CL:1", "CL:3", "CL:5", "CL:B", "CL:C"],
        completed: false,
      },
      {
        id: "lesson-007-02",
        title: "Directional Verbs",
        description: "Subject-object agreement in signing",
        duration: 20,
        signs: ["GIVE", "SEND", "TELL", "SHOW", "HELP", "ASK"],
        completed: false,
      },
      {
        id: "lesson-007-03",
        title: "Facial Grammar",
        description: "Using facial expressions for grammar",
        duration: 20,
        signs: ["RAISED-EYEBROWS", "FURROWED-BROW", "HEAD-NOD", "HEAD-SHAKE"],
        completed: false,
      },
      {
        id: "lesson-007-04",
        title: "Storytelling Techniques",
        description: "Narrative structure and role shifting",
        duration: 20,
        signs: ["STORY", "HAPPEN", "THEN", "FINISH", "CHARACTER", "QUOTE"],
        completed: false,
      },
      {
        id: "lesson-007-05",
        title: "Topic-Comment Structure",
        description: "Advanced sentence structures in ASL",
        duration: 20,
        signs: ["TOPIC", "COMMENT", "FOCUS", "EMPHASIS"],
        completed: false,
      },
      {
        id: "lesson-007-06",
        title: "Natural Conversation Flow",
        description: "Putting it all together with real dialogues",
        duration: 20,
        signs: ["CONVERSATION", "DISCUSS", "EXPLAIN", "UNDERSTAND", "AGREE", "DISAGREE"],
        completed: false,
      },
    ],
  },
  {
    id: "course-008",
    title: "ASL in Professional Settings",
    description: "Workplace vocabulary, professional etiquette, and business communication in ASL.",
    difficulty: "advanced",
    thumbnail: "💼",
    totalLessons: 5,
    completedLessons: 0,
    progress: 0,
    estimatedTime: 100,
    prerequisites: ["course-007"],
    category: "conversation",
    lessons: [
      {
        id: "lesson-008-01",
        title: "Workplace Basics",
        description: "Jobs, occupations, and work environments",
        duration: 20,
        signs: ["WORK", "JOB", "OFFICE", "BOSS", "COWORKER", "EMPLOYEE", "EMPLOYER"],
        completed: false,
      },
      {
        id: "lesson-008-02",
        title: "Meetings & Presentations",
        description: "Professional communication in group settings",
        duration: 20,
        signs: ["MEETING", "PRESENTATION", "REPORT", "DISCUSS", "DECIDE", "VOTE"],
        completed: false,
      },
      {
        id: "lesson-008-03",
        title: "Technology & Office",
        description: "Computer, phone, and office equipment vocabulary",
        duration: 20,
        signs: ["COMPUTER", "EMAIL", "PHONE", "PRINT", "COPY", "FAX", "INTERNET"],
        completed: false,
      },
      {
        id: "lesson-008-04",
        title: "Business Etiquette",
        description: "Professional politeness and formal communication",
        duration: 20,
        signs: ["PROFESSIONAL", "FORMAL", "INFORMAL", "RESPECT", "APPROPRIATE"],
        completed: false,
      },
      {
        id: "lesson-008-05",
        title: "Interviewing & Networking",
        description: "Job interviews and professional networking",
        duration: 20,
        signs: ["INTERVIEW", "RESUME", "SKILL", "EXPERIENCE", "QUALIFIED", "HIRE"],
        completed: false,
      },
    ],
  },
];

// Helper functions
export function getCourseById(id: string): Course | undefined {
  return MOCK_COURSES.find((course) => course.id === id);
}

export function getCoursesByDifficulty(difficulty: DifficultyLevel): Course[] {
  return MOCK_COURSES.filter((course) => course.difficulty === difficulty);
}

export function getCoursesByCategory(category: Course["category"]): Course[] {
  return MOCK_COURSES.filter((course) => course.category === category);
}

export function getRecommendedCourses(completedCourseIds: string[]): Course[] {
  return MOCK_COURSES.filter((course) => {
    // If course has no prerequisites, it's recommended
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return !completedCourseIds.includes(course.id);
    }
    // If all prerequisites are completed, it's recommended
    const prereqsMet = course.prerequisites.every((prereq) =>
      completedCourseIds.includes(prereq)
    );
    return prereqsMet && !completedCourseIds.includes(course.id);
  });
}

export function calculateOverallProgress(courses: Course[]): number {
  if (courses.length === 0) return 0;
  const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0);
  return Math.round(totalProgress / courses.length);
}

// Mock user progress data
export function createMockUserProgress(userId: string): UserProgress {
  return {
    userId,
    courseProgress: {
      "course-001": {
        completedLessons: ["lesson-001-01", "lesson-001-02"],
        currentLesson: "lesson-001-03",
        lastAccessed: new Date(Date.now() - 86400000), // 1 day ago
        overallScore: 85,
      },
      "course-003": {
        completedLessons: ["lesson-003-01"],
        currentLesson: "lesson-003-02",
        lastAccessed: new Date(Date.now() - 172800000), // 2 days ago
        overallScore: 78,
      },
    },
  };
}
