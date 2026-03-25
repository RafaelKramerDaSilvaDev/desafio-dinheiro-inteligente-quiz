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
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 py-8 text-center">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary text-white py-4 px-8 rounded-2xl shadow-md mb-8 w-full max-w-sm">
        <h2 className="text-2xl font-extrabold">Seu Resultado</h2>
      </div>

      {/* Score */}
      <div className="mb-6">
        <p className="text-secondary text-xl font-bold mb-1">Você acertou</p>
        <p className="text-5xl font-extrabold">
          <span className="text-primary-light">{score}</span>
          <span className="text-secondary/60 text-2xl font-bold"> de </span>
          <span className="text-secondary">{total}</span>
        </p>
        <p className="text-secondary text-xl font-bold mt-1">perguntas!</p>
      </div>

      {/* Message */}
      <div className="mb-8">
        <h3 className="text-primary text-3xl font-extrabold mb-2">{message}</h3>
        <p className="text-secondary/80 text-base max-w-xs mx-auto">{subtitle}</p>
      </div>

      {/* Gift icon */}
      {percentage >= 50 && (
        <div className="mb-6 relative">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-accent-yellow/30 blur-xl rounded-full scale-150" />
            {/* Gift box */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="relative">
                {/* Ribbon */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-accent-gold rounded-full border-2 border-accent-yellow" />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-accent-gold" />
                {/* Box */}
                <div className="w-16 h-14 bg-primary rounded-lg border-2 border-primary-light relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-accent-gold/50" />
                  <div className="absolute top-0 left-0 w-full h-2 bg-primary-light" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-primary-dark font-semibold text-sm mt-4">
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
  );
}
