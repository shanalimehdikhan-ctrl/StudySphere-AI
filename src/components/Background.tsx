export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#060614]" />

      {/* Glow orbs */}
      <div
        className="animate-pulse-glow absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full opacity-30 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #5b8cff 0%, transparent 70%)',
        }}
      />
      <div
        className="animate-pulse-glow absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full opacity-25 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)',
          animationDelay: '2s',
        }}
      />
      <div
        className="animate-pulse-glow absolute -bottom-40 left-1/4 h-[30rem] w-[30rem] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)',
          animationDelay: '4s',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  );
}
