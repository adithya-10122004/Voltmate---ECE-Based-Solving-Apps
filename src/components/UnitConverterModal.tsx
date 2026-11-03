import React, { useState } from 'react';
import { X, Wrench, Zap, Radio, Sliders, ArrowLeftRight } from 'lucide-react';

interface UnitConverterModalProps {
  onClose: () => void;
}

const RESISTOR_COLORS: { name: string; hex: string; value: number; multiplier: number; tolerance?: number }[] = [
  { name: 'Black', hex: '#1e293b', value: 0, multiplier: 1 },
  { name: 'Brown', hex: '#854d0e', value: 1, multiplier: 10, tolerance: 1 },
  { name: 'Red', hex: '#dc2626', value: 2, multiplier: 100, tolerance: 2 },
  { name: 'Orange', hex: '#ea580c', value: 3, multiplier: 1000 },
  { name: 'Yellow', hex: '#eab308', value: 4, multiplier: 10000 },
  { name: 'Green', hex: '#16a34a', value: 5, multiplier: 100000, tolerance: 0.5 },
  { name: 'Blue', hex: '#2563eb', value: 6, multiplier: 1000000, tolerance: 0.25 },
  { name: 'Violet', hex: '#9333ea', value: 7, multiplier: 10000000, tolerance: 0.1 },
  { name: 'Grey', hex: '#64748b', value: 8, multiplier: 100000000, tolerance: 0.05 },
  { name: 'White', hex: '#f8fafc', value: 9, multiplier: 1000000000 },
  { name: 'Gold', hex: '#d97706', value: -1, multiplier: 0.1, tolerance: 5 },
  { name: 'Silver', hex: '#94a3b8', value: -2, multiplier: 0.01, tolerance: 10 }
];

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'resistor' | 'dbm' | 'freq' | 'gain'>('resistor');

  // Resistor Color Code
  const [band1, setBand1] = useState(1); // Brown (1)
  const [band2, setBand2] = useState(0); // Black (0)
  const [band3Mult, setBand3Mult] = useState(2); // Red (x100)
  const [band4Tol, setBand4Tol] = useState(10); // Gold (5%)

  // dBm to Watts
  const [dbmVal, setDbmVal] = useState<number>(30); // 30 dBm = 1 Watt
  const [wattsVal, setWattsVal] = useState<number>(1);

  // Frequency to Wavelength
  const [freqInput, setFreqInput] = useState<number>(2.4); // 2.4 GHz (WiFi)
  const [freqUnit, setFreqUnit] = useState<number>(1e9); // GHz

  // Gain Decibel
  const [vIn, setVIn] = useState<number>(1);
  const [vOut, setVOut] = useState<number>(10);

  // Calculate resistor value
  const rValue = (band1 * 10 + band2) * RESISTOR_COLORS[band3Mult].multiplier;
  const rTolerance = RESISTOR_COLORS[band4Tol].tolerance || 5;

  const formatResistance = (ohms: number) => {
    if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(2)} MΩ`;
    if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(2)} kΩ`;
    return `${ohms.toFixed(1)} Ω`;
  };

  // Handle dBm change
  const handleDbmChange = (dbm: number) => {
    setDbmVal(dbm);
    const w = Math.pow(10, (dbm - 30) / 10);
    setWattsVal(w);
  };

  // Handle Watts change
  const handleWattsChange = (w: number) => {
    setWattsVal(w);
    if (w > 0) {
      const dbm = 10 * Math.log10(w) + 30;
      setDbmVal(Number(dbm.toFixed(2)));
    }
  };

  // Compute wavelength lambda = c / f
  const actualFreqHz = freqInput * freqUnit;
  const lambdaMeters = 3e8 / (actualFreqHz > 0 ? actualFreqHz : 1);

  const getSpectrumBand = (hz: number) => {
    if (hz < 3e5) return 'VLF / LF (Low Frequency)';
    if (hz < 3e6) return 'MF (Medium Frequency / AM Radio)';
    if (hz < 3e7) return 'HF (High Frequency / Shortwave)';
    if (hz < 3e8) return 'VHF (Very High Frequency / FM & TV)';
    if (hz < 3e9) return 'UHF (Ultra High / Cellular & Wi-Fi)';
    if (hz < 3e10) return 'SHF (Super High / Satellite & Radar)';
    if (hz < 3e11) return 'EHF (Extremely High / Millimeter Wave)';
    return 'Infrared / Optical Domain';
  };

  // Voltage gain dB = 20 * log10(Vout / Vin)
  const voltRatio = vIn > 0 ? vOut / vIn : 1;
  const gainDb = 20 * Math.log10(voltRatio > 0 ? voltRatio : 1e-6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 leading-tight">
                VoltMate ECE Quick Utilities &amp; Scalers
              </h2>
              <p className="text-xs text-slate-400">
                Resistor color decoding, RF power conversion, and electromagnetic spectrum scaling
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
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('resistor')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'resistor'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resistor Color Code
          </button>

          <button
            onClick={() => setActiveTab('dbm')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'dbm'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            dBm ↔ Watts
          </button>

          <button
            onClick={() => setActiveTab('freq')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'freq'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Freq ↔ Wavelength
          </button>

          <button
            onClick={() => setActiveTab('gain')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'gain'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Decibel (dB) Gain
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: RESISTOR COLOR CODE */}
          {activeTab === 'resistor' && (
            <div className="space-y-6">
              {/* Graphic Resistor Display */}
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center w-72 h-20">
                  {/* Lead left */}
                  <div className="absolute left-0 w-16 h-2 bg-slate-500 rounded-l" />
                  {/* Lead right */}
                  <div className="absolute right-0 w-16 h-2 bg-slate-500 rounded-r" />

                  {/* Resistor Body */}
                  <div className="relative z-10 w-44 h-16 bg-amber-100/90 rounded-2xl flex items-center justify-around px-4 shadow-inner border border-amber-300/40">
                    {/* Band 1 */}
                    <div
                      className="w-3.5 h-full shadow"
                      style={{ backgroundColor: RESISTOR_COLORS[band1].hex }}
                      title={`Band 1: ${RESISTOR_COLORS[band1].name}`}
                    />
                    {/* Band 2 */}
                    <div
                      className="w-3.5 h-full shadow"
                      style={{ backgroundColor: RESISTOR_COLORS[band2].hex }}
                      title={`Band 2: ${RESISTOR_COLORS[band2].name}`}
                    />
                    {/* Multiplier */}
                    <div
                      className="w-3.5 h-full shadow"
                      style={{ backgroundColor: RESISTOR_COLORS[band3Mult].hex }}
                      title={`Multiplier: ${RESISTOR_COLORS[band3Mult].name}`}
                    />
                    {/* Space */}
                    <div className="w-4" />
                    {/* Tolerance */}
                    <div
                      className="w-3.5 h-full shadow"
                      style={{ backgroundColor: RESISTOR_COLORS[band4Tol].hex }}
                      title={`Tolerance: ${RESISTOR_COLORS[band4Tol].name}`}
                    />
                  </div>
                </div>

                {/* Calculated Result Display */}
                <div className="mt-5 text-center">
                  <div className="text-2xl font-bold font-mono text-cyan-300">
                    {formatResistance(rValue)} ±{rTolerance}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Value Range: {formatResistance(rValue * (1 - rTolerance / 100))} to {formatResistance(rValue * (1 + rTolerance / 100))}
                  </div>
                </div>
              </div>

              {/* Band Pickers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">1st Digit</label>
                  <select
                    value={band1}
                    onChange={(e) => setBand1(parseInt(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
                  >
                    {RESISTOR_COLORS.slice(1, 10).map((c, i) => (
                      <option key={c.name} value={i + 1}>
                        {c.name} ({c.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">2nd Digit</label>
                  <select
                    value={band2}
                    onChange={(e) => setBand2(parseInt(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
                  >
                    {RESISTOR_COLORS.slice(0, 10).map((c, i) => (
                      <option key={c.name} value={i}>
                        {c.name} ({c.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Multiplier</label>
                  <select
                    value={band3Mult}
                    onChange={(e) => setBand3Mult(parseInt(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
                  >
                    {RESISTOR_COLORS.map((c, i) => (
                      <option key={c.name} value={i}>
                        {c.name} (×{c.multiplier})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Tolerance</label>
                  <select
                    value={band4Tol}
                    onChange={(e) => setBand4Tol(parseInt(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
                  >
                    <option value={10}>Gold (±5%)</option>
                    <option value={11}>Silver (±10%)</option>
                    <option value={1}>Brown (±1%)</option>
                    <option value={2}>Red (±2%)</option>
                    <option value={5}>Green (±0.5%)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DBM TO WATTS */}
          {activeTab === 'dbm' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-amber-300">Conversion Law: </span>
                <span className="font-mono text-slate-300">{"P(dBm) = 10 · log₁₀(P_mW)  |  P(W) = 10^[(P_dBm - 30) / 10]"}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase">Power in dBm</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={dbmVal}
                      step="0.5"
                      onChange={(e) => handleDbmChange(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-lg font-mono font-bold text-cyan-300"
                    />
                    <span className="text-sm font-bold text-slate-400">dBm</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="60"
                    step="1"
                    value={dbmVal}
                    onChange={(e) => handleDbmChange(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400">Range: -30 dBm (1 μW) to +60 dBm (1 kW)</p>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase">Power in Linear Units</label>
                  <div className="space-y-2 font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex justify-between items-center text-sm">
                      <span className="text-slate-400">Watts (W):</span>
                      <span className="font-bold text-slate-100">{wattsVal >= 1e-3 ? wattsVal.toFixed(4) : wattsVal.toExponential(3)} W</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex justify-between items-center text-sm">
                      <span className="text-slate-400">Milliwatts (mW):</span>
                      <span className="font-bold text-amber-300">{(wattsVal * 1000).toFixed(3)} mW</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex justify-between items-center text-sm">
                      <span className="text-slate-400">Microwatts (μW):</span>
                      <span className="font-bold text-emerald-400">{(wattsVal * 1e6).toFixed(1)} μW</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FREQUENCY TO WAVELENGTH */}
          {activeTab === 'freq' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-amber-300">Wave Equation: </span>
                <span className="font-mono text-slate-300">λ = c / f  (c = 2.9979 × 10⁸ m/s in free space)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase">Frequency (f)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={freqInput}
                      step="0.1"
                      onChange={(e) => setFreqInput(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-lg font-mono font-bold text-cyan-300"
                    />
                    <select
                      value={freqUnit}
                      onChange={(e) => setFreqUnit(parseFloat(e.target.value))}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-slate-200"
                    >
                      <option value={1e3}>kHz</option>
                      <option value={1e6}>MHz</option>
                      <option value={1e9}>GHz</option>
                      <option value={1e12}>THz</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Band: <span className="text-cyan-400 font-semibold">{getSpectrumBand(actualFreqHz)}</span>
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 font-mono">
                  <label className="text-xs font-bold text-slate-400 uppercase font-sans">Wavelength (λ)</label>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center text-sm">
                    <span className="text-slate-400">Meters (m):</span>
                    <span className="font-bold text-slate-100">{lambdaMeters >= 0.01 ? lambdaMeters.toFixed(4) : lambdaMeters.toExponential(3)} m</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center text-sm">
                    <span className="text-slate-400">Centimeters (cm):</span>
                    <span className="font-bold text-amber-300">{(lambdaMeters * 100).toFixed(2)} cm</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center text-sm">
                    <span className="text-slate-400">Quarter-Wave (λ/4 Antenna):</span>
                    <span className="font-bold text-cyan-400">{((lambdaMeters * 100) / 4).toFixed(2)} cm</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DECIBEL GAIN */}
          {activeTab === 'gain' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-amber-300">Decibel Definitions: </span>
                <span className="font-mono text-slate-300">{"Voltage: dB = 20 · log₁₀(V_out / V_in)  |  Power: dB = 10 · log₁₀(P_out / P_in)"}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Input Voltage (V_in)</label>
                    <input
                      type="number"
                      value={vIn}
                      onChange={(e) => setVIn(parseFloat(e.target.value) || 0.001)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Output Voltage (V_out)</label>
                    <input
                      type="number"
                      value={vOut}
                      onChange={(e) => setVOut(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center space-y-3 font-mono">
                  <div className="text-xs font-bold text-slate-400 uppercase font-sans">Gain in Decibels</div>
                  <div className="text-3xl font-bold text-cyan-300">
                    {gainDb >= 0 ? `+${gainDb.toFixed(2)}` : gainDb.toFixed(2)} dB
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Voltage Ratio: <span className="text-slate-200 font-bold font-mono">{voltRatio.toFixed(2)}×</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
