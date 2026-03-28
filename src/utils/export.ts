import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { PlayAnswer, Session } from '../types';

interface PlayWithMeta {
  id: string;
  date: string;
  score: number;
  total: number;
  answers: PlayAnswer[];
  sessionName: string;
  quizName: string;
}

interface Stats {
  totalPlays: number;
  avgPercent: number;
  avgScore: number;
  avgTotal: number;
}

interface QuestionStat {
  question: string;
  correct: number;
  total: number;
  percent: number;
}

export function exportPDF(
  plays: PlayWithMeta[],
  questionStats: QuestionStat[],
  stats: Stats,
  sessions: Session[],
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Desafio do Dinheiro Inteligente', pageWidth / 2, 16, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, pageWidth / 2, 26, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Geral', 14, 48);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Total de sessões: ${sessions.length}`, 14, 58);
  doc.text(`Total de jogadas: ${stats.totalPlays}`, 14, 65);
  doc.text(`Média de acertos: ${stats.avgPercent.toFixed(1)}%`, 14, 72);
  doc.text(`Score médio: ${stats.avgScore.toFixed(1)} de ${stats.avgTotal.toFixed(0)}`, 14, 79);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Acertos por Pergunta', 14, 95);

  autoTable(doc, {
    startY: 100,
    head: [['#', 'Pergunta', 'Acertos', 'Total', '%']],
    body: questionStats.map((qs, i) => [
      String(i + 1),
      qs.question.length > 50 ? qs.question.substring(0, 50) + '...' : qs.question,
      String(qs.correct),
      String(qs.total),
      qs.total > 0 ? `${qs.percent.toFixed(0)}%` : '—',
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [22, 163, 74], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 90 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 20, halign: 'center' },
    },
  });

  const sessionsY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

  if (sessionsY > 240) {
    doc.addPage();
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Últimas Jogadas', 14, 20);
    addPlaysTable(doc, plays, 25);
  } else {
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Últimas Jogadas', 14, sessionsY);
    addPlaysTable(doc, plays, sessionsY + 5);
  }

  doc.save('relatorio-quiz.pdf');
}

function addPlaysTable(doc: jsPDF, plays: PlayWithMeta[], startY: number) {
  autoTable(doc, {
    startY,
    head: [['Data', 'Sessão', 'Score', '%']],
    body: [...plays].reverse().slice(0, 50).map(p => {
      const date = new Date(p.date);
      const pct = (p.score / p.total) * 100;
      return [
        `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
        p.sessionName || 'Sessão',
        `${p.score}/${p.total}`,
        `${pct.toFixed(0)}%`,
      ];
    }),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [22, 163, 74], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 253, 244] },
  });
}

export function exportXLSX(plays: PlayWithMeta[], sessions: Session[]) {
  const data = [...plays].reverse().map(p => {
    const date = new Date(p.date);
    const pct = (p.score / p.total) * 100;
    return {
      'Data': date.toLocaleDateString('pt-BR'),
      'Hora': date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      'Sessão': p.sessionName || 'Sessão',
      'Quiz': p.quizName || 'Quiz',
      'Acertos': p.score,
      'Total': p.total,
      'Percentual': `${pct.toFixed(0)}%`,
      ...Object.fromEntries(p.answers.map((a, i) => [
        `P${i + 1}`,
        a.selectedIndex === a.correctIndex ? 'Certo' : 'Errado',
      ])),
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Jogadas');

  if (data.length > 0) {
    const colWidths = Object.keys(data[0]).map(key => ({
      wch: Math.max(key.length, ...data.map(row => String((row as Record<string, unknown>)[key] ?? '').length)) + 2,
    }));
    ws['!cols'] = colWidths;
  }

  XLSX.writeFile(wb, 'resultados-quiz.xlsx');
}
