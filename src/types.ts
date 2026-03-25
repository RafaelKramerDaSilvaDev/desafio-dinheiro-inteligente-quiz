export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctIndex: number;
}

export interface Option {
  label: string;
  text: string;
}

export type Screen = 'home' | 'quiz' | 'result' | 'admin';

export interface QuizState {
  currentQuestion: number;
  answers: (number | null)[];
  score: number;
  showFeedback: boolean;
  selectedOption: number | null;
}
