// types.ts

export interface Lesson {
  id: string;
  title: string;
  description: string;
  explanation: string;
  examples: Array<{
    question: string;
    steps: string[];
    result: string;
  }>;
  interactiveType?: 'sets' | 'integers' | 'percentage' | 'algebra' | 'geometry' | 'pythagoras';
  interactiveData?: any;
  realWorldProblems?: Array<{
    scenario: string; // Real world context, e.g., "في مشروع الجزيرة الزراعي..."
    question: string; // The math question
    answer: string; // The final answer
    explanation: string; // How we solved it in real life
  }>;
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  icon: string;
  color: string;
  lessons: Lesson[];
  quizzes: Question[];
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  type: 'multiple-choice' | 'boolean' | 'fill-in';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  pointsReward: number;
  maxProgress: number;
  currentProgress: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'alert' | 'parent-goal';
}

export interface StudentProgress {
  points: number;
  stars: number;
  streak: number;
  level: number;
  completedLessons: string[]; // lesson ids
  unitScores: { [unitId: string]: number }; // percentage max score
  completedQuizzes: { [quizId: string]: number }; // score out of total
  lastStudyDate: string;
}

export interface ParentGoal {
  id: string;
  goalText: string;
  targetUnitId: string;
  targetPoints: number;
  completed: boolean;
  createdAt: string;
}
