export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number; // in seconds
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Participant {
  id: string;
  name: string;
  score: number;
  lastAnswerCorrect?: boolean;
  streak: number;
}

export type AppState = 'landing' | 'join' | 'lobby' | 'quiz' | 'results' | 'moderator';
