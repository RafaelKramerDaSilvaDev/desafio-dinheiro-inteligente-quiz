import { Play, Settings } from 'lucide-react';
import { Coin, CoinSmall, TitleBadge, WaveHeader } from './icons';

interface HomeScreenProps {
  sessionName?: string;
  quizName?: string;
  onStart: () => void;
  onAdmin: () => void;
}

export default function HomeScreen({ sessionName, quizName, onStart, onAdmin }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-[100dvh] w-full text-center">
      <div className="relative w-full">
        <div className="bg-gradient-to-b from-primary-darker to-primary-dark pt-5 md:pt-7 lg:pt-8 pb-8 md:pb-10 px-6">
          <div className="flex items-center justify-center gap-5 md:gap-7">
            <img
              src="/logos/uno.png"
              alt="UNO São Lourenço"
              className="h-11 md:h-14 lg:h-16 w-auto brightness-0 invert"
            />
            <div className="w-px h-9 md:h-12 bg-white/20" />
            <img src="/logos/sicoob.png" alt="Sicoob" className="h-9 md:h-11 lg:h-13 w-auto" />
          </div>
        </div>
        <WaveHeader className="w-full h-6 md:h-8 text-primary-dark -mt-px" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        <div className="relative mb-8 md:mb-10 animate-fade-in-up">
          <Coin size={38} className="absolute -top-5 -left-6 animate-float" />
          <Coin size={28} className="absolute -top-4 -right-7 animate-float [animation-delay:0.8s]" />
          <CoinSmall className="absolute -bottom-3 -left-5 animate-float [animation-delay:1.6s]" />
          <Coin size={32} className="absolute -bottom-5 -right-4 animate-float [animation-delay:0.4s]" />
          <CoinSmall className="absolute top-1/2 -left-9 -translate-y-1/2 animate-float [animation-delay:1.2s]" />
          <CoinSmall className="absolute top-1/3 -right-10 animate-float [animation-delay:2s]" />
          <TitleBadge className="w-72 sm:w-80 md:w-96 lg:w-[28rem]" />
        </div>

        {sessionName && (
          <div className="mb-2 animate-fade-in-up [animation-delay:0.1s]">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary-dark text-xs md:text-sm font-semibold tracking-wide">
              {sessionName}
            </span>
          </div>
        )}

        {quizName && (
          <div className="mb-3 animate-fade-in-up [animation-delay:0.12s]">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] md:text-xs font-medium">
              {quizName}
            </span>
          </div>
        )}

        <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-xs md:max-w-sm leading-relaxed mb-8 md:mb-10 animate-fade-in-up [animation-delay:0.15s]">
          Teste seus conhecimentos sobre{' '}
          <strong className="text-primary-dark">educação financeira</strong> e ganhe brindes!
        </p>

        <button
          id="btn-start"
          onClick={onStart}
          disabled={!sessionName}
          className={`group relative font-bold text-lg md:text-xl px-10 md:px-14 py-4 md:py-5 rounded-2xl uppercase tracking-wider flex items-center gap-3 animate-fade-in-up [animation-delay:0.2s] ${
            sessionName
              ? 'bg-gradient-to-b from-primary to-primary-dark text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:from-primary-light hover:to-primary active:scale-95 border-b-4 border-primary-darker animate-pulse-glow'
              : 'bg-slate-300 text-white/70 border-b-4 border-slate-400 cursor-not-allowed'
          }`}
        >
          <Play size={22} className="fill-white" />
          Começar o Desafio
        </button>

        {!sessionName && (
          <p className="mt-4 text-sm text-slate-400 animate-fade-in-up [animation-delay:0.25s]">
            Nenhuma sessão configurada. Acesse as <strong className="text-slate-500">Configurações</strong> para criar uma.
          </p>
        )}
      </div>

      <button
        onClick={onAdmin}
        className="my-6 flex items-center gap-1.5 text-xs md:text-sm text-slate-400 hover:text-slate-600"
      >
        <Settings size={14} />
        Configurações
      </button>
    </div>
  );
}
