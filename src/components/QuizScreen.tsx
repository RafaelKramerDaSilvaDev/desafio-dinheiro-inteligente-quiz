import { useState, useEffect } from 'react';
import type { Question, QuizState, QuizSession } from '../types';
import { saveSession } from '../store';
import { WaveHeader, CheckIcon, CrossIcon } from './icons';

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
        const sessionAnswers = state.answers.map((selected, i) => ({
          questionId: questions[i].id,
          questionText: questions[i].text,
          selectedIndex: selected ?? -1,
          correctIndex: questions[i].correctIndex,
        }));
        const session: QuizSession = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          score: state.score,
          total,
          answers: sessionAnswers,
        };
        saveSession(session);
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
      return `${base} bg-option-bg hover:bg-option-hover active:scale-[0.98] cursor-pointer shadow-md`;
    }

    if (index === question.correctIndex) {
      return `${base} bg-correct ring-2 ring-correct/50 shadow-lg`;
    }
    if (index === state.selectedOption && index !== question.correctIndex) {
      return `${base} bg-wrong ring-2 ring-wrong/50 shadow-lg`;
    }
    return `${base} bg-option-bg opacity-50`;
  }

  return (
    <div className="flex flex-col min-h-[100dvh] w-full">
      {/* Header with wave */}
      <div className="relative">
        <div className="bg-gradient-to-r from-primary-dark to-primary text-white pt-5 pb-8 px-6">
          <h2 className="text-center text-lg font-bold">
            Pergunta <span className="text-accent-yellow text-2xl">{state.currentQuestion + 1}</span>{' '}
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
        <WaveHeader className="w-full h-5 text-primary -mt-px" />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg w-full max-w-md mb-6 border border-white/50">
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
            className={`mt-6 px-6 py-3 rounded-xl text-white font-bold text-lg shadow-lg flex items-center gap-2 ${
              state.selectedOption === question.correctIndex
                ? 'bg-correct'
                : 'bg-wrong'
            }`}
          >
            {state.selectedOption === question.correctIndex ? (
              <>
                <CheckIcon className="w-6 h-6" />
                <span>Correto!</span>
              </>
            ) : (
              <>
                <CrossIcon className="w-6 h-6" />
                <span>Incorreto!</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
