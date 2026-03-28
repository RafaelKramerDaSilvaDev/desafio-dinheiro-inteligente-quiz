import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, XCircle, Timer } from 'lucide-react';
import type { Question, QuizState, Play } from '../types';
import { addPlayToSession, getTimerSeconds } from '../store';
import { WaveHeader } from './icons';
import ConfirmModal from './ConfirmModal';

interface QuizScreenProps {
  questions: Question[];
  sessionId: string;
  onFinish: (score: number) => void;
  onQuit: () => void;
}

export default function QuizScreen({ questions, sessionId, onFinish, onQuit }: QuizScreenProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: new Array(questions.length).fill(null),
    score: 0,
    showFeedback: false,
    selectedOption: null,
  });
  const [showQuitModal, setShowQuitModal] = useState(false);

  const timerSeconds = getTimerSeconds();
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = questions[state.currentQuestion];
  const total = questions.length;
  const progress = ((state.currentQuestion) / total) * 100;

  const handleSelect = useCallback((index: number | null) => {
    if (state.showFeedback) return;

    const isCorrect = index !== null && index === question.correctIndex;
    const newScore = isCorrect ? state.score + 1 : state.score;
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestion] = index ?? -1;

    setState(prev => ({
      ...prev,
      selectedOption: index,
      showFeedback: true,
      score: newScore,
      answers: newAnswers,
    }));
  }, [state.showFeedback, state.score, state.answers, state.currentQuestion, question.correctIndex]);

  useEffect(() => {
    if (timerSeconds <= 0 || state.showFeedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSelect(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.currentQuestion, state.showFeedback, timerSeconds, handleSelect]);

  useEffect(() => {
    setTimeLeft(timerSeconds);
  }, [state.currentQuestion, timerSeconds]);

  useEffect(() => {
    if (state.showFeedback && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [state.showFeedback]);

  useEffect(() => {
    if (!state.showFeedback) return;

    const timer = setTimeout(() => {
      if (state.currentQuestion + 1 >= total) {
        const play: Play = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          score: state.score,
          total,
          answers: state.answers.map((selected, i) => ({
            questionId: questions[i].id,
            questionText: questions[i].text,
            selectedIndex: selected ?? -1,
            correctIndex: questions[i].correctIndex,
          })),
        };
        addPlayToSession(sessionId, play);
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
  }, [state.showFeedback, state.currentQuestion, state.score, total, onFinish, sessionId, questions, state.answers]);

  function getOptionClass(index: number) {
    const base =
      'w-full text-left px-5 md:px-6 py-4 md:py-5 rounded-2xl font-semibold text-white flex items-center gap-3 text-sm sm:text-base md:text-lg';

    if (!state.showFeedback) {
      return `${base} bg-option-bg hover:bg-option-hover active:scale-[0.98] cursor-pointer shadow-md hover:shadow-lg`;
    }

    if (index === question.correctIndex) {
      return `${base} bg-correct ring-2 ring-correct/30 shadow-lg`;
    }
    if (index === state.selectedOption && index !== question.correctIndex) {
      return `${base} bg-wrong ring-2 ring-wrong/30 shadow-lg`;
    }
    return `${base} bg-option-bg/50`;
  }

  const timerPercent = timerSeconds > 0 ? (timeLeft / timerSeconds) * 100 : 100;
  const timerColor = timerPercent > 50 ? 'text-white' : timerPercent > 25 ? 'text-amber-light' : 'text-red-400';

  return (
    <div className="flex flex-col min-h-[100dvh] w-full">
      <div className="relative w-full">
        <div className="bg-gradient-to-b from-primary-darker to-primary-dark text-white pt-4 md:pt-6 pb-8 md:pb-10 px-4 md:px-6">
          <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowQuitModal(true)}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium"
              >
                <X size={18} />
                <span className="hidden sm:inline">Sair</span>
              </button>
              <h2 className="text-base md:text-lg font-bold">
                Pergunta{' '}
                <span className="text-amber-light text-xl md:text-2xl font-extrabold">
                  {state.currentQuestion + 1}
                </span>{' '}
                <span className="font-normal text-white/60">de {total}</span>
              </h2>
              {timerSeconds > 0 ? (
                <div className={`flex items-center gap-1 font-bold text-lg md:text-xl ${timerColor}`}>
                  <Timer size={18} />
                  <span>{timeLeft}s</span>
                </div>
              ) : (
                <div className="w-10" />
              )}
            </div>
            <div className="w-full bg-white/15 rounded-full h-2.5 md:h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-light to-amber h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <WaveHeader className="w-full h-6 md:h-8 text-primary-dark -mt-px" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-5 md:py-8 w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        <div className="glass rounded-2xl p-5 md:p-7 shadow-lg w-full mb-5 md:mb-7 animate-fade-in-up">
          <p className="text-slate-800 text-lg sm:text-xl md:text-2xl font-bold leading-snug font-[family-name:var(--font-display)]">
            {question.text}
          </p>
        </div>

        {timerSeconds > 0 && (
          <div className="w-full h-1.5 bg-slate-200 rounded-full mb-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 linear ${
                timerPercent > 50 ? 'bg-primary' : timerPercent > 25 ? 'bg-amber' : 'bg-wrong'
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        )}

        <div className="w-full space-y-3 md:space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={getOptionClass(index)}
              disabled={state.showFeedback}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="bg-white/15 rounded-xl w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-sm md:text-base font-bold shrink-0">
                {option.label})
              </span>
              <span className="flex-1">{option.text}</span>
              {state.showFeedback && index === question.correctIndex && (
                <Check size={20} className="text-white shrink-0" />
              )}
              {state.showFeedback && index === state.selectedOption && index !== question.correctIndex && (
                <XCircle size={20} className="text-white shrink-0" />
              )}
            </button>
          ))}
        </div>

        {state.showFeedback && (
          <div
            className={`mt-5 md:mt-7 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-white font-bold text-base md:text-lg shadow-lg flex items-center gap-2 animate-scale-in ${
              state.selectedOption !== null && state.selectedOption === question.correctIndex
                ? 'bg-correct'
                : 'bg-wrong'
            }`}
          >
            {state.selectedOption !== null && state.selectedOption === question.correctIndex ? (
              <>
                <Check size={22} />
                <span>Correto!</span>
              </>
            ) : (
              <>
                <XCircle size={22} />
                <span>{state.selectedOption === null ? 'Tempo esgotado!' : 'Incorreto!'}</span>
              </>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        open={showQuitModal}
        title="Sair do Quiz?"
        message="Seu progresso será perdido. Tem certeza que deseja sair?"
        confirmLabel="Sim, sair"
        cancelLabel="Continuar"
        variant="warning"
        onConfirm={onQuit}
        onCancel={() => setShowQuitModal(false)}
      />
    </div>
  );
}
