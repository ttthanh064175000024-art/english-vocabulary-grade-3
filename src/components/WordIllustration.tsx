import React from 'react';

interface Props {
  iconName: string;
  className?: string;
  badgeEmoji?: string;
}

export const WordIllustration: React.FC<Props> = ({ iconName, className = 'w-48 h-48', badgeEmoji }) => {
  // Renders rich, friendly child-themed SVG illustrations
  const renderSvg = () => {
    switch (iconName) {
      // School things
      case 'book':
        return (
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-md">
            <circle cx="80" cy="80" r="72" fill="#FEF3C7" />
            {/* Book spine & pages */}
            <path d="M30 46C44 42 66 43 80 48C94 43 116 42 130 46V118C116 114 94 115 80 120C66 115 44 114 30 118V46Z" fill="#F59E0B" />
            <path d="M32 50C45 46 66 47 80 52C94 47 115 46 128 50V114C115 110 94 111 80 116C66 111 45 110 32 114V50Z" fill="#FFFFFF" />
            <path d="M80 52V116" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
            {/* Bookmark ribbon */}
            <path d="M80 52V76L87 70L94 76V50" fill="#EF4444" />
            {/* Page lines */}
            <line x1="42" y1="64" x2="70" y2="66" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="76" x2="68" y2="78" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="88" x2="65" y2="90" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="90" y1="66" x2="118" y2="64" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="90" y1="78" x2="118" y2="76" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="90" y1="90" x2="112" y2="88" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
            {/* Cute eyes */}
            <circle cx="55" cy="74" r="4" fill="#1E293B" />
            <circle cx="105" cy="74" r="4" fill="#1E293B" />
            <circle cx="56" cy="73" r="1.5" fill="#FFFFFF" />
            <circle cx="106" cy="73" r="1.5" fill="#FFFFFF" />
            <path d="M74 88C78 92 82 92 86 88" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'pen':
        return (
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-md">
            <circle cx="80" cy="80" r="72" fill="#DBEAFE" />
            {/* Pen body angled */}
            <g transform="rotate(-35 80 80)">
              <rect x="70" y="32" width="20" height="74" rx="4" fill="#2563EB" />
              <rect x="74" y="36" width="12" height="66" rx="2" fill="#3B82F6" />
              {/* Pen clip */}
              <rect x="64" y="38" width="6" height="34" rx="2" fill="#93C5FD" />
              <circle cx="67" cy="72" r="3" fill="#93C5FD" />
              {/* Pen grip */}
              <rect x="70" y="86" width="20" height="22" fill="#1D4ED8" />
              <line x1="70" y1="92" x2="90" y2="92" stroke="#60A5FA" strokeWidth="1.5" />
              <line x1="70" y1="98" x2="90" y2="98" stroke="#60A5FA" strokeWidth="1.5" />
              <line x1="70" y1="104" x2="90" y2="104" stroke="#60A5FA" strokeWidth="1.5" />
              {/* Nib cone */}
              <polygon points="70,108 90,108 80,128" fill="#CBD5E1" />
              <polygon points="77,122 83,122 80,128" fill="#0F172A" />
              {/* Sparkle */}
              <circle cx="68" cy="28" r="4" fill="#FBBF24" />
            </g>
          </svg>
        );

      case 'pencil':
        return (
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-md">
            <circle cx="80" cy="80" r="72" fill="#DCFCE7" />
            <g transform="rotate(40 80 80)">
              {/* Eraser */}
              <path d="M70 28H90V40H70V28Z" fill="#F43F5E" />
              <path d="M70 28C70 24 75 22 80 22C85 22 90 24 90 28V30H70V28Z" fill="#FB7185" />
              {/* Metal collar */}
              <rect x="69" y="40" width="22" height="10" fill="#94A3B8" />
              <line x1="69" y1="44" x2="91" y2="44" stroke="#64748B" strokeWidth="1.5" />
              <line x1="69" y1="47" x2="91" y2="47" stroke="#64748B" strokeWidth="1.5" />
              {/* Wooden shaft */}
              <rect x="70" y="50" width="20" height="64" fill="#FBBF24" />
              <rect x="76" y="50" width="8" height="64" fill="#F59E0B" />
              {/* Wooden tip */}
              <polygon points="70,114 90,114 80,132" fill="#FDE68A" />
              {/* Graphite tip */}
              <polygon points="77,126 83,126 80,132" fill="#334155" />
            </g>
          </svg>
        );

      case 'ruler':
        return (
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-md">
            <circle cx="80" cy="80" r="72" fill="#FCE7F3" />
            <g transform="rotate(-20 80 80)">
              <rect x="30" y="65" width="100" height="30" rx="4" fill="#EC4899" />
              <rect x="33" y="68" width="94" height="24" rx="2" fill="#F472B6" />
              {/* Tick marks */}
              {[40, 50, 60, 70, 80, 90, 100, 110, 120].map((x, i) => (
                <React.Fragment key={x}>
                  <line x1={x} y1="68" x2={x} y2={i % 2 === 0 ? "80" : "75"} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  {i % 2 === 0 && (
                    <text x={x - 2} y="88" fontSize="8" fill="#FFFFFF" fontWeight="bold">{i / 2 + 1}</text>
                  )}
                </React.Fragment>
              ))}
            </g>
          </svg>
        );

      case 'rubber':
        return (
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-md">
            <circle cx="80" cy="80" r="72" fill="#EDE9FE" />
            {/* Rubber with sleeve */}
            <g transform="rotate(15 80 80)">
              {/* Pink eraser exposed part */}
              <rect x="45" y="55" width="70" height="48" rx="8" fill="#F43F5E" />
              {/* White/Blue sleeve cover */}
              <rect x="65" y="53" width="52" height="52" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
              <line x1="80" y1="55" x2="80" y2="103" stroke="#60A5FA" strokeWidth="3" />
              <text x="76" y="83" fontSize="14" fontWeight="bold" fill="#FFFFFF" transform="rotate(-90 80 80)">RUBBER</text>
              {/* Cute smile on the pink tip */}
              <circle cx="54" cy="72" r="2.5" fill="#881337" />
              <circle cx="54" cy="84" r="2.5" fill="#881337" />
              <path d="M50 78C47 80 47 81 50 83" stroke="#881337" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'pencil-case':
        return (
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-md">
            <circle cx="80" cy="80" r="72" fill="#CFFAFE" />
            {/* Zippered pouch */}
            <rect x="30" y="55" width="100" height="52" rx="14" fill="#06B6D4" />
            <rect x="34" y="60" width="92" height="42" rx="10" fill="#22D3EE" />
            {/* Zipper top */}
            <line x1="38" y1="58" x2="122" y2="58" stroke="#0891B2" strokeWidth="4" strokeDasharray="3 3" />
            <circle cx="44" cy="58" r="6" fill="#F59E0B" />
            <circle cx="44" cy="58" r="2.5" fill="#FEF3C7" />
            {/* Heart badge */}
            <path d="M80 82C78 78 72 78 72 82C72 86 80 91 80 91C80 91 88 86 88 82C88 78 82 78 80 82Z" fill="#F43F5E" />
            {/* Cute pencils peeking out slightly */}
            <rect x="46" y="44" width="8" height="14" rx="2" fill="#F59E0B" />
            <polygon points="46,44 54,44 50,38" fill="#FDE68A" />
            <rect x="58" y="46" width="8" height="12" rx="2" fill="#EC4899" />
            <polygon points="58,46 66,46 62,40" fill="#FDE68A" />
          </svg>
        );

      case 'school-bag':
        return (
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-md">
            <circle cx="80" cy="80" r="72" fill="#FFEDD5" />
            {/* Backpack handle */}
            <path d="M64 48C64 36 96 36 96 48" stroke="#C2410C" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Main bag body */}
            <rect x="42" y="46" width="76" height="78" rx="20" fill="#EA580C" />
            <rect x="48" y="52" width="64" height="70" rx="16" fill="#F97316" />
            {/* Front pocket */}
            <rect x="52" y="78" width="56" height="40" rx="10" fill="#FB923C" />
            <line x1="56" y1="84" x2="104" y2="84" stroke="#C2410C" strokeWidth="2.5" strokeDasharray="4 2" />
            <circle cx="80" cy="98" r="5" fill="#FDE047" />
            {/* Side pockets */}
            <rect x="36" y="72" width="8" height="30" rx="3" fill="#C2410C" />
            <rect x="116" y="72" width="8" height="30" rx="3" fill="#C2410C" />
            {/* Star badge on bag */}
            <polygon points="80,60 82,65 87,65 83,68 85,73 80,70 75,73 77,68 73,65 78,65" fill="#FEF08A" />
          </svg>
        );

      // Default with badge emoji
      default:
        return (
          <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 shadow-inner">
            <span className="text-7xl animate-bounce drop-shadow">{badgeEmoji || '✨'}</span>
          </div>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center transition-transform hover:scale-105 ${className}`}>
      {renderSvg()}
    </div>
  );
};
