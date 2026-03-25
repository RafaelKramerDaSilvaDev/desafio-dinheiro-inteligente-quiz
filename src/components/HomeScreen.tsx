import { TitleBadge, Coin, CoinSmall, WaveHeader } from './icons';

interface HomeScreenProps {
  onStart: () => void;
  onAdmin: () => void;
}

export default function HomeScreen({ onStart, onAdmin }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-[100dvh] w-full text-center">
      {/* Header with logos */}
      <div className="relative w-full">
        <div className="bg-gradient-to-r from-primary-dark to-primary pt-4 pb-6 px-6">
          <div className="flex items-center justify-center gap-4">
            <img src="/logos/uno.svg" alt="UNO São Lourenço" className="h-10 w-auto brightness-0 invert" />
            <div className="w-px h-8 bg-white/30" />
            <img src="/logos/sicoob.png" alt="Sicoob" className="h-10 w-auto" />
          </div>
        </div>
        <WaveHeader className="w-full h-5 text-primary -mt-px" />
      </div>

      {/* Title area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative mb-6">
          {/* Floating coins */}
          <Coin size={38} className="absolute -top-5 -left-6 animate-bounce" />
          <Coin size={28} className="absolute -top-4 -right-7 animate-bounce [animation-delay:0.3s]" />
          <CoinSmall className="absolute -bottom-3 -left-5 animate-bounce [animation-delay:0.6s]" />
          <Coin size={32} className="absolute -bottom-5 -right-4 animate-bounce [animation-delay:0.9s]" />
          <CoinSmall className="absolute top-1/2 -left-9 -translate-y-1/2 animate-bounce [animation-delay:0.4s]" />
          <CoinSmall className="absolute top-1/3 -right-10 animate-bounce [animation-delay:0.7s]" />

          {/* Title badge SVG */}
          <TitleBadge className="w-72 sm:w-80 h-auto" />
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
        className="my-6 text-xs text-secondary/40 hover:text-secondary/70 transition-colors"
      >
        Configurações
      </button>
    </div>
  );
}
