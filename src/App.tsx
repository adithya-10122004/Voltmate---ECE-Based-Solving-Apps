import React, { useState, useMemo, useEffect } from 'react';
import { VTU_ECE_FORMULAS, SEMESTER_METADATA } from './data/vtuFormulas';
import { VTUFormula, SemesterNumber } from './types/formula';
import { Header } from './components/Header';
import { SemesterNav } from './components/SemesterNav';
import { FormulaCard } from './components/FormulaCard';
import { FormulaSolverModal } from './components/FormulaSolverModal';
import { VisualizersModal } from './components/VisualizersModal';
import { UnitConverterModal } from './components/UnitConverterModal';
import { AiTutorModal } from './components/AiTutorModal';
import { exportSemesterCheatsheet, exportMasterHandbook } from './utils/pdfGenerator';
import {
  Zap,
  BookOpen,
  Calculator,
  Download,
  Activity,
  Wrench,
  Search,
  Sparkles,
  GraduationCap,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Navigation & Filtering State
  const [selectedSemester, setSelectedSemester] = useState<SemesterNumber | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyStarred, setOnlyStarred] = useState<boolean>(false);

  // Starred Bookmarks (persisted in localStorage)
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('voltmate_starred_formulas');
      return saved ? JSON.parse(saved) : ['bee-rlc-resonance', 'comm-am-modulation', 'em-vswr-reflection', 'lic-555-astable'];
    } catch {
      return ['bee-rlc-resonance', 'comm-am-modulation', 'em-vswr-reflection', 'lic-555-astable'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('voltmate_starred_formulas', JSON.stringify(starredIds));
    } catch (e) {
      console.error(e);
    }
  }, [starredIds]);

  const handleToggleStar = (id: string) => {
    setStarredIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Modals state
  const [activeFormula, setActiveFormula] = useState<VTUFormula | null>(null);
  const [solverInitialInputs, setSolverInitialInputs] = useState<Record<string, number> | undefined>(undefined);
  const [showVisualizers, setShowVisualizers] = useState(false);
  const [showConverters, setShowConverters] = useState(false);
  const [showAiTutor, setShowAiTutor] = useState(false);

  // Extract all categories
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    VTU_ECE_FORMULAS.forEach(f => set.add(f.category));
    return Array.from(set);
  }, []);

  // Filtered Formulas
  const filteredFormulas = useMemo(() => {
    return VTU_ECE_FORMULAS.filter(formula => {
      // Semester filter
      if (selectedSemester !== 'ALL' && !formula.semesters.includes(selectedSemester)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && formula.category !== selectedCategory) {
        return false;
      }

      // Starred filter
      if (onlyStarred && !starredIds.includes(formula.id)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = formula.title.toLowerCase().includes(query);
        const matchesCode = formula.subjectCode.toLowerCase().includes(query);
        const matchesSubject = formula.subjectName.toLowerCase().includes(query);
        const matchesDesc = formula.description.toLowerCase().includes(query);
        const matchesFormula = formula.plainFormula.toLowerCase().includes(query);
        const matchesTags = formula.tags.some(t => t.toLowerCase().includes(query));
        const matchesVars = formula.variables.some(
          v => v.name.toLowerCase().includes(query) || v.symbol.toLowerCase().includes(query)
        );

        if (!matchesTitle && !matchesCode && !matchesSubject && !matchesDesc && !matchesFormula && !matchesTags && !matchesVars) {
          return false;
        }
      }

      return true;
    });
  }, [selectedSemester, selectedCategory, onlyStarred, searchQuery, starredIds]);

  // Open solver for a formula
  const handleOpenSolver = (formula: VTUFormula) => {
    setSolverInitialInputs(undefined);
    setActiveFormula(formula);
  };

  // Load sample exam sum into solver
  const handleLoadSample = (formula: VTUFormula) => {
    if (formula.sampleProblems.length > 0) {
      setSolverInitialInputs(formula.sampleProblems[0].inputs);
    } else {
      setSolverInitialInputs(undefined);
    }
    setActiveFormula(formula);
  };

  // PDF Export Handlers
  const handleExportSemesterPdf = () => {
    const sem = selectedSemester === 'ALL' ? 1 : selectedSemester;
    const formulas = VTU_ECE_FORMULAS.filter(f => f.semesters.includes(sem as any));
    exportSemesterCheatsheet(sem as number, formulas);
  };

  const handleExportMasterPdf = () => {
    exportMasterHandbook(VTU_ECE_FORMULAS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSemester={selectedSemester}
        onExportSemesterPdf={handleExportSemesterPdf}
        onExportMasterPdf={handleExportMasterPdf}
        onOpenVisualizers={() => setShowVisualizers(true)}
        onOpenConverters={() => setShowConverters(true)}
        onOpenAiTutor={() => setShowAiTutor(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Banner / Quick Overview */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 md:p-8 shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <GraduationCap className="w-3.5 h-3.5" />
                  VTU Visvesvaraya Technological University ECE Scheme
                </span>
                <span className="text-xs text-slate-400">• CBCS 2021/2022</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Electronics &amp; Communication Engineering Formula &amp; Solver Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Step-by-step problem solver from 1st to 8th Semester with live numeric substitutions,
                interactive waveform scopes, standard SI units, and instant PDF cheatsheet generation.
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 min-w-[110px] text-center">
                <div className="text-2xl font-extrabold font-mono text-cyan-400">
                  {VTU_ECE_FORMULAS.length}
                </div>
                <div className="text-[11px] font-medium text-slate-400">VTU Formulas</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 min-w-[110px] text-center">
                <div className="text-2xl font-extrabold font-mono text-amber-400">
                  8 / 8
                </div>
                <div className="text-[11px] font-medium text-slate-400">Semesters</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 min-w-[110px] text-center">
                <div className="text-2xl font-extrabold font-mono text-emerald-400">
                  100%
                </div>
                <div className="text-[11px] font-medium text-slate-400">Step Solvers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Navigation & Category Filters */}
        <SemesterNav
          selectedSemester={selectedSemester}
          onSelectSemester={setSelectedSemester}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={allCategories}
          onlyStarred={onlyStarred}
          onToggleOnlyStarred={() => setOnlyStarred(prev => !prev)}
          totalFilteredCount={filteredFormulas.length}
          totalCount={VTU_ECE_FORMULAS.length}
        />

        {/* Formulas Grid */}
        {filteredFormulas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFormulas.map(formula => (
              <FormulaCard
                key={formula.id}
                formula={formula}
                isStarred={starredIds.includes(formula.id)}
                onToggleStar={handleToggleStar}
                onOpenSolver={handleOpenSolver}
                onLoadSample={handleLoadSample}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-16 px-4 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-200">
                No matching VTU ECE formulas found
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No formulas matched your search query &quot;{searchQuery}&quot; or active filter combination.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSemester('ALL');
                setSelectedCategory('ALL');
                setOnlyStarred(false);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="font-bold text-slate-300">VOLTMATE</span>
            <span>•</span>
            <span>Visvesvaraya Technological University (VTU) ECE Syllabus Hub</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>CBCS Scheme</span>
            <span>•</span>
            <span>Instant Client Step-by-Step Numerical Math Engine</span>
            <span>•</span>
            <button
              onClick={handleExportMasterPdf}
              className="text-cyan-400 hover:underline"
            >
              Download ECE PDF Handbook
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Formula Interactive Solver Modal */}
      <FormulaSolverModal
        formula={activeFormula}
        initialInputs={solverInitialInputs}
        onClose={() => setActiveFormula(null)}
      />

      {/* 2. Interactive Waveform & Circuit Scopes */}
      {showVisualizers && (
        <VisualizersModal onClose={() => setShowVisualizers(false)} />
      )}

      {/* 3. Unit Converters & Resistor Decoder */}
      {showConverters && (
        <UnitConverterModal onClose={() => setShowConverters(false)} />
      )}

      {/* 4. AI Problem Solver Assistant */}
      {showAiTutor && (
        <AiTutorModal onClose={() => setShowAiTutor(false)} />
      )}
    </div>
  );
}
