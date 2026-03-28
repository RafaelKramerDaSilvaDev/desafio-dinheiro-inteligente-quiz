import { useState, useEffect } from 'react';
import {
  ArrowLeft, LayoutDashboard, BookOpen, Pencil, Settings, Trash2,
  Plus, Save, ChevronDown, ChevronUp, X,
  Play, Archive, Undo2, FileDown, FileSpreadsheet,
  CheckCircle2, Clock, Users, TrendingUp, Layers,
  HardDrive, Download, Upload, AlertCircle, CheckCircle,
} from 'lucide-react';
import type { Question, Quiz, Session } from '../types';
import {
  getQuizzes,
  addQuiz, updateQuiz, softDeleteQuiz, restoreQuiz, permanentDeleteQuiz,
  getSessions, setActiveSession,
  addSession, softDeleteSession, restoreSession, permanentDeleteSession,
  getTimerSeconds, saveTimerSeconds,
  ADMIN_PASSWORD,
} from '../store';
import ConfirmModal from './ConfirmModal';
import { exportPDF, exportXLSX } from '../utils/export';
import { downloadMemory, loadMemory } from '../utils/memory';

interface AdminScreenProps {
  onBack: () => void;
}

type Tab = 'dashboard' | 'sessions' | 'quizzes' | 'settings' | 'trash';

export default function AdminScreen({ onBack }: AdminScreenProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (authenticated) refreshData();
  }, [authenticated]);

  function refreshData() {
    setQuizzes(getQuizzes());
    setSessions(getSessions());
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-6">
        <div className="glass rounded-2xl shadow-xl p-8 w-full max-w-sm animate-scale-in">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Settings size={28} className="text-primary" />
          </div>
          <h2 className="text-slate-800 text-xl font-bold mb-6 text-center">Área do Administrador</h2>
          <input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className={`w-full px-4 py-3 rounded-xl border-2 text-base outline-none ${
              passwordError ? 'border-wrong text-wrong' : 'border-slate-200 focus:border-primary'
            }`}
          />
          {passwordError && <p className="text-wrong text-sm mt-2">Senha incorreta!</p>}
          <div className="flex gap-3 mt-6">
            <button onClick={onBack} className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-sm">
              Voltar
            </button>
            <button onClick={handleLogin} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark text-sm">
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeQuizzes = quizzes.filter(q => !q.isDeleted);
  const activeSessions = sessions.filter(s => !s.isDeleted);
  const trashedSessions = sessions.filter(s => s.isDeleted);
  const trashedQuizzes = quizzes.filter(q => q.isDeleted);
  const trashedCount = trashedQuizzes.length + trashedSessions.length;

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sessions', label: 'Sessões', icon: Layers },
    { id: 'quizzes', label: 'Quizzes', icon: BookOpen },
    { id: 'settings', label: 'Config', icon: Settings },
    { id: 'trash', label: 'Lixeira', icon: Trash2, badge: trashedCount || undefined },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full">
      <div className="bg-gradient-to-r from-primary-darker to-primary-dark text-white py-4 px-4 md:px-6 flex items-center justify-between shadow-lg">
        <button onClick={onBack} className="text-white/70 hover:text-white font-medium flex items-center gap-1.5 text-sm">
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Voltar</span>
        </button>
        <h2 className="text-base md:text-lg font-bold">Administração</h2>
        <div className="w-16" />
      </div>

      <div className="flex border-b border-slate-200 bg-white overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-0 py-3 text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 relative whitespace-nowrap px-2 ${
              tab === t.id ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <t.icon size={16} />
            <span className="hidden sm:inline">{t.label}</span>
            {t.badge && (
              <span className="absolute -top-0.5 right-1 sm:static bg-wrong text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 py-5 overflow-y-auto w-full max-w-2xl mx-auto">
        {tab === 'dashboard' && <DashboardTab sessions={activeSessions} quizzes={activeQuizzes} />}
        {tab === 'sessions' && <SessionsTab sessions={activeSessions} quizzes={activeQuizzes} onRefresh={refreshData} />}
        {tab === 'quizzes' && <QuizzesTab quizzes={activeQuizzes} onRefresh={refreshData} />}
        {tab === 'settings' && <SettingsTab onRefresh={refreshData} />}
        {tab === 'trash' && <TrashTab trashedQuizzes={trashedQuizzes} trashedSessions={trashedSessions} onRefresh={refreshData} />}
      </div>
    </div>
  );
}

function DashboardTab({ sessions, quizzes }: { sessions: Session[]; quizzes: Quiz[] }) {
  const allPlays = sessions.flatMap(s => s.plays.map(p => ({ ...p, sessionName: s.name, quizName: s.quizName })));
  const totalPlays = allPlays.length;
  const avgScore = totalPlays > 0 ? allPlays.reduce((s, p) => s + p.score, 0) / totalPlays : 0;
  const avgTotal = totalPlays > 0 ? allPlays.reduce((s, p) => s + p.total, 0) / totalPlays : 0;
  const avgPercent = avgTotal > 0 ? (avgScore / avgTotal) * 100 : 0;

  const activeSession = sessions.find(s => s.isActive);
  const activeQuiz = activeSession ? quizzes.find(q => q.id === activeSession.quizId) : null;
  const activeQuestions = activeQuiz?.questions ?? [];

  const questionStats = activeQuestions.map(q => {
    let correct = 0, total = 0;
    allPlays.forEach(p => {
      const a = p.answers.find(a => a.questionId === q.id);
      if (a) { total++; if (a.selectedIndex === a.correctIndex) correct++; }
    });
    return { question: q.text, correct, total, percent: total > 0 ? (correct / total) * 100 : 0 };
  });

  const buckets = ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];
  const scoreDistribution: Record<string, number> = {};
  allPlays.forEach(p => {
    const pct = Math.round((p.score / p.total) * 100);
    const bucket = pct <= 20 ? '0-20%' : pct <= 40 ? '21-40%' : pct <= 60 ? '41-60%' : pct <= 80 ? '61-80%' : '81-100%';
    scoreDistribution[bucket] = (scoreDistribution[bucket] || 0) + 1;
  });
  const maxBucketVal = Math.max(...buckets.map(b => scoreDistribution[b] || 0), 1);

  if (totalPlays === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <LayoutDashboard size={48} className="mb-4 opacity-30" />
        <p className="font-semibold text-lg">Nenhuma jogada registrada</p>
        <p className="text-sm mt-1">Os dados aparecerão após jogadores completarem o quiz.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => exportPDF(allPlays, questionStats, { totalPlays, avgPercent, avgScore, avgTotal }, sessions)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-wrong/10 text-wrong hover:bg-wrong/20 text-xs font-semibold"
        >
          <FileDown size={14} />
          PDF
        </button>
        <button
          onClick={() => exportXLSX(allPlays, sessions)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold"
        >
          <FileSpreadsheet size={14} />
          Planilha
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { value: totalPlays, label: 'Jogadas', icon: Users, color: 'text-primary' },
          { value: `${avgPercent.toFixed(0)}%`, label: 'Média', icon: TrendingUp, color: 'text-primary-light' },
          { value: `${avgScore.toFixed(1)}/${avgTotal.toFixed(0)}`, label: 'Score', icon: CheckCircle2, color: 'text-slate-700' },
        ].map((card, i) => (
          <div key={i} className="glass rounded-xl shadow-md p-4 text-center">
            <card.icon size={18} className={`mx-auto mb-1 ${card.color} opacity-60`} />
            <p className={`text-xl md:text-2xl font-extrabold ${card.color}`}>{card.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl shadow-md p-4">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Distribuição de Acertos</h3>
        <div className="space-y-2">
          {buckets.map(bucket => {
            const val = scoreDistribution[bucket] || 0;
            const width = (val / maxBucketVal) * 100;
            return (
              <div key={bucket} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-14 text-right font-mono shrink-0">{bucket}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-300" style={{ width: `${Math.max(width, val > 0 ? 8 : 0)}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-600 w-6">{val}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-xl shadow-md p-4">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Acertos por Pergunta</h3>
        <div className="space-y-3">
          {questionStats.map((qs, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 font-semibold truncate max-w-[70%]">{i + 1}. {qs.question}</span>
                <span className={`text-xs font-bold shrink-0 ml-2 ${qs.percent >= 70 ? 'text-correct' : qs.percent >= 40 ? 'text-amber' : 'text-wrong'}`}>
                  {qs.total > 0 ? `${qs.percent.toFixed(0)}%` : '—'}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${qs.percent >= 70 ? 'bg-correct' : qs.percent >= 40 ? 'bg-amber' : 'bg-wrong'}`} style={{ width: `${qs.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl shadow-md p-4">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Últimas Jogadas</h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {[...allPlays].reverse().slice(0, 20).map(p => {
            const pct = (p.score / p.total) * 100;
            const date = new Date(p.date);
            return (
              <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">{date.toLocaleDateString('pt-BR')} {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-[10px] text-slate-400">{p.sessionName}</span>
                </div>
                <span className={`text-xs font-bold ${pct >= 70 ? 'text-correct' : pct >= 40 ? 'text-amber' : 'text-wrong'}`}>
                  {p.score}/{p.total} ({pct.toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SessionsTab({ sessions, quizzes, onRefresh }: { sessions: Session[]; quizzes: Quiz[]; onRefresh: () => void }) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuizId, setNewQuizId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  function handleCreate() {
    if (!newName.trim() || !newQuizId) return;
    const quiz = quizzes.find(q => q.id === newQuizId);
    if (!quiz) return;
    const session: Session = {
      id: Date.now().toString(),
      name: newName.trim(),
      quizId: quiz.id,
      quizName: quiz.name,
      isActive: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      plays: [],
    };
    addSession(session);
    onRefresh();
    setShowNewModal(false);
    setNewName('');
    setNewQuizId('');
  }

  function handleActivate(sessionId: string) {
    setActiveSession(sessionId);
    onRefresh();
  }

  function handleDelete(sessionId: string) {
    softDeleteSession(sessionId);
    onRefresh();
    setShowDeleteModal(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">{sessions.length} sessão(ões)</h3>
        <button onClick={() => { setShowNewModal(true); setNewQuizId(quizzes[0]?.id ?? ''); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark">
          <Plus size={16} /> Nova Sessão
        </button>
      </div>

      {sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Layers size={48} className="mb-4 opacity-30" />
          <p className="font-semibold text-lg">Nenhuma sessão</p>
          <p className="text-sm mt-1">Crie uma sessão para começar a registrar jogadas.</p>
        </div>
      )}

      {sessions.map(session => (
        <div key={session.id} className="glass rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-800 text-sm truncate">{session.name}</h4>
                {session.isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">ATIVA</span>
                )}
              </div>
              <p className="text-xs text-slate-400">{session.quizName} &middot; {session.plays.length} jogada(s)</p>
              <p className="text-[10px] text-slate-300 mt-0.5">
                Criada em {new Date(session.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {!session.isActive && (
                <button onClick={() => handleActivate(session.id)} className="p-2 rounded-lg hover:bg-primary/10 text-primary" title="Ativar">
                  <Play size={16} />
                </button>
              )}
              <button onClick={() => setShowDeleteModal(session.id)} className="p-2 rounded-lg hover:bg-wrong/10 text-wrong/60 hover:text-wrong" title="Excluir">
                <Archive size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 modal-content">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Nova Sessão</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nome da Sessão</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-primary outline-none text-sm"
                  placeholder="Ex: Feira de Ciências 2026"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Quiz</label>
                <select
                  value={newQuizId}
                  onChange={(e) => setNewQuizId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-primary outline-none text-sm"
                >
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id}>{q.name || '(Sem nome)'}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNewModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || !newQuizId}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark disabled:opacity-40"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showDeleteModal !== null}
        title="Mover sessão para lixeira?"
        message="A sessão e suas jogadas serão movidas para a lixeira."
        confirmLabel="Mover"
        variant="warning"
        onConfirm={() => showDeleteModal && handleDelete(showDeleteModal)}
        onCancel={() => setShowDeleteModal(null)}
      />
    </div>
  );
}

function QuizzesTab({ quizzes, onRefresh }: { quizzes: Quiz[]; onRefresh: () => void }) {
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  function handleNewQuiz() {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      name: '',
      description: '',
      questions: [],
      isActive: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };
    addQuiz(newQuiz);
    onRefresh();
    setEditingQuiz(newQuiz);
  }

  function handleSaveQuiz(quiz: Quiz) {
    updateQuiz(quiz);
    onRefresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDelete(quizId: string) {
    softDeleteQuiz(quizId);
    onRefresh();
    setShowDeleteModal(null);
    if (editingQuiz?.id === quizId) setEditingQuiz(null);
  }

  if (editingQuiz) {
    return (
      <QuizEditor
        quiz={editingQuiz}
        editingQuestionIdx={editingQuestionIdx}
        setEditingQuestionIdx={setEditingQuestionIdx}
        saved={saved}
        onSave={(updated) => { setEditingQuiz(updated); handleSaveQuiz(updated); }}
        onBack={() => { setEditingQuiz(null); setEditingQuestionIdx(null); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">{quizzes.length} quiz(zes)</h3>
        <button onClick={handleNewQuiz} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark">
          <Plus size={16} /> Novo Quiz
        </button>
      </div>

      {quizzes.map(quiz => (
        <div key={quiz.id} className="glass rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-800 text-sm truncate">{quiz.name || '(Sem nome)'}</h4>
              </div>
              <p className="text-xs text-slate-400">{quiz.questions.length} perguntas</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => setEditingQuiz(quiz)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" title="Editar">
                <Pencil size={16} />
              </button>
              <button onClick={() => setShowDeleteModal(quiz.id)} className="p-2 rounded-lg hover:bg-wrong/10 text-wrong/60 hover:text-wrong" title="Excluir">
                <Archive size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <ConfirmModal
        open={showDeleteModal !== null}
        title="Mover para lixeira?"
        message="O quiz será movido para a lixeira. Você poderá restaurá-lo depois."
        confirmLabel="Mover"
        variant="warning"
        onConfirm={() => showDeleteModal && handleDelete(showDeleteModal)}
        onCancel={() => setShowDeleteModal(null)}
      />
    </div>
  );
}

function QuizEditor({
  quiz, editingQuestionIdx, setEditingQuestionIdx, saved, onSave, onBack,
}: {
  quiz: Quiz;
  editingQuestionIdx: number | null;
  setEditingQuestionIdx: (i: number | null) => void;
  saved: boolean;
  onSave: (quiz: Quiz) => void;
  onBack: () => void;
}) {
  const [local, setLocal] = useState<Quiz>(quiz);

  function updateField(field: 'name' | 'description', value: string) {
    setLocal({ ...local, [field]: value });
  }

  function addQuestion() {
    const newQ: Question = {
      id: Date.now().toString(),
      text: '',
      options: [{ label: 'A', text: '' }, { label: 'B', text: '' }, { label: 'C', text: '' }, { label: 'D', text: '' }],
      correctIndex: 0,
    };
    setLocal({ ...local, questions: [...local.questions, newQ] });
    setEditingQuestionIdx(local.questions.length);
  }

  function removeQuestion(index: number) {
    setLocal({ ...local, questions: local.questions.filter((_, i) => i !== index) });
    if (editingQuestionIdx === index) setEditingQuestionIdx(null);
  }

  function updateQuestion(index: number, field: string, value: string | number) {
    const questions = [...local.questions];
    if (field === 'text') questions[index] = { ...questions[index], text: value as string };
    else if (field === 'correctIndex') questions[index] = { ...questions[index], correctIndex: value as number };
    setLocal({ ...local, questions });
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    const questions = [...local.questions];
    const options = [...questions[qIndex].options];
    options[oIndex] = { ...options[oIndex], text: value };
    questions[qIndex] = { ...questions[qIndex], options };
    setLocal({ ...local, questions });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium">
          <ArrowLeft size={16} /> Voltar
        </button>
        <button
          onClick={() => onSave(local)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
        >
          <Save size={16} /> {saved ? '✓ Salvo!' : 'Salvar'}
        </button>
      </div>

      <div className="glass rounded-2xl shadow-md p-4 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Nome do Quiz</label>
          <input
            type="text"
            value={local.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-primary outline-none text-sm font-semibold"
            placeholder="Ex: Educação Financeira"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição</label>
          <input
            type="text"
            value={local.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-primary outline-none text-sm"
            placeholder="Breve descrição..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-700">{local.questions.length} perguntas</h4>
        <button onClick={addQuestion} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold">
          <Plus size={14} /> Pergunta
        </button>
      </div>

      <div className="space-y-3">
        {local.questions.map((q, qIndex) => (
          <div key={q.id} className="glass rounded-2xl shadow-sm overflow-hidden">
            <div
              className="flex items-start gap-2 px-4 py-3 cursor-pointer hover:bg-slate-50/50"
              onClick={() => setEditingQuestionIdx(editingQuestionIdx === qIndex ? null : qIndex)}
            >
              <span className="font-bold text-slate-700 text-sm flex-1 min-w-0 break-words">
                {qIndex + 1}. {q.text || '(Sem texto)'}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); removeQuestion(qIndex); }} className="text-wrong/40 hover:text-wrong p-1" title="Remover">
                  <X size={14} />
                </button>
                {editingQuestionIdx === qIndex ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </div>
            </div>

            {editingQuestionIdx === qIndex && (
              <div className="p-4 space-y-3 border-t border-slate-100 animate-slide-down">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Pergunta</label>
                  <textarea
                    value={q.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-primary outline-none text-sm resize-none"
                    placeholder="Digite a pergunta..."
                    rows={2}
                  />
                </div>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Opção {opt.label}
                      {oIndex === q.correctIndex && <span className="text-correct ml-1.5">✓ Correta</span>}
                    </label>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-primary outline-none text-sm"
                      placeholder={`Texto da opção ${opt.label}...`}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Resposta correta</label>
                  <select
                    value={q.correctIndex}
                    onChange={(e) => updateQuestion(qIndex, 'correctIndex', parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-primary outline-none text-sm"
                  >
                    {q.options.map((opt, oIndex) => (
                      <option key={oIndex} value={oIndex}>{opt.label}) {opt.text || '...'}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ onRefresh }: { onRefresh: () => void }) {
  const [timer, setTimer] = useState(getTimerSeconds());
  const [saved, setSaved] = useState(false);
  const [memoryMsg, setMemoryMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function handleSave() {
    saveTimerSeconds(timer);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLoadMemory(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await loadMemory(file);
    setMemoryMsg({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) {
      setTimer(getTimerSeconds());
      onRefresh();
    }
    e.target.value = '';
    setTimeout(() => setMemoryMsg(null), 5000);
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl shadow-md p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-primary" />
          <h3 className="text-base font-bold text-slate-700">Temporizador por Pergunta</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">Define o tempo para responder cada pergunta. Use 0 para desativar.</p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="0"
            max="300"
            value={timer}
            onChange={(e) => setTimer(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-24 px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-primary outline-none text-lg text-center font-bold"
          />
          <span className="text-sm text-slate-400">segundos</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[0, 15, 30, 45, 60].map(val => (
            <button
              key={val}
              onClick={() => setTimer(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                timer === val ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {val === 0 ? 'Desativado' : `${val}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark text-sm"
        >
          <Save size={16} />
          {saved ? '✓ Salvo!' : 'Salvar Configurações'}
        </button>
      </div>

      <div className="glass rounded-2xl shadow-md p-5 md:p-6">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive size={20} className="text-primary" />
          <h3 className="text-base font-bold text-slate-700">Memória</h3>
        </div>
        <p className="text-sm text-slate-400 mb-5">
          Baixe todos os dados (quizzes, sessões, configurações) ou carregue a partir de um backup anterior.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadMemory}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-slate-200 hover:border-primary hover:bg-primary-50 group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
              <Download size={20} className="text-primary" />
            </div>
            <span className="text-sm font-semibold text-slate-600">Baixar</span>
            <span className="text-[11px] text-slate-400">Exportar dados</span>
          </button>

          <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-slate-200 hover:border-amber hover:bg-amber-light/5 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center group-hover:bg-amber/20">
              <Upload size={20} className="text-amber-dark" />
            </div>
            <span className="text-sm font-semibold text-slate-600">Carregar</span>
            <span className="text-[11px] text-slate-400">Importar backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleLoadMemory}
              className="hidden"
            />
          </label>
        </div>

        {memoryMsg && (
          <div className={`mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in ${
            memoryMsg.type === 'success' ? 'bg-primary-50 text-primary-dark' : 'bg-red-50 text-wrong'
          }`}>
            {memoryMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{memoryMsg.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TrashTab({ trashedQuizzes, trashedSessions, onRefresh }: { trashedQuizzes: Quiz[]; trashedSessions: Session[]; onRefresh: () => void }) {
  const [showDeleteModal, setShowDeleteModal] = useState<{ type: 'quiz' | 'session'; id: string } | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState<{ type: 'quiz' | 'session'; id: string } | null>(null);

  const isEmpty = trashedQuizzes.length === 0 && trashedSessions.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Trash2 size={48} className="mb-4 opacity-30" />
        <p className="font-semibold text-lg">Lixeira vazia</p>
        <p className="text-sm mt-1">Itens excluídos aparecerão aqui.</p>
      </div>
    );
  }

  function handleRestore(type: string, id: string) {
    if (type === 'quiz') restoreQuiz(id);
    else restoreSession(id);
    onRefresh();
    setShowRestoreModal(null);
  }

  function handlePermanentDelete(type: string, id: string) {
    if (type === 'quiz') permanentDeleteQuiz(id);
    else permanentDeleteSession(id);
    onRefresh();
    setShowDeleteModal(null);
  }

  return (
    <div className="space-y-4">
      {trashedSessions.length > 0 && (
        <>
          <p className="text-sm text-slate-400 font-semibold">{trashedSessions.length} sessão(ões)</p>
          {trashedSessions.map(session => (
            <div key={session.id} className="glass rounded-2xl shadow-md p-4 flex items-center justify-between">
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-sm truncate">{session.name}</h4>
                <p className="text-xs text-slate-400">{session.quizName} &middot; {session.plays.length} jogada(s)</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => setShowRestoreModal({ type: 'session', id: session.id })} className="p-2 rounded-lg hover:bg-primary/10 text-primary" title="Restaurar">
                  <Undo2 size={16} />
                </button>
                <button onClick={() => setShowDeleteModal({ type: 'session', id: session.id })} className="p-2 rounded-lg hover:bg-wrong/10 text-wrong" title="Excluir permanentemente">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {trashedQuizzes.length > 0 && (
        <>
          <p className="text-sm text-slate-400 font-semibold">{trashedQuizzes.length} quiz(zes)</p>
          {trashedQuizzes.map(quiz => (
            <div key={quiz.id} className="glass rounded-2xl shadow-md p-4 flex items-center justify-between">
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-sm truncate">{quiz.name || '(Sem nome)'}</h4>
                <p className="text-xs text-slate-400">{quiz.questions.length} perguntas</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => setShowRestoreModal({ type: 'quiz', id: quiz.id })} className="p-2 rounded-lg hover:bg-primary/10 text-primary" title="Restaurar">
                  <Undo2 size={16} />
                </button>
                <button onClick={() => setShowDeleteModal({ type: 'quiz', id: quiz.id })} className="p-2 rounded-lg hover:bg-wrong/10 text-wrong" title="Excluir permanentemente">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <ConfirmModal
        open={showRestoreModal !== null}
        title="Restaurar item?"
        message="O item será restaurado e ficará disponível novamente."
        confirmLabel="Restaurar"
        variant="info"
        onConfirm={() => showRestoreModal && handleRestore(showRestoreModal.type, showRestoreModal.id)}
        onCancel={() => setShowRestoreModal(null)}
      />

      <ConfirmModal
        open={showDeleteModal !== null}
        title="Excluir permanentemente?"
        message="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={() => showDeleteModal && handlePermanentDelete(showDeleteModal.type, showDeleteModal.id)}
        onCancel={() => setShowDeleteModal(null)}
      />
    </div>
  );
}
