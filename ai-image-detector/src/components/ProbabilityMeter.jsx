export default function ProbabilityMeter({ probability, isAI, isReal, color }) {
  const percent = Math.round((probability || 0) * 100);

  // Map semantic color to hex gradient stops
  const colorMap = {
    emerald: ["#10B981", "#0EA5A4"],
    rose: ["#F43F5E", "#EC4899"],
    amber: ["#F59E0B", "#FB923C"],
  };

  const [start, end] = colorMap[color] || colorMap.amber;
  const boxShadow = `0 6px 30px ${start}33`;

  return (
    <div className="relative">
      {/* local keyframes for shimmer */}
      <style>{`
        @keyframes _shim {0% {transform: translateX(-100%);} 100% {transform: translateX(100%);} }
      `}</style>

      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
        <span>Authentic</span>
        <span>AI Generated</span>
      </div>

      {/* Bar Background */}
      <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex relative" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)" }}>
        {/* Center Marker */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 z-10"></div>

        {/* Fill */}
        <div
          className="h-full relative overflow-hidden"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${start}, ${end})`,
            transition: "width 800ms ease-out, background 400ms",
            boxShadow,
          }}
        >
          {/* shimmer overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%)",
              transform: "translateX(-100%)",
              animation: "_shim 1.6s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Markers */}
      <div className="flex justify-between text-[10px] text-slate-600 mt-1.5 font-mono">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}