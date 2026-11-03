import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  Search,
  Download,
  Activity,
  Wrench,
  Bot,
  FileText,
  ChevronDown,
  X
} from 'lucide-react';
import { SemesterNumber } from '../types/formula';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSemester: SemesterNumber | 'ALL';
  onExportSemesterPdf: () => void;
  onExportMasterPdf: () => void;
  onOpenVisualizers: () => void;
  onOpenConverters: () => void;
  onOpenAiTutor: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedSemester,
  onExportSemesterPdf,
  onExportMasterPdf,
  onOpenVisualizers,
  onOpenConverters,
  onOpenAiTutor
}) => {
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const pdfMenuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pdfMenuRef.current && !pdfMenuRef.current.contains(e.target as Node)) {
        setShowPdfMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-mono">
                  VOLT<span className="text-cyan-400">MATE</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 uppercase tracking-wider">
                  VTU ECE Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Semesters 1 to 8 • Formulas &amp; Interactive Sum Solver
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search formula, subject (e.g. VSWR, Friis, 555, RLC)..."
              className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow">
                  /
                </kbd>
              </div>
            )}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* PDF Export Dropdown */}
            <div className="relative" ref={pdfMenuRef}>
              <button
                onClick={() => setShowPdfMenu(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPdfMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs">
                  <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    PDF Cheatsheets
                  </div>

                  {selectedSemester !== 'ALL' && (
                    <button
                      onClick={() => {
                        setShowPdfMenu(false);
                        onExportSemesterPdf();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-semibold">Sem {selectedSemester} Cheatsheet</div>
                        <div className="text-[10px] text-slate-400">Export active semester formulas</div>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowPdfMenu(false);
                      onExportMasterPdf();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold">Master ECE Handbook</div>
                      <div className="text-[10px] text-slate-400">All 8 Semesters formula guide</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Visualizers Scope */}
            <button
              onClick={onOpenVisualizers}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors shadow-sm"
              title="Interactive Waveform & Circuit Scopes"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Waveform Scopes</span>
            </button>

            {/* Unit Converters */}
            <button
              onClick={onOpenConverters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors shadow-sm"
              title="ECE Quick Tools & Resistor Decoder"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Quick Tools</span>
            </button>

            {/* AI Problem Solver Tutor */}
            <button
              onClick={onOpenAiTutor}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm"
              title="AI VTU Exam Problem Solver"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">VTU AI Tutor</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
