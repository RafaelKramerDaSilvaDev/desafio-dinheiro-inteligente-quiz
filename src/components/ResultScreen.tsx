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

  if (percentage >= 80) {
    message = 'Parabéns!';
    subtitle = 'Você entende bem sobre educação financeira.';
  } else if (percentage >= 50) {
    message = 'Muito bem!';
    subtitle = 'Você está no caminho certo para entender educação financeira.';
  } else {
    message = 'Continue aprendendo!';
    subtitle = 'Educação financeira é uma jornada. Continue estudando!';
  }

  return (
    <div className="flex flex-col items-center min-h-[100dvh] w-full text-center">
      {/* Header with wave */}
      <div className="relative w-full">
        <div className="bg-gradient-to-r from-primary-dark to-primary text-white pt-6 pb-8 px-8">
          <h2 className="text-2xl font-extrabold italic">Seu Resultado</h2>
        </div>
        <WaveHeader className="w-full h-5 text-primary -mt-px" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        {/* Score */}
        <div className="mb-6">
          <p className="text-secondary text-xl font-bold mb-1">Você acertou</p>
          <p className="text-5xl font-extrabold">
            <span className="text-primary-light">{score}</span>
            <span className="text-secondary/50 text-2xl font-bold"> de </span>
            <span className="text-secondary">{total}</span>
          </p>
          <p className="text-secondary text-xl font-bold mt-1">perguntas!</p>
        </div>

        {/* Message */}
        <div className="mb-6">
          <h3 className="text-primary text-3xl font-extrabold italic mb-2">{message}</h3>
          <p className="text-secondary/80 text-base max-w-xs mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Gift box SVG */}
        {percentage >= 50 && (
          <div className="mb-6">
            <GiftBox className="w-32 h-auto mx-auto" />
            <p className="text-primary-dark font-semibold text-sm mt-2">
              Retire seu brinde especial no estande!
            </p>
          </div>
        )}

        {/* Restart button */}
        <button
          onClick={onRestart}
          className="bg-gradient-to-b from-primary-light to-primary text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:from-primary hover:to-primary-dark active:scale-95 transition-all duration-150 border-b-4 border-primary-dark uppercase tracking-wide"
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  );
}
