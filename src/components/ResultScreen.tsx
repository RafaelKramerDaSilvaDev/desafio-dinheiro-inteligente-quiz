import { Trophy, Award, BookOpen, RotateCcw } from 'lucide-react';
import { WaveHeader, GiftBox } from './icons';

interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export default function ResultScreen({ score, total, onRestart }: ResultScreenProps) {
  const percentage = (score / total) * 100;

  let message: string;
  let subtitle: string;
  let Icon = BookOpen;

  if (percentage >= 80) {
    message = 'Parabéns!';
    subtitle = 'Você entende bem sobre educação financeira.';
    Icon = Trophy;
  } else if (percentage >= 50) {
    message = 'Muito bem!';
    subtitle = 'Você está no caminho certo para entender educação financeira.';
    Icon = Award;
  } else {
    message = 'Continue aprendendo!';
    subtitle = 'Educação financeira é uma jornada. Continue estudando!';
    Icon = BookOpen;
  }

  return (
    <div className="flex flex-col items-center min-h-[100dvh] w-full text-center">
      {/* Header - full width */}
      <div className="relative w-full">
        <div className="bg-gradient-to-b from-primary-darker to-primary-dark text-white pt-6 md:pt-8 pb-10 md:pb-12 px-8">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Icon size={28} className="text-amber-light" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold italic font-[family-name:var(--font-display)]">
            Seu Resultado
          </h2>
        </div>
        <WaveHeader className="w-full h-6 md:h-8 text-primary-dark -mt-px" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 py-6 md:py-8 w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        {/* Score circle */}
        <div className="mb-8 md:mb-10 animate-scale-in">
          <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={percentage >= 50 ? '#16a34a' : '#ef4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 2.64} 264`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-extrabold text-slate-800">{score}</span>
              <span className="text-sm md:text-base text-slate-400 font-medium">de {total}</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6 md:mb-8 animate-fade-in-up [animation-delay:0.2s]">
          <h3 className="text-primary text-3xl md:text-4xl font-extrabold italic mb-2 font-[family-name:var(--font-display)]">
            {message}
          </h3>
          <p className="text-slate-500 text-base md:text-lg max-w-xs md:max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Gift box */}
        {percentage >= 50 && (
          <div className="mb-6 md:mb-8 animate-fade-in-up [animation-delay:0.3s]">
            <GiftBox className="w-28 md:w-36 h-auto mx-auto animate-float" />
            <p className="text-primary-dark font-semibold text-sm md:text-base mt-3 bg-primary-50 px-4 py-2 rounded-xl">
              Retire seu brinde especial no estande!
            </p>
          </div>
        )}

        {/* Restart button */}
        <button
          onClick={onRestart}
          className="group bg-gradient-to-b from-primary to-primary-dark text-white font-bold text-lg md:text-xl px-10 md:px-14 py-4 md:py-5 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:from-primary-light hover:to-primary active:scale-95 border-b-4 border-primary-darker uppercase tracking-wider flex items-center gap-3 animate-fade-in-up [animation-delay:0.4s]"
        >
          <RotateCcw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
          Jogar Novamente
        </button>
      </div>
    </div>
  );
}
