import React from 'react';
import { VTUFormula } from '../types/formula';
import { Calculator, Star, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface FormulaCardProps {
  formula: VTUFormula;
  isStarred: boolean;
  onToggleStar: (id: string) => void;
  onOpenSolver: (formula: VTUFormula) => void;
  onLoadSample: (formula: VTUFormula) => void;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  formula,
  isStarred,
  onToggleStar,
  onOpenSolver,
  onLoadSample
}) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Circuits':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Analog':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Digital':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Signals & DSP':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Electromagnetics':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Communication':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'VLSI':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Photonics & Radar':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    }
  };

  const semLabels = formula.semesters.map(s => `Sem ${s}`).join(' & ');

  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 p-5 overflow-hidden backdrop-blur-sm">
      {/* Background glow accent */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {semLabels}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getCategoryColor(formula.category)}`}>
              {formula.category}
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-mono text-cyan-400/80 bg-cyan-950/30 border border-cyan-800/30">
              {formula.subjectCode}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(formula.id);
            }}
            title={isStarred ? 'Remove from Bookmarks' : 'Bookmark Formula'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
          >
            <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-1.5 leading-snug">
          {formula.title}
        </h3>

        {/* Subject & Module */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span className="truncate">{formula.subjectName}</span>
          <span>•</span>
          <span className="text-slate-400 font-mono">Mod {formula.module}</span>
        </div>

        {/* Formula Math Box */}
        <div className="my-3 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800/90 group-hover:border-slate-700 text-slate-200 transition-colors">
          <p className="font-mono text-xs md:text-sm font-semibold tracking-wide text-cyan-300 overflow-x-auto whitespace-nowrap scrollbar-none">
            {formula.formulaDisplay}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {formula.description}
        </p>

        {/* Variable Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="text-[11px] text-slate-400 font-medium">Vars:</span>
          {formula.variables.map(v => (
            <span
              key={v.key}
              className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50"
              title={`${v.name}: Default ${v.defaultValue} ${v.unit}`}
            >
              {v.symbol} <span className="text-slate-400">({v.unit})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        {formula.sampleProblems.length > 0 ? (
          <button
            onClick={() => onLoadSample(formula)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors py-1.5 px-2 rounded-md hover:bg-slate-800/60"
            title={formula.sampleProblems[0].vtuExamReference}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-[11px]">Exam Sum</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => onOpenSolver(formula)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all duration-200 shadow-sm"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Solve Sum</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
