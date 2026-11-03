import React, { useState, useEffect, useRef } from 'react';
import { X, Activity, Radio, Cpu, Eye, Sliders, Play, RotateCcw } from 'lucide-react';

interface VisualizersModalProps {
  onClose: () => void;
  defaultTab?: 'rlc' | 'am' | '555' | 'fiber';
}

export const VisualizersModal: React.FC<VisualizersModalProps> = ({
  onClose,
  defaultTab = 'rlc'
}) => {
  const [activeTab, setActiveTab] = useState<'rlc' | 'am' | '555' | 'fiber'>(defaultTab);

  // --- RLC Resonance State ---
  const [rlcR, setRlcR] = useState<number>(15); // Ohms
  const [rlcL, setRlcL] = useState<number>(50); // mH
  const [rlcC, setRlcC] = useState<number>(10); // uF
  const rlcCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- AM Scope State ---
  const [amMu, setAmMu] = useState<number>(0.8);
  const [amFm, setAmFm] = useState<number>(2); // kHz
  const [amFc, setAmFc] = useState<number>(24); // kHz
  const amCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- 555 Timer State ---
  const [timerRa, setTimerRa] = useState<number>(5); // kOhm
  const [timerRb, setTimerRb] = useState<number>(10); // kOhm
  const [timerC, setTimerC] = useState<number>(0.1); // uF
  const timerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Optical Fiber State ---
  const [fiberN1, setFiberN1] = useState<number>(1.48);
  const [fiberN2, setFiberN2] = useState<number>(1.45);
  const fiberCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw RLC Resonance Curve
  useEffect(() => {
    if (activeTab !== 'rlc' || !rlcCanvasRef.current) return;
    const canvas = rlcCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Compute fr, Q, BW
    const L_h = rlcL * 1e-3;
    const C_f = rlcC * 1e-6;
    const R = rlcR;

    const fr = 1 / (2 * Math.PI * Math.sqrt(L_h * C_f));
    const Q = (1 / R) * Math.sqrt(L_h / C_f);
    const BW = fr / Q;
    const f1 = Math.max(0, fr - BW / 2);
    const f2 = fr + BW / 2;

    // Grid and axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 40; x < width - 20; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 30);
      ctx.stroke();
    }
    for (let y = 30; y < height - 30; y += 30) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Axis
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 30);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('0', 25, height - 28);
    ctx.fillText('Frequency (f)', width / 2 - 30, height - 10);
    ctx.save();
    ctx.translate(15, height / 2 + 30);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Current I(f)', 0, 0);
    ctx.restore();

    // Frequency sweep from 0.1*fr to 2.5*fr
    const minF = Math.max(1, fr * 0.1);
    const maxF = fr * 2.5;

    // Current curve I = V / Z (assume V=10V)
    ctx.strokeStyle = '#06b6d4'; // cyan-500
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const maxCurrent = 10 / R;
    const plotHeight = height - 60;

    let frCanvasX = 0;
    let frCanvasY = 0;
    let f1CanvasX = 0;
    let f2CanvasX = 0;

    for (let px = 40; px < width - 20; px++) {
      const frac = (px - 40) / (width - 60);
      const f = minF + frac * (maxF - minF);

      const omega = 2 * Math.PI * f;
      const XL = omega * L_h;
      const XC = 1 / (omega * C_f);
      const Z = Math.sqrt(R * R + (XL - XC) * (XL - XC));
      const I = 10 / Z;

      const py = height - 30 - (I / maxCurrent) * (plotHeight * 0.85);

      if (px === 40) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);

      if (Math.abs(f - fr) < (maxF - minF) / (width - 60)) {
        frCanvasX = px;
        frCanvasY = py;
      }
      if (Math.abs(f - f1) < (maxF - minF) / (width - 60)) f1CanvasX = px;
      if (Math.abs(f - f2) < (maxF - minF) / (width - 60)) f2CanvasX = px;
    }
    ctx.stroke();

    // Resonant peak vertical dashed line
    if (frCanvasX > 0) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#f59e0b'; // amber
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(frCanvasX, height - 30);
      ctx.lineTo(frCanvasX, frCanvasY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point marker
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(frCanvasX, frCanvasY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`fr = ${fr.toFixed(1)} Hz`, frCanvasX - 35, frCanvasY - 10);
    }

    // Bandwidth span at 0.707 peak
    if (f1CanvasX > 0 && f2CanvasX > 0) {
      const halfPowerY = height - 30 - 0.707 * (plotHeight * 0.85);
      ctx.strokeStyle = '#10b981'; // emerald
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(f1CanvasX, halfPowerY);
      ctx.lineTo(f2CanvasX, halfPowerY);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = '10px monospace';
      ctx.fillText(`BW = ${BW.toFixed(1)} Hz (-3dB)`, f1CanvasX + 10, halfPowerY - 6);
    }
  }, [activeTab, rlcR, rlcL, rlcC]);

  // Draw AM Waveform Scope
  useEffect(() => {
    if (activeTab !== 'am' || !amCanvasRef.current) return;
    const canvas = amCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Centerline
    const midY = height / 2;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, midY);
    ctx.lineTo(width - 20, midY);
    ctx.stroke();

    const Ac = 50; // carrier amplitude in px
    const mu = amMu;
    const fm = amFm;
    const fc = amFc;

    // Draw upper and lower envelopes
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#f59e0b'; // amber
    ctx.lineWidth = 1.5;

    // Upper envelope
    ctx.beginPath();
    for (let x = 20; x < width - 20; x++) {
      const t = ((x - 20) / (width - 40)) * (4 / fm);
      const envelope = Ac * (1 + mu * Math.cos(2 * Math.PI * fm * t));
      const y = midY - envelope;
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Lower envelope
    ctx.beginPath();
    for (let x = 20; x < width - 20; x++) {
      const t = ((x - 20) / (width - 40)) * (4 / fm);
      const envelope = Ac * (1 + mu * Math.cos(2 * Math.PI * fm * t));
      const y = midY + envelope;
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw AM Modulated Carrier
    ctx.strokeStyle = '#06b6d4'; // cyan
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let x = 20; x < width - 20; x++) {
      const t = ((x - 20) / (width - 40)) * (4 / fm);
      const envelope = Ac * (1 + mu * Math.cos(2 * Math.PI * fm * t));
      const s_am = envelope * Math.cos(2 * Math.PI * fc * t);
      const y = midY - s_am;

      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Envelope warning text if overmodulated
    if (mu > 1.0) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`OVERMODULATION (μ = ${mu.toFixed(2)} > 1.0) — Envelope Phase Reversal & Distortion!`, 25, 25);
    } else {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Distortion-Free AM Envelope (Modulation Index μ = ${(mu * 100).toFixed(0)}%)`, 25, 25);
    }
  }, [activeTab, amMu, amFm, amFc]);

  // Draw 555 Timer Waveforms
  useEffect(() => {
    if (activeTab !== '555' || !timerCanvasRef.current) return;
    const canvas = timerCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const RA = timerRa * 1000;
    const RB = timerRb * 1000;
    const C = timerC * 1e-6;

    const tHigh = 0.693 * (RA + RB) * C;
    const tLow = 0.693 * RB * C;
    const T = tHigh + tLow;
    const duty = (tHigh / T) * 100;

    // Divider line between analog capacitor voltage and digital output
    const splitY = height / 2;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, splitY);
    ctx.lineTo(width - 20, splitY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Capacitor threshold lines (1/3 Vcc and 2/3 Vcc)
    const vcc1_3 = splitY - (splitY - 30) * (1 / 3);
    const vcc2_3 = splitY - (splitY - 30) * (2 / 3);

    ctx.strokeStyle = '#475569';
    ctx.font = '10px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('2/3 V_CC (Threshold)', 25, vcc2_3 - 4);
    ctx.fillText('1/3 V_CC (Trigger)', 25, vcc1_3 + 12);

    ctx.beginPath();
    ctx.moveTo(20, vcc2_3);
    ctx.lineTo(width - 20, vcc2_3);
    ctx.moveTo(20, vcc1_3);
    ctx.lineTo(width - 20, vcc1_3);
    ctx.stroke();

    // Draw Capacitor Voltage (Exponential curves)
    ctx.strokeStyle = '#f59e0b'; // amber
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const cycles = 3;
    const cyclePixels = (width - 40) / cycles;
    const highPixels = cyclePixels * (tHigh / T);
    const lowPixels = cyclePixels * (tLow / T);

    for (let cIdx = 0; cIdx < cycles; cIdx++) {
      const startX = 20 + cIdx * cyclePixels;

      // Charge phase: from 1/3 to 2/3 Vcc
      for (let px = 0; px <= highPixels; px++) {
        const frac = px / highPixels;
        // exponential shape approx
        const ease = 1 - Math.exp(-frac * 1.5);
        const norm = ease / (1 - Math.exp(-1.5));
        const y = vcc1_3 - norm * (vcc1_3 - vcc2_3);
        if (cIdx === 0 && px === 0) ctx.moveTo(startX + px, y);
        else ctx.lineTo(startX + px, y);
      }

      // Discharge phase: from 2/3 to 1/3 Vcc
      for (let px = 0; px <= lowPixels; px++) {
        const frac = px / lowPixels;
        const decay = Math.exp(-frac * 1.5);
        const norm = (decay - Math.exp(-1.5)) / (1 - Math.exp(-1.5));
        const y = vcc1_3 - norm * (vcc1_3 - vcc2_3);
        ctx.lineTo(startX + highPixels + px, y);
      }
    }
    ctx.stroke();

    // Draw Digital Output (Square Wave)
    const digHighY = splitY + 25;
    const digLowY = height - 25;

    ctx.strokeStyle = '#06b6d4'; // cyan
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let cIdx = 0; cIdx < cycles; cIdx++) {
      const startX = 20 + cIdx * cyclePixels;
      // High
      ctx.moveTo(startX, digHighY);
      ctx.lineTo(startX + highPixels, digHighY);
      // Fall
      ctx.lineTo(startX + highPixels, digLowY);
      // Low
      ctx.lineTo(startX + highPixels + lowPixels, digLowY);
      // Rise
      ctx.lineTo(startX + highPixels + lowPixels, digHighY);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('Analog Capacitor Voltage v_C(t)', 25, 20);

    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`Digital Output Waveform (Duty Cycle: ${duty.toFixed(1)}%)`, 25, splitY + 18);
  }, [activeTab, timerRa, timerRb, timerC]);

  // Draw Optical Fiber Acceptance Cone
  useEffect(() => {
    if (activeTab !== 'fiber' || !fiberCanvasRef.current) return;
    const canvas = fiberCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const n1 = fiberN1;
    const n2 = fiberN2;
    const na = n1 > n2 ? Math.sqrt(n1 * n1 - n2 * n2) : 0;
    const theta_a_deg = (Math.asin(Math.min(na, 1.0)) * 180) / Math.PI;

    const fiberStartX = 180;
    const fiberHeight = 120;
    const coreHeight = 70;
    const centerY = height / 2;

    // Cladding Top & Bottom
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(fiberStartX, centerY - fiberHeight / 2, width - fiberStartX - 20, (fiberHeight - coreHeight) / 2);
    ctx.fillRect(fiberStartX, centerY + coreHeight / 2, width - fiberStartX - 20, (fiberHeight - coreHeight) / 2);

    // Core Center
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(fiberStartX, centerY - coreHeight / 2, width - fiberStartX - 20, coreHeight);

    // Core-Cladding Boundary Lines
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(fiberStartX, centerY - coreHeight / 2);
    ctx.lineTo(width - 20, centerY - coreHeight / 2);
    ctx.moveTo(fiberStartX, centerY + coreHeight / 2);
    ctx.lineTo(width - 20, centerY + coreHeight / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Fiber input face
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fiberStartX, centerY - fiberHeight / 2);
    ctx.lineTo(fiberStartX, centerY + fiberHeight / 2);
    ctx.stroke();

    // Fiber Axis
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(20, centerY);
    ctx.lineTo(width - 20, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Acceptance Cone
    const coneRadius = 140;
    const theta_rad = (theta_a_deg * Math.PI) / 180;
    const coneTopY = centerY - Math.tan(theta_rad) * (fiberStartX - 30);
    const coneBotY = centerY + Math.tan(theta_rad) * (fiberStartX - 30);

    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.beginPath();
    ctx.moveTo(fiberStartX, centerY);
    ctx.lineTo(30, coneTopY);
    ctx.lineTo(30, coneBotY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(fiberStartX, centerY);
    ctx.lineTo(30, coneTopY);
    ctx.moveTo(fiberStartX, centerY);
    ctx.lineTo(30, coneBotY);
    ctx.stroke();

    // Internal Guided Light Ray
    ctx.strokeStyle = '#f59e0b'; // amber
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(40, centerY - 35);
    ctx.lineTo(fiberStartX, centerY);
    // Bounces inside core
    const bounceDist = 70;
    ctx.lineTo(fiberStartX + bounceDist, centerY - coreHeight / 2);
    ctx.lineTo(fiberStartX + 2 * bounceDist, centerY + coreHeight / 2);
    ctx.lineTo(fiberStartX + 3 * bounceDist, centerY - coreHeight / 2);
    ctx.stroke();

    // Text labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`Cladding (n₂ = ${n2.toFixed(2)})`, fiberStartX + 20, centerY - fiberHeight / 2 + 18);
    ctx.fillText(`Core (n₁ = ${n1.toFixed(2)})`, fiberStartX + 20, centerY + 4);
    ctx.fillText(`Cladding (n₂ = ${n2.toFixed(2)})`, fiberStartX + 20, centerY + fiberHeight / 2 - 8);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`Acceptance Angle θ_a = ${theta_a_deg.toFixed(2)}°`, 30, centerY - 55);
    ctx.fillText(`Numerical Aperture NA = ${na.toFixed(4)}`, 30, centerY + 65);
  }, [activeTab, fiberN1, fiberN2]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 leading-tight">
                VoltMate Interactive ECE Labs &amp; Waveform Scopes
              </h2>
              <p className="text-xs text-slate-400">
                Live interactive parameter tuning, circuit responses, and visual waveforms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('rlc')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              activeTab === 'rlc'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>RLC Resonance Scope</span>
          </button>

          <button
            onClick={() => setActiveTab('am')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              activeTab === 'am'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>AM Modulation Envelope</span>
          </button>

          <button
            onClick={() => setActiveTab('555')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              activeTab === '555'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>555 Timer Waveforms</span>
          </button>

          <button
            onClick={() => setActiveTab('fiber')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              activeTab === 'fiber'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Optical Fiber Cone</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: RLC RESONANCE */}
          {activeTab === 'rlc' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-cyan-300">Series RLC Resonance Analyzer:</span>{' '}
                  <span className="text-slate-300">f_r = 1 / (2π√(LC)) • Q = (1/R)·√(L/C) • BW = f_r / Q</span>
                </div>
                <div className="text-slate-400 font-mono">
                  Module: 21ELE13/21EC32
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Resistance (R)</span>
                    <span className="text-cyan-400 font-mono">{rlcR} Ω</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={rlcR}
                    onChange={(e) => setRlcR(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Controls curve sharpness &amp; Q-factor</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Inductance (L)</span>
                    <span className="text-cyan-400 font-mono">{rlcL} mH</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={rlcL}
                    onChange={(e) => setRlcL(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Shifts resonant center frequency</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Capacitance (C)</span>
                    <span className="text-cyan-400 font-mono">{rlcC} μF</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={rlcC}
                    onChange={(e) => setRlcC(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Inverse relation with frequency</p>
                </div>
              </div>

              {/* Canvas Visualizer */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                <canvas
                  ref={rlcCanvasRef}
                  width={750}
                  height={300}
                  className="w-full max-w-[750px] h-[300px] rounded-lg bg-slate-900/60"
                />
              </div>
            </div>
          )}

          {/* TAB 2: AM MODULATION */}
          {activeTab === 'am' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-cyan-300">AM DSB-FC Envelope Generator:</span>{' '}
                  <span className="text-slate-300">s(t) = A_c [1 + μ · cos(2π f_m t)] · cos(2π f_c t)</span>
                </div>
                <div className="text-slate-400 font-mono">
                  Subject: 21EC42
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Modulation Index (μ)</span>
                    <span className={`font-mono font-bold ${amMu > 1 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {amMu.toFixed(2)} {amMu > 1 ? '(Overmod!)' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.05"
                    value={amMu}
                    onChange={(e) => setAmMu(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">μ &gt; 1 causes severe distortion</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Modulating Audio (f_m)</span>
                    <span className="text-cyan-400 font-mono">{amFm} kHz</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={amFm}
                    onChange={(e) => setAmFm(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Audio message frequency</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>RF Carrier (f_c)</span>
                    <span className="text-cyan-400 font-mono">{amFc} kHz</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="2"
                    value={amFc}
                    onChange={(e) => setAmFc(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">High frequency RF carrier</p>
                </div>
              </div>

              {/* AM Canvas */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                <canvas
                  ref={amCanvasRef}
                  width={750}
                  height={300}
                  className="w-full max-w-[750px] h-[300px] rounded-lg bg-slate-900/60"
                />
              </div>
            </div>
          )}

          {/* TAB 3: 555 TIMER */}
          {activeTab === '555' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-cyan-300">555 Astable Waveform Generator:</span>{' '}
                  <span className="text-slate-300">t_high = 0.693(R_A + R_B)C • t_low = 0.693 R_B C</span>
                </div>
                <div className="text-slate-400 font-mono">
                  Subject: 21EC53 (LIC)
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Timing Resistor R_A</span>
                    <span className="text-cyan-400 font-mono">{timerRa} kΩ</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={timerRa}
                    onChange={(e) => setTimerRa(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Affects only charging time t_high</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Timing Resistor R_B</span>
                    <span className="text-cyan-400 font-mono">{timerRb} kΩ</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={timerRb}
                    onChange={(e) => setTimerRb(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Affects both t_high and t_low</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Capacitor C</span>
                    <span className="text-cyan-400 font-mono">{timerC} μF</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={timerC}
                    onChange={(e) => setTimerC(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Overall frequency scaling</p>
                </div>
              </div>

              {/* 555 Canvas */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                <canvas
                  ref={timerCanvasRef}
                  width={750}
                  height={300}
                  className="w-full max-w-[750px] h-[300px] rounded-lg bg-slate-900/60"
                />
              </div>
            </div>
          )}

          {/* TAB 4: OPTICAL FIBER */}
          {activeTab === 'fiber' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-cyan-300">Optical Fiber Acceptance Cone &amp; TIR:</span>{' '}
                  <span className="text-slate-300">NA = √(n₁² - n₂²) • θ_a = arcsin(NA)</span>
                </div>
                <div className="text-slate-400 font-mono">
                  Subject: 21EC71 (OFC)
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Core Refractive Index (n₁)</span>
                    <span className="text-cyan-400 font-mono">{fiberN1.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.46"
                    max="1.60"
                    step="0.005"
                    value={fiberN1}
                    onChange={(e) => setFiberN1(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Must be strictly &gt; n₂ for total reflection</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
                    <span>Cladding Refractive Index (n₂)</span>
                    <span className="text-cyan-400 font-mono">{fiberN2.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.40"
                    max="1.47"
                    step="0.005"
                    value={fiberN2}
                    onChange={(e) => setFiberN2(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Outer glass boundary</p>
                </div>
              </div>

              {/* Fiber Canvas */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                <canvas
                  ref={fiberCanvasRef}
                  width={750}
                  height={300}
                  className="w-full max-w-[750px] h-[300px] rounded-lg bg-slate-900/60"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
