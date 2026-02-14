import ProbabilityMeter from "./ProbabilityMeter";

export default function ResultCard({ result, loading }) {
  // Provide a neutral default when no result is available so UI stays balanced
  const prob = result?.ai_probability ?? 0.5;
  const decision = result?.decision ?? null;

  const isAI = prob > 0.50;
  const isReal = prob < 0.45;

  let statusColor = "amber";
  let statusGradient = "from-amber-500 to-orange-500";
  let borderColor = "border-amber-500/30";
  let statusText = result ? "Uncertain" : "Awaiting Image";
  let statusIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  );

  if (isAI) {
    statusColor = "rose";
    statusGradient = "from-rose-500 to-pink-600";
    borderColor = "border-rose-500/30";
    statusText = "AI Generated";
    statusIcon = (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    );
  } else if (isReal) {
    statusColor = "emerald";
    statusGradient = "from-emerald-500 to-teal-500";
    borderColor = "border-emerald-500/30";
    statusText = "Likely Authentic";
    statusIcon = (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
  }

  return (
    <div className={`glass-card rounded-3xl p-8 border ${borderColor} relative overflow-hidden animate-fade-in-up`}>
      {/* Decorative background glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none`} style={{ backgroundColor: `${statusColor === 'emerald' ? 'rgba(16,185,129,0.07)' : statusColor === 'rose' ? 'rgba(244,63,94,0.07)' : 'rgba(245,158,11,0.07)' }` }}></div>

      {/* Header Verdict */}
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${result ? `bg-${statusColor}-500/10 text-${statusColor}-400 ring-1 ring-${statusColor}-500/20` : 'bg-slate-800/40 text-slate-400'}`}>
            Verdict Analysis
          </div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            {statusText}
            {/* Icon wrapper */}
            <div className={`p-2 rounded-xl bg-gradient-to-br ${statusGradient} text-white shadow-lg shadow-${statusColor}-500/20`}>
              {statusIcon}
            </div>
          </h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400 mb-1">Confidence Score</div>
          <div className={`text-4xl font-black ${result ? `text-${statusColor}-400` : 'text-slate-500'}`}>
            {(prob * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Meter */}
      <div className="mb-8">
        <ProbabilityMeter probability={prob} isAI={isAI} isReal={isReal} color={statusColor} />
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/50">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Pattern Match</div>
          <div className="text-slate-200 font-medium">
            {isAI ? "Synthetic Artifacts Detected" : "Natural Noise Distribution"}
          </div>
        </div>
        <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/50">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Model Confidence</div>
          <div className={`font-medium ${Math.abs(prob - 0.5) > 0.4 ? "text-emerald-400" : "text-amber-400"}`}>
            {Math.abs(prob - 0.5) > 0.4 ? "Very High" : Math.abs(prob - 0.5) > 0.15 ? "High" : "Moderate"}
          </div>
        </div>
      </div>

      {/* Detailed Note */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong className="text-white block mb-1">Analysis Summary:</strong>
          {result?.note ?? 'Result will appear here after you upload an image. The UI reflects a neutral, probabilistic estimate until an analysis is performed.'}
        </p>
      </div>

      {/* <div className="mt-6 flex justify-between items-center text-xs text-slate-500">
        <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        <span>Model v2.4.0</span>
      </div> */}
    </div>
  );
}
