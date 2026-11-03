export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface FormulaVariable {
  key: string;
  name: string;
  symbol: string;
  defaultValue: number;
  unit: string;
  unitOptions?: { label: string; multiplier: number }[];
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export interface SampleProblem {
  title: string;
  vtuExamReference: string; // e.g. "VTU Jan 2023 [8 Marks]"
  problemStatement: string;
  inputs: Record<string, number>;
  expectedOutputSummary: string;
}

export interface CalculationResult {
  outputs: {
    key: string;
    label: string;
    symbol: string;
    value: number | string;
    unit: string;
    highlight?: boolean;
    scientific?: string;
  }[];
  steps: string[];
  notes?: string[];
  diagramHint?: string;
}

export interface VTUFormula {
  id: string;
  semesters: SemesterNumber[]; // Some span 1st & 2nd
  subjectCode: string; // e.g. "21EC32"
  subjectName: string; // e.g. "Network Analysis"
  category: 'Circuits' | 'Analog' | 'Digital' | 'Signals & DSP' | 'Electromagnetics' | 'Communication' | 'VLSI' | 'Photonics & Radar' | 'Embedded & IoT';
  module: number; // 1 to 5 in VTU CBCS
  title: string;
  formulaDisplay: string; // Plain formatted or math string
  plainFormula: string;
  description: string;
  keyInsights: string[];
  variables: FormulaVariable[];
  sampleProblems: SampleProblem[];
  calculate: (inputs: Record<string, number>) => CalculationResult;
  tags: string[];
}
