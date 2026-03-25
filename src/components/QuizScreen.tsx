import { useState, useEffect } from 'react';
import type { Question, QuizState } from '../types';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (score: number) => void;
}

export default function QuizScreen({ questions, onFinish }: QuizScreenProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: new Array(questions.length).fill(null),
    score: 0,
    showFeedback: false,
    selectedOption: null,
  });

  const question = questions[state.currentQuestion];
  const total = questions.length;
  const progress = ((state.currentQuestion) / total) * 100;

  function handleSelect(index: number) {
    if (state.showFeedback) return;

    const isCorrect = index === question.correctIndex;
    const newScore = isCorrect ? state.score + 1 : state.score;
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestion] = index;

    setState({
      ...state,
      selectedOption: index,
      showFeedback: true,
      score: newScore,
      answers: newAnswers,
    });
  }

  useEffect(() => {
    if (!state.showFeedback) return;

    const timer = setTimeout(() => {
      if (state.currentQuestion + 1 >= total) {
        onFinish(state.score);
      } else {
        setState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          showFeedback: false,
          selectedOption: null,
        }));
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [state.showFeedback, state.currentQuestion, state.score, total, onFinish]);

  function getOptionClass(index: number) {
    const base =
      'w-full text-left px-5 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-3 text-sm sm:text-base';

    if (!state.showFeedback) {
      return `${base} bg-option-bg hover:bg-option-hover active:scale-[0.98] cursor-pointer`;
    }

    if (index === question.correctIndex) {
      return `${base} bg-correct ring-2 ring-correct/50`;
    }
    if (index === state.selectedOption && index !== question.correctIndex) {
      return `${base} bg-wrong ring-2 ring-wrong/50`;
    }
    return `${base} bg-option-bg opacity-50`;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary text-white py-4 px-6 rounded-b-2xl shadow-md">
        <h2 className="text-center text-lg font-bold">
          Pergunta <span className="text-accent-yellow">{state.currentQuestion + 1}</span>{' '}
          <span className="font-normal text-white/70">de {total}</span>
        </h2>
        {/* Progress bar */}
        <div className="mt-3 w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent-yellow to-accent-gold h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg w-full max-w-md mb-6">
          <p className="text-secondary text-lg sm:text-xl font-bold leading-snug">
            {question.text}
          </p>
        </div>

        {/* Options */}
        <div className="w-full max-w-md space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={getOptionClass(index)}
              disabled={state.showFeedback}
            >
              <span className="bg-white/20 rounded-lg w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">
                {option.label})
              </span>
              <span>{option.text}</span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {state.showFeedback && (
          <div
            className={`mt-6 px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg animate-bounce-in ${
              state.selectedOption === question.correctIndex
                ? 'bg-correct'
                : 'bg-wrong'
            }`}
          >
            {state.selectedOption === question.correctIndex ? (
              <span>✓ Correto!</span>
            ) : (
              <span>✗ Incorreto!</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
