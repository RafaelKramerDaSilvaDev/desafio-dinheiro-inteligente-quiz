export interface Option {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface PlayAnswer {
  questionId: string;
  questionText: string;
  selectedIndex: number;
  correctIndex: number;
}

export interface Play {
  id: string;
  date: string;
  score: number;
  total: number;
  answers: PlayAnswer[];
}

export interface Session {
  id: string;
  name: string;
  quizId: string;
  quizName: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  plays: Play[];
}

export type Screen = 'home' | 'quiz' | 'result' | 'admin';

export interface QuizState {
  currentQuestion: number;
  answers: (number | null)[];
  score: number;
  showFeedback: boolean;
  selectedOption: number | null;
}
