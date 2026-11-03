import { VTUFormula } from '../types/formula';

export const VTU_ECE_FORMULAS: VTUFormula[] = [
  // ==========================================
  // SEMESTER 1 & 2: FIRST YEAR FOUNDATIONS
  // ==========================================
  {
    id: 'bee-ohms-law',
    semesters: [1, 2],
    subjectCode: '21ELE13/23',
    subjectName: 'Basic Electrical Engineering',
    category: 'Circuits',
    module: 1,
    title: "Ohm's Law & DC Power Dissipation",
    formulaDisplay: 'V = I · R  |  P = V · I = I² · R = V² / R',
    plainFormula: 'V = I * R, P = V * I = I^2 * R = V^2 / R',
    description: 'Calculates voltage, current, resistance, and electrical power dissipated in a DC resistive element according to fundamental circuit laws.',
    keyInsights: [
      'Current is directly proportional to voltage and inversely proportional to resistance.',
      'Power dissipation increases with the square of the voltage or current.',
      'Foundational for VTU Module 1 DC circuits & nodal/mesh analysis.'
    ],
    variables: [
      { key: 'voltage', name: 'Voltage (V)', symbol: 'V', defaultValue: 230, unit: 'V', min: 0.01, step: 1 },
      { key: 'resistance', name: 'Resistance (R)', symbol: 'R', defaultValue: 46, unit: 'Ω', min: 0.1, step: 0.5,
        unitOptions: [{ label: 'Ω', multiplier: 1 }, { label: 'kΩ', multiplier: 1e3 }, { label: 'MΩ', multiplier: 1e6 }] }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question Paper 2022',
        vtuExamReference: 'VTU 21ELE13 [6 Marks]',
        problemStatement: 'An electric heater connected to a 230 V DC source has an internal resistance of 46 Ω. Calculate the current drawn and the power dissipated by the heater.',
        inputs: { voltage: 230, resistance: 46 },
        expectedOutputSummary: 'I = 5 A, P = 1150 W (1.15 kW)'
      }
    ],
    calculate: (inputs) => {
      const V = inputs.voltage || 0;
      const R = inputs.resistance || 1;
      const I = V / R;
      const P = V * I;
      return {
        outputs: [
          { key: 'current', label: 'Circuit Current', symbol: 'I', value: Number(I.toFixed(4)), unit: 'A', highlight: true },
          { key: 'power_watts', label: 'Power Dissipated', symbol: 'P', value: Number(P.toFixed(2)), unit: 'W' },
          { key: 'power_kw', label: 'Power in Kilowatts', symbol: 'P', value: Number((P / 1000).toFixed(4)), unit: 'kW' }
        ],
        steps: [
          `Step 1: Identify given parameters: Voltage V = ${V} V, Resistance R = ${R} Ω`,
          `Step 2: Apply Ohm's Law: I = V / R`,
          `Step 3: Calculate current: I = ${V} / ${R} = ${I.toFixed(4)} A`,
          `Step 4: Compute electrical power: P = V × I = ${V} × ${I.toFixed(4)} = ${P.toFixed(2)} W (${(P/1000).toFixed(4)} kW)`,
          `Step 5: Verify using P = V² / R: (${V})² / ${R} = ${(V*V).toFixed(1)} / ${R} = ${P.toFixed(2)} W`
        ],
        notes: ['Check heating element power ratings against safety margins.']
      };
    },
    tags: ["ohm's law", "dc circuits", "power", "current", "voltage", "resistance", "21ele13"]
  },

  {
    id: 'bee-rlc-resonance',
    semesters: [1, 2],
    subjectCode: '21ELE13/23',
    subjectName: 'Basic Electrical Engineering',
    category: 'Circuits',
    module: 2,
    title: 'Series RLC Circuit Resonant Frequency & Q-Factor',
    formulaDisplay: 'f_r = 1 / (2π√(L·C))  |  Q = (1/R) · √(L/C)  |  BW = f_r / Q',
    plainFormula: 'fr = 1 / (2 * pi * sqrt(L * C)), Q = (1/R) * sqrt(L/C), BW = fr / Q',
    description: 'Computes series resonant frequency, inductive/capacitive reactances, circuit quality factor (Q-factor), and half-power bandwidth for AC series RLC circuits.',
    keyInsights: [
      'At resonance, inductive reactance equals capacitive reactance (X_L = X_C).',
      'The net impedance is purely resistive and at its absolute minimum Z = R.',
      'A high Q-factor signifies sharp selectivity and narrower bandwidth.'
    ],
    variables: [
      { key: 'R', name: 'Resistance (R)', symbol: 'R', defaultValue: 10, unit: 'Ω', min: 0.1, step: 0.5 },
      { key: 'L', name: 'Inductance (L)', symbol: 'L', defaultValue: 0.1, unit: 'H', min: 0.0001, step: 0.01,
        unitOptions: [{ label: 'H', multiplier: 1 }, { label: 'mH', multiplier: 1e-3 }, { label: 'μH', multiplier: 1e-6 }] },
      { key: 'C', name: 'Capacitance (C)', symbol: 'C', defaultValue: 10e-6, unit: 'F', min: 1e-12, step: 1e-6,
        unitOptions: [{ label: 'μF', multiplier: 1e-6 }, { label: 'nF', multiplier: 1e-9 }, { label: 'pF', multiplier: 1e-12 }, { label: 'F', multiplier: 1 }] }
    ],
    sampleProblems: [
      {
        title: 'VTU Jan 2023 Exam Problem',
        vtuExamReference: 'VTU 21ELE23 [8 Marks]',
        problemStatement: 'A series RLC circuit has R = 10 Ω, L = 100 mH, and C = 10 μF. Determine the resonant frequency, circuit Q-factor, and the bandwidth.',
        inputs: { R: 10, L: 0.1, C: 10e-6 },
        expectedOutputSummary: 'fr ≈ 159.15 Hz, Q = 10.0, BW ≈ 15.92 Hz'
      }
    ],
    calculate: (inputs) => {
      const R = inputs.R || 10;
      const L = inputs.L || 0.1;
      const C = inputs.C || 10e-6;

      const fr = 1 / (2 * Math.PI * Math.sqrt(L * C));
      const omega_r = 2 * Math.PI * fr;
      const XL = omega_r * L;
      const Q = (1 / R) * Math.sqrt(L / C);
      const BW = fr / Q;
      const f1 = fr - BW / 2;
      const f2 = fr + BW / 2;

      return {
        outputs: [
          { key: 'fr', label: 'Resonant Frequency', symbol: 'f_r', value: Number(fr.toFixed(2)), unit: 'Hz', highlight: true },
          { key: 'q_factor', label: 'Quality Factor', symbol: 'Q', value: Number(Q.toFixed(2)), unit: 'dimensionless', highlight: true },
          { key: 'bandwidth', label: 'Bandwidth (BW)', symbol: 'BW', value: Number(BW.toFixed(2)), unit: 'Hz' },
          { key: 'xl_xc', label: 'Reactance at Resonance (X_L = X_C)', symbol: 'X_L', value: Number(XL.toFixed(2)), unit: 'Ω' },
          { key: 'f1', label: 'Lower Half-Power Cutoff', symbol: 'f₁', value: Number(f1.toFixed(2)), unit: 'Hz' },
          { key: 'f2', label: 'Upper Half-Power Cutoff', symbol: 'f₂', value: Number(f2.toFixed(2)), unit: 'Hz' }
        ],
        steps: [
          `Step 1: Given: R = ${R} Ω, L = ${(L >= 1e-3 ? (L * 1000).toFixed(2) + ' mH' : L + ' H')}, C = ${(C * 1e6).toFixed(2)} μF`,
          `Step 2: Calculate LC product: L × C = ${L} × ${C.toExponential(4)} = ${(L * C).toExponential(5)} s²`,
          `Step 3: Compute Resonant Frequency: f_r = 1 / (2π√(LC)) = 1 / (2 × 3.14159 × √(${(L * C).toExponential(5)})) = ${fr.toFixed(2)} Hz`,
          `Step 4: Compute Quality Factor: Q = (1/R) · √(L/C) = (1/${R}) · √(${L} / ${C.toExponential(4)}) = (1/${R}) · ${(Math.sqrt(L/C)).toFixed(2)} = ${Q.toFixed(2)}`,
          `Step 5: Determine Bandwidth: BW = f_r / Q = ${fr.toFixed(2)} / ${Q.toFixed(2)} = ${BW.toFixed(2)} Hz`,
          `Step 6: Half-power frequencies: f₁ = f_r - BW/2 = ${f1.toFixed(2)} Hz, f₂ = f_r + BW/2 = ${f2.toFixed(2)} Hz`
        ],
        notes: ['At f = fr, circuit power factor is unity (cos φ = 1.0). Total current is maximum I_max = V / R.']
      };
    },
    tags: ['resonance', 'rlc', 'q-factor', 'bandwidth', 'cutoff frequency', 'ac circuits', '21ele13']
  },

  {
    id: 'bee-ac-power',
    semesters: [1, 2],
    subjectCode: '21ELE13/23',
    subjectName: 'Basic Electrical Engineering',
    category: 'Circuits',
    module: 2,
    title: 'Single-Phase AC Power & Power Factor',
    formulaDisplay: 'P = V · I · cos(φ)  |  Q = V · I · sin(φ)  |  S = V · I',
    plainFormula: 'P = V * I * cos(phi), Q = V * I * sin(phi), S = V * I, pf = cos(phi)',
    description: 'Calculates Active Power (W/kW), Reactive Power (VAR/kVAR), Apparent Power (VA/kVA), and Power Factor in AC systems.',
    keyInsights: [
      'Active power P does real physical work (light, heat, mechanical motion).',
      'Reactive power Q oscillates between source and magnetic/dielectric fields.',
      'Power Factor = P / S = cos(φ). Closer to 1.0 reduces transmission I²R losses.'
    ],
    variables: [
      { key: 'voltage', name: 'RMS Voltage (V)', symbol: 'V', defaultValue: 230, unit: 'V', min: 1 },
      { key: 'current', name: 'RMS Current (I)', symbol: 'I', defaultValue: 10, unit: 'A', min: 0.1 },
      { key: 'pf', name: 'Power Factor cos(φ)', symbol: 'cos φ', defaultValue: 0.8, unit: 'lagging', min: 0.05, max: 1.0, step: 0.05 }
    ],
    sampleProblems: [
      {
        title: 'VTU July 2022 Exam',
        vtuExamReference: 'VTU 21ELE13 [6 Marks]',
        problemStatement: 'A single phase 230 V, 50 Hz motor draws a current of 10 A at 0.8 power factor lagging. Calculate the Active, Reactive, and Apparent power.',
        inputs: { voltage: 230, current: 10, pf: 0.8 },
        expectedOutputSummary: 'P = 1840 W (1.84 kW), Q = 1380 VAR, S = 2300 VA'
      }
    ],
    calculate: (inputs) => {
      const V = inputs.voltage || 230;
      const I = inputs.current || 10;
      const cosPhi = Math.min(Math.max(inputs.pf || 0.8, 0.01), 1.0);

      const phiRad = Math.acos(cosPhi);
      const sinPhi = Math.sin(phiRad);
      const phiDeg = (phiRad * 180) / Math.PI;

      const S = V * I;
      const P = S * cosPhi;
      const Q = S * sinPhi;

      return {
        outputs: [
          { key: 'p_watts', label: 'Active Power (P)', symbol: 'P', value: Number(P.toFixed(2)), unit: 'W', highlight: true },
          { key: 'p_kw', label: 'Active Power (kW)', symbol: 'P', value: Number((P / 1000).toFixed(3)), unit: 'kW' },
          { key: 'q_var', label: 'Reactive Power (Q)', symbol: 'Q', value: Number(Q.toFixed(2)), unit: 'VAR' },
          { key: 's_va', label: 'Apparent Power (S)', symbol: 'S', value: Number(S.toFixed(2)), unit: 'VA' },
          { key: 'phase_angle', label: 'Phase Angle (φ)', symbol: 'φ', value: Number(phiDeg.toFixed(2)), unit: '°' }
        ],
        steps: [
          `Step 1: Given: V = ${V} V, I = ${I} A, Power Factor cos(φ) = ${cosPhi}`,
          `Step 2: Apparent Power S = V × I = ${V} × ${I} = ${S.toFixed(1)} VA (${(S/1000).toFixed(3)} kVA)`,
          `Step 3: Phase angle φ = arccos(${cosPhi}) = ${phiDeg.toFixed(2)}°`,
          `Step 4: Active Power P = S × cos(φ) = ${S.toFixed(1)} × ${cosPhi} = ${P.toFixed(2)} W (${(P/1000).toFixed(3)} kW)`,
          `Step 5: Reactive Power Q = S × sin(φ) = ${S.toFixed(1)} × ${sinPhi.toFixed(4)} = ${Q.toFixed(2)} VAR (${(Q/1000).toFixed(3)} kVAR)`
        ]
      };
    },
    tags: ['active power', 'reactive power', 'apparent power', 'power factor', 'single phase', 'ac', 'vtu']
  },

  {
    id: 'bee-three-phase-power',
    semesters: [1, 2],
    subjectCode: '21ELE13/23',
    subjectName: 'Basic Electrical Engineering',
    category: 'Circuits',
    module: 3,
    title: 'Three-Phase Balanced Star & Delta System Power',
    formulaDisplay: 'P_{3φ} = √3 · V_L · I_L · cos(φ)  |  S_{3φ} = √3 · V_L · I_L',
    plainFormula: 'P = sqrt(3) * VL * IL * cos(phi), Star: VL = sqrt(3)*Vph, IL = Iph; Delta: VL = Vph, IL = sqrt(3)*Iph',
    description: 'Solves line-to-line vs phase voltages, currents, and total active power for balanced three-phase Star (Y) and Delta (Δ) electrical networks.',
    keyInsights: [
      'In Star (Y): V_L = √3 · V_ph and I_L = I_ph.',
      'In Delta (Δ): V_L = V_ph and I_L = √3 · I_ph.',
      'Total power formula P = √3 · V_L · I_L · cos(φ) applies identically to both Star and Delta.'
    ],
    variables: [
      { key: 'line_voltage', name: 'Line Voltage (V_L)', symbol: 'V_L', defaultValue: 415, unit: 'V', min: 10 },
      { key: 'phase_impedance', name: 'Phase Impedance magnitude (Z_ph)', symbol: 'Z_ph', defaultValue: 20, unit: 'Ω', min: 0.5 },
      { key: 'pf', name: 'Power Factor cos(φ)', symbol: 'cos φ', defaultValue: 0.85, unit: 'lagging', min: 0.1, max: 1.0, step: 0.05 }
    ],
    sampleProblems: [
      {
        title: 'VTU Dec 2022 Exam',
        vtuExamReference: 'VTU 21ELE23 [8 Marks]',
        problemStatement: 'Three identical coils each having an impedance of 20 Ω and power factor 0.85 are connected in Star across a 415 V, 50 Hz, 3-phase supply. Calculate phase voltage, line current, and total active power.',
        inputs: { line_voltage: 415, phase_impedance: 20, pf: 0.85 },
        expectedOutputSummary: 'Vph ≈ 239.6 V, IL = 11.98 A, P ≈ 7320 W'
      }
    ],
    calculate: (inputs) => {
      const VL = inputs.line_voltage || 415;
      const Zph = inputs.phase_impedance || 20;
      const cosPhi = inputs.pf || 0.85;

      // Star calculation
      const Vph_star = VL / Math.sqrt(3);
      const Iph_star = Vph_star / Zph;
      const IL_star = Iph_star;
      const P_star = Math.sqrt(3) * VL * IL_star * cosPhi;

      // Delta calculation
      const Vph_delta = VL;
      const Iph_delta = Vph_delta / Zph;
      const IL_delta = Math.sqrt(3) * Iph_delta;
      const P_delta = Math.sqrt(3) * VL * IL_delta * cosPhi;

      return {
        outputs: [
          { key: 'p_star', label: 'Total 3-Phase Power (Star)', symbol: 'P_Y', value: Number(P_star.toFixed(2)), unit: 'W', highlight: true },
          { key: 'il_star', label: 'Line Current (Star)', symbol: 'I_L(Y)', value: Number(IL_star.toFixed(2)), unit: 'A' },
          { key: 'vph_star', label: 'Phase Voltage (Star)', symbol: 'V_ph(Y)', value: Number(Vph_star.toFixed(2)), unit: 'V' },
          { key: 'p_delta', label: 'Total 3-Phase Power (Delta)', symbol: 'P_Δ', value: Number(P_delta.toFixed(2)), unit: 'W' },
          { key: 'il_delta', label: 'Line Current (Delta)', symbol: 'I_L(Δ)', value: Number(IL_delta.toFixed(2)), unit: 'A' }
        ],
        steps: [
          `Step 1: Given: Line Voltage V_L = ${VL} V, Phase Impedance Z_ph = ${Zph} Ω, cos(φ) = ${cosPhi}`,
          `Step 2: [Star Connection]: V_ph = V_L / √3 = ${VL} / 1.732 = ${Vph_star.toFixed(2)} V`,
          `Step 3: Line current in Star: I_L = I_ph = V_ph / Z_ph = ${Vph_star.toFixed(2)} / ${Zph} = ${IL_star.toFixed(2)} A`,
          `Step 4: Star 3-Phase Power: P_Y = √3 × V_L × I_L × cos(φ) = 1.732 × ${VL} × ${IL_star.toFixed(2)} × ${cosPhi} = ${P_star.toFixed(2)} W (${(P_star/1000).toFixed(2)} kW)`,
          `Step 5: [Delta Connection comparison]: Notice P_Δ = 3 × P_Y = ${(P_star * 3).toFixed(2)} W, because line current is 3× higher.`
        ]
      };
    },
    tags: ['three phase', 'star', 'delta', 'vtu', 'line voltage', 'phase current']
  },

  {
    id: 'bee-transformer-emf',
    semesters: [1, 2],
    subjectCode: '21ELE13/23',
    subjectName: 'Basic Electrical Engineering',
    category: 'Circuits',
    module: 4,
    title: 'Single-Phase Transformer EMF Equation & Turns Ratio',
    formulaDisplay: 'E = 4.44 · f · N · Φ_m  |  K = V₂ / V₁ = N₂ / N₁ = I₁ / I₂',
    plainFormula: 'E = 4.44 * f * N * Phi_m, Phi_m = B_m * A, K = V2/V1 = N2/N1',
    description: 'Solves induced primary/secondary EMF, core magnetic flux (Φ_m), flux density (B_m), and transformation ratio K in a single-phase transformer.',
    keyInsights: [
      'Factor 4.44 originates from 4 × Form Factor (1.11) of a sinusoidal waveform.',
      'EMF per turn is constant across both primary and secondary windings (E1/N1 = E2/N2).',
      'Step-up transformer has K > 1; Step-down has K < 1.'
    ],
    variables: [
      { key: 'frequency', name: 'Supply Frequency (f)', symbol: 'f', defaultValue: 50, unit: 'Hz', min: 10, max: 400 },
      { key: 'n1', name: 'Primary Turns (N₁)', symbol: 'N₁', defaultValue: 500, unit: 'turns', min: 1, step: 10 },
      { key: 'n2', name: 'Secondary Turns (N₂)', symbol: 'N₂', defaultValue: 100, unit: 'turns', min: 1, step: 10 },
      { key: 'phi_m', name: 'Maximum Core Flux (Φ_m)', symbol: 'Φ_m', defaultValue: 0.02, unit: 'Wb', min: 0.0001, step: 0.005 }
    ],
    sampleProblems: [
      {
        title: 'VTU Jan 2020 Exam',
        vtuExamReference: 'VTU 18ELE13 [7 Marks]',
        problemStatement: 'A 50 Hz single phase transformer has 500 primary turns and 100 secondary turns. The maximum core flux is 0.02 Wb. Find the induced primary EMF (E1), secondary EMF (E2), and transformation ratio.',
        inputs: { frequency: 50, n1: 500, n2: 100, phi_m: 0.02 },
        expectedOutputSummary: 'E1 ≈ 2220 V, E2 ≈ 444 V, K = 0.2 (Step Down)'
      }
    ],
    calculate: (inputs) => {
      const f = inputs.frequency || 50;
      const N1 = inputs.n1 || 500;
      const N2 = inputs.n2 || 100;
      const Phi_m = inputs.phi_m || 0.02;

      const E1 = 4.44 * f * N1 * Phi_m;
      const E2 = 4.44 * f * N2 * Phi_m;
      const K = N2 / N1;
      const emfPerTurn = E1 / N1;

      return {
        outputs: [
          { key: 'e1', label: 'Primary Induced EMF (E₁)', symbol: 'E₁', value: Number(E1.toFixed(2)), unit: 'V', highlight: true },
          { key: 'e2', label: 'Secondary Induced EMF (E₂)', symbol: 'E₂', value: Number(E2.toFixed(2)), unit: 'V', highlight: true },
          { key: 'k', label: 'Transformation Ratio (K)', symbol: 'K', value: Number(K.toFixed(4)), unit: 'dimensionless' },
          { key: 'emf_per_turn', label: 'EMF per Turn (E/N)', symbol: 'E/N', value: Number(emfPerTurn.toFixed(3)), unit: 'V/turn' }
        ],
        steps: [
          `Step 1: Given: f = ${f} Hz, N₁ = ${N1}, N₂ = ${N2}, Φ_m = ${Phi_m} Wb`,
          `Step 2: Primary EMF: E₁ = 4.44 × f × N₁ × Φ_m = 4.44 × ${f} × ${N1} × ${Phi_m} = ${E1.toFixed(2)} V`,
          `Step 3: Secondary EMF: E₂ = 4.44 × f × N₂ × Φ_m = 4.44 × ${f} × ${N2} × ${Phi_m} = ${E2.toFixed(2)} V`,
          `Step 4: Transformation Ratio K = N₂ / N₁ = ${N2} / ${N1} = ${K.toFixed(4)} (${K < 1 ? 'Step-down' : 'Step-up'})`,
          `Step 5: EMF per turn = E₁ / N₁ = ${E1.toFixed(2)} / ${N1} = ${emfPerTurn.toFixed(3)} V/turn`
        ]
      };
    },
    tags: ['transformer', 'emf equation', 'flux', 'turns ratio', 'vtu', '21ele13']
  },

  {
    id: 'bes-rectifiers',
    semesters: [1, 2],
    subjectCode: '21ELN14/24',
    subjectName: 'Basic Electronics',
    category: 'Analog',
    module: 2,
    title: 'Half-Wave & Full-Wave Rectifiers Analysis',
    formulaDisplay: 'HWR: V_{dc} = V_m/π, γ = 1.21  |  FWR: V_{dc} = 2V_m/π, γ = 0.48',
    plainFormula: 'HWR: Vdc = Vm/pi, Vrms = Vm/2, eff = 40.6%; FWR: Vdc = 2*Vm/pi, Vrms = Vm/sqrt(2), eff = 81.2%',
    description: 'Solves DC output voltage, RMS ripple voltage, ripple factor (γ), rectification efficiency (η), and PIV for Half-Wave and Center-Tap/Bridge Full-Wave rectifiers.',
    keyInsights: [
      'Full-wave rectifier delivers twice the DC voltage and has ripple frequency 2f compared to f for HWR.',
      'FWR ripple factor is significantly lower (0.48 vs 1.21), requiring much smaller filter capacitors.',
      'Bridge Rectifier PIV = Vm, while Center-Tapped FWR requires PIV = 2Vm.'
    ],
    variables: [
      { key: 'vm', name: 'Peak AC Voltage (V_m)', symbol: 'V_m', defaultValue: 24, unit: 'V', min: 1, step: 0.5 },
      { key: 'rl', name: 'Load Resistance (R_L)', symbol: 'R_L', defaultValue: 1000, unit: 'Ω', min: 10 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21ELN14 [6 Marks]',
        problemStatement: 'A 230V to 24V rms transformer feeds a bridge rectifier with load R_L = 1 kΩ. Neglecting diode drop, find the peak voltage Vm, DC output voltage, and ripple voltage.',
        inputs: { vm: 33.94, rl: 1000 },
        expectedOutputSummary: 'Vm = 33.94V, Vdc(FWR) = 21.61V, Vrms(FWR) = 24.0V'
      }
    ],
    calculate: (inputs) => {
      const Vm = inputs.vm || 24;
      const RL = inputs.rl || 1000;

      // HWR
      const Vdc_hwr = Vm / Math.PI;
      const Vrms_hwr = Vm / 2;
      const Idc_hwr = (Vdc_hwr / RL) * 1000; // mA

      // FWR
      const Vdc_fwr = (2 * Vm) / Math.PI;
      const Vrms_fwr = Vm / Math.SQRT2;
      const Idc_fwr = (Vdc_fwr / RL) * 1000; // mA
      const ripple_fwr = Math.sqrt(Math.max(0, Math.pow(Vrms_fwr, 2) - Math.pow(Vdc_fwr, 2)));

      return {
        outputs: [
          { key: 'vdc_fwr', label: 'Full-Wave DC Voltage', symbol: 'V_dc(FWR)', value: Number(Vdc_fwr.toFixed(2)), unit: 'V', highlight: true },
          { key: 'vdc_hwr', label: 'Half-Wave DC Voltage', symbol: 'V_dc(HWR)', value: Number(Vdc_hwr.toFixed(2)), unit: 'V' },
          { key: 'idc_fwr', label: 'Full-Wave DC Current', symbol: 'I_dc(FWR)', value: Number(Idc_fwr.toFixed(2)), unit: 'mA' },
          { key: 'ripple_fwr', label: 'FWR AC Ripple Voltage (V_ac)', symbol: 'V_ac', value: Number(ripple_fwr.toFixed(2)), unit: 'V' },
          { key: 'eff_fwr', label: 'FWR Theoretical Efficiency', symbol: 'η_max', value: 81.2, unit: '%' }
        ],
        steps: [
          `Step 1: Given Peak Voltage V_m = ${Vm} V, Load Resistance R_L = ${RL} Ω`,
          `Step 2: Half-Wave Rectifier: V_dc = V_m / π = ${Vm} / 3.1416 = ${Vdc_hwr.toFixed(2)} V (Ripple Factor γ = 1.21)`,
          `Step 3: Full-Wave Rectifier: V_dc = 2 × V_m / π = 2 × ${Vm} / 3.1416 = ${Vdc_fwr.toFixed(2)} V (Ripple Factor γ = 0.482)`,
          `Step 4: Full-Wave RMS output voltage: V_rms = V_m / √2 = ${Vm} / 1.414 = ${Vrms_fwr.toFixed(2)} V`,
          `Step 5: AC ripple component: V_ac = √(V_rms² - V_dc²) = √(${Vrms_fwr.toFixed(2)}² - ${Vdc_fwr.toFixed(2)}²) = ${ripple_fwr.toFixed(2)} V`,
          `Step 6: Load DC Current: I_dc = V_dc / R_L = ${Vdc_fwr.toFixed(2)} / ${RL} = ${Idc_fwr.toFixed(2)} mA`
        ]
      };
    },
    tags: ['rectifiers', 'half wave', 'full wave', 'bridge rectifier', 'ripple factor', 'efficiency', '21eln14']
  },

  {
    id: 'bes-bjt-current-gain',
    semesters: [1, 2],
    subjectCode: '21ELN14/24',
    subjectName: 'Basic Electronics',
    category: 'Analog',
    module: 3,
    title: 'Bipolar Junction Transistor (BJT) Current Gain Relations',
    formulaDisplay: 'α = β / (1 + β)  |  β = α / (1 - α)  |  I_E = I_B + I_C',
    plainFormula: 'alpha = beta / (1 + beta), beta = alpha / (1 - alpha), IC = beta * IB, IE = (beta + 1) * IB',
    description: 'Solves common-base current amplification factor (α), common-emitter gain (β), base current, collector current, and emitter current.',
    keyInsights: [
      'α is always slightly less than 1.0 (typically 0.95 to 0.998).',
      'β is typically large (50 to 400), providing high current amplification in CE configuration.',
      'Conservation of charge in transistor: I_E = I_B + I_C.'
    ],
    variables: [
      { key: 'beta', name: 'Current Gain (β or h_FE)', symbol: 'β', defaultValue: 100, unit: 'dimensionless', min: 10, max: 800 },
      { key: 'ib_micro', name: 'Base Current (I_B)', symbol: 'I_B', defaultValue: 20, unit: 'μA', min: 0.1, step: 1 }
    ],
    sampleProblems: [
      {
        title: 'VTU Feb 2021 Exam',
        vtuExamReference: 'VTU 18ELN24 [5 Marks]',
        problemStatement: 'A transistor has β = 100 and base current I_B = 20 μA. Calculate collector current I_C, emitter current I_E, and common-base gain α.',
        inputs: { beta: 100, ib_micro: 20 },
        expectedOutputSummary: 'α ≈ 0.9901, IC = 2 mA, IE = 2.02 mA'
      }
    ],
    calculate: (inputs) => {
      const beta = inputs.beta || 100;
      const Ib_uA = inputs.ib_micro || 20;
      const Ib_A = Ib_uA * 1e-6;

      const alpha = beta / (1 + beta);
      const Ic_A = beta * Ib_A;
      const Ie_A = Ic_A + Ib_A;

      return {
        outputs: [
          { key: 'alpha', label: 'Common-Base Gain (α)', symbol: 'α', value: Number(alpha.toFixed(5)), unit: 'dimensionless', highlight: true },
          { key: 'ic_ma', label: 'Collector Current (I_C)', symbol: 'I_C', value: Number((Ic_A * 1000).toFixed(3)), unit: 'mA', highlight: true },
          { key: 'ie_ma', label: 'Emitter Current (I_E)', symbol: 'I_E', value: Number((Ie_A * 1000).toFixed(3)), unit: 'mA' }
        ],
        steps: [
          `Step 1: Given: Transistor β = ${beta}, Base Current I_B = ${Ib_uA} μA (${Ib_A.toExponential(2)} A)`,
          `Step 2: Common-Base current gain: α = β / (1 + β) = ${beta} / (${beta} + 1) = ${alpha.toFixed(5)}`,
          `Step 3: Collector Current: I_C = β × I_B = ${beta} × ${Ib_uA} μA = ${(Ic_A * 1000).toFixed(3)} mA`,
          `Step 4: Emitter Current: I_E = I_B + I_C = ${(Ib_A * 1000).toFixed(3)} mA + ${(Ic_A * 1000).toFixed(3)} mA = ${(Ie_A * 1000).toFixed(3)} mA`
        ]
      };
    },
    tags: ['bjt', 'transistor', 'beta', 'alpha', 'gain', 'collector current', '21eln14']
  },

  {
    id: 'bes-opamp-gains',
    semesters: [1, 2],
    subjectCode: '21ELN14/24',
    subjectName: 'Basic Electronics',
    category: 'Analog',
    module: 4,
    title: 'Operational Amplifier (Op-Amp) Inverting & Non-Inverting Gain',
    formulaDisplay: 'Inv: A_v = -R_f / R_1  |  Non-Inv: A_v = 1 + (R_f / R_1)',
    plainFormula: 'Inverting: Av = -Rf / R1; Non-Inverting: Av = 1 + (Rf / R1); Vout = Av * Vin',
    description: 'Calculates the closed-loop voltage gain and output voltage for both Inverting and Non-Inverting Op-Amp configurations based on feedback resistors.',
    keyInsights: [
      'Inverting amplifier introduces a 180° phase inversion (negative sign).',
      'Non-inverting amplifier has a minimum gain of 1 (when Rf = 0, voltage follower).',
      'Virtual ground concept applies to the inverting input due to near-infinite open-loop gain.'
    ],
    variables: [
      { key: 'rf', name: 'Feedback Resistor (R_f)', symbol: 'R_f', defaultValue: 100, unit: 'kΩ', min: 1, step: 5 },
      { key: 'r1', name: 'Input Resistor (R_1)', symbol: 'R_1', defaultValue: 10, unit: 'kΩ', min: 0.1, step: 1 },
      { key: 'vin', name: 'Input Voltage (V_in)', symbol: 'V_in', defaultValue: 0.5, unit: 'V', min: -15, max: 15, step: 0.1 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model QP 2022',
        vtuExamReference: 'VTU 21ELN14 [6 Marks]',
        problemStatement: 'Design an inverting and non-inverting amplifier with Rf = 100 kΩ and R1 = 10 kΩ. If input voltage Vin = 0.5 V, calculate gains and output voltages.',
        inputs: { rf: 100, r1: 10, vin: 0.5 },
        expectedOutputSummary: 'Inv: Av = -10, Vout = -5.0V; Non-Inv: Av = 11, Vout = +5.5V'
      }
    ],
    calculate: (inputs) => {
      const Rf = inputs.rf || 100;
      const R1 = inputs.r1 || 10;
      const Vin = inputs.vin || 0.5;

      const Av_inv = -Rf / R1;
      const Vout_inv = Av_inv * Vin;

      const Av_noninv = 1 + Rf / R1;
      const Vout_noninv = Av_noninv * Vin;

      return {
        outputs: [
          { key: 'av_inv', label: 'Inverting Gain (A_v)', symbol: 'A_v(inv)', value: Number(Av_inv.toFixed(2)), unit: 'V/V', highlight: true },
          { key: 'vout_inv', label: 'Inverting Output (V_out)', symbol: 'V_out(inv)', value: Number(Vout_inv.toFixed(2)), unit: 'V' },
          { key: 'av_noninv', label: 'Non-Inverting Gain (A_v)', symbol: 'A_v(non)', value: Number(Av_noninv.toFixed(2)), unit: 'V/V', highlight: true },
          { key: 'vout_noninv', label: 'Non-Inverting Output (V_out)', symbol: 'V_out(non)', value: Number(Vout_noninv.toFixed(2)), unit: 'V' }
        ],
        steps: [
          `Step 1: Given: Feedback Resistor R_f = ${Rf} kΩ, Input Resistor R_1 = ${R1} kΩ, Input V_in = ${Vin} V`,
          `Step 2: Inverting Gain formula: A_v = -R_f / R_1 = -(${Rf} / ${R1}) = ${Av_inv.toFixed(2)}`,
          `Step 3: Inverting Output: V_out = A_v × V_in = ${Av_inv.toFixed(2)} × ${Vin} = ${Vout_inv.toFixed(2)} V (180° out of phase)`,
          `Step 4: Non-Inverting Gain formula: A_v = 1 + (R_f / R_1) = 1 + (${Rf} / ${R1}) = 1 + ${(Rf/R1).toFixed(2)} = ${Av_noninv.toFixed(2)}`,
          `Step 5: Non-Inverting Output: V_out = A_v × V_in = ${Av_noninv.toFixed(2)} × ${Vin} = ${Vout_noninv.toFixed(2)} V (in phase)`
        ],
        notes: ['Assuming op-amp supply rails ±15V are sufficient to avoid saturation.']
      };
    },
    tags: ['op-amp', 'operational amplifier', 'inverting', 'non-inverting', 'gain', '21eln14']
  },

  // ==========================================
  // SEMESTER 3: NETWORK ANALYSIS & AEC & DIGITAL
  // ==========================================
  {
    id: 'na-thevenin-mpt',
    semesters: [3],
    subjectCode: '21EC32',
    subjectName: 'Network Analysis',
    category: 'Circuits',
    module: 1,
    title: "Maximum Power Transfer Theorem & Thevenin's Equivalent",
    formulaDisplay: 'R_L = R_{th}  |  P_{max} = V_{th}² / (4 · R_{th})',
    plainFormula: 'RL = Rth, Pmax = (Vth^2) / (4 * Rth), IL = Vth / (Rth + RL)',
    description: 'Determines the load resistance for maximum power transfer from a linear active network and computes the maximum active power delivered.',
    keyInsights: [
      'Maximum power is transferred when load resistance equals the internal Thevenin resistance (R_L = R_th).',
      'At maximum power transfer condition, circuit transmission efficiency is exactly 50%.',
      'For AC networks with reactive elements, load impedance must be the complex conjugate Z_L = Z_th*.'
    ],
    variables: [
      { key: 'vth', name: "Thevenin Voltage (V_th)", symbol: 'V_th', defaultValue: 12, unit: 'V', min: 0.1 },
      { key: 'rth', name: "Thevenin Resistance (R_th)", symbol: 'R_th', defaultValue: 6, unit: 'Ω', min: 0.1 }
    ],
    sampleProblems: [
      {
        title: 'VTU Jan 2020 Question Paper',
        vtuExamReference: 'VTU 18EC32 [8 Marks]',
        problemStatement: 'Find the value of RL for maximum power transfer in a bridge circuit having Thevenin equivalent Vth = 12 V and Rth = 6 Ω. Also compute the maximum power dissipated in RL.',
        inputs: { vth: 12, rth: 6 },
        expectedOutputSummary: 'RL = 6 Ω, Pmax = 6.0 W'
      }
    ],
    calculate: (inputs) => {
      const Vth = inputs.vth || 12;
      const Rth = inputs.rth || 6;
      const RL = Rth;
      const Pmax = (Vth * Vth) / (4 * Rth);
      const IL = Vth / (2 * Rth);
      const VL = IL * RL;

      return {
        outputs: [
          { key: 'rl_opt', label: 'Optimal Load Resistance (R_L)', symbol: 'R_L', value: Number(RL.toFixed(2)), unit: 'Ω', highlight: true },
          { key: 'p_max', label: 'Maximum Power Delivered (P_max)', symbol: 'P_max', value: Number(Pmax.toFixed(3)), unit: 'W', highlight: true },
          { key: 'i_load', label: 'Load Current at P_max', symbol: 'I_L', value: Number(IL.toFixed(3)), unit: 'A' },
          { key: 'v_load', label: 'Load Voltage at P_max', symbol: 'V_L', value: Number(VL.toFixed(2)), unit: 'V' }
        ],
        steps: [
          `Step 1: Identify Thevenin parameters: V_th = ${Vth} V, R_th = ${Rth} Ω`,
          `Step 2: By Maximum Power Transfer Theorem, load resistance must match internal resistance: R_L = R_th = ${Rth} Ω`,
          `Step 3: Circuit current at match: I_L = V_th / (R_th + R_L) = ${Vth} / (${Rth} + ${Rth}) = ${IL.toFixed(3)} A`,
          `Step 4: Compute Maximum Power: P_max = I_L² × R_L = (${IL.toFixed(3)})² × ${Rth} = ${Pmax.toFixed(3)} W`,
          `Step 5: Direct verification formula: P_max = V_th² / (4 × R_th) = (${Vth})² / (4 × ${Rth}) = ${(Vth*Vth).toFixed(1)} / ${(4*Rth)} = ${Pmax.toFixed(3)} W`
        ]
      };
    },
    tags: ['network analysis', 'thevenin', 'maximum power transfer', 'mpt', '21ec32']
  },

  {
    id: 'na-star-delta',
    semesters: [3],
    subjectCode: '21EC32',
    subjectName: 'Network Analysis',
    category: 'Circuits',
    module: 1,
    title: 'Star-Delta (Y-Δ) and Delta-Star Conversion',
    formulaDisplay: 'Δ to Y: R_1 = (R_B · R_C) / ΣR_Δ  |  Y to Δ: R_A = R_1 + R_2 + (R_1·R_2 / R_3)',
    plainFormula: 'Delta to Star: R1 = (Rb*Rc)/(Ra+Rb+Rc); Star to Delta: Ra = R1 + R2 + (R1*R2/R3)',
    description: 'Performs bidirectional transformation between three-terminal Delta (Mesh) and Star (Wye) resistive networks.',
    keyInsights: [
      'Delta to Star: Any star branch equals the product of adjacent delta branches divided by the sum of all delta branches.',
      'If all three resistors in delta are equal (R_Δ), each star resistor is R_Y = R_Δ / 3.',
      'Crucial for simplifying non-series-parallel bridge networks in VTU exams.'
    ],
    variables: [
      { key: 'ra', name: 'Delta Resistor R_A', symbol: 'R_A', defaultValue: 30, unit: 'Ω', min: 0.1 },
      { key: 'rb', name: 'Delta Resistor R_B', symbol: 'R_B', defaultValue: 30, unit: 'Ω', min: 0.1 },
      { key: 'rc', name: 'Delta Resistor R_C', symbol: 'R_C', defaultValue: 30, unit: 'Ω', min: 0.1 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question Paper',
        vtuExamReference: 'VTU 21EC32 [6 Marks]',
        problemStatement: 'Three resistors of 30 Ω each are connected in Delta. Convert this delta network into an equivalent Star network.',
        inputs: { ra: 30, rb: 30, rc: 30 },
        expectedOutputSummary: 'R1 = 10 Ω, R2 = 10 Ω, R3 = 10 Ω'
      }
    ],
    calculate: (inputs) => {
      const Ra = inputs.ra || 30;
      const Rb = inputs.rb || 30;
      const Rc = inputs.rc || 30;
      const sumDelta = Ra + Rb + Rc;

      const R1 = (Rb * Rc) / sumDelta;
      const R2 = (Rc * Ra) / sumDelta;
      const R3 = (Ra * Rb) / sumDelta;

      return {
        outputs: [
          { key: 'r1', label: 'Star Resistor R₁', symbol: 'R₁', value: Number(R1.toFixed(3)), unit: 'Ω', highlight: true },
          { key: 'r2', label: 'Star Resistor R₂', symbol: 'R₂', value: Number(R2.toFixed(3)), unit: 'Ω', highlight: true },
          { key: 'r3', label: 'Star Resistor R₃', symbol: 'R₃', value: Number(R3.toFixed(3)), unit: 'Ω', highlight: true }
        ],
        steps: [
          `Step 1: Given Delta resistances: R_A = ${Ra} Ω, R_B = ${Rb} Ω, R_C = ${Rc} Ω`,
          `Step 2: Compute total sum of Delta resistances: ΣR_Δ = ${Ra} + ${Rb} + ${Rc} = ${sumDelta} Ω`,
          `Step 3: Calculate Star branch R₁ = (R_B × R_C) / ΣR_Δ = (${Rb} × ${Rc}) / ${sumDelta} = ${(Rb*Rc)} / ${sumDelta} = ${R1.toFixed(3)} Ω`,
          `Step 4: Calculate Star branch R₂ = (R_C × R_A) / ΣR_Δ = (${Rc} × ${Ra}) / ${sumDelta} = ${(Rc*Ra)} / ${sumDelta} = ${R2.toFixed(3)} Ω`,
          `Step 5: Calculate Star branch R₃ = (R_A × R_B) / ΣR_Δ = (${Ra} × ${Rb}) / ${sumDelta} = ${(Ra*Rb)} / ${sumDelta} = ${R3.toFixed(3)} Ω`
        ]
      };
    },
    tags: ['star delta', 'wye delta', 'network reduction', '21ec32']
  },

  {
    id: 'na-transient-rc-rl',
    semesters: [3],
    subjectCode: '21EC32',
    subjectName: 'Network Analysis',
    category: 'Circuits',
    module: 3,
    title: 'First-Order RC & RL Circuit Transient Analysis',
    formulaDisplay: 'RC: τ = R · C, v_c(t) = V(1 - e^{-t/τ})  |  RL: τ = L / R, i_L(t) = (V/R)(1 - e^{-t/τ})',
    plainFormula: 'tau_RC = R * C, vc(t) = V*(1 - exp(-t/tau)); tau_RL = L/R, iL(t) = (V/R)*(1 - exp(-t/tau))',
    description: 'Computes circuit time constant (τ), charging voltage or current at specific elapsed time t, and time to reach 99% steady state (5τ).',
    keyInsights: [
      'At t = 1τ, the capacitor charges to 63.2% of its final steady-state voltage.',
      'At t = 5τ, the circuit is considered to have practically reached 99.3% steady state.',
      'Capacitor opposes instantaneous change in voltage (v(0+) = v(0-)); inductor opposes change in current.'
    ],
    variables: [
      { key: 'v', name: 'Step Source Voltage (V)', symbol: 'V', defaultValue: 10, unit: 'V', min: 0.1 },
      { key: 'r', name: 'Circuit Resistance (R)', symbol: 'R', defaultValue: 1000, unit: 'Ω', min: 1 },
      { key: 'c', name: 'Capacitance (C)', symbol: 'C', defaultValue: 100e-6, unit: 'F', min: 1e-12,
        unitOptions: [{ label: 'μF', multiplier: 1e-6 }, { label: 'nF', multiplier: 1e-9 }, { label: 'mF', multiplier: 1e-3 }] },
      { key: 't', name: 'Elapsed Time (t)', symbol: 't', defaultValue: 0.1, unit: 's', min: 0 }
    ],
    sampleProblems: [
      {
        title: 'VTU Dec 2019 Exam',
        vtuExamReference: 'VTU 18EC32 [6 Marks]',
        problemStatement: 'A series RC circuit with R = 1 kΩ and C = 100 μF is connected to a 10 V DC supply at t = 0. Find the time constant τ and capacitor voltage at t = 0.1 s.',
        inputs: { v: 10, r: 1000, c: 100e-6, t: 0.1 },
        expectedOutputSummary: 'τ = 0.1 s, vc(0.1s) = 6.32 V'
      }
    ],
    calculate: (inputs) => {
      const V = inputs.v || 10;
      const R = inputs.r || 1000;
      const C = inputs.c || 100e-6;
      const t = inputs.t || 0.1;

      const tau = R * C;
      const vc = V * (1 - Math.exp(-t / tau));
      const ic = (V / R) * Math.exp(-t / tau);
      const steadyTime = 5 * tau;

      return {
        outputs: [
          { key: 'tau', label: 'Time Constant (τ)', symbol: 'τ', value: Number(tau.toFixed(4)), unit: 's', highlight: true },
          { key: 'vc_t', label: 'Capacitor Voltage at t', symbol: 'v_C(t)', value: Number(vc.toFixed(3)), unit: 'V', highlight: true },
          { key: 'ic_t', label: 'Charging Current at t', symbol: 'i(t)', value: Number((ic * 1000).toFixed(3)), unit: 'mA' },
          { key: 'steady_time', label: 'Time to 99% Steady State (5τ)', symbol: '5τ', value: Number(steadyTime.toFixed(4)), unit: 's' }
        ],
        steps: [
          `Step 1: Given: V = ${V} V, R = ${R} Ω, C = ${(C*1e6).toFixed(1)} μF, t = ${t} s`,
          `Step 2: Time Constant: τ = R × C = ${R} × ${C.toExponential(3)} = ${tau.toFixed(4)} s`,
          `Step 3: Normalized time ratio: t / τ = ${t} / ${tau.toFixed(4)} = ${(t / tau).toFixed(3)}`,
          `Step 4: Capacitor voltage: v_C(t) = V · (1 - e^(-t/τ)) = ${V} · (1 - e^(-${(t/tau).toFixed(3)})) = ${V} · (1 - ${Math.exp(-t/tau).toFixed(4)}) = ${vc.toFixed(3)} V`,
          `Step 5: Transient current: i(t) = (V/R) · e^(-t/τ) = (${V}/${R}) · ${Math.exp(-t/tau).toFixed(4)} = ${(ic * 1000).toFixed(3)} mA`
        ]
      };
    },
    tags: ['transients', 'rc circuit', 'time constant', 'tau', 'differential equations', '21ec32']
  },

  {
    id: 'aec-wien-bridge-oscillator',
    semesters: [3],
    subjectCode: '21EC33',
    subjectName: 'Analog Electronic Circuits',
    category: 'Analog',
    module: 4,
    title: 'Wien Bridge & RC Phase Shift Oscillator Frequency',
    formulaDisplay: 'Wien Bridge: f_o = 1 / (2π · R · C)  |  RC Phase Shift: f_o = 1 / (2π · R · C · √6)',
    plainFormula: 'Wien: fo = 1/(2*pi*R*C), Av >= 3 (Rf/R1 >= 2); RC Phase Shift: fo = 1/(2*pi*R*C*sqrt(6)), Av >= 29',
    description: 'Calculates the frequency of oscillation and required amplifier gain for audio frequency sinusoidal oscillators under the Barkhausen criterion.',
    keyInsights: [
      'Wien Bridge oscillator uses lead-lag network with attenuation β = 1/3 at resonance, requiring op-amp gain A_v ≥ 3.',
      'RC phase shift oscillator employs three RC ladder stages, each contributing 60° shift (total 180°), requiring gain A_v ≥ 29.',
      'Barkhausen criterion: loop gain |Aβ| = 1 and net loop phase shift = 0° or 360°.'
    ],
    variables: [
      { key: 'r', name: 'Timing Resistor (R)', symbol: 'R', defaultValue: 10, unit: 'kΩ', min: 0.5, step: 0.5 },
      { key: 'c', name: 'Timing Capacitor (C)', symbol: 'C', defaultValue: 0.01, unit: 'μF', min: 0.0001, step: 0.001 }
    ],
    sampleProblems: [
      {
        title: 'VTU July 2021 Exam',
        vtuExamReference: 'VTU 18EC34 [7 Marks]',
        problemStatement: 'Design a Wien Bridge oscillator to generate a sine wave frequency of 1 kHz using C = 0.01 μF. Find R and the ratio Rf/R1 for sustained oscillations.',
        inputs: { r: 15.915, c: 0.01 },
        expectedOutputSummary: 'fo ≈ 1000 Hz (1 kHz), required Av >= 3'
      }
    ],
    calculate: (inputs) => {
      const R_k = inputs.r || 10;
      const C_u = inputs.c || 0.01;
      const R = R_k * 1000;
      const C = C_u * 1e-6;

      const fo_wien = 1 / (2 * Math.PI * R * C);
      const fo_rc = 1 / (2 * Math.PI * R * C * Math.sqrt(6));

      return {
        outputs: [
          { key: 'fo_wien', label: 'Wien Bridge Frequency', symbol: 'f_o(Wien)', value: Number(fo_wien.toFixed(2)), unit: 'Hz', highlight: true },
          { key: 'fo_rc', label: 'RC Phase Shift Frequency', symbol: 'f_o(RC)', value: Number(fo_rc.toFixed(2)), unit: 'Hz' },
          { key: 'wien_gain', label: 'Required Wien Gain (A_v)', symbol: 'A_v', value: 3.0, unit: 'V/V' },
          { key: 'rc_gain', label: 'Required RC Phase Shift Gain', symbol: 'A_v', value: 29.0, unit: 'V/V' }
        ],
        steps: [
          `Step 1: Given: R = ${R_k} kΩ (${R} Ω), C = ${C_u} μF (${C.toExponential(3)} F)`,
          `Step 2: Wien Bridge Frequency: f_o = 1 / (2π · R · C) = 1 / (2 × 3.14159 × ${R} × ${C.toExponential(3)}) = ${fo_wien.toFixed(2)} Hz`,
          `Step 3: Wien Bridge Gain condition: |A_v · β| ≥ 1. Since β = 1/3, amplifier gain must satisfy A_v = 1 + R_f/R_1 ≥ 3 (i.e. R_f ≥ 2·R_1)`,
          `Step 4: RC Phase Shift Frequency: f_o = 1 / (2π · R · C · √6) = 1 / (2π × ${R} × ${C.toExponential(3)} × 2.449) = ${fo_rc.toFixed(2)} Hz`,
          `Step 5: RC Phase Shift Gain condition: Each RC section provides 60° shift. Total attenuation is 1/29, so |A_v| ≥ 29 is mandatory.`
        ]
      };
    },
    tags: ['oscillators', 'wien bridge', 'rc phase shift', 'barkhausen', 'aec', '21ec33']
  },

  {
    id: 'aec-bjt-voltage-divider-bias',
    semesters: [3],
    subjectCode: '21EC33',
    subjectName: 'Analog Electronic Circuits',
    category: 'Analog',
    module: 2,
    title: 'BJT Voltage Divider Bias Q-Point & Stability Factor',
    formulaDisplay: 'V_{th} = V_{CC} · R₂ / (R₁ + R₂)  |  I_C = (V_{th} - V_{BE}) / (R_E + R_{th}/β)',
    plainFormula: 'Vth = VCC * R2 / (R1 + R2), Rth = R1 || R2, IC = (Vth - VBE) / (RE + Rth/beta), VCE = VCC - IC*(RC + RE)',
    description: 'Calculates DC quiescent operating point (Q-point: I_CQ, V_CEQ) and stability factor S for the standard emitter-stabilized voltage divider biased BJT circuit.',
    keyInsights: [
      'Voltage divider bias provides excellent Q-point stability against temperature variations and β variations.',
      'Rule of thumb for good design: R_th ≤ 0.1 · β · R_E.',
      'Stability factor S approaches 1 when (R_th / R_E) is small.'
    ],
    variables: [
      { key: 'vcc', name: 'Supply Voltage (V_CC)', symbol: 'V_CC', defaultValue: 12, unit: 'V', min: 1 },
      { key: 'r1', name: 'Divider Resistor 1 (R₁)', symbol: 'R₁', defaultValue: 33, unit: 'kΩ', min: 1 },
      { key: 'r2', name: 'Divider Resistor 2 (R₂)', symbol: 'R₂', defaultValue: 10, unit: 'kΩ', min: 0.5 },
      { key: 'rc', name: 'Collector Resistor (R_C)', symbol: 'R_C', defaultValue: 2.2, unit: 'kΩ', min: 0.1 },
      { key: 're', name: 'Emitter Resistor (R_E)', symbol: 'R_E', defaultValue: 1.0, unit: 'kΩ', min: 0.05 },
      { key: 'beta', name: 'Transistor Gain (β)', symbol: 'β', defaultValue: 100, unit: 'dimensionless', min: 10 }
    ],
    sampleProblems: [
      {
        title: 'VTU Jan 2020 Question Paper',
        vtuExamReference: 'VTU 18EC34 [8 Marks]',
        problemStatement: 'For a silicon transistor circuit with VCC = 12 V, R1 = 33 kΩ, R2 = 10 kΩ, RC = 2.2 kΩ, RE = 1 kΩ, β = 100 and VBE = 0.7 V, calculate ICQ and VCEQ.',
        inputs: { vcc: 12, r1: 33, r2: 10, rc: 2.2, re: 1.0, beta: 100 },
        expectedOutputSummary: 'ICQ ≈ 1.95 mA, VCEQ ≈ 5.76 V'
      }
    ],
    calculate: (inputs) => {
      const VCC = inputs.vcc || 12;
      const R1 = (inputs.r1 || 33) * 1000;
      const R2 = (inputs.r2 || 10) * 1000;
      const RC = (inputs.rc || 2.2) * 1000;
      const RE = (inputs.re || 1.0) * 1000;
      const beta = inputs.beta || 100;
      const VBE = 0.7; // Silicon

      const Vth = (VCC * R2) / (R1 + R2);
      const Rth = (R1 * R2) / (R1 + R2);
      const IC = (Vth - VBE) / (RE + Rth / beta);
      const VCE = VCC - IC * (RC + RE);
      const S = (1 + beta) / (1 + (beta * RE) / (Rth + RE));

      return {
        outputs: [
          { key: 'icq', label: 'Quiescent Collector Current (I_CQ)', symbol: 'I_CQ', value: Number((IC * 1000).toFixed(3)), unit: 'mA', highlight: true },
          { key: 'vceq', label: 'Quiescent Collector-Emitter Voltage (V_CEQ)', symbol: 'V_CEQ', value: Number(VCE.toFixed(2)), unit: 'V', highlight: true },
          { key: 'vth', label: 'Thevenin Base Voltage (V_th)', symbol: 'V_th', value: Number(Vth.toFixed(3)), unit: 'V' },
          { key: 'rth', label: 'Thevenin Base Resistance (R_th)', symbol: 'R_th', value: Number((Rth / 1000).toFixed(2)), unit: 'kΩ' },
          { key: 'stability', label: 'Stability Factor (S)', symbol: 'S', value: Number(S.toFixed(2)), unit: 'dimensionless' }
        ],
        steps: [
          `Step 1: Calculate Thevenin voltage at base: V_th = V_CC × [R₂ / (R₁ + R₂)] = ${VCC} × [${(R2/1000)} / (${(R1/1000)} + ${(R2/1000)})] = ${Vth.toFixed(3)} V`,
          `Step 2: Calculate Thevenin resistance: R_th = R₁ || R₂ = (${(R1/1000)} × ${(R2/1000)}) / (${(R1/1000)} + ${(R2/1000)}) = ${(Rth/1000).toFixed(2)} kΩ`,
          `Step 3: Base loop KVL: V_th - I_B·R_th - V_BE - I_E·R_E = 0`,
          `Step 4: Solve for I_C: I_CQ = (V_th - V_BE) / [R_E + R_th/β] = (${Vth.toFixed(3)} - 0.7) / [${RE} + ${(Rth/beta).toFixed(1)}] = ${(IC * 1000).toFixed(3)} mA`,
          `Step 5: Collector loop KVL: V_CEQ = V_CC - I_C·(R_C + R_E) = ${VCC} - ${(IC*1000).toFixed(3)} mA × ${((RC+RE)/1000).toFixed(1)} kΩ = ${VCE.toFixed(2)} V`
        ]
      };
    },
    tags: ['bjt biasing', 'q point', 'voltage divider', 'stability factor', 'aec', '21ec33']
  },

  {
    id: 'dsd-power-delay-product',
    semesters: [3],
    subjectCode: '21EC34',
    subjectName: 'Digital System Design',
    category: 'Digital',
    module: 1,
    title: 'Digital IC Propagation Delay & Power-Delay Product (PDP)',
    formulaDisplay: 't_{pd} = (t_{pHL} + t_{pLH}) / 2  |  PDP = P_{diss} · t_{pd}  |  NM_H = V_{OH} - V_{IH}',
    plainFormula: 'tpd = (tpHL + tpLH)/2, PDP = Pd * tpd, NMH = VOH - VIH, NML = VIL - VOL',
    description: 'Computes average propagation delay, Power-Delay Product (PDP in Joules/femtojoules), and High/Low noise margins for logic gates.',
    keyInsights: [
      'PDP represents the figure of merit for a digital logic family (smaller PDP is superior).',
      'High noise margin NM_H = V_OH - V_IH; Low noise margin NM_L = V_IL - V_OL.',
      'CMOS logic achieves significantly lower static power and better PDP than TTL.'
    ],
    variables: [
      { key: 'tphl', name: 'High-to-Low Delay (t_pHL)', symbol: 't_pHL', defaultValue: 2.5, unit: 'ns', min: 0.01, step: 0.1 },
      { key: 'tplh', name: 'Low-to-High Delay (t_pLH)', symbol: 't_pLH', defaultValue: 3.5, unit: 'ns', min: 0.01, step: 0.1 },
      { key: 'power', name: 'Power Dissipation (P_diss)', symbol: 'P_diss', defaultValue: 1.2, unit: 'mW', min: 0.01, step: 0.1 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC34 [5 Marks]',
        problemStatement: 'A CMOS NAND gate has tpHL = 2.5 ns, tpLH = 3.5 ns and average power dissipation of 1.2 mW. Calculate the average propagation delay and Power-Delay Product.',
        inputs: { tphl: 2.5, tplh: 3.5, power: 1.2 },
        expectedOutputSummary: 'tpd = 3.0 ns, PDP = 3.6 pJ (3600 fJ)'
      }
    ],
    calculate: (inputs) => {
      const tpHL = inputs.tphl || 2.5;
      const tpLH = inputs.tplh || 3.5;
      const P_mW = inputs.power || 1.2;

      const tpd_ns = (tpHL + tpLH) / 2;
      const tpd_s = tpd_ns * 1e-9;
      const P_w = P_mW * 1e-3;
      const pdp_j = P_w * tpd_s;
      const pdp_pj = pdp_j * 1e12;
      const pdp_fj = pdp_j * 1e15;

      return {
        outputs: [
          { key: 'tpd', label: 'Average Propagation Delay (t_pd)', symbol: 't_pd', value: Number(tpd_ns.toFixed(2)), unit: 'ns', highlight: true },
          { key: 'pdp_pj', label: 'Power-Delay Product (PDP)', symbol: 'PDP', value: Number(pdp_pj.toFixed(3)), unit: 'pJ', highlight: true },
          { key: 'pdp_fj', label: 'PDP in Femtojoules', symbol: 'PDP', value: Number(pdp_fj.toFixed(1)), unit: 'fJ' }
        ],
        steps: [
          `Step 1: Given: t_pHL = ${tpHL} ns, t_pLH = ${tpLH} ns, Power = ${P_mW} mW`,
          `Step 2: Average propagation delay: t_pd = (t_pHL + t_pLH) / 2 = (${tpHL} + ${tpLH}) / 2 = ${tpd_ns.toFixed(2)} ns`,
          `Step 3: Power-Delay Product: PDP = P_diss × t_pd = (${P_mW} × 10⁻³ W) × (${tpd_ns} × 10⁻⁹ s) = ${pdp_j.toExponential(3)} Joules`,
          `Step 4: Convert to engineering units: PDP = ${pdp_pj.toFixed(3)} pJ (${pdp_fj.toFixed(1)} fJ)`
        ]
      };
    },
    tags: ['digital', 'propagation delay', 'pdp', 'noise margin', '21ec34']
  },

  // ==========================================
  // SEMESTER 4: COMMUNICATION & ELECTROMAGNETICS
  // ==========================================
  {
    id: 'comm-am-modulation',
    semesters: [4],
    subjectCode: '21EC42',
    subjectName: 'Principles of Communication / Analog Comm',
    category: 'Communication',
    module: 1,
    title: 'Amplitude Modulation (AM) Power & Transmission Efficiency',
    formulaDisplay: 'μ = A_m / A_c  |  P_t = P_c · (1 + μ² / 2)  |  η = μ² / (2 + μ²)',
    plainFormula: 'mu = Am / Ac, Pt = Pc * (1 + (mu^2)/2), eta = (mu^2) / (2 + mu^2), BW = 2 * fm',
    description: 'Calculates the modulation index (μ), sideband power, total transmitted power, transmission efficiency, and RF bandwidth of an AM DSB-FC wave.',
    keyInsights: [
      'For distortion-free envelope detection, modulation index must not exceed 1.0 (μ ≤ 1).',
      'At 100% modulation (μ = 1.0), total transmitted power increases by 50% above carrier power.',
      'Maximum theoretical efficiency of standard AM is only 33.33% because the carrier wastes 66.7% of total power.'
    ],
    variables: [
      { key: 'pc', name: 'Carrier Power (P_c)', symbol: 'P_c', defaultValue: 10, unit: 'kW', min: 0.1, step: 0.5 },
      { key: 'mu', name: 'Modulation Index (μ)', symbol: 'μ', defaultValue: 0.8, unit: 'fraction', min: 0.05, max: 1.5, step: 0.05 },
      { key: 'fm', name: 'Modulating Frequency (f_m)', symbol: 'f_m', defaultValue: 5, unit: 'kHz', min: 0.1 }
    ],
    sampleProblems: [
      {
        title: 'VTU Jan 2023 Exam Paper',
        vtuExamReference: 'VTU 21EC42 [8 Marks]',
        problemStatement: 'An AM transmitter radiates 10 kW with carrier unmodulated. If the depth of modulation is 80% (μ = 0.8) and audio frequency is 5 kHz, calculate total radiated power, sideband power, efficiency, and bandwidth.',
        inputs: { pc: 10, mu: 0.8, fm: 5 },
        expectedOutputSummary: 'Pt = 13.2 kW, Psb = 3.2 kW, η = 24.24%, BW = 10 kHz'
      }
    ],
    calculate: (inputs) => {
      const Pc = inputs.pc || 10;
      const mu = inputs.mu || 0.8;
      const fm = inputs.fm || 5;

      const Pt = Pc * (1 + (mu * mu) / 2);
      const Psb = Pt - Pc;
      const Pusb = Psb / 2;
      const Plsb = Psb / 2;
      const eta = ((mu * mu) / (2 + mu * mu)) * 100;
      const BW = 2 * fm;

      return {
        outputs: [
          { key: 'pt', label: 'Total Transmitted Power (P_t)', symbol: 'P_t', value: Number(Pt.toFixed(3)), unit: 'kW', highlight: true },
          { key: 'psb', label: 'Total Sideband Power (P_sb)', symbol: 'P_sb', value: Number(Psb.toFixed(3)), unit: 'kW' },
          { key: 'pusb', label: 'Upper Sideband Power (P_usb)', symbol: 'P_usb', value: Number(Pusb.toFixed(3)), unit: 'kW' },
          { key: 'eta', label: 'Modulation Efficiency (η)', symbol: 'η', value: Number(eta.toFixed(2)), unit: '%', highlight: true },
          { key: 'bw', label: 'Transmission Bandwidth (BW)', symbol: 'BW', value: Number(BW.toFixed(2)), unit: 'kHz' }
        ],
        steps: [
          `Step 1: Given: Unmodulated Carrier Power P_c = ${Pc} kW, Modulation index μ = ${mu}, Audio tone f_m = ${fm} kHz`,
          `Step 2: Total Radiated Power: P_t = P_c · [1 + μ² / 2] = ${Pc} · [1 + (${mu})² / 2] = ${Pc} · [1 + ${(mu*mu/2).toFixed(4)}] = ${Pt.toFixed(3)} kW`,
          `Step 3: Total Sideband Power: P_sb = P_t - P_c = ${Pt.toFixed(3)} - ${Pc} = ${Psb.toFixed(3)} kW`,
          `Step 4: Power per sideband: P_usb = P_lsb = P_sb / 2 = ${(Psb/2).toFixed(3)} kW`,
          `Step 5: Transmission Efficiency: η = [P_sb / P_t] = [μ² / (2 + μ²)] = [${(mu*mu).toFixed(4)} / ${(2 + mu*mu).toFixed(4)}] = ${eta.toFixed(2)}%`,
          `Step 6: AM RF Bandwidth: BW = 2 × f_m = 2 × ${fm} = ${BW.toFixed(2)} kHz`
        ]
      };
    },
    tags: ['amplitude modulation', 'am', 'power', 'efficiency', 'sidebands', 'communication', '21ec42']
  },

  {
    id: 'comm-fm-carson-bandwidth',
    semesters: [4],
    subjectCode: '21EC42',
    subjectName: 'Principles of Communication / Analog Comm',
    category: 'Communication',
    module: 2,
    title: "Frequency Modulation (FM) Carson's Rule Bandwidth",
    formulaDisplay: 'β = Δf / f_m  |  BW = 2 · (Δf + f_m) = 2 · f_m · (β + 1)',
    plainFormula: 'beta = delta_f / fm, BW = 2 * (delta_f + fm) = 2 * fm * (beta + 1)',
    description: "Calculates modulation index (β), maximum frequency deviation (Δf), and Carson's rule transmission bandwidth for Frequency Modulation.",
    keyInsights: [
      "Carson's rule accounts for ~98% of total transmitted FM signal power.",
      'Narrowband FM (NBFM): β << 1, BW ≈ 2·f_m (same as AM).',
      'Wideband FM (WBFM): β >> 1, BW ≈ 2·Δf (commercial FM broadcast standard uses Δf = 75 kHz).'
    ],
    variables: [
      { key: 'delta_f', name: 'Frequency Deviation (Δf)', symbol: 'Δf', defaultValue: 75, unit: 'kHz', min: 1, step: 1 },
      { key: 'fm', name: 'Modulating Frequency (f_m)', symbol: 'f_m', defaultValue: 15, unit: 'kHz', min: 0.1, step: 0.5 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question Paper 2022',
        vtuExamReference: 'VTU 21EC42 [6 Marks]',
        problemStatement: 'In an FM system, the maximum frequency deviation is 75 kHz and modulating signal frequency is 15 kHz. Determine the modulation index and transmission bandwidth using Carson’s rule.',
        inputs: { delta_f: 75, fm: 15 },
        expectedOutputSummary: 'β = 5.0, BW = 180 kHz'
      }
    ],
    calculate: (inputs) => {
      const delta_f = inputs.delta_f || 75;
      const fm = inputs.fm || 15;

      const beta = delta_f / fm;
      const BW = 2 * (delta_f + fm);
      const isNarrowband = beta < 0.2;

      return {
        outputs: [
          { key: 'beta', label: 'FM Modulation Index (β)', symbol: 'β', value: Number(beta.toFixed(3)), unit: 'rad', highlight: true },
          { key: 'bw', label: "Carson's Rule Bandwidth", symbol: 'BW', value: Number(BW.toFixed(2)), unit: 'kHz', highlight: true },
          { key: 'type', label: 'FM Classification', symbol: 'Type', value: isNarrowband ? 'Narrowband FM (NBFM)' : 'Wideband FM (WBFM)', unit: '' }
        ],
        steps: [
          `Step 1: Given: Frequency Deviation Δf = ${delta_f} kHz, Modulating Frequency f_m = ${fm} kHz`,
          `Step 2: FM Modulation Index: β = Δf / f_m = ${delta_f} / ${fm} = ${beta.toFixed(3)}`,
          `Step 3: Carson's Rule Formula: BW = 2 · (Δf + f_m) = 2 · f_m · (1 + β)`,
          `Step 4: Substitute values: BW = 2 · (${delta_f} + ${fm}) = 2 · (${(delta_f + fm)}) = ${BW.toFixed(2)} kHz`,
          `Step 5: System is ${isNarrowband ? 'NBFM' : 'WBFM'} since modulation index β is ${isNarrowband ? '<< 1' : '>= 1'}.`
        ]
      };
    },
    tags: ['frequency modulation', 'fm', 'carson rule', 'bandwidth', 'deviation', '21ec42']
  },

  {
    id: 'comm-friis-noise-cascaded',
    semesters: [4],
    subjectCode: '21EC42',
    subjectName: 'Principles of Communication',
    category: 'Communication',
    module: 4,
    title: 'Friis Formula for Cascaded Noise Figure & Noise Temperature',
    formulaDisplay: 'F_{total} = F₁ + (F₂ - 1)/G₁ + (F₃ - 1)/(G₁·G₂)  |  T_e = T_0 · (F - 1)',
    plainFormula: 'F_cascaded = F1 + (F2 - 1)/G1 + (F3 - 1)/(G1*G2), Te = T0 * (F - 1), F_dB = 10 * log10(F)',
    description: 'Computes overall noise figure and equivalent noise temperature of multi-stage RF receiver front-ends according to Friis formula.',
    keyInsights: [
      'The noise figure of the first RF stage (Low Noise Amplifier - LNA) overwhelmingly dominates overall receiver sensitivity.',
      'High gain in stage 1 drastically suppresses noise contributions of subsequent mixer and IF stages.',
      'Always convert dB values to linear scale before substituting into Friis formula!'
    ],
    variables: [
      { key: 'f1_db', name: 'Stage 1 Noise Figure (F₁)', symbol: 'NF₁', defaultValue: 2.0, unit: 'dB', min: 0.1, step: 0.1 },
      { key: 'g1_db', name: 'Stage 1 Power Gain (G₁)', symbol: 'G₁', defaultValue: 15.0, unit: 'dB', min: 1, step: 0.5 },
      { key: 'f2_db', name: 'Stage 2 Noise Figure (F₂)', symbol: 'NF₂', defaultValue: 6.0, unit: 'dB', min: 0.1, step: 0.1 },
      { key: 'g2_db', name: 'Stage 2 Power Gain (G₂)', symbol: 'G₂', defaultValue: 20.0, unit: 'dB', min: 1, step: 0.5 },
      { key: 'f3_db', name: 'Stage 3 Noise Figure (F₃)', symbol: 'NF₃', defaultValue: 12.0, unit: 'dB', min: 0.1, step: 0.5 }
    ],
    sampleProblems: [
      {
        title: 'VTU Jan 2020 Exam Paper',
        vtuExamReference: 'VTU 18EC42 [8 Marks]',
        problemStatement: 'A receiver front end consists of an LNA (NF = 2 dB, G = 15 dB), a mixer (NF = 6 dB, G = 20 dB) and an IF amplifier (NF = 12 dB). Calculate the overall noise figure in dB and equivalent noise temperature at T0 = 290 K.',
        inputs: { f1_db: 2.0, g1_db: 15.0, f2_db: 6.0, g2_db: 20.0, f3_db: 12.0 },
        expectedOutputSummary: 'NF_total ≈ 2.25 dB, Te ≈ 197 K'
      }
    ],
    calculate: (inputs) => {
      const f1_db = inputs.f1_db || 2.0;
      const g1_db = inputs.g1_db || 15.0;
      const f2_db = inputs.f2_db || 6.0;
      const g2_db = inputs.g2_db || 20.0;
      const f3_db = inputs.f3_db || 12.0;

      // Convert dB to linear
      const F1 = Math.pow(10, f1_db / 10);
      const G1 = Math.pow(10, g1_db / 10);
      const F2 = Math.pow(10, f2_db / 10);
      const G2 = Math.pow(10, g2_db / 10);
      const F3 = Math.pow(10, f3_db / 10);

      const term2 = (F2 - 1) / G1;
      const term3 = (F3 - 1) / (G1 * G2);
      const F_total = F1 + term2 + term3;
      const NF_total_db = 10 * Math.log10(F_total);
      const T0 = 290;
      const Te = T0 * (F_total - 1);

      return {
        outputs: [
          { key: 'nf_total_db', label: 'Overall Noise Figure (NF)', symbol: 'NF_total', value: Number(NF_total_db.toFixed(3)), unit: 'dB', highlight: true },
          { key: 'f_total_lin', label: 'Overall Linear Noise Factor', symbol: 'F_total', value: Number(F_total.toFixed(4)), unit: 'ratio' },
          { key: 'te', label: 'Equivalent Noise Temp (T_e)', symbol: 'T_e', value: Number(Te.toFixed(1)), unit: 'K', highlight: true }
        ],
        steps: [
          `Step 1: Convert all dB figures to linear ratios:`,
          `        F₁ = 10^(${f1_db}/10) = ${F1.toFixed(3)}, G₁ = 10^(${g1_db}/10) = ${G1.toFixed(2)}`,
          `        F₂ = 10^(${f2_db}/10) = ${F2.toFixed(3)}, G₂ = 10^(${g2_db}/10) = ${G2.toFixed(2)}, F₃ = 10^(${f3_db}/10) = ${F3.toFixed(3)}`,
          `Step 2: Apply Friis cascaded formula: F = F₁ + (F₂ - 1)/G₁ + (F₃ - 1)/(G₁ × G₂)`,
          `Step 3: Compute stage contributions: Stage 2 contribution = (${F2.toFixed(3)} - 1)/${G1.toFixed(2)} = ${term2.toFixed(4)}`,
          `        Stage 3 contribution = (${F3.toFixed(3)} - 1)/(${G1.toFixed(2)} × ${G2.toFixed(2)}) = ${term3.toFixed(5)}`,
          `Step 4: Sum linear factors: F_total = ${F1.toFixed(3)} + ${term2.toFixed(4)} + ${term3.toFixed(5)} = ${F_total.toFixed(4)}`,
          `Step 5: Convert back to dB: NF = 10 · log₁₀(${F_total.toFixed(4)}) = ${NF_total_db.toFixed(3)} dB`,
          `Step 6: Equivalent Noise Temperature: T_e = 290 · (${F_total.toFixed(4)} - 1) = ${Te.toFixed(1)} K`
        ]
      };
    },
    tags: ['friis formula', 'noise figure', 'noise temperature', 'cascaded', 'lna', 'rf receiver', '21ec42']
  },

  {
    id: 'comm-pcm-nyquist',
    semesters: [4],
    subjectCode: '21EC42',
    subjectName: 'Principles of Communication',
    category: 'Communication',
    module: 5,
    title: 'PCM Transmission: Nyquist Rate, Bit Rate & Quantization SNR',
    formulaDisplay: 'f_s = 2 · f_{max}  |  R_b = n · f_s  |  (SNR)_{dB} = 1.76 + 6.02 · n',
    plainFormula: 'fs = 2 * fm, Rb = n * fs, SNR_dB = 1.76 + 6.02 * n, Delta = Vpp / (2^n)',
    description: 'Solves minimum Nyquist sampling rate, transmission bit rate (R_b), step size (Δ), and theoretical peak signal-to-quantization-noise ratio (SQNR) for Pulse Code Modulation.',
    keyInsights: [
      'Each additional bit of quantization increases SQNR by approximately 6 dB (the 6 dB per bit rule).',
      'Sampling below Nyquist rate (f_s < 2 f_max) causes irreversible aliasing distortion.',
      'Quantization step size Δ = V_pp / 2^n; Quantization noise power N_q = Δ² / 12.'
    ],
    variables: [
      { key: 'fmax', name: 'Max Signal Frequency (f_max)', symbol: 'f_max', defaultValue: 3.4, unit: 'kHz', min: 0.1, step: 0.1 },
      { key: 'n_bits', name: 'Number of Bits per Sample (n)', symbol: 'n', defaultValue: 8, unit: 'bits', min: 1, max: 24, step: 1 },
      { key: 'vpp', name: 'Peak-to-Peak Input Range (V_pp)', symbol: 'V_pp', defaultValue: 10, unit: 'V', min: 0.5 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC42 [8 Marks]',
        problemStatement: 'A voice signal has maximum frequency component of 3.4 kHz and is digitized using 8-bit PCM with peak-to-peak range of 10 V. Find the Nyquist rate, transmission bit rate, quantization step size, and SQNR in dB.',
        inputs: { fmax: 3.4, n_bits: 8, vpp: 10 },
        expectedOutputSummary: 'fs = 6.8 kHz, Rb = 54.4 kbps, Δ = 39.06 mV, SQNR = 49.92 dB'
      }
    ],
    calculate: (inputs) => {
      const fmax = inputs.fmax || 3.4;
      const n = Math.round(inputs.n_bits || 8);
      const Vpp = inputs.vpp || 10;

      const fs = 2 * fmax;
      const Rb = n * fs;
      const levels = Math.pow(2, n);
      const delta = (Vpp / levels) * 1000; // in mV
      const snr_db = 1.76 + 6.02 * n;

      return {
        outputs: [
          { key: 'fs', label: 'Nyquist Sampling Rate (f_s)', symbol: 'f_s', value: Number(fs.toFixed(2)), unit: 'kHz', highlight: true },
          { key: 'rb', label: 'Transmission Bit Rate (R_b)', symbol: 'R_b', value: Number(Rb.toFixed(2)), unit: 'kbps', highlight: true },
          { key: 'levels', label: 'Quantization Levels (2ⁿ)', symbol: 'L', value: levels, unit: 'levels' },
          { key: 'delta', label: 'Step Size (Δ)', symbol: 'Δ', value: Number(delta.toFixed(2)), unit: 'mV' },
          { key: 'sqnr', label: 'Peak Signal-to-Quantization Noise', symbol: 'SQNR', value: Number(snr_db.toFixed(2)), unit: 'dB', highlight: true }
        ],
        steps: [
          `Step 1: Given: Max signal bandwidth f_max = ${fmax} kHz, n = ${n} bits/sample, Dynamic range V_pp = ${Vpp} V`,
          `Step 2: Nyquist Sampling Frequency: f_s = 2 × f_max = 2 × ${fmax} = ${fs.toFixed(2)} kHz (${(fs * 1000).toFixed(0)} samples/sec)`,
          `Step 3: Bit Rate: R_b = n × f_s = ${n} × ${fs.toFixed(2)} kHz = ${Rb.toFixed(2)} kbps`,
          `Step 4: Quantization levels: L = 2^n = 2^${n} = ${levels}`,
          `Step 5: Step size: Δ = V_pp / L = ${Vpp} / ${levels} = ${(Vpp / levels).toExponential(3)} V = ${delta.toFixed(2)} mV`,
          `Step 6: Theoretical Peak SQNR: (SNR)_dB = 1.76 + 6.02 × n = 1.76 + 6.02 × ${n} = ${snr_db.toFixed(2)} dB`
        ]
      };
    },
    tags: ['pcm', 'nyquist', 'sampling', 'quantization', 'sqnr', 'bit rate', '21ec42']
  },

  {
    id: 'em-vswr-reflection',
    semesters: [4],
    subjectCode: '21EC43',
    subjectName: 'Electromagnetic Waves & Transmission Lines',
    category: 'Electromagnetics',
    module: 4,
    title: 'Transmission Line Reflection Coefficient (Γ) & VSWR (S)',
    formulaDisplay: 'Γ = (Z_L - Z_0) / (Z_L + Z_0)  |  S = (1 + |Γ|) / (1 - |Γ|)  |  RL = -20 · log₁₀(|Γ|)',
    plainFormula: 'Gamma = (ZL - Z0)/(ZL + Z0), VSWR = (1 + |Gamma|)/(1 - |Gamma|), Return Loss = -20 * log10(|Gamma|)',
    description: 'Solves complex reflection coefficient, Voltage Standing Wave Ratio (VSWR), Return Loss (dB), and percentage of reflected power on RF transmission lines.',
    keyInsights: [
      'Perfect match: Z_L = Z_0 → Γ = 0, VSWR = 1.0 (no reflected power).',
      'Open circuit (Z_L = ∞) or Short circuit (Z_L = 0) results in total reflection: |Γ| = 1, VSWR = ∞.',
      'A practical RF system typically targets VSWR ≤ 1.5 (less than 4% reflected power).'
    ],
    variables: [
      { key: 'z0', name: 'Characteristic Impedance (Z_0)', symbol: 'Z_0', defaultValue: 50, unit: 'Ω', min: 10, max: 600 },
      { key: 'zl_real', name: 'Load Resistance Real Part (R_L)', symbol: 'R_L', defaultValue: 100, unit: 'Ω', min: 0 },
      { key: 'zl_imag', name: 'Load Reactance Imag Part (X_L)', symbol: 'X_L', defaultValue: 0, unit: 'Ω' }
    ],
    sampleProblems: [
      {
        title: 'VTU Dec 2022 Exam Paper',
        vtuExamReference: 'VTU 21EC43 [8 Marks]',
        problemStatement: 'A 50 Ω lossless coaxial transmission line is terminated in a load impedance of ZL = (100 + j0) Ω. Calculate the reflection coefficient, VSWR, and Return Loss.',
        inputs: { z0: 50, zl_real: 100, zl_imag: 0 },
        expectedOutputSummary: '|Γ| = 0.333, VSWR = 2.0, Return Loss = 9.54 dB'
      }
    ],
    calculate: (inputs) => {
      const Z0 = inputs.z0 || 50;
      const RL = inputs.zl_real !== undefined ? inputs.zl_real : 100;
      const XL = inputs.zl_imag || 0;

      // Complex arithmetic: ( (RL - Z0) + jXL ) / ( (RL + Z0) + jXL )
      const numR = RL - Z0;
      const numI = XL;
      const denR = RL + Z0;
      const denI = XL;

      const denMagSq = denR * denR + denI * denI;
      const gammaR = (numR * denR + numI * denI) / denMagSq;
      const gammaI = (numI * denR - numR * denI) / denMagSq;

      const gammaMag = Math.sqrt(gammaR * gammaR + gammaI * gammaI);
      const gammaPhaseDeg = (Math.atan2(gammaI, gammaR) * 180) / Math.PI;

      let vswr = 1.0;
      if (gammaMag >= 0.9999) {
        vswr = 999;
      } else {
        vswr = (1 + gammaMag) / (1 - gammaMag);
      }

      const returnLoss = gammaMag > 1e-6 ? -20 * Math.log10(gammaMag) : 100;
      const reflectedPowerPercent = Math.pow(gammaMag, 2) * 100;

      return {
        outputs: [
          { key: 'vswr', label: 'Voltage Standing Wave Ratio (VSWR)', symbol: 'S', value: Number(vswr.toFixed(3)), unit: ':1', highlight: true },
          { key: 'gamma_mag', label: 'Reflection Coefficient Magnitude', symbol: '|Γ|', value: Number(gammaMag.toFixed(4)), unit: 'ratio', highlight: true },
          { key: 'gamma_phase', label: 'Reflection Angle', symbol: '∠Γ', value: Number(gammaPhaseDeg.toFixed(2)), unit: '°' },
          { key: 'return_loss', label: 'Return Loss (RL)', symbol: 'RL', value: Number(returnLoss.toFixed(2)), unit: 'dB' },
          { key: 'refl_pct', label: 'Reflected Power Percentage', symbol: '% P_refl', value: Number(reflectedPowerPercent.toFixed(2)), unit: '%' }
        ],
        steps: [
          `Step 1: Given: Characteristic Impedance Z_0 = ${Z0} Ω, Load Impedance Z_L = (${RL} + j${XL}) Ω`,
          `Step 2: Formula: Γ = (Z_L - Z_0) / (Z_L + Z_0) = [(${RL} - ${Z0}) + j${XL}] / [(${RL} + ${Z0}) + j${XL}]`,
          `Step 3: Evaluate complex division: Γ = ${gammaR.toFixed(4)} + j(${gammaI.toFixed(4)})`,
          `Step 4: Magnitude and Phase: |Γ| = √(${gammaR.toFixed(4)}² + ${gammaI.toFixed(4)}²) = ${gammaMag.toFixed(4)}, ∠Γ = ${gammaPhaseDeg.toFixed(2)}°`,
          `Step 5: VSWR Formula: S = (1 + |Γ|) / (1 - |Γ|) = (1 + ${gammaMag.toFixed(4)}) / (1 - ${gammaMag.toFixed(4)}) = ${(1 + gammaMag).toFixed(4)} / ${(1 - gammaMag).toFixed(4)} = ${vswr.toFixed(3)}`,
          `Step 6: Return Loss: RL = -20 · log₁₀(|Γ|) = -20 · log₁₀(${gammaMag.toFixed(4)}) = ${returnLoss.toFixed(2)} dB`
        ]
      };
    },
    tags: ['vswr', 'reflection coefficient', 'transmission line', 'return loss', 'impedance matching', '21ec43']
  },

  {
    id: 'em-skin-depth',
    semesters: [4],
    subjectCode: '21EC43',
    subjectName: 'Electromagnetic Waves',
    category: 'Electromagnetics',
    module: 2,
    title: 'Skin Depth (δ) & Intrinsic Wave Impedance (η)',
    formulaDisplay: 'δ = 1 / √(π · f · μ · σ)  |  η = √(μ / ε)',
    plainFormula: 'delta = 1 / sqrt(pi * f * mu * sigma), eta_0 = sqrt(mu0 / eps0) approx 377 Ohm',
    description: 'Calculates the electromagnetic penetration depth (skin depth) in good conductors and intrinsic wave impedance of the medium.',
    keyInsights: [
      'At high RF frequencies, current flows only on the thin outer boundary of conductors (skin effect).',
      'Skin depth decreases as frequency and conductivity increase (proportional to 1/√f).',
      'Free space intrinsic wave impedance is universally η₀ ≈ 120π ≈ 376.73 Ω.'
    ],
    variables: [
      { key: 'frequency', name: 'Frequency (f)', symbol: 'f', defaultValue: 100, unit: 'MHz', min: 0.001,
        unitOptions: [{ label: 'MHz', multiplier: 1e6 }, { label: 'GHz', multiplier: 1e9 }, { label: 'kHz', multiplier: 1e3 }] },
      { key: 'sigma', name: 'Conductivity (σ for Copper: 5.8e7)', symbol: 'σ', defaultValue: 5.8e7, unit: 'S/m', min: 1e3 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC43 [6 Marks]',
        problemStatement: 'Calculate the skin depth in copper (σ = 5.8 × 10^7 S/m, μr = 1) at a radio frequency of 100 MHz.',
        inputs: { frequency: 100e6, sigma: 5.8e7 },
        expectedOutputSummary: 'δ ≈ 6.61 μm'
      }
    ],
    calculate: (inputs) => {
      const f = inputs.frequency || 100e6;
      const sigma = inputs.sigma || 5.8e7;
      const mu0 = 4 * Math.PI * 1e-7;

      const delta_m = 1 / Math.sqrt(Math.PI * f * mu0 * sigma);
      const delta_um = delta_m * 1e6;

      return {
        outputs: [
          { key: 'delta_um', label: 'Skin Depth (δ)', symbol: 'δ', value: Number(delta_um.toFixed(3)), unit: 'μm', highlight: true },
          { key: 'delta_m', label: 'Skin Depth in Meters', symbol: 'δ', value: Number(delta_m.toExponential(4)), unit: 'm' },
          { key: 'eta0', label: 'Free Space Intrinsic Impedance', symbol: 'η₀', value: 376.73, unit: 'Ω' }
        ],
        steps: [
          `Step 1: Given: Frequency f = ${f.toExponential(3)} Hz, Conductivity σ = ${sigma.toExponential(3)} S/m, μ = μ₀ = 4π × 10⁻⁷ H/m`,
          `Step 2: Formula: δ = 1 / √(π · f · μ · σ)`,
          `Step 3: Compute radicand: π · f · μ · σ = π · ${f.toExponential(2)} · (4π × 10⁻⁷) · ${sigma.toExponential(2)} = ${(Math.PI * f * mu0 * sigma).toExponential(4)}`,
          `Step 4: Take reciprocal square root: δ = 1 / √(${(Math.PI * f * mu0 * sigma).toExponential(4)}) = ${delta_m.toExponential(4)} m`,
          `Step 5: Convert to micrometers: δ = ${delta_um.toFixed(3)} μm`
        ]
      };
    },
    tags: ['skin depth', 'electromagnetic waves', 'conductivity', 'attenuation', '21ec43']
  },

  // ==========================================
  // SEMESTER 5: DSP, DIGITAL COMM & LIC
  // ==========================================
  {
    id: 'dsp-fft-speedup',
    semesters: [5],
    subjectCode: '21EC51',
    subjectName: 'Digital Signal Processing',
    category: 'Signals & DSP',
    module: 1,
    title: 'Radix-2 FFT Computational Speedup vs Direct DFT',
    formulaDisplay: 'Direct DFT: N²  |  Radix-2 FFT: (N/2) · log₂N  |  Speedup = 2N / log₂N',
    plainFormula: 'DFT_mults = N^2, FFT_mults = (N/2)*log2(N), Speedup = (2*N) / log2(N)',
    description: 'Compares the computational complexity and arithmetic operations (complex multiplications and additions) between standard direct DFT and Radix-2 Cooley-Tukey FFT.',
    keyInsights: [
      'Radix-2 FFT reduces computation from O(N²) to O(N log₂ N), transforming real-time DSP.',
      'For N = 1024, FFT requires only 5,120 multiplications compared to over 1,000,000 for direct DFT!',
      'FFT exploits the symmetry (W_N^{k+N/2} = -W_N^k) and periodicity (W_N^{k+N} = W_N^k) of twiddle factors.'
    ],
    variables: [
      { key: 'n_points', name: 'FFT Transform Length (N = 2ᵐ)', symbol: 'N', defaultValue: 1024, unit: 'points', min: 4, max: 65536, step: 2 }
    ],
    sampleProblems: [
      {
        title: 'VTU Jan 2023 Exam Paper',
        vtuExamReference: 'VTU 21EC51 [6 Marks]',
        problemStatement: 'Calculate the number of complex multiplications required to compute a 1024-point DFT directly and using Radix-2 FFT. Find the percentage computation time saved.',
        inputs: { n_points: 1024 },
        expectedOutputSummary: 'Direct = 1,048,576 mults, FFT = 5,120 mults, Speedup ≈ 204.8× (99.5% savings)'
      }
    ],
    calculate: (inputs) => {
      const N = inputs.n_points || 1024;
      const log2N = Math.log2(N);
      const dftMults = N * N;
      const dftAdds = N * (N - 1);

      const fftMults = (N / 2) * log2N;
      const fftAdds = N * log2N;

      const speedup = dftMults / fftMults;
      const percentSaved = ((dftMults - fftMults) / dftMults) * 100;

      return {
        outputs: [
          { key: 'speedup', label: 'FFT Speedup Factor', symbol: 'Speedup', value: Number(speedup.toFixed(1)), unit: '× faster', highlight: true },
          { key: 'pct_saved', label: 'Multiplication Savings', symbol: '% Saved', value: Number(percentSaved.toFixed(2)), unit: '%', highlight: true },
          { key: 'fft_mults', label: 'FFT Complex Multiplications', symbol: 'M_FFT', value: Math.round(fftMults), unit: 'ops' },
          { key: 'dft_mults', label: 'Direct DFT Multiplications', symbol: 'M_DFT', value: dftMults, unit: 'ops' },
          { key: 'fft_stages', label: 'Number of Butterfly Stages', symbol: 'm = log₂N', value: Number(log2N.toFixed(0)), unit: 'stages' }
        ],
        steps: [
          `Step 1: Given transform points N = ${N}`,
          `Step 2: Number of stages m = log₂(N) = log₂(${N}) = ${log2N.toFixed(0)}`,
          `Step 3: Direct DFT complex multiplications: N² = (${N})² = ${dftMults.toLocaleString()} operations`,
          `Step 4: Radix-2 FFT complex multiplications: (N / 2) · log₂(N) = (${N} / 2) · ${log2N.toFixed(0)} = ${Math.round(fftMults).toLocaleString()} operations`,
          `Step 5: Computational Speedup ratio: N² / [(N/2) log₂N] = 2N / log₂N = (2 × ${N}) / ${log2N.toFixed(0)} = ${speedup.toFixed(1)}×`,
          `Step 6: Computation time saved = [(${dftMults} - ${Math.round(fftMults)}) / ${dftMults}] × 100 = ${percentSaved.toFixed(2)}%`
        ]
      };
    },
    tags: ['dsp', 'fft', 'radix-2', 'dft', 'twiddle factor', 'complexity', '21ec51']
  },

  {
    id: 'dsp-butterworth-order',
    semesters: [5],
    subjectCode: '21EC51',
    subjectName: 'Digital Signal Processing',
    category: 'Signals & DSP',
    module: 4,
    title: 'Butterworth Analog/Digital Filter Order Calculation',
    formulaDisplay: 'N ≥ log₁₀[√( (10^{0.1·α_s} - 1) / (10^{0.1·α_p} - 1) )] / log₁₀(Ω_s / Ω_p)',
    plainFormula: 'N >= log10(sqrt((10^(0.1*As) - 1)/(10^(0.1*Ap) - 1))) / log10(Ws / Wp), wc = Wp / ((10^(0.1*Ap) - 1)^(1/(2N)))',
    description: 'Solves the minimum integer filter order (N) and 3-dB cutoff frequency (Ω_c) for a maximally flat Butterworth lowpass filter specification.',
    keyInsights: [
      'Butterworth filters exhibit maximally flat magnitude response in the passband with no ripples.',
      'Always round order N up to the nearest integer ceiling (e.g., 2.3 → 3).',
      'Roll-off slope beyond cutoff is -20N dB/decade.'
    ],
    variables: [
      { key: 'ap', name: 'Passband Attenuation (α_p)', symbol: 'α_p', defaultValue: 3.0, unit: 'dB', min: 0.1, step: 0.5 },
      { key: 'as', name: 'Stopband Attenuation (α_s)', symbol: 'α_s', defaultValue: 20.0, unit: 'dB', min: 10, step: 1 },
      { key: 'wp', name: 'Passband Edge (Ω_p)', symbol: 'Ω_p', defaultValue: 1000, unit: 'rad/s', min: 10 },
      { key: 'ws', name: 'Stopband Edge (Ω_s)', symbol: 'Ω_s', defaultValue: 2000, unit: 'rad/s', min: 20 }
    ],
    sampleProblems: [
      {
        title: 'VTU Dec 2021 Exam Paper',
        vtuExamReference: 'VTU 18EC52 [8 Marks]',
        problemStatement: 'Design an analog Butterworth lowpass filter with passband attenuation ≤ 3 dB at Ωp = 1000 rad/s and stopband attenuation ≥ 20 dB at Ωs = 2000 rad/s. Find filter order N and 3-dB cutoff frequency Ωc.',
        inputs: { ap: 3.0, as: 20.0, wp: 1000, ws: 2000 },
        expectedOutputSummary: 'N = 4 (exact N ≈ 3.32), Ωc ≈ 1000 rad/s'
      }
    ],
    calculate: (inputs) => {
      const Ap = inputs.ap || 3.0;
      const As = inputs.as || 20.0;
      const Wp = inputs.wp || 1000;
      const Ws = inputs.ws || 2000;

      const numVal = Math.sqrt((Math.pow(10, 0.1 * As) - 1) / (Math.pow(10, 0.1 * Ap) - 1));
      const denVal = Ws / Wp;
      const exactN = Math.log10(numVal) / Math.log10(denVal);
      const N = Math.ceil(exactN);

      // Cutoff based on passband specification
      const Wc = Wp / Math.pow(Math.pow(10, 0.1 * Ap) - 1, 1 / (2 * N));

      return {
        outputs: [
          { key: 'n_order', label: 'Required Filter Order (N)', symbol: 'N', value: N, unit: 'integer', highlight: true },
          { key: 'exact_n', label: 'Exact Unrounded Order', symbol: 'N_calc', value: Number(exactN.toFixed(3)), unit: '' },
          { key: 'wc', label: '3-dB Cutoff Frequency (Ω_c)', symbol: 'Ω_c', value: Number(Wc.toFixed(1)), unit: 'rad/s', highlight: true },
          { key: 'rolloff', label: 'Stopband Roll-off Rate', symbol: 'Slope', value: -20 * N, unit: 'dB/decade' }
        ],
        steps: [
          `Step 1: Given: α_p = ${Ap} dB, α_s = ${As} dB, Ω_p = ${Wp} rad/s, Ω_s = ${Ws} rad/s`,
          `Step 2: Compute numerator term: √[(10^(0.1·α_s) - 1) / (10^(0.1·α_p) - 1)] = √[(${(Math.pow(10, 0.1*As)-1).toFixed(2)}) / (${(Math.pow(10, 0.1*Ap)-1).toFixed(2)})] = ${numVal.toFixed(3)}`,
          `Step 3: Compute transition ratio: Ω_s / Ω_p = ${Ws} / ${Wp} = ${denVal.toFixed(2)}`,
          `Step 4: Formula: N = log₁₀(${numVal.toFixed(3)}) / log₁₀(${denVal.toFixed(2)}) = ${(Math.log10(numVal)).toFixed(4)} / ${(Math.log10(denVal)).toFixed(4)} = ${exactN.toFixed(3)}`,
          `Step 5: Taking ceiling integer: N = ceil(${exactN.toFixed(3)}) = ${N}`,
          `Step 6: Compute cutoff Ω_c = Ω_p / (10^(0.1·α_p) - 1)^(1/(2N)) = ${Wc.toFixed(1)} rad/s`
        ]
      };
    },
    tags: ['butterworth', 'filter design', 'dsp', 'order', 'iir filter', '21ec51']
  },

  {
    id: 'dc-shannon-capacity',
    semesters: [5],
    subjectCode: '21EC52',
    subjectName: 'Digital Communication',
    category: 'Communication',
    module: 1,
    title: 'Shannon-Hartley Channel Capacity Law',
    formulaDisplay: 'C = B · log₂(1 + SNR)  |  (SNR)_{linear} = 10^{(SNR_{dB} / 10)}',
    plainFormula: 'C = B * log2(1 + SNR_lin), SNR_lin = 10^(SNR_dB / 10)',
    description: 'Calculates the absolute maximum error-free data transmission capacity (in bps/Mbps) achievable over an AWGN channel with given bandwidth and signal-to-noise ratio.',
    keyInsights: [
      'Capacity increases linearly with bandwidth B, but only logarithmically with signal power.',
      'As bandwidth B → ∞, channel capacity approaches asymptotic limit C_max = 1.442 · (S / N₀).',
      'Defines the ultimate theoretical boundary of digital communications.'
    ],
    variables: [
      { key: 'bandwidth', name: 'Channel Bandwidth (B)', symbol: 'B', defaultValue: 1, unit: 'MHz', min: 0.001,
        unitOptions: [{ label: 'MHz', multiplier: 1e6 }, { label: 'kHz', multiplier: 1e3 }, { label: 'Hz', multiplier: 1 }] },
      { key: 'snr_db', name: 'Signal-to-Noise Ratio (SNR)', symbol: 'SNR', defaultValue: 30, unit: 'dB', min: -10, max: 80, step: 1 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC52 [6 Marks]',
        problemStatement: 'A standard voice telephone channel has a bandwidth of 3.4 kHz and an SNR of 30 dB. Calculate the maximum theoretical information channel capacity.',
        inputs: { bandwidth: 3400, snr_db: 30 },
        expectedOutputSummary: 'C ≈ 33.89 kbps'
      }
    ],
    calculate: (inputs) => {
      const B = inputs.bandwidth || 1e6;
      const snr_db = inputs.snr_db !== undefined ? inputs.snr_db : 30;

      const snr_lin = Math.pow(10, snr_db / 10);
      const C_bps = B * Math.log2(1 + snr_lin);
      const C_mbps = C_bps / 1e6;
      const C_kbps = C_bps / 1e3;

      return {
        outputs: [
          { key: 'c_mbps', label: 'Channel Capacity (C)', symbol: 'C', value: Number(C_mbps.toFixed(3)), unit: 'Mbps', highlight: true },
          { key: 'c_kbps', label: 'Capacity in kbps', symbol: 'C', value: Number(C_kbps.toFixed(2)), unit: 'kbps' },
          { key: 'snr_lin', label: 'Linear SNR Ratio', symbol: 'SNR', value: Number(snr_lin.toFixed(1)), unit: 'ratio' },
          { key: 'spec_eff', label: 'Spectral Efficiency (C / B)', symbol: 'η_s', value: Number((C_bps / B).toFixed(2)), unit: 'bits/s/Hz' }
        ],
        steps: [
          `Step 1: Given Bandwidth B = ${(B >= 1e6 ? (B/1e6).toFixed(2) + ' MHz' : (B/1e3).toFixed(2) + ' kHz')}, SNR = ${snr_db} dB`,
          `Step 2: Convert SNR from dB to linear ratio: SNR_lin = 10^(${snr_db} / 10) = 10^${(snr_db/10).toFixed(1)} = ${snr_lin.toFixed(1)}`,
          `Step 3: Shannon-Hartley Formula: C = B · log₂(1 + SNR)`,
          `Step 4: Compute logarithmic term: log₂(1 + ${snr_lin.toFixed(1)}) = log₂(${(1 + snr_lin).toFixed(1)}) = ${Math.log2(1 + snr_lin).toFixed(4)} bits/s/Hz`,
          `Step 5: Compute Channel Capacity: C = ${B} × ${Math.log2(1 + snr_lin).toFixed(4)} = ${C_bps.toFixed(0)} bps (${C_mbps.toFixed(3)} Mbps)`
        ]
      };
    },
    tags: ['shannon capacity', 'channel capacity', 'information theory', 'snr', 'digital comm', '21ec52']
  },

  {
    id: 'lic-555-astable',
    semesters: [5],
    subjectCode: '21EC53',
    subjectName: 'Linear Integrated Circuits',
    category: 'Analog',
    module: 4,
    title: 'NE555 Timer Astable Multivibrator Frequency & Duty Cycle',
    formulaDisplay: 'f = 1.44 / [(R_A + 2·R_B) · C]  |  D = (R_A + R_B) / (R_A + 2·R_B) · 100%',
    plainFormula: 't_high = 0.693*(RA + RB)*C, t_low = 0.693*RB*C, f = 1.44 / ((RA + 2*RB)*C), Duty = (RA + RB)/(RA + 2*RB)',
    description: 'Calculates high time (t_high), low time (t_low), oscillation frequency, and output duty cycle of the ubiquitous 555 IC timer in astable mode.',
    keyInsights: [
      'In basic 555 astable circuits, duty cycle is always strictly greater than 50% (because capacitor charges via RA+RB, but discharges only via RB).',
      'For 50% duty cycle, a bypass diode is connected across RB.',
      'Capacitor charges between (1/3)V_CC and (2/3)V_CC.'
    ],
    variables: [
      { key: 'ra', name: 'Timing Resistor R_A', symbol: 'R_A', defaultValue: 4.7, unit: 'kΩ', min: 1, step: 0.5 },
      { key: 'rb', name: 'Timing Resistor R_B', symbol: 'R_B', defaultValue: 10.0, unit: 'kΩ', min: 1, step: 0.5 },
      { key: 'c', name: 'Timing Capacitor C', symbol: 'C', defaultValue: 0.1, unit: 'μF', min: 0.001, step: 0.01 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question Paper 2022',
        vtuExamReference: 'VTU 21EC53 [6 Marks]',
        problemStatement: 'Design a 555 astable multivibrator with RA = 4.7 kΩ, RB = 10 kΩ, and C = 0.1 μF. Find t_high, t_low, output frequency, and duty cycle.',
        inputs: { ra: 4.7, rb: 10.0, c: 0.1 },
        expectedOutputSummary: 't_high = 1.019 ms, t_low = 0.693 ms, f ≈ 583 Hz, Duty Cycle = 59.5%'
      }
    ],
    calculate: (inputs) => {
      const RA = (inputs.ra || 4.7) * 1000;
      const RB = (inputs.rb || 10.0) * 1000;
      const C = (inputs.c || 0.1) * 1e-6;

      const tHigh = 0.693 * (RA + RB) * C;
      const tLow = 0.693 * RB * C;
      const T = tHigh + tLow;
      const f = 1 / T;
      const dutyCycle = (tHigh / T) * 100;

      return {
        outputs: [
          { key: 'f', label: 'Oscillation Frequency', symbol: 'f', value: Number(f.toFixed(2)), unit: 'Hz', highlight: true },
          { key: 'duty', label: 'Duty Cycle', symbol: 'D', value: Number(dutyCycle.toFixed(2)), unit: '%', highlight: true },
          { key: 'thigh', label: 'High Time (t_high)', symbol: 't_high', value: Number((tHigh * 1000).toFixed(3)), unit: 'ms' },
          { key: 'tlow', label: 'Low Time (t_low)', symbol: 't_low', value: Number((tLow * 1000).toFixed(3)), unit: 'ms' },
          { key: 'period', label: 'Total Period (T)', symbol: 'T', value: Number((T * 1000).toFixed(3)), unit: 'ms' }
        ],
        steps: [
          `Step 1: Given: R_A = ${(RA/1000)} kΩ, R_B = ${(RB/1000)} kΩ, C = ${(C*1e6)} μF`,
          `Step 2: Charging time (output HIGH): t_high = 0.693 · (R_A + R_B) · C = 0.693 · (${RA} + ${RB}) · ${C.toExponential(2)} = ${(tHigh * 1000).toFixed(3)} ms`,
          `Step 3: Discharging time (output LOW): t_low = 0.693 · R_B · C = 0.693 · ${RB} · ${C.toExponential(2)} = ${(tLow * 1000).toFixed(3)} ms`,
          `Step 4: Total Period: T = t_high + t_low = ${(tHigh*1000).toFixed(3)} + ${(tLow*1000).toFixed(3)} = ${(T * 1000).toFixed(3)} ms`,
          `Step 5: Output Frequency: f = 1 / T = 1.44 / [(R_A + 2·R_B) · C] = ${f.toFixed(2)} Hz`,
          `Step 6: Duty Cycle: D = (t_high / T) × 100 = [(${(tHigh*1000).toFixed(3)}) / (${(T*1000).toFixed(3)})] × 100 = ${dutyCycle.toFixed(2)}%`
        ]
      };
    },
    tags: ['555 timer', 'astable', 'multivibrator', 'duty cycle', 'lic', '21ec53']
  },

  {
    id: 'lic-opamp-slew-rate',
    semesters: [5],
    subjectCode: '21EC53',
    subjectName: 'Linear Integrated Circuits',
    category: 'Analog',
    module: 1,
    title: 'Op-Amp Slew Rate & Full-Power Bandwidth',
    formulaDisplay: 'SR = 2π · f_{max} · V_p · 10^{-6} V/μs  |  f_{max} = SR / (2π · V_p)',
    plainFormula: 'SR = 2 * pi * fmax * Vp * 1e-6 (in V/us), fmax = (SR * 1e6) / (2 * pi * Vp)',
    description: 'Determines the maximum undistorted sine wave frequency (full-power bandwidth) an op-amp can reproduce before slew-rate distortion occurs.',
    keyInsights: [
      'Slew Rate is the maximum rate of change of output voltage per unit time (typical 741 op-amp is 0.5 V/μs).',
      'Exceeding f_max causes severe triangular distortion and clipping on a sinusoidal input.',
      'Slew rate is caused by internal compensation capacitor charging limitations: SR = I_max / C_c.'
    ],
    variables: [
      { key: 'sr', name: 'Slew Rate (SR)', symbol: 'SR', defaultValue: 0.5, unit: 'V/μs', min: 0.05, step: 0.1 },
      { key: 'vp', name: 'Peak Output Voltage (V_p)', symbol: 'V_p', defaultValue: 10, unit: 'V', min: 0.1, step: 0.5 }
    ],
    sampleProblems: [
      {
        title: 'VTU Jan 2021 Exam Paper',
        vtuExamReference: 'VTU 18EC46 [6 Marks]',
        problemStatement: 'An op-amp has a slew rate of 0.5 V/μs. What is the maximum frequency of an undistorted output sine wave with a peak amplitude of 10 V?',
        inputs: { sr: 0.5, vp: 10 },
        expectedOutputSummary: 'fmax ≈ 7.96 kHz'
      }
    ],
    calculate: (inputs) => {
      const SR = inputs.sr || 0.5; // in V/us
      const Vp = inputs.vp || 10;

      const SR_vps = SR * 1e6; // V/s
      const fmax = SR_vps / (2 * Math.PI * Vp);
      const fmax_khz = fmax / 1000;

      return {
        outputs: [
          { key: 'fmax_khz', label: 'Maximum Undistorted Frequency', symbol: 'f_max', value: Number(fmax_khz.toFixed(2)), unit: 'kHz', highlight: true },
          { key: 'fmax_hz', label: 'Frequency in Hz', symbol: 'f_max', value: Number(fmax.toFixed(1)), unit: 'Hz' }
        ],
        steps: [
          `Step 1: Given: Slew Rate SR = ${SR} V/μs = ${SR_vps.toExponential(2)} V/s, Peak Amplitude V_p = ${Vp} V`,
          `Step 2: Voltage rate of change for sine v(t) = V_p · sin(2πft): dv/dt = 2π · f · V_p · cos(2πft)`,
          `Step 3: Maximum rate of change occurs at zero-crossings: (dv/dt)_max = 2π · f · V_p`,
          `Step 4: Equating to Slew Rate: SR = 2π · f_max · V_p`,
          `Step 5: Solve for f_max: f_max = SR / (2π · V_p) = ${SR_vps.toExponential(2)} / (2 × 3.14159 × ${Vp}) = ${fmax.toFixed(1)} Hz (${fmax_khz.toFixed(2)} kHz)`
        ]
      };
    },
    tags: ['slew rate', 'full power bandwidth', 'op-amp', 'lic', 'distortion', '21ec53']
  },

  // ==========================================
  // SEMESTER 6: CELLULAR, VLSI & MICROWAVE
  // ==========================================
  {
    id: 'cmc-cellular-reuse-sir',
    semesters: [6],
    subjectCode: '21EC61',
    subjectName: 'Cellular & Mobile Communication',
    category: 'Communication',
    module: 1,
    title: 'Cellular Frequency Reuse Cluster Size & Co-Channel SIR',
    formulaDisplay: 'N = i² + ij + j²  |  D = R · √(3N)  |  S/I ≈ (√(3N))^n / 6',
    plainFormula: 'N = i^2 + i*j + j^2, D = R * sqrt(3*N), Q = D/R = sqrt(3*N), SIR_dB = 10 * log10((Q^n) / 6)',
    description: 'Solves cellular cluster size N, co-channel reuse distance D, reuse ratio Q, and worst-case signal-to-interference ratio (SIR) with 6 first-tier interferers.',
    keyInsights: [
      'Permissible cluster sizes N must satisfy N = i² + ij + j² where i, j are non-negative integers (common: 3, 4, 7, 9, 12).',
      'For path loss exponent n = 4, a cluster size of N = 7 provides SIR ≈ 18.7 dB, satisfying the 18 dB AMPS standard requirement.',
      'Larger cluster sizes improve SIR at the expense of overall spectrum capacity.'
    ],
    variables: [
      { key: 'i_shift', name: 'Shift Parameter (i)', symbol: 'i', defaultValue: 2, unit: 'cells', min: 0, step: 1 },
      { key: 'j_shift', name: 'Shift Parameter (j)', symbol: 'j', defaultValue: 1, unit: 'cells', min: 0, step: 1 },
      { key: 'cell_radius', name: 'Cell Radius (R)', symbol: 'R', defaultValue: 2.0, unit: 'km', min: 0.1, step: 0.1 },
      { key: 'path_loss_n', name: 'Path Loss Exponent (n)', symbol: 'n', defaultValue: 4.0, unit: 'exponent', min: 2.0, max: 5.0, step: 0.5 }
    ],
    sampleProblems: [
      {
        title: 'VTU July 2022 Exam',
        vtuExamReference: 'VTU 18EC62 [8 Marks]',
        problemStatement: 'In a cellular mobile system with i = 2, j = 1, cell radius R = 2 km and path loss exponent n = 4, determine cluster size N, reuse distance D, and worst-case co-channel SIR in dB assuming 6 first-tier interferers.',
        inputs: { i_shift: 2, j_shift: 1, cell_radius: 2.0, path_loss_n: 4.0 },
        expectedOutputSummary: 'N = 7, D ≈ 9.17 km, Q = 4.58, SIR ≈ 18.66 dB'
      }
    ],
    calculate: (inputs) => {
      const i = inputs.i_shift || 2;
      const j = inputs.j_shift || 1;
      const R = inputs.cell_radius || 2.0;
      const n = inputs.path_loss_n || 4.0;

      const N = i * i + i * j + j * j;
      const Q = Math.sqrt(3 * N);
      const D = R * Q;

      const sir_lin = Math.pow(Q, n) / 6;
      const sir_db = 10 * Math.log10(sir_lin);

      return {
        outputs: [
          { key: 'cluster_n', label: 'Cluster Size (N)', symbol: 'N', value: N, unit: 'cells', highlight: true },
          { key: 'reuse_dist', label: 'Co-Channel Reuse Distance (D)', symbol: 'D', value: Number(D.toFixed(3)), unit: 'km', highlight: true },
          { key: 'q_ratio', label: 'Co-Channel Reuse Ratio (Q = D/R)', symbol: 'Q', value: Number(Q.toFixed(3)), unit: 'ratio' },
          { key: 'sir_db', label: 'Worst-Case Co-Channel SIR', symbol: 'S / I', value: Number(sir_db.toFixed(2)), unit: 'dB', highlight: true }
        ],
        steps: [
          `Step 1: Given: Shift parameters i = ${i}, j = ${j}, Cell radius R = ${R} km, Path loss exponent n = ${n}`,
          `Step 2: Cluster Size: N = i² + i·j + j² = ${i}² + (${i} × ${j}) + ${j}² = ${i*i} + ${i*j} + ${j*j} = ${N} cells`,
          `Step 3: Co-channel reuse ratio: Q = D / R = √(3N) = √(3 × ${N}) = √(${(3*N)}) = ${Q.toFixed(3)}`,
          `Step 4: Reuse Distance: D = R · √(3N) = ${R} × ${Q.toFixed(3)} = ${D.toFixed(3)} km`,
          `Step 5: Worst-Case SIR with 6 first-tier co-channel cells: S/I = Qⁿ / 6 = (${Q.toFixed(3)})^${n} / 6 = ${(Math.pow(Q, n)).toFixed(1)} / 6 = ${sir_lin.toFixed(2)}`,
          `Step 6: Convert to decibels: (S/I)_dB = 10 · log₁₀(${sir_lin.toFixed(2)}) = ${sir_db.toFixed(2)} dB`
        ]
      };
    },
    tags: ['cellular', 'frequency reuse', 'cluster size', 'sir', 'wireless', '21ec61']
  },

  {
    id: 'vlsi-cmos-dynamic-power',
    semesters: [6],
    subjectCode: '21EC62',
    subjectName: 'VLSI Design',
    category: 'VLSI',
    module: 1,
    title: 'CMOS Dynamic & Total Power Dissipation',
    formulaDisplay: 'P_{dyn} = α · C_L · V_{DD}² · f  |  P_{total} = P_{dyn} + P_{sc} + P_{leak}',
    plainFormula: 'Pdyn = alpha * CL * (VDD^2) * f, Energy = CL * VDD^2',
    description: 'Calculates the dynamic switching power dissipation of CMOS digital logic circuits based on switching activity factor (α), load capacitance, supply voltage, and clock frequency.',
    keyInsights: [
      'Power dissipation scales quadratically with supply voltage V_DD (halving V_DD reduces power by 75%!).',
      'Lowering operating frequency reduces power linearly but does not change energy consumed per operation.',
      'Fundamental metric for low-power VLSI design in modern submicron CMOS nodes.'
    ],
    variables: [
      { key: 'alpha', name: 'Activity Factor (α)', symbol: 'α', defaultValue: 0.2, unit: 'fraction', min: 0.01, max: 1.0, step: 0.05 },
      { key: 'cl', name: 'Total Load Capacitance (C_L)', symbol: 'C_L', defaultValue: 50, unit: 'pF', min: 0.1, step: 5,
        unitOptions: [{ label: 'pF', multiplier: 1e-12 }, { label: 'fF', multiplier: 1e-15 }, { label: 'nF', multiplier: 1e-9 }] },
      { key: 'vdd', name: 'Supply Voltage (V_DD)', symbol: 'V_DD', defaultValue: 1.2, unit: 'V', min: 0.5, max: 5.0, step: 0.1 },
      { key: 'freq', name: 'Clock Frequency (f)', symbol: 'f', defaultValue: 500, unit: 'MHz', min: 1, step: 50,
        unitOptions: [{ label: 'MHz', multiplier: 1e6 }, { label: 'GHz', multiplier: 1e9 }, { label: 'kHz', multiplier: 1e3 }] }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC62 [6 Marks]',
        problemStatement: 'A CMOS processor clock tree has a load capacitance of 50 pF and operates at 500 MHz with VDD = 1.2 V. If average switching activity is 0.2, calculate the dynamic power dissipation.',
        inputs: { alpha: 0.2, cl: 50e-12, vdd: 1.2, freq: 500e6 },
        expectedOutputSummary: 'Pdyn = 7.2 mW'
      }
    ],
    calculate: (inputs) => {
      const alpha = inputs.alpha || 0.2;
      const CL = inputs.cl || 50e-12;
      const VDD = inputs.vdd || 1.2;
      const f = inputs.freq || 500e6;

      const Pdyn_w = alpha * CL * (VDD * VDD) * f;
      const Pdyn_mw = Pdyn_w * 1000;
      const energyPerCycle_pj = CL * (VDD * VDD) * 1e12;

      return {
        outputs: [
          { key: 'pdyn_mw', label: 'Dynamic Power Dissipation', symbol: 'P_dyn', value: Number(Pdyn_mw.toFixed(3)), unit: 'mW', highlight: true },
          { key: 'pdyn_w', label: 'Power in Watts', symbol: 'P_dyn', value: Number(Pdyn_w.toExponential(3)), unit: 'W' },
          { key: 'energy', label: 'Energy per Full Transition', symbol: 'E_switch', value: Number(energyPerCycle_pj.toFixed(2)), unit: 'pJ' }
        ],
        steps: [
          `Step 1: Given: Activity factor α = ${alpha}, Load C_L = ${(CL * 1e12).toFixed(1)} pF, V_DD = ${VDD} V, Clock f = ${(f / 1e6).toFixed(1)} MHz`,
          `Step 2: Formula: P_dyn = α · C_L · V_DD² · f`,
          `Step 3: Square of supply voltage: V_DD² = (${VDD})² = ${(VDD * VDD).toFixed(2)} V²`,
          `Step 4: Compute dynamic power: P_dyn = ${alpha} × ${CL.toExponential(2)} F × ${(VDD * VDD).toFixed(2)} × ${f.toExponential(2)} Hz`,
          `Step 5: Result: P_dyn = ${Pdyn_w.toExponential(3)} W = ${Pdyn_mw.toFixed(3)} mW`
        ]
      };
    },
    tags: ['vlsi', 'cmos', 'dynamic power', 'power dissipation', 'low power', '21ec62']
  },

  {
    id: 'mwa-waveguide-cutoff',
    semesters: [6],
    subjectCode: '21EC63',
    subjectName: 'Microwave & Antennas',
    category: 'Electromagnetics',
    module: 2,
    title: 'Rectangular Waveguide TE₁₀ Dominant Mode Cutoff & Guide Wavelength',
    formulaDisplay: 'f_c = c / (2·a)  |  λ_g = λ₀ / √(1 - (f_c / f)²)  |  v_p = c / √(1 - (f_c / f)²)',
    plainFormula: 'fc = c / (2 * a), lambda0 = c / f, lambdag = lambda0 / sqrt(1 - (fc/f)^2), vp = c / sqrt(1 - (fc/f)^2)',
    description: 'Solves the dominant TE₁₀ mode cutoff frequency (f_c), operating guide wavelength (λ_g), wave impedance (Z_TE), and phase velocity (v_p) inside an air-filled rectangular metallic waveguide.',
    keyInsights: [
      'For standard rectangular waveguides (a = 2b), TE₁₀ has the lowest cutoff frequency of any mode.',
      'Guide wavelength λ_g is always strictly greater than free-space wavelength λ₀.',
      'Signals with frequency below cutoff (f < f_c) cannot propagate and undergo evanescent attenuation.'
    ],
    variables: [
      { key: 'broad_dim', name: 'Waveguide Broad Dimension (a)', symbol: 'a', defaultValue: 2.286, unit: 'cm', min: 0.1, step: 0.1 },
      { key: 'freq', name: 'Operating Frequency (f)', symbol: 'f', defaultValue: 10, unit: 'GHz', min: 1, step: 0.5 }
    ],
    sampleProblems: [
      {
        title: 'VTU Jan 2023 Exam Paper',
        vtuExamReference: 'VTU 21EC63 [8 Marks]',
        problemStatement: 'An X-band rectangular waveguide has dimensions a = 2.286 cm and b = 1.016 cm. If operating frequency is 10 GHz, find cutoff frequency for TE10 mode, guide wavelength λg, and phase velocity vp.',
        inputs: { broad_dim: 2.286, freq: 10 },
        expectedOutputSummary: 'fc = 6.56 GHz, λg ≈ 3.97 cm, vp ≈ 3.97 × 10^8 m/s'
      }
    ],
    calculate: (inputs) => {
      const a_cm = inputs.broad_dim || 2.286;
      const f_ghz = inputs.freq || 10;
      const a_m = a_cm / 100;
      const f_hz = f_ghz * 1e9;
      const c = 3e8;

      const fc_hz = c / (2 * a_m);
      const fc_ghz = fc_hz / 1e9;

      if (f_hz <= fc_hz) {
        return {
          outputs: [
            { key: 'fc', label: 'Cutoff Frequency (f_c)', symbol: 'f_c', value: Number(fc_ghz.toFixed(3)), unit: 'GHz', highlight: true },
            { key: 'status', label: 'Propagation Status', symbol: 'Mode', value: 'EVANESCENT (f ≤ fc: Wave cannot propagate!)', unit: '' }
          ],
          steps: [
            `Step 1: Broad wall dimension a = ${a_cm} cm = ${a_m} m, Operating frequency f = ${f_ghz} GHz`,
            `Step 2: Dominant TE₁₀ cutoff frequency: f_c = c / (2a) = (3 × 10⁸) / (2 × ${a_m}) = ${fc_ghz.toFixed(3)} GHz`,
            `Step 3: Since f (${f_ghz} GHz) < f_c (${fc_ghz.toFixed(3)} GHz), the wave is evanescent and does NOT propagate!`
          ]
        };
      }

      const ratio = fc_hz / f_hz;
      const factor = Math.sqrt(1 - ratio * ratio);
      const lambda0_m = c / f_hz;
      const lambdag_m = lambda0_m / factor;
      const vp = c / factor;
      const eta0 = 377;
      const zte = eta0 / factor;

      return {
        outputs: [
          { key: 'fc', label: 'Cutoff Frequency (f_c)', symbol: 'f_c', value: Number(fc_ghz.toFixed(3)), unit: 'GHz', highlight: true },
          { key: 'lambdag', label: 'Guide Wavelength (λ_g)', symbol: 'λ_g', value: Number((lambdag_m * 100).toFixed(2)), unit: 'cm', highlight: true },
          { key: 'lambda0', label: 'Free-Space Wavelength (λ₀)', symbol: 'λ₀', value: Number((lambda0_m * 100).toFixed(2)), unit: 'cm' },
          { key: 'vp', label: 'Phase Velocity (v_p)', symbol: 'v_p', value: Number((vp / 1e8).toFixed(2)), unit: '× 10⁸ m/s' },
          { key: 'zte', label: 'Wave Impedance (Z_TE)', symbol: 'Z_TE', value: Number(zte.toFixed(1)), unit: 'Ω' }
        ],
        steps: [
          `Step 1: Given: Broad dimension a = ${a_cm} cm = ${a_m} m, Operating frequency f = ${f_ghz} GHz`,
          `Step 2: TE₁₀ Cutoff Frequency: f_c = c / (2a) = (3 × 10⁸) / (2 × ${a_m}) = ${fc_hz.toExponential(3)} Hz = ${fc_ghz.toFixed(3)} GHz`,
          `Step 3: Free space wavelength: λ₀ = c / f = (3 × 10⁸) / (${f_hz.toExponential(2)}) = ${(lambda0_m * 100).toFixed(2)} cm`,
          `Step 4: Radical factor: √(1 - (f_c / f)²) = √(1 - (${fc_ghz.toFixed(3)} / ${f_ghz})²) = √(1 - ${(ratio*ratio).toFixed(4)}) = ${factor.toFixed(4)}`,
          `Step 5: Guide Wavelength: λ_g = λ₀ / √(1 - (f_c/f)²) = ${(lambda0_m * 100).toFixed(2)} / ${factor.toFixed(4)} = ${(lambdag_m * 100).toFixed(2)} cm`,
          `Step 6: Phase velocity: v_p = c / √(1 - (f_c/f)²) = (3 × 10⁸) / ${factor.toFixed(4)} = ${(vp / 1e8).toFixed(2)} × 10⁸ m/s`
        ]
      };
    },
    tags: ['microwave', 'waveguide', 'cutoff frequency', 'guide wavelength', 'te10', '21ec63']
  },

  {
    id: 'mwa-halfwave-dipole',
    semesters: [6],
    subjectCode: '21EC63',
    subjectName: 'Microwave & Antennas',
    category: 'Electromagnetics',
    module: 4,
    title: 'Half-Wave Dipole Antenna Directivity & Effective Aperture',
    formulaDisplay: 'R_r = 73 Ω  |  D_0 = 1.64 (2.15 dBi)  |  A_e = (λ² / 4π) · D_0',
    plainFormula: 'Rr = 73 Ohm, D0 = 1.643, Ae = (lambda^2 / (4*pi)) * D0, Pr = Pt * Gt * Gr * (lambda / (4*pi*d))^2',
    description: 'Computes radiation resistance (73 Ω), maximum directivity (2.15 dBi), and maximum effective aperture (A_e) for a resonant half-wave dipole (λ/2) antenna.',
    keyInsights: [
      'A thin resonant half-wave dipole has an input impedance of Z_in ≈ 73 + j42.5 Ω (often tuned to purely resistive 73 Ω by slightly reducing length to ~0.485λ).',
      'Directivity D₀ = 1.643 corresponds to 2.15 dBi gain over an isotropic radiator.',
      'Effective aperture represents the equivalent physical collecting area capturing RF power.'
    ],
    variables: [
      { key: 'freq', name: 'Operating Frequency (f)', symbol: 'f', defaultValue: 300, unit: 'MHz', min: 1, step: 10,
        unitOptions: [{ label: 'MHz', multiplier: 1e6 }, { label: 'GHz', multiplier: 1e9 }, { label: 'kHz', multiplier: 1e3 }] }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC63 [6 Marks]',
        problemStatement: 'Calculate the physical length and maximum effective aperture of a half-wave dipole antenna operating at 300 MHz.',
        inputs: { freq: 300e6 },
        expectedOutputSummary: 'Length L = 0.5 m, λ = 1.0 m, Ae ≈ 0.131 m²'
      }
    ],
    calculate: (inputs) => {
      const f = inputs.freq || 300e6;
      const c = 3e8;
      const lambda = c / f;
      const length = lambda / 2;
      const D0 = 1.643;
      const D0_dbi = 2.15;
      const Ae = (lambda * lambda * D0) / (4 * Math.PI);

      return {
        outputs: [
          { key: 'length', label: 'Dipole Length (λ/2)', symbol: 'L', value: Number(length.toFixed(3)), unit: 'm', highlight: true },
          { key: 'ae', label: 'Effective Aperture (A_e)', symbol: 'A_e', value: Number(Ae.toFixed(4)), unit: 'm²', highlight: true },
          { key: 'lambda', label: 'Wavelength (λ)', symbol: 'λ', value: Number(lambda.toFixed(3)), unit: 'm' },
          { key: 'd0', label: 'Directivity (dBi)', symbol: 'D₀', value: D0_dbi, unit: 'dBi' },
          { key: 'rr', label: 'Radiation Resistance', symbol: 'R_r', value: 73.1, unit: 'Ω' }
        ],
        steps: [
          `Step 1: Given Frequency f = ${(f / 1e6).toFixed(1)} MHz`,
          `Step 2: Wavelength λ = c / f = (3 × 10⁸) / (${f.toExponential(2)}) = ${lambda.toFixed(3)} m`,
          `Step 3: Physical dipole length: L = λ / 2 = ${lambda.toFixed(3)} / 2 = ${length.toFixed(3)} m (${(length * 100).toFixed(1)} cm)`,
          `Step 4: Standard Half-Wave Dipole Directivity: D₀ = 1.643 (10 log₁₀(1.643) = 2.15 dBi)`,
          `Step 5: Maximum Effective Aperture: A_e = (λ² / 4π) · D₀ = (${lambda.toFixed(3)}² / 12.566) × 1.643 = ${Ae.toFixed(4)} m²`
        ]
      };
    },
    tags: ['antennas', 'half-wave dipole', 'directivity', 'effective aperture', 'radiation resistance', '21ec63']
  },

  // ==========================================
  // SEMESTER 7: OPTICAL FIBER, SATELLITE & RADAR
  // ==========================================
  {
    id: 'ofc-numerical-aperture',
    semesters: [7],
    subjectCode: '21EC71',
    subjectName: 'Optical Fiber Communication',
    category: 'Photonics & Radar',
    module: 1,
    title: 'Optical Fiber Numerical Aperture (NA) & Acceptance Angle',
    formulaDisplay: 'NA = √(n₁² - n₂²) ≈ n₁ · √(2Δ)  |  θ_a = arcsin(NA)  |  V = (2π·a / λ) · NA',
    plainFormula: 'NA = sqrt(n1^2 - n2^2), theta_a = asin(NA), Delta = (n1 - n2) / n1, V = (2*pi*a / lambda) * NA',
    description: 'Calculates the light-gathering capacity (Numerical Aperture NA), acceptance cone half-angle (θ_a), fractional index difference (Δ), and normalized frequency (V-number) of an optical fiber.',
    keyInsights: [
      'Higher Numerical Aperture increases light coupled from LED/laser sources into the fiber.',
      'Single-mode fiber condition: normalized frequency V < 2.405.',
      'Number of guided modes in step-index multimode fiber is M ≈ V² / 2.'
    ],
    variables: [
      { key: 'n1', name: 'Core Refractive Index (n₁)', symbol: 'n₁', defaultValue: 1.48, unit: 'index', min: 1.0, max: 2.5, step: 0.01 },
      { key: 'n2', name: 'Cladding Refractive Index (n₂)', symbol: 'n₂', defaultValue: 1.46, unit: 'index', min: 1.0, max: 2.5, step: 0.01 },
      { key: 'core_radius', name: 'Core Radius (a)', symbol: 'a', defaultValue: 25, unit: 'μm', min: 2, max: 100, step: 1 },
      { key: 'wavelength', name: 'Operating Wavelength (λ)', symbol: 'λ', defaultValue: 1.31, unit: 'μm', min: 0.8, max: 1.65, step: 0.01 }
    ],
    sampleProblems: [
      {
        title: 'VTU Dec 2022 Exam Paper',
        vtuExamReference: 'VTU 21EC71 [8 Marks]',
        problemStatement: 'A silica step-index fiber has a core refractive index n1 = 1.48 and cladding index n2 = 1.46. With core radius 25 μm and operating wavelength 1.31 μm, calculate NA, acceptance angle θa, and the total number of guided modes.',
        inputs: { n1: 1.48, n2: 1.46, core_radius: 25, wavelength: 1.31 },
        expectedOutputSummary: 'NA ≈ 0.2425, θa ≈ 14.03°, V ≈ 29.08, Modes M ≈ 423'
      }
    ],
    calculate: (inputs) => {
      const n1 = inputs.n1 || 1.48;
      const n2 = inputs.n2 || 1.46;
      const a_um = inputs.core_radius || 25;
      const lambda_um = inputs.wavelength || 1.31;

      if (n2 >= n1) {
        return {
          outputs: [{ key: 'err', label: 'Error', symbol: '!', value: 'n1 must be strictly greater than n2 for total internal reflection!', unit: '' }],
          steps: ['Total internal reflection requires core index (n1) > cladding index (n2).']
        };
      }

      const na = Math.sqrt(n1 * n1 - n2 * n2);
      const theta_rad = Math.asin(Math.min(na, 1.0));
      const theta_deg = (theta_rad * 180) / Math.PI;
      const delta = (n1 - n2) / n1;

      const V = ((2 * Math.PI * a_um) / lambda_um) * na;
      const modes_step = Math.round((V * V) / 2);
      const isSingleMode = V < 2.405;

      return {
        outputs: [
          { key: 'na', label: 'Numerical Aperture (NA)', symbol: 'NA', value: Number(na.toFixed(4)), unit: 'dimensionless', highlight: true },
          { key: 'theta_a', label: 'Acceptance Angle (θ_a)', symbol: 'θ_a', value: Number(theta_deg.toFixed(2)), unit: '°', highlight: true },
          { key: 'v_num', label: 'V-Number (Normalized Frequency)', symbol: 'V', value: Number(V.toFixed(2)), unit: 'dimensionless' },
          { key: 'modes', label: 'Number of Guided Modes (M)', symbol: 'M', value: modes_step, unit: 'modes' },
          { key: 'fiber_type', label: 'Fiber Classification', symbol: 'Type', value: isSingleMode ? 'Single-Mode Fiber (SMF)' : 'Multimode Fiber (MMF)', unit: '' }
        ],
        steps: [
          `Step 1: Given: Core index n₁ = ${n1}, Cladding index n₂ = ${n2}, Core radius a = ${a_um} μm, Wavelength λ = ${lambda_um} μm`,
          `Step 2: Fractional index difference: Δ = (n₁ - n₂) / n₁ = (${n1} - ${n2}) / ${n1} = ${delta.toFixed(4)} (${(delta * 100).toFixed(2)}%)`,
          `Step 3: Numerical Aperture: NA = √(n₁² - n₂²) = √(${n1}² - ${n2}²) = √(${(n1*n1).toFixed(4)} - ${(n2*n2).toFixed(4)}) = ${na.toFixed(4)}`,
          `Step 4: Acceptance Half-Angle: θ_a = arcsin(NA) = arcsin(${na.toFixed(4)}) = ${theta_deg.toFixed(2)}° (Total acceptance cone = ${(theta_deg * 2).toFixed(2)}°)`,
          `Step 5: Normalized Frequency: V = (2π · a / λ) · NA = (2 × 3.14159 × ${a_um} / ${lambda_um}) × ${na.toFixed(4)} = ${V.toFixed(2)}`,
          `Step 6: Number of Guided Modes: M ≈ V² / 2 = (${V.toFixed(2)})² / 2 = ${modes_step} modes`
        ]
      };
    },
    tags: ['optical fiber', 'numerical aperture', 'acceptance angle', 'v-number', 'photonics', 'ofc', '21ec71']
  },

  {
    id: 'ofc-link-power-budget',
    semesters: [7],
    subjectCode: '21EC71',
    subjectName: 'Optical Fiber Communication',
    category: 'Photonics & Radar',
    module: 4,
    title: 'Optical Fiber Link Loss & Power Budget Margin',
    formulaDisplay: 'P_{rx} = P_{tx} - α · L - Loss_{connectors} - Loss_{splices}  |  Margin = P_{rx} - Sensitivity',
    plainFormula: 'TotalLoss = alpha*L + N_conn*Loss_conn + N_splice*Loss_splice, Prx = Ptx - TotalLoss, Margin = Prx - Psensitivity',
    description: 'Solves total end-to-end optical link attenuation and safety operating margin for fiber optic telecommunications systems.',
    keyInsights: [
      'A healthy telecom fiber link should have at least 3 dB to 6 dB system safety margin for component aging.',
      'Fiber attenuation α at 1550 nm is lowest (~0.2 dB/km) compared to 1310 nm (~0.35 dB/km).',
      'Losses accumulate from fiber cable, connector pairs, and fusion/mechanical splices.'
    ],
    variables: [
      { key: 'ptx', name: 'Transmitter Output Power (P_tx)', symbol: 'P_tx', defaultValue: 0, unit: 'dBm', min: -20, max: 20 },
      { key: 'sensitivity', name: 'Receiver Sensitivity', symbol: 'P_sens', defaultValue: -32, unit: 'dBm', min: -50, max: -10 },
      { key: 'length', name: 'Fiber Link Length (L)', symbol: 'L', defaultValue: 40, unit: 'km', min: 1, max: 200, step: 1 },
      { key: 'alpha', name: 'Fiber Cable Attenuation (α)', symbol: 'α', defaultValue: 0.25, unit: 'dB/km', min: 0.1, max: 3.0, step: 0.05 },
      { key: 'connectors', name: 'Number of Connectors (0.5 dB ea)', symbol: 'N_conn', defaultValue: 2, unit: 'connectors', min: 0, step: 1 },
      { key: 'splices', name: 'Number of Splices (0.1 dB ea)', symbol: 'N_splice', defaultValue: 5, unit: 'splices', min: 0, step: 1 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC71 [8 Marks]',
        problemStatement: 'An optical link has transmitter power 0 dBm, receiver sensitivity -32 dBm, link length 40 km, cable attenuation 0.25 dB/km, 2 connectors (0.5 dB each) and 5 splices (0.1 dB each). Check if the link meets a minimum 6 dB safety margin.',
        inputs: { ptx: 0, sensitivity: -32, length: 40, alpha: 0.25, connectors: 2, splices: 5 },
        expectedOutputSummary: 'Total Loss = 11.5 dB, Prx = -11.5 dBm, Margin = 20.5 dB (Viable)'
      }
    ],
    calculate: (inputs) => {
      const Ptx = inputs.ptx !== undefined ? inputs.ptx : 0;
      const Psens = inputs.sensitivity || -32;
      const L = inputs.length || 40;
      const alpha = inputs.alpha || 0.25;
      const Nconn = inputs.connectors || 2;
      const Nsplice = inputs.splices || 5;

      const fiberLoss = alpha * L;
      const connLoss = Nconn * 0.5;
      const spliceLoss = Nsplice * 0.1;
      const totalLoss = fiberLoss + connLoss + spliceLoss;
      const Prx = Ptx - totalLoss;
      const margin = Prx - Psens;
      const isViable = margin >= 3.0;

      return {
        outputs: [
          { key: 'margin', label: 'Safety Power Margin', symbol: 'Margin', value: Number(margin.toFixed(2)), unit: 'dB', highlight: true },
          { key: 'prx', label: 'Received Optical Power (P_rx)', symbol: 'P_rx', value: Number(Prx.toFixed(2)), unit: 'dBm', highlight: true },
          { key: 'total_loss', label: 'Total Link Attenuation', symbol: 'Loss_total', value: Number(totalLoss.toFixed(2)), unit: 'dB' },
          { key: 'status', label: 'Link Feasibility', symbol: 'Status', value: isViable ? 'LINK FEASIBLE (Margin ≥ 3 dB)' : 'UNFEASIBLE (Insufficient Margin)', unit: '' }
        ],
        steps: [
          `Step 1: Given: P_tx = ${Ptx} dBm, Sensitivity = ${Psens} dBm, Length L = ${L} km, α = ${alpha} dB/km`,
          `Step 2: Fiber cable attenuation: Loss_fiber = α × L = ${alpha} × ${L} = ${fiberLoss.toFixed(2)} dB`,
          `Step 3: Component connector & splice losses: ${Nconn} × 0.5 dB = ${connLoss.toFixed(2)} dB, ${Nsplice} × 0.1 dB = ${spliceLoss.toFixed(2)} dB`,
          `Step 4: Total Link Loss: Loss_total = ${fiberLoss.toFixed(2)} + ${connLoss.toFixed(2)} + ${spliceLoss.toFixed(2)} = ${totalLoss.toFixed(2)} dB`,
          `Step 5: Received optical power: P_rx = P_tx - Loss_total = ${Ptx} - ${totalLoss.toFixed(2)} = ${Prx.toFixed(2)} dBm`,
          `Step 6: Power Budget Margin: Margin = P_rx - P_sens = ${Prx.toFixed(2)} - (${Psens}) = ${margin.toFixed(2)} dB`
        ]
      };
    },
    tags: ['optical link', 'power budget', 'link margin', 'attenuation', 'ofc', '21ec71']
  },

  {
    id: 'radar-range-equation',
    semesters: [7],
    subjectCode: '21EC72',
    subjectName: 'Satellite Communication & Radar',
    category: 'Photonics & Radar',
    module: 4,
    title: 'Standard Radar Range Equation',
    formulaDisplay: 'R_{max} = [ (P_t · G² · λ² · σ) / ((4π)³ · S_{min}) ]^{1/4}',
    plainFormula: 'Rmax = ((Pt * (G^2) * (lambda^2) * sigma) / ((4*pi)^3 * Smin))^(1/4)',
    description: 'Calculates the theoretical maximum detection range (R_max in km/nmi) of a monostatic pulse radar based on transmitter power, antenna gain, radar cross section (RCS), and minimum detectable signal.',
    keyInsights: [
      'Radar range is proportional to the fourth root (R_max ∝ P_t^{1/4}). Increasing range by a factor of 2 requires 16× more power!',
      'Two-way free space path loss accounts for the (4π)³ and 1/R⁴ radar inverse power law.',
      'Target RCS (σ) depends on physical size, shape, material, and radar aspect angle.'
    ],
    variables: [
      { key: 'pt_kw', name: 'Peak Transmitter Power (P_t)', symbol: 'P_t', defaultValue: 250, unit: 'kW', min: 1, step: 10 },
      { key: 'gain_db', name: 'Antenna Gain (G)', symbol: 'G', defaultValue: 30, unit: 'dB', min: 10, max: 55, step: 1 },
      { key: 'freq_ghz', name: 'Operating Frequency (f)', symbol: 'f', defaultValue: 3.0, unit: 'GHz', min: 0.1, step: 0.5 },
      { key: 'rcs', name: 'Target Radar Cross Section (σ)', symbol: 'σ', defaultValue: 2.0, unit: 'm²', min: 0.01, step: 0.5 },
      { key: 'smin_dbm', name: 'Receiver Minimum Detectable Signal', symbol: 'S_min', defaultValue: -100, unit: 'dBm', min: -130, max: -70, step: 5 }
    ],
    sampleProblems: [
      {
        title: 'VTU July 2021 Exam Paper',
        vtuExamReference: 'VTU 18EC71 [8 Marks]',
        problemStatement: 'A radar system has peak power Pt = 250 kW, antenna gain G = 30 dB, operating frequency f = 3 GHz, target RCS σ = 2 m², and S_min = -100 dBm. Calculate the maximum radar range in kilometers.',
        inputs: { pt_kw: 250, gain_db: 30, freq_ghz: 3.0, rcs: 2.0, smin_dbm: -100 },
        expectedOutputSummary: 'Rmax ≈ 67.5 km'
      }
    ],
    calculate: (inputs) => {
      const Pt_kw = inputs.pt_kw || 250;
      const Pt = Pt_kw * 1000; // in Watts
      const G_db = inputs.gain_db || 30;
      const G = Math.pow(10, G_db / 10);
      const f_ghz = inputs.freq_ghz || 3.0;
      const lambda = 3e8 / (f_ghz * 1e9);
      const sigma = inputs.rcs || 2.0;
      const Smin_dbm = inputs.smin_dbm || -100;
      const Smin_w = Math.pow(10, (Smin_dbm - 30) / 10); // dBm to W

      const numerator = Pt * Math.pow(G, 2) * Math.pow(lambda, 2) * sigma;
      const denominator = Math.pow(4 * Math.PI, 3) * Smin_w;
      const Rmax_m = Math.pow(numerator / denominator, 0.25);
      const Rmax_km = Rmax_m / 1000;
      const Rmax_nmi = Rmax_km * 0.539957;

      return {
        outputs: [
          { key: 'rmax_km', label: 'Maximum Radar Range', symbol: 'R_max', value: Number(Rmax_km.toFixed(2)), unit: 'km', highlight: true },
          { key: 'rmax_nmi', label: 'Range in Nautical Miles', symbol: 'R_max', value: Number(Rmax_nmi.toFixed(2)), unit: 'nmi' },
          { key: 'lambda', label: 'Radar Wavelength (λ)', symbol: 'λ', value: Number((lambda * 100).toFixed(2)), unit: 'cm' },
          { key: 'gain_lin', label: 'Antenna Power Gain', symbol: 'G', value: Number(G.toFixed(0)), unit: 'ratio' }
        ],
        steps: [
          `Step 1: Convert inputs: P_t = ${Pt_kw} kW (${Pt.toExponential(2)} W), G = 10^(${G_db}/10) = ${G.toFixed(0)}, S_min = ${Smin_dbm} dBm (${Smin_w.toExponential(2)} W)`,
          `Step 2: Wavelength λ = c / f = (3 × 10⁸) / (${(f_ghz*1e9).toExponential(2)}) = ${(lambda * 100).toFixed(2)} cm (${lambda.toFixed(3)} m)`,
          `Step 3: Numerator: P_t · G² · λ² · σ = ${Pt} × (${G.toFixed(0)})² × (${lambda.toFixed(3)})² × ${sigma} = ${numerator.toExponential(4)}`,
          `Step 4: Denominator: (4π)³ · S_min = (1984.4) × ${Smin_w.toExponential(2)} = ${denominator.toExponential(4)}`,
          `Step 5: Apply Fourth-Root: R_max = (${numerator.toExponential(3)} / ${denominator.toExponential(3)})^(0.25) = ${Rmax_m.toFixed(0)} meters`,
          `Step 6: Convert to km: R_max = ${Rmax_km.toFixed(2)} km (${Rmax_nmi.toFixed(2)} nautical miles)`
        ]
      };
    },
    tags: ['radar', 'radar range equation', 'rcs', 'target detection', 'satellite radar', '21ec72']
  },

  {
    id: 'radar-unambiguous-range',
    semesters: [7],
    subjectCode: '21EC72',
    subjectName: 'Satellite Communication & Radar',
    category: 'Photonics & Radar',
    module: 4,
    title: 'Radar Maximum Unambiguous Range & Doppler Velocity',
    formulaDisplay: 'R_{unamb} = c / (2 · PRF)  |  f_d = (2 · v_r / λ) = (2 · v_r · f₀) / c',
    plainFormula: 'Runamb = c / (2 * PRF) = (c * Tp) / 2, fd = (2 * vr * f0) / c',
    description: 'Calculates the maximum unambiguous range before echo overlap occurs and determines Doppler frequency shift resulting from target radial velocity.',
    keyInsights: [
      'Echoes returning after the next transmit pulse cause range ambiguity (ghost targets).',
      'High PRF increases Doppler velocity resolution but decreases maximum unambiguous range (the radar dilemma).',
      'Target moving toward radar yields positive Doppler shift (f_received > f_transmitted).'
    ],
    variables: [
      { key: 'prf', name: 'Pulse Repetition Frequency (PRF)', symbol: 'PRF', defaultValue: 1000, unit: 'Hz', min: 100, max: 20000, step: 100 },
      { key: 'vr', name: 'Target Radial Velocity (v_r)', symbol: 'v_r', defaultValue: 250, unit: 'm/s', min: 1, step: 10 },
      { key: 'f0', name: 'Transmitted Carrier (f₀)', symbol: 'f₀', defaultValue: 9.0, unit: 'GHz', min: 0.5, step: 0.5 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC72 [6 Marks]',
        problemStatement: 'A pulsed radar operates at 9 GHz with a Pulse Repetition Frequency of 1000 Hz. If a jet aircraft approaches with radial speed vr = 250 m/s (900 km/h), find the maximum unambiguous range and Doppler shift.',
        inputs: { prf: 1000, vr: 250, f0: 9.0 },
        expectedOutputSummary: 'Runamb = 150 km, fd = 15.0 kHz'
      }
    ],
    calculate: (inputs) => {
      const PRF = inputs.prf || 1000;
      const vr = inputs.vr || 250;
      const f0_ghz = inputs.f0 || 9.0;
      const f0 = f0_ghz * 1e9;
      const c = 3e8;

      const Runamb_m = c / (2 * PRF);
      const Runamb_km = Runamb_m / 1000;
      const lambda = c / f0;
      const fd = (2 * vr * f0) / c;
      const fd_khz = fd / 1000;

      return {
        outputs: [
          { key: 'runamb_km', label: 'Max Unambiguous Range', symbol: 'R_unamb', value: Number(Runamb_km.toFixed(2)), unit: 'km', highlight: true },
          { key: 'fd_khz', label: 'Doppler Frequency Shift', symbol: 'f_d', value: Number(fd_khz.toFixed(2)), unit: 'kHz', highlight: true },
          { key: 'pulse_period', label: 'Pulse Repetition Interval (PRI)', symbol: 'T_p', value: Number(((1 / PRF) * 1000).toFixed(2)), unit: 'ms' },
          { key: 'target_speed_kmh', label: 'Target Speed', symbol: 'v_r', value: Number((vr * 3.6).toFixed(1)), unit: 'km/h' }
        ],
        steps: [
          `Step 1: Given: PRF = ${PRF} Hz, Target velocity v_r = ${vr} m/s, Carrier f₀ = ${f0_ghz} GHz`,
          `Step 2: Pulse Repetition Period: T_p = 1 / PRF = 1 / ${PRF} = ${((1/PRF)*1000).toFixed(2)} ms`,
          `Step 3: Maximum Unambiguous Range: R_unamb = c / (2 × PRF) = (3 × 10⁸) / (2 × ${PRF}) = ${Runamb_m.toFixed(0)} m = ${Runamb_km.toFixed(2)} km`,
          `Step 4: Wavelength: λ = c / f₀ = (3 × 10⁸) / (${f0.toExponential(2)}) = ${(lambda * 100).toFixed(2)} cm`,
          `Step 5: Doppler Shift: f_d = (2 · v_r · f₀) / c = (2 × ${vr} × ${f0.toExponential(2)}) / (3 × 10⁸) = ${fd.toFixed(1)} Hz (${fd_khz.toFixed(2)} kHz)`
        ]
      };
    },
    tags: ['radar', 'unambiguous range', 'doppler', 'prf', 'satellite radar', '21ec72']
  },

  // ==========================================
  // SEMESTER 8: EMBEDDED, POWER ELECTRONICS & IOT
  // ==========================================
  {
    id: 'pe-buck-converter',
    semesters: [8],
    subjectCode: '21EC81',
    subjectName: 'Power Electronics & Embedded / IoT',
    category: 'Embedded & IoT',
    module: 1,
    title: 'DC-DC Buck (Step-Down) Converter Design',
    formulaDisplay: 'V_{out} = D · V_{in}  |  ΔI_L = [(V_{in} - V_{out}) · D] / (f_s · L)  |  L_{crit} = (1 - D)·R / (2·f_s)',
    plainFormula: 'Vout = D * Vin, Duty = Vout / Vin, Delta_IL = ((Vin - Vout) * D) / (fs * L)',
    description: 'Calculates output voltage, PWM duty cycle (D), inductor peak-to-peak ripple current (ΔI_L), and critical inductance for continuous conduction mode (CCM).',
    keyInsights: [
      'Buck converter output voltage is strictly lower than input (step-down: V_out ≤ V_in).',
      'For CCM operation, inductor value must exceed L_critical to prevent current from dropping to zero.',
      'Typical design targets inductor ripple current ΔI_L between 20% and 40% of average load current.'
    ],
    variables: [
      { key: 'vin', name: 'Input Voltage (V_in)', symbol: 'V_in', defaultValue: 12, unit: 'V', min: 1 },
      { key: 'vout', name: 'Desired Output (V_out)', symbol: 'V_out', defaultValue: 5, unit: 'V', min: 0.5 },
      { key: 'fs_khz', name: 'Switching Frequency (f_s)', symbol: 'f_s', defaultValue: 100, unit: 'kHz', min: 10, step: 10 },
      { key: 'inductance_uh', name: 'Filter Inductance (L)', symbol: 'L', defaultValue: 100, unit: 'μH', min: 1, step: 10 },
      { key: 'load_r', name: 'Load Resistance (R)', symbol: 'R', defaultValue: 5, unit: 'Ω', min: 0.5 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC81 [8 Marks]',
        problemStatement: 'A buck converter has input Vin = 12 V and regulated output Vout = 5 V with load R = 5 Ω at switching frequency fs = 100 kHz. With L = 100 μH, calculate duty cycle D, inductor ripple current ΔIL, and verify CCM operation.',
        inputs: { vin: 12, vout: 5, fs_khz: 100, inductance_uh: 100, load_r: 5 },
        expectedOutputSummary: 'D = 0.417 (41.7%), ΔIL = 0.292 A (292 mA), Lcrit = 14.6 μH'
      }
    ],
    calculate: (inputs) => {
      const Vin = inputs.vin || 12;
      const Vout = Math.min(inputs.vout || 5, Vin * 0.99);
      const fs = (inputs.fs_khz || 100) * 1000;
      const L = (inputs.inductance_uh || 100) * 1e-6;
      const R = inputs.load_r || 5;

      const D = Vout / Vin;
      const Iout = Vout / R;
      const deltaIL = ((Vin - Vout) * D) / (fs * L);
      const Lcrit = ((1 - D) * R) / (2 * fs);
      const isCCM = L >= Lcrit;

      return {
        outputs: [
          { key: 'duty', label: 'PWM Duty Cycle (D)', symbol: 'D', value: Number((D * 100).toFixed(2)), unit: '%', highlight: true },
          { key: 'delta_il', label: 'Inductor Ripple Current (ΔI_L)', symbol: 'ΔI_L', value: Number((deltaIL * 1000).toFixed(1)), unit: 'mA', highlight: true },
          { key: 'iout', label: 'DC Load Current (I_out)', symbol: 'I_out', value: Number(Iout.toFixed(2)), unit: 'A' },
          { key: 'lcrit_uh', label: 'Critical Minimum Inductance', symbol: 'L_crit', value: Number((Lcrit * 1e6).toFixed(2)), unit: 'μH' },
          { key: 'ccm_status', label: 'Conduction Mode', symbol: 'Mode', value: isCCM ? 'Continuous Conduction (CCM)' : 'Discontinuous Conduction (DCM)', unit: '' }
        ],
        steps: [
          `Step 1: Given: V_in = ${Vin} V, V_out = ${Vout} V, f_s = ${(fs/1000)} kHz, L = ${(L*1e6).toFixed(1)} μH, R_L = ${R} Ω`,
          `Step 2: Ideal Duty Ratio: D = V_out / V_in = ${Vout} / ${Vin} = ${D.toFixed(4)} (${(D * 100).toFixed(2)}%)`,
          `Step 3: Average load current: I_out = V_out / R = ${Vout} / ${R} = ${Iout.toFixed(2)} A`,
          `Step 4: Inductor Ripple Current: ΔI_L = [(V_in - V_out) · D] / (f_s · L) = [(${Vin} - ${Vout}) × ${D.toFixed(4)}] / (${fs} × ${L.toExponential(2)}) = ${deltaIL.toFixed(4)} A (${(deltaIL * 1000).toFixed(1)} mA)`,
          `Step 5: Minimum critical inductance for continuous conduction: L_crit = [(1 - D) · R] / (2 · f_s) = [(1 - ${D.toFixed(4)}) × ${R}] / (2 × ${fs}) = ${(Lcrit * 1e6).toFixed(2)} μH`,
          `Step 6: Since installed L (${(L*1e6).toFixed(1)} μH) > L_crit (${(Lcrit*1e6).toFixed(2)} μH), the converter reliably operates in CCM.`
        ]
      };
    },
    tags: ['buck converter', 'dc-dc', 'power electronics', 'duty cycle', 'ripple current', '21ec81']
  },

  {
    id: 'emb-adc-quantization-step',
    semesters: [8],
    subjectCode: '21EC81',
    subjectName: 'Embedded Systems & IoT',
    category: 'Embedded & IoT',
    module: 3,
    title: 'Microcontroller ADC Resolution & Voltage Step Size',
    formulaDisplay: 'ΔV = V_{ref} / (2^N - 1)  |  Digital Code = round[ (V_{in} / V_{ref}) · (2^N - 1) ]',
    plainFormula: 'DeltaV = Vref / (2^N - 1), DigitalCode = round((Vin / Vref) * (2^N - 1)), Resolution = 2^N',
    description: 'Solves analog-to-digital converter (ADC) quantization step size (voltage resolution per LSB) and expected digital output integer code for microcontrollers (ARM Cortex, STM32, ESP32, Arduino).',
    keyInsights: [
      '10-bit ADC provides 1024 discrete levels; 12-bit ADC provides 4096 levels (4× greater precision).',
      'At V_ref = 3.3V, a 12-bit ADC has an LSB step size of only 0.806 mV.',
      'Quantization error is bounded within ±0.5 LSB.'
    ],
    variables: [
      { key: 'nbits', name: 'ADC Resolution in Bits (N)', symbol: 'N', defaultValue: 12, unit: 'bits', min: 8, max: 24, step: 1 },
      { key: 'vref', name: 'Reference Voltage (V_ref)', symbol: 'V_ref', defaultValue: 3.3, unit: 'V', min: 1.0, max: 5.0, step: 0.1 },
      { key: 'vin', name: 'Analog Input Voltage (V_in)', symbol: 'V_in', defaultValue: 1.65, unit: 'V', min: 0, max: 5.0, step: 0.05 }
    ],
    sampleProblems: [
      {
        title: 'VTU Model Question 2022',
        vtuExamReference: 'VTU 21EC81 [6 Marks]',
        problemStatement: 'An embedded STM32 microcontroller has a 12-bit ADC with reference voltage Vref = 3.3 V. Calculate the voltage step size (1 LSB) and find the raw digital integer code when Vin = 1.65 V.',
        inputs: { nbits: 12, vref: 3.3, vin: 1.65 },
        expectedOutputSummary: 'Step Size ΔV ≈ 0.806 mV, Digital Code = 2048 (0x800)'
      }
    ],
    calculate: (inputs) => {
      const N = Math.round(inputs.nbits || 12);
      const Vref = inputs.vref || 3.3;
      const Vin = Math.min(inputs.vin !== undefined ? inputs.vin : 1.65, Vref);

      const maxCode = Math.pow(2, N) - 1;
      const totalLevels = Math.pow(2, N);
      const step_v = Vref / maxCode;
      const step_mv = step_v * 1000;
      const digitalCode = Math.round((Vin / Vref) * maxCode);
      const hexCode = '0x' + digitalCode.toString(16).toUpperCase();

      return {
        outputs: [
          { key: 'step_mv', label: 'Voltage Resolution (1 LSB)', symbol: 'ΔV', value: Number(step_mv.toFixed(3)), unit: 'mV', highlight: true },
          { key: 'code', label: 'Digital Decimal Code', symbol: 'Code', value: digitalCode, unit: `[0 - ${maxCode}]`, highlight: true },
          { key: 'hex', label: 'Digital Hexadecimal Code', symbol: 'Hex', value: hexCode, unit: '' },
          { key: 'levels', label: 'Total Quantization Levels', symbol: '2ⁿ', value: totalLevels, unit: 'steps' }
        ],
        steps: [
          `Step 1: Given: ADC bits N = ${N}, V_ref = ${Vref} V, Input V_in = ${Vin} V`,
          `Step 2: Total quantization intervals: 2^N - 1 = 2^${N} - 1 = ${maxCode}`,
          `Step 3: Voltage Resolution per LSB: ΔV = V_ref / (2^N - 1) = ${Vref} / ${maxCode} = ${step_v.toExponential(3)} V = ${step_mv.toFixed(3)} mV`,
          `Step 4: Output conversion: Digital Code = round[(V_in / V_ref) × (2^N - 1)] = round[(${Vin} / ${Vref}) × ${maxCode}] = ${digitalCode}`,
          `Step 5: Hexadecimal Representation: ${digitalCode} in base-16 is ${hexCode}`
        ]
      };
    },
    tags: ['adc', 'embedded systems', 'microcontroller', 'iot', 'resolution', 'quantization', '21ec81']
  }
];

export const SEMESTER_METADATA: Record<number, { name: string; subtitle: string; subjects: string[] }> = {
  1: {
    name: '1st Semester (First Year)',
    subtitle: 'Physics/Chemistry Group Foundation',
    subjects: ['Basic Electrical Engineering (21ELE13)', 'Basic Electronics (21ELN14)']
  },
  2: {
    name: '2nd Semester (First Year)',
    subtitle: 'Core Electrical & Electronics Concepts',
    subjects: ['Basic Electrical Engineering (21ELE23)', 'Basic Electronics (21ELN24)']
  },
  3: {
    name: '3rd Semester',
    subtitle: 'Circuits, Analog Systems & Logic Design',
    subjects: ['Network Analysis (21EC32)', 'Analog Electronic Circuits (21EC33)', 'Digital System Design (21EC34)']
  },
  4: {
    name: '4th Semester',
    subtitle: 'Communications & Field Theory',
    subjects: ['Principles of Communication (21EC42)', 'Electromagnetic Waves & Transmission Lines (21EC43)', 'Signals & Systems (21EC44)']
  },
  5: {
    name: '5th Semester',
    subtitle: 'DSP, Digital Comm & Integrated Circuits',
    subjects: ['Digital Signal Processing (21EC51)', 'Digital Communication (21EC52)', 'Linear Integrated Circuits (21EC53)']
  },
  6: {
    name: '6th Semester',
    subtitle: 'Cellular, VLSI & Microwave Systems',
    subjects: ['Cellular & Mobile Comm (21EC61)', 'VLSI Design (21EC62)', 'Microwave & Antennas (21EC63)']
  },
  7: {
    name: '7th Semester',
    subtitle: 'Photonics, Radar & Satellite Technologies',
    subjects: ['Optical Fiber Communication (21EC71)', 'Satellite Communication & Radar (21EC72)']
  },
  8: {
    name: '8th Semester',
    subtitle: 'Advanced Embedded, IoT & Power Systems',
    subjects: ['Embedded Systems & IoT (21EC81)', 'Power Electronics Applications']
  }
};
