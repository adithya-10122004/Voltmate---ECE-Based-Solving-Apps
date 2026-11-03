import React, { useState, useEffect, useMemo } from 'react';
import { VTUFormula, CalculationResult } from '../types/formula';
import { exportSolvedProblemReport } from '../utils/pdfGenerator';
import {
  X,
  Calculator,
  Download,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Sparkles,
  Info,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

interface FormulaSolverModalProps {
  formula: VTUFormula | null;
  initialInputs?: Record<string, number>;
  onClose: () => void;
}

export const FormulaSolverModal: React.FC<FormulaSolverModalProps> = ({
  formula,
  initialInputs,
  onClose
}) => {
  if (!formula) return null;

  // Initialize input values and selected unit multipliers
  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const [unitMultipliers, setUnitMultipliers] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'solver' | 'theory'>('solver');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number | null>(null);

  // Set default values when formula changes or initialInputs provided
  useEffect(() => {
    if (!formula) return;
    const initial: Record<string, number> = {};
    const multipliers: Record<string, number> = {};

    formula.variables.forEach(v => {
      // If initialInputs passed (e.g. from sample exam sum), use it
      if (initialInputs && initialInputs[v.key] !== undefined) {
        initial[v.key] = initialInputs[v.key];
      } else {
        initial[v.key] = v.defaultValue;
      }

      // Default unit multiplier is 1 or first option if matching
      multipliers[v.key] = 1;
    });

    setInputValues(initial);
    setUnitMultipliers(multipliers);
    setSelectedSampleIndex(null);
  }, [formula, initialInputs]);

  // Handle numerical input change
  const handleInputChange = (key: string, rawVal: string) => {
    const num = parseFloat(rawVal);
    setInputValues(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num
    }));
  };

  // Handle unit multiplier change
  const handleMultiplierChange = (key: string, mult: number) => {
    setUnitMultipliers(prev => ({
      ...prev,
      [key]: mult
    }));
  };

  // Reset to original defaults
  const handleReset = () => {
    const defaults: Record<string, number> = {};
    formula.variables.forEach(v => {
      defaults[v.key] = v.defaultValue;
    });
    setInputValues(defaults);
    setSelectedSampleIndex(null);
  };

  // Load a sample VTU exam problem
  const handleLoadSample = (sample: typeof formula.sampleProblems[0], index: number) => {
    setInputValues({ ...sample.inputs });
    setSelectedSampleIndex(index);
  };

  // Compute results dynamically with unit multipliers applied
  const calculationResult: CalculationResult = useMemo(() => {
    const processedInputs: Record<string, number> = {};
    formula.variables.forEach(v => {
      const baseVal = inputValues[v.key] !== undefined ? inputValues[v.key] : v.defaultValue;
      const mult = unitMultipliers[v.key] || 1;
      processedInputs[v.key] = baseVal * mult;
    });

    try {
      return formula.calculate(processedInputs);
    } catch (err) {
      return {
        outputs: [{ key: 'error', label: 'Calculation Error', symbol: '!', value: 'Invalid Inputs', unit: '' }],
        steps: ['Error evaluating formula. Please verify input values.']
      };
    }
  }, [formula, inputValues, unitMultipliers]);

  // Copy solution to clipboard
  const handleCopySolution = () => {
    if (!calculationResult) return;
    const text = [
      `VOLTMATE - VTU ECE SOLVED PROBLEM`,
      `Subject: ${formula.subjectCode} - ${formula.subjectName}`,
      `Topic: ${formula.title}`,
      `Equation: ${formula.plainFormula}`,
      `\nGIVEN INPUTS:`,
      ...formula.variables.map(v => `• ${v.name} (${v.symbol}) = ${inputValues[v.key]} ${v.unit}`),
      `\nCOMPUTED RESULTS:`,
      ...calculationResult.outputs.map(o => `• ${o.label} (${o.symbol}) = ${o.value} ${o.unit}`),
      `\nSTEP-BY-STEP DERIVATION:`,
      ...calculationResult.steps.map((s, i) => `${s}`)
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100 my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                  {formula.subjectCode}
                </span>
                <span className="text-xs text-slate-400">
                  Sem {formula.semesters.join(' & ')} • Module {formula.module}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 leading-tight">
                {formula.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportSolvedProblemReport(formula, inputValues, calculationResult)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              title="Download clean PDF solution report"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-950/50 border-b border-slate-800 text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('solver')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeTab === 'solver'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Calculator
            </button>
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeTab === 'theory'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              VTU Exam Notes &amp; Theory
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 px-2 py-1 rounded"
              title="Reset inputs to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'solver' ? (
            <>
              {/* Formula Equation Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Governing VTU Formula:
                  </span>
                  <span className="text-xs text-slate-400">{formula.subjectName}</span>
                </div>
                <div className="mt-1 text-sm md:text-base font-mono font-bold text-cyan-300 overflow-x-auto py-1">
                  {formula.formulaDisplay}
                </div>
              </div>

              {/* Sample VTU Exam Problem Selector */}
              {formula.sampleProblems.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      Sample VTU University Question Paper Problem
                    </span>
                  </div>
                  {formula.sampleProblems.map((prob, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/10 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-amber-400 mr-2">
                          [{prob.vtuExamReference}]
                        </span>
                        <span className="text-slate-300">{prob.problemStatement}</span>
                      </div>
                      <button
                        onClick={() => handleLoadSample(prob, idx)}
                        className={`shrink-0 px-3 py-1.5 rounded-md font-semibold text-xs transition-colors ${
                          selectedSampleIndex === idx
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                        }`}
                      >
                        {selectedSampleIndex === idx ? '✓ Loaded' : 'Load into Calculator'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Grid: Inputs on Left, Results & Steps on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inputs Column (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Input Values
                    </h3>
                    <span className="text-[11px] text-slate-400">Live calculation</span>
                  </div>

                  <div className="space-y-3.5">
                    {formula.variables.map(variable => {
                      const currentVal = inputValues[variable.key] !== undefined ? inputValues[variable.key] : variable.defaultValue;

                      return (
                        <div
                          key={variable.key}
                          className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 focus-within:border-cyan-500/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-slate-200">
                              {variable.name}
                            </label>
                            <span className="text-xs font-mono font-bold text-cyan-400">
                              {variable.symbol}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={currentVal}
                              step={variable.step || 'any'}
                              onChange={(e) => handleInputChange(variable.key, e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-sm font-mono font-medium text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                            />

                            {/* Unit selector if multiple units available */}
                            {variable.unitOptions && variable.unitOptions.length > 0 ? (
                              <select
                                value={unitMultipliers[variable.key] || 1}
                                onChange={(e) => handleMultiplierChange(variable.key, parseFloat(e.target.value))}
                                className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-semibold text-cyan-300 focus:outline-none focus:border-cyan-400"
                              >
                                {variable.unitOptions.map(opt => (
                                  <option key={opt.label} value={opt.multiplier}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="px-2.5 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 select-none min-w-[42px] text-center">
                                {variable.unit}
                              </span>
                            )}
                          </div>

                          {variable.description && (
                            <p className="mt-1.5 text-[11px] text-slate-400">
                              {variable.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Outputs & Steps Column (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Calculated Results
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopySolution}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-800/60 transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied!' : 'Copy Steps'}</span>
                      </button>

                      <button
                        onClick={() => exportSolvedProblemReport(formula, inputValues, calculationResult)}
                        className="sm:hidden flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-800/60 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Output Result Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {calculationResult.outputs.map(out => (
                      <div
                        key={out.key}
                        className={`p-3 rounded-xl border transition-all ${
                          out.highlight
                            ? 'bg-gradient-to-br from-cyan-950/40 to-slate-950 border-cyan-500/40 shadow-sm'
                            : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
                          <span>{out.label}</span>
                          <span className="font-mono text-cyan-400/80 font-bold">{out.symbol}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-xl font-bold font-mono tracking-tight ${out.highlight ? 'text-cyan-300' : 'text-slate-100'}`}>
                            {out.value}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {out.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Step-by-Step Derivation Box */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                      <ChevronRight className="w-4 h-4 text-cyan-400" />
                      <span>Mathematical Derivation &amp; Step-by-Step Working:</span>
                    </div>

                    <div className="space-y-2 pt-1 font-mono text-xs">
                      {calculationResult.steps.map((step, idx) => (
                        <div key={idx} className="text-slate-300 leading-relaxed pl-2 border-l-2 border-cyan-500/30 hover:border-cyan-400 transition-colors">
                          {step}
                        </div>
                      ))}
                    </div>

                    {calculationResult.notes && calculationResult.notes.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-start gap-2 text-xs text-amber-300/90 bg-amber-500/5 p-2 rounded-lg">
                        <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                        <div>
                          {calculationResult.notes.map((note, nIdx) => (
                            <p key={nIdx}>{note}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Theory & VTU Exam Notes Tab */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Syllabus &amp; Exam Context</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {formula.description}
                </p>

                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
                  <div>
                    <span className="text-slate-400">Course Code: </span>
                    <span className="font-mono font-semibold text-slate-200">{formula.subjectCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Subject: </span>
                    <span className="font-semibold text-slate-200">{formula.subjectName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">VTU Module: </span>
                    <span className="font-semibold text-slate-200">Module {formula.module}</span>
                  </div>
                </div>
              </div>

              {/* Key Exam Insights */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Key Examination Insights &amp; Rules of Thumb</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {formula.keyInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Variables Reference Table */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-200">
                  Parameter Definitions &amp; Standard SI Units
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2 px-3 font-semibold">Symbol</th>
                        <th className="py-2 px-3 font-semibold">Parameter Name</th>
                        <th className="py-2 px-3 font-semibold">Default Value</th>
                        <th className="py-2 px-3 font-semibold">Standard Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {formula.variables.map(v => (
                        <tr key={v.key} className="text-slate-300">
                          <td className="py-2 px-3 font-bold text-cyan-400">{v.symbol}</td>
                          <td className="py-2 px-3 font-sans">{v.name}</td>
                          <td className="py-2 px-3 text-slate-400">{v.defaultValue}</td>
                          <td className="py-2 px-3 text-amber-300">{v.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>VTU CBCS Compliant Formulation</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportSolvedProblemReport(formula, inputValues, calculationResult)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Solution</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
