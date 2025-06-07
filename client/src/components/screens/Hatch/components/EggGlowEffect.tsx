interface EggGlowEffectProps {
  glowLevel: number;
}

export const EggGlowEffect = ({ glowLevel }: EggGlowEffectProps) => {
  if (glowLevel === 0) return null;

  const baseClasses = "absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full -z-10";

  return (
    <>
      {/* Glow Level 1: Soft */}
      {glowLevel >= 1 && (
        <div className={`${baseClasses} bg-gold/20 animate-pulse blur-lg`} />
      )}

      {/* Glow Level 2: Medium */}
      {glowLevel >= 2 && (
        <div className={`${baseClasses} bg-gold/30 animate-pulse blur-xl`} />
      )}

      {/* Glow Level 3: Intense */}
      {glowLevel >= 3 && (
        <div className={`${baseClasses} bg-yellow-400/40 animate-pulse blur-2xl`} />
      )}

      {/* Glow Level 4: Very Intense */}
      {glowLevel >= 4 && (
        <>
          <div className={`${baseClasses} bg-orange-300/50 animate-pulse blur-3xl`} />
          <div className={`${baseClasses} bg-white/20 animate-ping`} />
        </>
      )}

      {/* Glow Level 5: MAXIMUM POWER */}
      {glowLevel >= 5 && (
        <>
          <div className={`${baseClasses} bg-white/60 animate-pulse blur-[40px]`} />
          <div className={`${baseClasses} bg-cyan-300/40 animate-ping`} />
          <div className={`${baseClasses} bg-magenta/30 animate-pulse blur-[50px]`} />
        </>
      )}
    </>
  );
};