import { useState, useEffect } from 'react';
import type { Question, QuizSession } from '../types';
import {
  getQuestions,
  saveQuestions,
  resetQuestions,
  getSessions,
  clearSessions,
  ADMIN_PASSWORD,
} from '../store';

interface AdminScreenProps {
  onBack: () => void;
}

type Tab = 'dashboard' | 'questions';

export default function AdminScreen({ onBack }: AdminScreenProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authenticated) {
      setQuestions(getQuestions());
      setSessions(getSessions());
    }
  }, [authenticated]);

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  function handleSave() {
    saveQuestions(questions);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    resetQuestions();
    setQuestions(getQuestions());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClearSessions() {
    clearSessions();
    setSessions([]);
  }

  function addQuestion() {
    const newQ: Question = {
      id: Date.now().toString(),
      text: '',
      options: [
        { label: 'A', text: '' },
        { label: 'B', text: '' },
        { label: 'C', text: '' },
        { label: 'D', text: '' },
      ],
      correctIndex: 0,
    };
    setQuestions([...questions, newQ]);
    setEditingIndex(questions.length);
  }

  function removeQuestion(index: number) {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    if (editingIndex === index) setEditingIndex(null);
  }

  function updateQuestion(index: number, field: string, value: string | number) {
    const updated = [...questions];
    if (field === 'text') {
      updated[index] = { ...updated[index], text: value as string };
    } else if (field === 'correctIndex') {
      updated[index] = { ...updated[index], correctIndex: value as number };
    }
    setQuestions(updated);
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    const updated = [...questions];
    const options = [...updated[qIndex].options];
    options[oIndex] = { ...options[oIndex], text: value };
    updated[qIndex] = { ...updated[qIndex], options };
    setQuestions(updated);
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <h2 className="text-secondary text-2xl font-bold mb-6 text-center">
            Área do Administrador
          </h2>
          <input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className={`w-full px-4 py-3 rounded-xl border-2 text-lg outline-none transition-colors ${
              passwordError
                ? 'border-wrong text-wrong'
                : 'border-gray-200 focus:border-primary'
            }`}
          />
          {passwordError && (
            <p className="text-wrong text-sm mt-2">Senha incorreta!</p>
          )}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-secondary font-semibold hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleLogin}
              className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stats calculations
  const totalSessions = sessions.length;
  const avgScore =
    totalSessions > 0
      ? sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions
      : 0;
  const avgTotal =
    totalSessions > 0
      ? sessions.reduce((sum, s) => sum + s.total, 0) / totalSessions
      : 0;
  const avgPercent = avgTotal > 0 ? (avgScore / avgTotal) * 100 : 0;

  // Per-question stats
  const questionStats = questions.map((q) => {
    let correct = 0;
    let total = 0;
    sessions.forEach((s) => {
      const answer = s.answers.find((a) => a.questionId === q.id);
      if (answer) {
        total++;
        if (answer.selectedIndex === answer.correctIndex) correct++;
      }
    });
    return { question: q.text, correct, total, percent: total > 0 ? (correct / total) * 100 : 0 };
  });

  // Score distribution
  const scoreDistribution: Record<string, number> = {};
  sessions.forEach((s) => {
    const pct = Math.round((s.score / s.total) * 100);
    let bucket: string;
    if (pct <= 20) bucket = '0-20%';
    else if (pct <= 40) bucket = '21-40%';
    else if (pct <= 60) bucket = '41-60%';
    else if (pct <= 80) bucket = '61-80%';
    else bucket = '81-100%';
    scoreDistribution[bucket] = (scoreDistribution[bucket] || 0) + 1;
  });

  const buckets = ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];
  const maxBucketVal = Math.max(...buckets.map((b) => scoreDistribution[b] || 0), 1);

  return (
    <div className="flex flex-col min-h-[100dvh] w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary text-white py-4 px-6 flex items-center justify-between shadow-md">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white font-semibold transition-colors"
        >
          ← Voltar
        </button>
        <h2 className="text-lg font-bold">Administração</h2>
        <div className="w-16" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setTab('dashboard')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            tab === 'dashboard'
              ? 'text-primary border-b-2 border-primary'
              : 'text-secondary/50 hover:text-secondary/70'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setTab('questions')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            tab === 'questions'
              ? 'text-primary border-b-2 border-primary'
              : 'text-secondary/50 hover:text-secondary/70'
          }`}
        >
          Perguntas
        </button>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {tab === 'dashboard' ? (
          <DashboardTab
            totalSessions={totalSessions}
            avgPercent={avgPercent}
            avgScore={avgScore}
            avgTotal={avgTotal}
            questionStats={questionStats}
            buckets={buckets}
            scoreDistribution={scoreDistribution}
            maxBucketVal={maxBucketVal}
            sessions={sessions}
            onClearSessions={handleClearSessions}
          />
        ) : (
          <QuestionsTab
            questions={questions}
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
            onSave={handleSave}
            onAdd={addQuestion}
            onReset={handleReset}
            onRemove={removeQuestion}
            onUpdateQuestion={updateQuestion}
            onUpdateOption={updateOption}
            saved={saved}
          />
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Tab ───────────────────────────────────────────

interface DashboardTabProps {
  totalSessions: number;
  avgPercent: number;
  avgScore: number;
  avgTotal: number;
  questionStats: { question: string; correct: number; total: number; percent: number }[];
  buckets: string[];
  scoreDistribution: Record<string, number>;
  maxBucketVal: number;
  sessions: QuizSession[];
  onClearSessions: () => void;
}

function DashboardTab({
  totalSessions,
  avgPercent,
  avgScore,
  avgTotal,
  questionStats,
  buckets,
  scoreDistribution,
  maxBucketVal,
  sessions,
  onClearSessions,
}: DashboardTabProps) {
  if (totalSessions === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-secondary/50">
        <svg viewBox="0 0 64 64" className="w-16 h-16 mb-4 opacity-30">
          <rect x="8" y="28" width="10" height="28" rx="2" fill="currentColor" />
          <rect x="22" y="18" width="10" height="38" rx="2" fill="currentColor" />
          <rect x="36" y="8" width="10" height="48" rx="2" fill="currentColor" />
          <rect x="50" y="22" width="10" height="34" rx="2" fill="currentColor" />
        </svg>
        <p className="font-semibold text-lg">Nenhuma sessão registrada</p>
        <p className="text-sm mt-1">Os dados aparecerão aqui após jogadores completarem o quiz.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-2xl font-extrabold text-primary">{totalSessions}</p>
          <p className="text-xs text-secondary/60 font-semibold mt-1">Sessões</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-2xl font-extrabold text-primary-light">{avgPercent.toFixed(0)}%</p>
          <p className="text-xs text-secondary/60 font-semibold mt-1">Média Acertos</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-2xl font-extrabold text-secondary">
            {avgScore.toFixed(1)}/{avgTotal.toFixed(0)}
          </p>
          <p className="text-xs text-secondary/60 font-semibold mt-1">Média Score</p>
        </div>
      </div>

      {/* Score distribution */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-sm font-bold text-secondary mb-3">Distribuição de Acertos</h3>
        <div className="space-y-2">
          {buckets.map((bucket) => {
            const val = scoreDistribution[bucket] || 0;
            const width = (val / maxBucketVal) * 100;
            return (
              <div key={bucket} className="flex items-center gap-2">
                <span className="text-xs text-secondary/60 w-16 text-right font-mono shrink-0">
                  {bucket}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-light to-primary transition-all duration-300"
                    style={{ width: `${Math.max(width, val > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-secondary w-6">{val}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-question stats */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-sm font-bold text-secondary mb-3">Acertos por Pergunta</h3>
        <div className="space-y-3">
          {questionStats.map((qs, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-secondary/80 font-semibold truncate max-w-[70%]">
                  {i + 1}. {qs.question}
                </span>
                <span
                  className={`text-xs font-bold ${
                    qs.percent >= 70
                      ? 'text-correct'
                      : qs.percent >= 40
                        ? 'text-accent-gold'
                        : 'text-wrong'
                  }`}
                >
                  {qs.total > 0 ? `${qs.percent.toFixed(0)}%` : '—'}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    qs.percent >= 70
                      ? 'bg-correct'
                      : qs.percent >= 40
                        ? 'bg-accent-gold'
                        : 'bg-wrong'
                  }`}
                  style={{ width: `${qs.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-sm font-bold text-secondary mb-3">
          Últimas Sessões
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[...sessions]
            .reverse()
            .slice(0, 20)
            .map((s) => {
              const pct = (s.score / s.total) * 100;
              const date = new Date(s.date);
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs text-secondary/60">
                    {date.toLocaleDateString('pt-BR')}{' '}
                    {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      pct >= 70 ? 'text-correct' : pct >= 40 ? 'text-accent-gold' : 'text-wrong'
                    }`}
                  >
                    {s.score}/{s.total} ({pct.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Clear sessions */}
      <div className="text-center pt-2 pb-4">
        <button
          onClick={onClearSessions}
          className="bg-wrong/80 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-wrong transition-colors text-sm"
        >
          Limpar Sessões
        </button>
      </div>
    </div>
  );
}

// ─── Questions Tab ───────────────────────────────────────────

interface QuestionsTabProps {
  questions: Question[];
  editingIndex: number | null;
  setEditingIndex: (i: number | null) => void;
  onSave: () => void;
  onAdd: () => void;
  onReset: () => void;
  onRemove: (i: number) => void;
  onUpdateQuestion: (i: number, field: string, value: string | number) => void;
  onUpdateOption: (qi: number, oi: number, value: string) => void;
  saved: boolean;
}

function QuestionsTab({
  questions,
  editingIndex,
  setEditingIndex,
  onSave,
  onAdd,
  onReset,
  onRemove,
  onUpdateQuestion,
  onUpdateOption,
  saved,
}: QuestionsTabProps) {
  return (
    <>
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <button
          onClick={onSave}
          className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm"
        >
          {saved ? '✓ Salvo!' : 'Salvar Alterações'}
        </button>
        <button
          onClick={onAdd}
          className="bg-secondary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-secondary-light transition-colors text-sm"
        >
          + Adicionar Pergunta
        </button>
        <button
          onClick={onReset}
          className="bg-wrong/80 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-wrong transition-colors text-sm"
        >
          Resetar Padrão
        </button>
      </div>

      <p className="text-center text-secondary/60 text-sm mb-6">
        Total: {questions.length} perguntas
      </p>

      {/* Questions list */}
      <div className="space-y-4 max-w-lg mx-auto">
        {questions.map((q, qIndex) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-4 py-3 bg-secondary/5 cursor-pointer"
              onClick={() =>
                setEditingIndex(editingIndex === qIndex ? null : qIndex)
              }
            >
              <span className="font-bold text-secondary text-sm">
                {qIndex + 1}. {q.text || '(Sem texto)'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(qIndex);
                  }}
                  className="text-wrong/60 hover:text-wrong text-lg transition-colors"
                  title="Remover"
                >
                  ✕
                </button>
                <span className="text-secondary/40 text-xs">
                  {editingIndex === qIndex ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {editingIndex === qIndex && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary/70 mb-1">
                    Pergunta
                  </label>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) =>
                      onUpdateQuestion(qIndex, 'text', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary outline-none text-sm"
                    placeholder="Digite a pergunta..."
                  />
                </div>

                {q.options.map((opt, oIndex) => (
                  <div key={oIndex}>
                    <label className="block text-sm font-semibold text-secondary/70 mb-1">
                      Opção {opt.label}
                      {oIndex === q.correctIndex && (
                        <span className="text-correct ml-2">✓ Correta</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) =>
                        onUpdateOption(qIndex, oIndex, e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary outline-none text-sm"
                      placeholder={`Texto da opção ${opt.label}...`}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-semibold text-secondary/70 mb-1">
                    Resposta correta
                  </label>
                  <select
                    value={q.correctIndex}
                    onChange={(e) =>
                      onUpdateQuestion(
                        qIndex,
                        'correctIndex',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary outline-none text-sm"
                  >
                    {q.options.map((opt, oIndex) => (
                      <option key={oIndex} value={oIndex}>
                        {opt.label}) {opt.text || '...'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
