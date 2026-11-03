import { jsPDF } from 'jspdf';
import { VTUFormula, CalculationResult } from '../types/formula';
import { SEMESTER_METADATA } from '../data/vtuFormulas';

export function exportSemesterCheatsheet(semester: number, formulas: VTUFormula[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const semInfo = SEMESTER_METADATA[semester] || {
    name: `Semester ${semester}`,
    subtitle: 'Electronics & Communication Engineering',
    subjects: [],
  };

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 16;

  // Header banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, pageWidth - 2 * margin, 24, 'F');

  doc.setTextColor(6, 182, 212); // cyan-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('VOLTMATE  |  VTU ECE FORMULA CHEATSHEET', margin + 6, y + 8);

  doc.setTextColor(248, 250, 252);
  doc.setFontSize(11);
  doc.text(`${semInfo.name.toUpperCase()} — ${semInfo.subtitle}`, margin + 6, y + 15);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated for VTU CBCS Scheme  •  Total Formulas: ${formulas.length}  •  ${new Date().toLocaleDateString()}`, margin + 6, y + 20);

  y += 30;

  formulas.forEach((formula, index) => {
    // Check if new page is needed
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 16;
    }

    // Formula card container
    doc.setFillColor(248, 250, 252); // light slate background
    doc.setDrawColor(226, 232, 240); // slate-200 border
    doc.rect(margin, y, pageWidth - 2 * margin, 32, 'FD');

    // Title & subject tag
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${formula.title}`, margin + 4, y + 6);

    // Subject Pill
    doc.setTextColor(14, 116, 144); // cyan-700
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`[${formula.subjectCode}] ${formula.subjectName} (Mod ${formula.module})`, pageWidth - margin - 4, y + 6, { align: 'right' });

    // Math formula box
    doc.setFillColor(238, 242, 255); // indigo-50
    doc.setDrawColor(199, 210, 254); // indigo-200
    doc.roundedRect(margin + 4, y + 9, pageWidth - 2 * margin - 8, 8, 1, 1, 'FD');

    doc.setTextColor(30, 27, 75); // indigo-950
    doc.setFont('courier', 'bold');
    doc.setFontSize(9);
    doc.text(formula.formulaDisplay, margin + 7, y + 14.5);

    // Variables / description
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const splitDesc = doc.splitTextToSize(formula.description, pageWidth - 2 * margin - 8);
    doc.text(splitDesc.slice(0, 1), margin + 4, y + 21);

    // Key variables inline
    const varText = 'Variables: ' + formula.variables.map(v => `${v.symbol} (${v.name.split('(')[0].trim()}) [${v.unit}]`).join(' • ');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    const splitVars = doc.splitTextToSize(varText, pageWidth - 2 * margin - 8);
    doc.text(splitVars.slice(0, 1), margin + 4, y + 26);

    y += 36;
  });

  // Footer page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`VoltMate ECE Formula Hub  —  Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  doc.save(`VoltMate_VTU_ECE_Sem${semester}_Cheatsheet.pdf`);
}

export function exportSolvedProblemReport(
  formula: VTUFormula,
  inputs: Record<string, number>,
  result: CalculationResult
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = 18;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, pageWidth - 2 * margin, 26, 'F');

  doc.setTextColor(6, 182, 212); // cyan-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('VOLTMATE  |  VTU ECE SOLVED PROBLEM REPORT', margin + 6, y + 9);

  doc.setTextColor(241, 245, 249);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formula.subjectCode}: ${formula.subjectName} — Module ${formula.module}`, margin + 6, y + 16);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(`Timestamp: ${new Date().toLocaleString()}  •  Verified VTU CBCS Formulation`, margin + 6, y + 22);

  y += 34;

  // Formula Title Section
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(formula.title, margin, y);
  y += 6;

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(formula.description, pageWidth - 2 * margin);
  doc.text(descLines, margin, y);
  y += descLines.length * 4.5 + 4;

  // Primary Equation Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 12, 1.5, 1.5, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.text(`EQUATION:  ${formula.formulaDisplay}`, margin + 5, y + 7.5);
  y += 18;

  // Section 1: Given Input Values
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. Given Input Parameters', margin, y);
  y += 6;

  formula.variables.forEach(v => {
    const val = inputs[v.key] !== undefined ? inputs[v.key] : v.defaultValue;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, pageWidth - 2 * margin, 7, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`• ${v.name} (${v.symbol}):`, margin + 4, y + 4.8);

    doc.setFont('courier', 'bold');
    doc.setTextColor(14, 116, 144);
    doc.text(`${val} ${v.unit}`, pageWidth - margin - 4, y + 4.8, { align: 'right' });
    y += 8;
  });

  y += 4;

  // Section 2: Calculated Final Results
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Computed Engineering Results', margin, y);
  y += 6;

  result.outputs.forEach(out => {
    doc.setFillColor(out.highlight ? 236 : 248, out.highlight ? 253 : 250, out.highlight ? 245 : 252);
    doc.setDrawColor(out.highlight ? 52 : 226, out.highlight ? 211 : 232, out.highlight ? 153 : 240);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 8, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(out.highlight ? 6 : 51, out.highlight ? 95 : 65, out.highlight ? 70 : 85);
    doc.text(`${out.label} (${out.symbol})`, margin + 4, y + 5.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(out.highlight ? 4 : 15, out.highlight ? 120 : 23, out.highlight ? 87 : 42);
    doc.text(`${out.value} ${out.unit}`, pageWidth - margin - 4, y + 5.5, { align: 'right' });
    y += 9.5;
  });

  y += 4;

  // Section 3: Step-by-Step Mathematical Derivation
  if (y > pageHeight - 60) {
    doc.addPage();
    y = 18;
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. Step-by-Step Derivation & Working', margin, y);
  y += 6;

  result.steps.forEach(step => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 18;
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const stepLines = doc.splitTextToSize(step, pageWidth - 2 * margin - 6);
    doc.text(stepLines, margin + 4, y);
    y += stepLines.length * 4.5 + 2;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`VoltMate Solved Problem Report  •  VTU ECE Hub  •  Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  doc.save(`VoltMate_Solution_${formula.id}.pdf`);
}

export function exportMasterHandbook(formulas: VTUFormula[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Cover Page
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(6, 182, 212); // cyan-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('VOLTMATE', pageWidth / 2, 85, { align: 'center' });

  doc.setTextColor(248, 250, 252);
  doc.setFontSize(16);
  doc.text('VTU ECE MASTER FORMULA HANDBOOK', pageWidth / 2, 98, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Comprehensive Formulae, Theory & Solved Exam References', pageWidth / 2, 108, { align: 'center' });
  doc.text('Semesters 1 through 8  •  Visvesvaraya Technological University (VTU) CBCS', pageWidth / 2, 115, { align: 'center' });

  // Divider
  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 40, 125, pageWidth / 2 + 40, 125);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(9);
  doc.text(`Total Engineering Formulas: ${formulas.length}`, pageWidth / 2, 140, { align: 'center' });
  doc.text(`Published by VoltMate Engineering Hub  •  ${new Date().getFullYear()}`, pageWidth / 2, 260, { align: 'center' });

  // Formulas by semester
  const semGroups: Record<number, VTUFormula[]> = {};
  for (let s = 1; s <= 8; s++) {
    semGroups[s] = formulas.filter(f => f.semesters.includes(s as any));
  }

  for (let s = 1; s <= 8; s++) {
    const semList = semGroups[s];
    if (!semList || semList.length === 0) continue;

    doc.addPage();
    let y = 18;

    const semInfo = SEMESTER_METADATA[s];
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, pageWidth - 2 * margin, 18, 'F');

    doc.setTextColor(6, 182, 212);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`SEMESTER ${s}: ${semInfo ? semInfo.name.toUpperCase() : ''}`, margin + 5, y + 8);

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(semInfo ? semInfo.subtitle : '', margin + 5, y + 14);

    y += 24;

    semList.forEach((f, idx) => {
      if (y > pageHeight - 38) {
        doc.addPage();
        y = 18;
      }

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, pageWidth - 2 * margin, 28, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${f.title}`, margin + 4, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(14, 116, 144);
      doc.text(`[${f.subjectCode}] ${f.subjectName}`, pageWidth - margin - 4, y + 5.5, { align: 'right' });

      // Equation
      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 27, 75);
      doc.text(f.formulaDisplay, margin + 4, y + 12);

      // Description & variables
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      const splitDesc = doc.splitTextToSize(f.description, pageWidth - 2 * margin - 8);
      doc.text(splitDesc.slice(0, 1), margin + 4, y + 18);

      const varsLine = 'Vars: ' + f.variables.map(v => `${v.symbol} [${v.unit}]`).join(', ');
      doc.setTextColor(100, 116, 139);
      doc.text(varsLine, margin + 4, y + 23);

      y += 32;
    });
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`VoltMate VTU ECE Master Handbook  •  Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  doc.save('VoltMate_VTU_ECE_Master_Handbook.pdf');
}
