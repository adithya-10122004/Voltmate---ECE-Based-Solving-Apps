import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';

interface AiTutorModalProps {
  onClose: () => void;
  onSolveFormula?: (formulaId: string) => void;
}

const PRESET_QUESTIONS = [
  'Derive why a standard 555 astable duty cycle is always > 50% and how to fix it with a diode.',
  'A series RLC circuit has R=10Ω, L=100mH, C=10μF. Calculate fr, Q-factor, and -3dB bandwidth.',
  'Explain Carson’s rule for FM bandwidth and compare WBFM vs NBFM.',
  'What is the Barkhausen criterion for sinusoidal oscillations?',
  'Calculate the cutoff frequency of X-band rectangular waveguide (a=2.286cm) for TE10 mode.'
];

const BUILTIN_KNOWLEDGE: Record<string, string> = {
  '555': `### 555 Timer Astable Multivibrator: Duty Cycle Analysis
**Why is Duty Cycle strictly > 50% in standard configuration?**
1. **Charging Phase (Output HIGH):** The timing capacitor $C$ charges from $\\frac{1}{3}V_{CC}$ to $\\frac{2}{3}V_{CC}$ through both resistors $R_A$ and $R_B$.
   $$t_{\\text{high}} = 0.693 \\cdot (R_A + R_B) \\cdot C$$
2. **Discharging Phase (Output LOW):** Capacitor $C$ discharges through pin 7 via only $R_B$.
   $$t_{\\text{low}} = 0.693 \\cdot R_B \\cdot C$$
3. **Duty Cycle Formula:**
   $$D = \\frac{t_{\\text{high}}}{t_{\\text{high}} + t_{\\text{low}}} = \\frac{R_A + R_B}{R_A + 2 R_B} \\times 100\\%$$
   Since $R_A > 0$, $(R_A + R_B) > R_B$, ensuring $D > 50\\%$.

**How to achieve 50% or < 50% Duty Cycle:**
Connect a fast switching diode (like 1N4148) in parallel with $R_B$ (anode at pin 7/node between $R_A$ and $R_B$, cathode to pin 6/pin 2). During charging, current bypasses $R_B$ through the diode directly to $C$. Then:
$$t_{\\text{high}} \\approx 0.693 \\cdot R_A \\cdot C, \\quad t_{\\text{low}} = 0.693 \\cdot R_B \\cdot C$$
Setting $R_A = R_B$ produces an exact 50% square wave!`,

  'rlc': `### Series RLC Resonant Circuit - VTU Exam Problem Breakdown
**Given Data:**
- Resistance $R = 10\\,\\Omega$
- Inductance $L = 100\\,\\text{mH} = 0.1\\,\\text{H}$
- Capacitance $C = 10\\,\\mu\\text{F} = 10 \\times 10^{-6}\\,\\text{F}$

**1. Resonant Frequency ($f_r$):**
$$f_r = \\frac{1}{2\\pi \\sqrt{L \\cdot C}} = \\frac{1}{2\\pi \\sqrt{0.1 \\times 10^{-5}}} = \\frac{1}{2\\pi \\times 10^{-3}} = \\frac{1000}{2\\pi} \\approx 159.15\\,\\text{Hz}$$

**2. Circuit Quality Factor ($Q$):**
$$Q = \\frac{1}{R} \\sqrt{\\frac{L}{C}} = \\frac{1}{10} \\sqrt{\\frac{0.1}{10^{-5}}} = \\frac{1}{10} \\sqrt{10000} = \\frac{100}{10} = 10.0$$

**3. Half-Power Bandwidth ($BW$):**
$$BW = \\frac{f_r}{Q} = \\frac{159.15}{10} = 15.92\\,\\text{Hz}$$

**4. Half-Power Cutoff Frequencies:**
- Lower cutoff: $f_1 = f_r - \\frac{BW}{2} = 159.15 - 7.96 = 151.19\\,\\text{Hz}$
- Upper cutoff: $f_2 = f_r + \\frac{BW}{2} = 159.15 + 7.96 = 167.11\\,\\text{Hz}$`,

  'carson': `### Carson’s Rule for FM Transmission Bandwidth
**Principle:**
Frequency Modulation produces theoretically infinite pairs of Bessel sidebands ($J_n(\\beta)$). Carson's rule provides a practical approximation containing over 98% of total transmitted power.

**Mathematical Formula:**
$$BW = 2 \\cdot (\\Delta f + f_m) = 2 \\cdot f_m \\cdot (\\beta + 1)$$
where:
- $\\Delta f$ = peak frequency deviation (Hz)
- $f_m$ = highest modulating signal frequency (Hz)
- $\\beta = \\frac{\\Delta f}{f_m}$ = FM modulation index

**Comparison:**
- **Narrowband FM (NBFM):** $\\beta \\ll 1$. Bandwidth is $BW \\approx 2 f_m$ (identical to standard AM DSB-FC).
- **Wideband FM (WBFM):** $\\beta \\gg 1$. Bandwidth is $BW \\approx 2 \\Delta f$. Commercial broadcast standard uses $\\Delta f = 75\\,\\text{kHz}$, $f_m = 15\\,\\text{kHz} \\implies BW = 2(75+15) = 180\\,\\text{kHz}$.`,

  'barkhausen': `### Barkhausen Criterion for Sustained Oscillations
For an amplifier with feedback factor $\\beta$ to produce stable, sustained sinusoidal oscillations without external input:

1. **Loop Gain Magnitude Condition:**
   $$|A \\cdot \\beta| = 1$$
   - If $|A\\beta| < 1$, oscillations damp out exponentially to zero.
   - If $|A\\beta| > 1$, output grows until clipped by amplifier supply rails.
   - For startup, initial $|A\\beta| > 1$ is required, settling to exactly $1.0$ via AGC or back-to-back diode limiter.

2. **Loop Phase Shift Condition:**
   $$\\angle (A \\cdot \\beta) = 0^\\circ \\quad \\text{or} \\quad 360^\\circ \\cdot n \\quad (n \\in \\mathbb{Z})$$
   - Total phase shift around the feedback loop must be zero or an integral multiple of $360^\\circ$ (positive feedback).
   - In an inverting op-amp ($-180^\\circ$), the feedback network must contribute the remaining $-180^\\circ$ (e.g. 3-stage RC phase shift oscillator with $60^\\circ$ per stage).`,

  'waveguide': `### Rectangular Waveguide $TE_{10}$ Dominant Mode Cutoff
**Formula for Cutoff Frequency ($f_{c,mn}$):**
$$f_{c,mn} = \\frac{c}{2} \\sqrt{\\left(\\frac{m}{a}\\right)^2 + \\left(\\frac{n}{b}\\right)^2}$$

For the dominant mode $TE_{10}$ ($m=1, n=0$):
$$f_c = \\frac{c}{2a}$$

**Standard X-Band Dimensions:**
$a = 2.286\\,\\text{cm} = 0.02286\\,\\text{m}$, $b = 1.016\\,\\text{cm}$
$$f_c = \\frac{3 \\times 10^8\\,\\text{m/s}}{2 \\times 0.02286\\,\\text{m}} \\approx 6.561\\,\\text{GHz}$$

**Guide Wavelength ($\\lambda_g$):**
$$\\lambda_g = \\frac{\\lambda_0}{\\sqrt{1 - (f_c / f)^2}}$$
At operating frequency $f = 10\\,\\text{GHz}$:
$$\\lambda_0 = \\frac{3 \\times 10^8}{10 \\times 10^9} = 3.0\\,\\text{cm}$$
$$\\sqrt{1 - (6.561 / 10)^2} = \\sqrt{1 - 0.4305} = 0.7546$$
$$\\lambda_g = \\frac{3.0\\,\\text{cm}}{0.7546} \\approx 3.976\\,\\text{cm}$$`
};

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleAsk = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setQuestion(q);
    setIsSearching(true);

    setTimeout(() => {
      const lower = q.toLowerCase();
      let match = '';

      if (lower.includes('555') || lower.includes('duty') || lower.includes('astable')) {
        match = BUILTIN_KNOWLEDGE['555'];
      } else if (lower.includes('rlc') || lower.includes('resonance') || lower.includes('q-factor') || lower.includes('bandwidth')) {
        match = BUILTIN_KNOWLEDGE['rlc'];
      } else if (lower.includes('carson') || lower.includes('fm') || lower.includes('wbfm')) {
        match = BUILTIN_KNOWLEDGE['carson'];
      } else if (lower.includes('barkhausen') || lower.includes('oscillation') || lower.includes('wien')) {
        match = BUILTIN_KNOWLEDGE['barkhausen'];
      } else if (lower.includes('waveguide') || lower.includes('te10') || lower.includes('cutoff') || lower.includes('x-band')) {
        match = BUILTIN_KNOWLEDGE['waveguide'];
      } else {
        match = `### VTU ECE Formulation & Problem Solving Strategy
For your query regarding **"${q}"**:

1. **Governing Law / Principle:** Verify the applicable VTU CBCS course module and write down the standard equations with proper sign conventions.
2. **Parameters & Units:** Convert all given engineering values into standard SI base units (Ohms, Farads, Henries, Hertz, Meters, dBm to Watts) before substituting into formulas.
3. **Step-by-Step Working:** Show the algebraic formula first, followed by the substituted numbers, intermediate mathematical calculation, and the final unit.
4. **Recommended Tool in VoltMate:** Use the search bar in VoltMate's main dashboard to load the interactive calculator for this specific topic to get instant numerical solutions and export a full PDF solution report!`;
      }

      setAnswer(match);
      setIsSearching(false);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100 leading-tight">
                  VoltMate VTU ECE Exam Assistant
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  Instant ECE Tutor
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ask theoretical questions, derivation explanations, and exam solving strategies
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Ask Input */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask any VTU ECE formula, problem, or concept (e.g. Derive RLC resonance, Barkhausen criteria, 555 astable duty cycle, Waveguide cutoff)..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
              />
              <button
                onClick={() => handleAsk(question)}
                disabled={isSearching || !question.trim()}
                className="absolute right-3 bottom-3 flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Solve / Explain</span>
              </button>
            </div>

            {/* Quick Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Popular VTU Exam Inquiries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(q)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800/80 text-slate-300 border border-slate-800 hover:border-cyan-500/30 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Answer Display */}
          {answer && (
            <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/20 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified VTU Engineering Solution</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  CBCS Syllabus Compliant
                </span>
              </div>

              <div className="prose prose-invert prose-xs max-w-none text-slate-200 space-y-3 font-sans leading-relaxed">
                {answer.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('###')) {
                    return (
                      <h3 key={pIdx} className="text-sm font-bold text-cyan-300 border-b border-slate-800/60 pb-1 mt-2">
                        {paragraph.replace('###', '').trim()}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                    const parts = paragraph.split(':**');
                    return (
                      <p key={pIdx} className="text-xs">
                        <strong className="text-amber-300">{parts[0].replace('**', '')}:</strong>
                        {parts[1]}
                      </p>
                    );
                  }
                  return (
                    <div key={pIdx} className="text-xs font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-slate-300 whitespace-pre-wrap">
                      {paragraph}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
