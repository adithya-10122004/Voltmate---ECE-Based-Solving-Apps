import React from 'react';
import { SemesterNumber } from '../types/formula';
import { SEMESTER_METADATA } from '../data/vtuFormulas';
import { Star, Layers, Filter } from 'lucide-react';

interface SemesterNavProps {
  selectedSemester: SemesterNumber | 'ALL';
  onSelectSemester: (sem: SemesterNumber | 'ALL') => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  onlyStarred: boolean;
  onToggleOnlyStarred: () => void;
  totalFilteredCount: number;
  totalCount: number;
}

export const SemesterNav: React.FC<SemesterNavProps> = ({
  selectedSemester,
  onSelectSemester,
  selectedCategory,
  onSelectCategory,
  categories,
  onlyStarred,
  onToggleOnlyStarred,
  totalFilteredCount,
  totalCount
}) => {
  const semesters: (SemesterNumber | 'ALL')[] = ['ALL', 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-4">
      {/* Semester Horizontal Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto scrollbar-none backdrop-blur-md">
        {semesters.map((sem) => {
          const isActive = selectedSemester === sem;
          const label = sem === 'ALL' ? 'All Semesters' : `Sem ${sem}`;

          return (
            <button
              key={sem}
              onClick={() => onSelectSemester(sem)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              {label}
            </button>
          );
        })}

        {/* Starred / Bookmarks Tab */}
        <button
          onClick={onToggleOnlyStarred}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ml-auto shrink-0 ${
            onlyStarred
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/80'
          }`}
          title="Filter only bookmarked formulas"
        >
          <Star className={`w-3.5 h-3.5 ${onlyStarred ? 'fill-slate-950' : 'fill-none'}`} />
          <span>Starred</span>
        </button>
      </div>

      {/* Semester Subtitle and Meta if specific semester selected */}
      {selectedSemester !== 'ALL' && SEMESTER_METADATA[selectedSemester] && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-cyan-400">
              {SEMESTER_METADATA[selectedSemester].name}:
            </span>
            <span className="text-slate-300">
              {SEMESTER_METADATA[selectedSemester].subtitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 overflow-x-auto">
            {SEMESTER_METADATA[selectedSemester].subjects.map((sub, sIdx) => (
              <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                {sub}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills & Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
          <button
            onClick={() => onSelectCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            All Disciplines
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 shrink-0 font-mono">
          Showing <span className="font-bold text-cyan-400">{totalFilteredCount}</span> of {totalCount} formulas
        </div>
      </div>
    </div>
  );
};
