export function LogoUno({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 50" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="50" rx="6" fill="#0d4a24" />
      <text x="60" y="28" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#ffffff" letterSpacing="2">
        UNO
      </text>
      <text x="60" y="43" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="9" fill="#a8d5ba" letterSpacing="1.5">
        SÃO LOURENÇO
      </text>
    </svg>
  );
}

export function LogoSicoob({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 50" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Sicoob arrow/checkmark icon */}
      <g transform="translate(8, 8)">
        <path d="M16 0 L6 17 L0 11" fill="none" stroke="#e8b710" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 10 L22 27 L28 21" fill="none" stroke="#0d5e2e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="48" y="33" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="22" fill="#0d5e2e" letterSpacing="1.5">
        SICOOB
      </text>
    </svg>
  );
}

export function Coin({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`coinGrad${size}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="50%" stopColor="#f5d442" />
          <stop offset="100%" stopColor="#c9960c" />
        </radialGradient>
        <radialGradient id={`coinShine${size}`} cx="30%" cy="25%" r="30%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="21" cy="22" rx="16" ry="16" fill="rgba(0,0,0,0.15)" />
      {/* Coin body */}
      <circle cx="20" cy="20" r="16" fill={`url(#coinGrad${size})`} />
      {/* Inner ring */}
      <circle cx="20" cy="20" r="13" fill="none" stroke="#c9960c" strokeWidth="1" opacity="0.5" />
      {/* Dollar sign */}
      <text x="20" y="26" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="#8b6914">
        $
      </text>
      {/* Shine */}
      <circle cx="20" cy="20" r="16" fill={`url(#coinShine${size})`} />
      {/* Edge highlight */}
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#ffe680" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

export function CoinSmall({ className = '' }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="coinSmGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="50%" stopColor="#f5d442" />
          <stop offset="100%" stopColor="#c9960c" />
        </radialGradient>
      </defs>
      <ellipse cx="15" cy="15.5" rx="11" ry="11" fill="rgba(0,0,0,0.12)" />
      <circle cx="14" cy="14" r="11" fill="url(#coinSmGrad)" />
      <circle cx="14" cy="14" r="9" fill="none" stroke="#c9960c" strokeWidth="0.7" opacity="0.5" />
      <text x="14" y="19" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12" fill="#8b6914">$</text>
    </svg>
  );
}

export function GiftBox({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 160" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="giftGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5d442" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#f5d442" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f5d442" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a8c45" />
          <stop offset="100%" stopColor="#0d5e2e" />
        </linearGradient>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22a854" />
          <stop offset="100%" stopColor="#1a8c45" />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4a017" />
          <stop offset="50%" stopColor="#f5d442" />
          <stop offset="100%" stopColor="#d4a017" />
        </linearGradient>
      </defs>

      {/* Glow behind gift */}
      <ellipse cx="70" cy="110" rx="65" ry="50" fill="url(#giftGlow)" />

      {/* Sparkle rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1="70"
          y1="75"
          x2={70 + Math.cos((angle * Math.PI) / 180) * (i % 2 === 0 ? 55 : 40)}
          y2={75 + Math.sin((angle * Math.PI) / 180) * (i % 2 === 0 ? 55 : 40)}
          stroke="#f5d442"
          strokeWidth={i % 2 === 0 ? 2 : 1}
          opacity={i % 2 === 0 ? 0.4 : 0.2}
          strokeLinecap="round"
        />
      ))}

      {/* Box body */}
      <rect x="25" y="80" width="90" height="65" rx="6" fill="url(#boxGrad)" />

      {/* Box lid */}
      <rect x="20" y="68" width="100" height="20" rx="5" fill="url(#lidGrad)" />

      {/* Vertical ribbon */}
      <rect x="62" y="68" width="16" height="77" fill="url(#ribbonGrad)" opacity="0.85" />

      {/* Horizontal ribbon */}
      <rect x="20" y="73" width="100" height="10" fill="url(#ribbonGrad)" opacity="0.85" rx="2" />

      {/* Ribbon cross center */}
      <rect x="62" y="73" width="16" height="10" fill="#f5d442" />

      {/* Bow - left loop */}
      <ellipse cx="55" cy="60" rx="18" ry="14" fill="#f5d442" transform="rotate(-20 55 60)" />
      <ellipse cx="55" cy="60" rx="12" ry="9" fill="url(#lidGrad)" transform="rotate(-20 55 60)" />

      {/* Bow - right loop */}
      <ellipse cx="85" cy="60" rx="18" ry="14" fill="#f5d442" transform="rotate(20 85 60)" />
      <ellipse cx="85" cy="60" rx="12" ry="9" fill="url(#lidGrad)" transform="rotate(20 85 60)" />

      {/* Bow - center knot */}
      <ellipse cx="70" cy="65" rx="8" ry="7" fill="#d4a017" />
      <ellipse cx="70" cy="64" rx="6" ry="5" fill="#f5d442" />

      {/* Shine on box */}
      <rect x="28" y="82" width="8" height="50" rx="4" fill="white" opacity="0.08" />
    </svg>
  );
}

export function WaveHeader({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 30"
      preserveAspectRatio="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 0 L400 0 L400 10 Q300 30 200 15 Q100 0 0 20 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TitleBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 160" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="badgeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a8c45" />
          <stop offset="40%" stopColor="#0d5e2e" />
          <stop offset="100%" stopColor="#073d1c" />
        </linearGradient>
        <filter id="badgeShadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Badge shape */}
      <rect x="15" y="10" width="270" height="140" rx="18" fill="url(#badgeGrad)" filter="url(#badgeShadow)" />

      {/* Subtle inner border */}
      <rect x="20" y="15" width="260" height="130" rx="15" fill="none" stroke="#2aad5a" strokeWidth="1" opacity="0.3" />

      {/* Top decorative line */}
      <rect x="80" y="20" width="140" height="2" rx="1" fill="#2aad5a" opacity="0.3" />

      {/* Text: DESAFIO DO */}
      <text x="150" y="55" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="18" fill="#d0e8d8" letterSpacing="5">
        DESAFIO DO
      </text>

      {/* Text: DINHEIRO */}
      <text x="150" y="95" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="42" fill="#f5d442">
        <tspan filter="url(#badgeShadow)">DINHEIRO</tspan>
      </text>

      {/* Text: INTELIGENTE */}
      <text x="150" y="135" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="32" fill="#ffffff">
        INTELIGENTE
      </text>

      {/* Bottom decorative line */}
      <rect x="80" y="143" width="140" height="2" rx="1" fill="#2aad5a" opacity="0.3" />
    </svg>
  );
}

export function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#28a745" />
      <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CrossIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#dc3545" />
      <path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
