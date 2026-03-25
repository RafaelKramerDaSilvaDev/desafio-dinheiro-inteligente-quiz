interface HomeScreenProps {
  onStart: () => void;
  onAdmin: () => void;
}

export default function HomeScreen({ onStart, onAdmin }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full px-6 py-8 text-center">
      {/* Header logos */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-white font-bold text-lg tracking-wide bg-primary rounded px-3 py-1">
          UNO
          <span className="block text-[10px] font-normal -mt-1">SÃO LOURENÇO</span>
        </span>
        <div className="w-px h-8 bg-white/50" />
        <span className="text-primary font-bold text-lg">
          ✦ SICOOB
        </span>
      </div>

      {/* Title area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="bg-gradient-to-b from-primary to-primary-dark rounded-2xl px-8 py-6 shadow-lg border-2 border-accent-gold relative">
            {/* Coins decoration */}
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-accent-yellow rounded-full border-2 border-accent-gold shadow-md flex items-center justify-center text-xs font-bold text-primary-dark">$</div>
            <div className="absolute -top-2 -right-4 w-6 h-6 bg-accent-yellow rounded-full border-2 border-accent-gold shadow-md flex items-center justify-center text-[10px] font-bold text-primary-dark">$</div>
            <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-accent-yellow rounded-full border-2 border-accent-gold shadow-md flex items-center justify-center text-[9px] font-bold text-primary-dark">$</div>
            <div className="absolute -bottom-3 right-2 w-7 h-7 bg-accent-yellow rounded-full border-2 border-accent-gold shadow-md flex items-center justify-center text-[11px] font-bold text-primary-dark">$</div>

            <h1 className="text-white text-sm font-medium tracking-widest uppercase mb-1">
              Desafio do
            </h1>
            <h2 className="text-accent-yellow text-3xl sm:text-4xl font-extrabold leading-tight drop-shadow-md">
              DINHEIRO
            </h2>
            <h2 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow-md">
              INTELIGENTE
            </h2>
          </div>
        </div>

        <p className="text-secondary text-base sm:text-lg max-w-xs leading-relaxed mb-8">
          Teste seus conhecimentos sobre{' '}
          <strong>educação financeira</strong> e ganhe brindes!
        </p>

        <button
          id="btn-start"
          onClick={onStart}
          className="bg-gradient-to-b from-primary-light to-primary text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:from-primary hover:to-primary-dark active:scale-95 transition-all duration-150 border-b-4 border-primary-dark uppercase tracking-wide"
        >
          Começar o Desafio
        </button>
      </div>

      {/* Admin link */}
      <button
        onClick={onAdmin}
        className="mt-8 text-xs text-secondary/40 hover:text-secondary/70 transition-colors"
      >
        Configurações
      </button>
    </div>
  );
}
