import type { Quiz, Question, Session, Play } from "./types";

const QUIZZES_KEY = "quiz-quizzes";
const SESSIONS_KEY = "quiz-sessions";
const TIMER_KEY = "quiz-timer-seconds";

const defaultQuestions: Question[] = [
  {
    id: "1",
    text: "O que é educação financeira?",
    options: [
      { label: "A", text: "Saber gastar todo o dinheiro" },
      { label: "B", text: "Administrar bem o dinheiro" },
      { label: "C", text: "Guardar todo o salário" },
      { label: "D", text: "Comprar apenas à vista" },
    ],
    correctIndex: 1,
  },
  {
    id: "2",
    text: "Qual é o primeiro passo para organizar suas finanças?",
    options: [
      { label: "A", text: "Fazer um empréstimo" },
      { label: "B", text: "Comprar tudo que deseja" },
      { label: "C", text: "Fazer um orçamento mensal" },
      { label: "D", text: "Investir na bolsa de valores" },
    ],
    correctIndex: 2,
  },
  {
    id: "3",
    text: "O que é uma reserva de emergência?",
    options: [
      { label: "A", text: "Dinheiro para gastar em viagens" },
      { label: "B", text: "Valor guardado para imprevistos" },
      { label: "C", text: "Investimento de alto risco" },
      { label: "D", text: "Conta corrente do banco" },
    ],
    correctIndex: 1,
  },
  {
    id: "4",
    text: "Qual a importância de poupar dinheiro?",
    options: [
      { label: "A", text: "Não tem importância" },
      { label: "B", text: "Apenas para pessoas ricas" },
      { label: "C", text: "Garantir segurança financeira futura" },
      { label: "D", text: "Guardar embaixo do colchão" },
    ],
    correctIndex: 2,
  },
  {
    id: "5",
    text: "O que são juros compostos?",
    options: [
      { label: "A", text: "Juros cobrados apenas uma vez" },
      { label: "B", text: "Juros que incidem sobre juros anteriores" },
      { label: "C", text: "Taxa fixa sem alteração" },
      { label: "D", text: "Desconto em compras à vista" },
    ],
    correctIndex: 1,
  },
  {
    id: "6",
    text: "Qual desses é um exemplo de renda fixa?",
    options: [
      { label: "A", text: "Ações na bolsa de valores" },
      { label: "B", text: "Criptomoedas" },
      { label: "C", text: "Poupança" },
      { label: "D", text: "Day trade" },
    ],
    correctIndex: 2,
  },
  {
    id: "7",
    text: "O que significa diversificar investimentos?",
    options: [
      { label: "A", text: "Colocar todo dinheiro em um só lugar" },
      { label: "B", text: "Distribuir dinheiro em diferentes aplicações" },
      { label: "C", text: "Investir apenas em poupança" },
      { label: "D", text: "Não investir nada" },
    ],
    correctIndex: 1,
  },
  {
    id: "8",
    text: "O que é inflação?",
    options: [
      { label: "A", text: "Queda nos preços dos produtos" },
      { label: "B", text: "Aumento geral dos preços ao longo do tempo" },
      { label: "C", text: "Taxa de juros do banco" },
      { label: "D", text: "Valor do salário mínimo" },
    ],
    correctIndex: 1,
  },
  {
    id: "9",
    text: "Qual é a melhor atitude ao receber o salário?",
    options: [
      { label: "A", text: "Gastar tudo imediatamente" },
      { label: "B", text: "Separar uma parte para poupança antes de gastar" },
      { label: "C", text: "Emprestar para amigos" },
      { label: "D", text: "Fazer compras parceladas" },
    ],
    correctIndex: 1,
  },
  {
    id: "10",
    text: "O que é crédito consciente?",
    options: [
      { label: "A", text: "Usar o cartão sem limite" },
      { label: "B", text: "Pegar empréstimos sem pesquisar" },
      {
        label: "C",
        text: "Usar crédito de forma planejada e dentro do orçamento",
      },
      { label: "D", text: "Parcelar tudo em 12 vezes" },
    ],
    correctIndex: 2,
  },
];

function getDefaultQuiz(): Quiz {
  return {
    id: "default",
    name: "Educação Financeira",
    description: "Teste seus conhecimentos sobre educação financeira",
    questions: defaultQuestions,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
  };
}

export function getQuizzes(): Quiz[] {
  const stored = localStorage.getItem(QUIZZES_KEY);
  if (stored) {
    try {
      const quizzes = JSON.parse(stored) as Quiz[];
      if (quizzes.length > 0) return quizzes;
    } catch {
      // invalid data
    }
  }
  const defaultQuiz = getDefaultQuiz();
  saveQuizzes([defaultQuiz]);
  return [defaultQuiz];
}

export function saveQuizzes(quizzes: Quiz[]): void {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
}

export function getActiveQuiz(): Quiz | null {
  const quizzes = getQuizzes();
  return quizzes.find((q) => q.isActive && !q.isDeleted) ?? null;
}

export function setActiveQuiz(quizId: string): void {
  const quizzes = getQuizzes();
  quizzes.forEach((q) => (q.isActive = q.id === quizId));
  saveQuizzes(quizzes);
}

export function addQuiz(quiz: Quiz): void {
  const quizzes = getQuizzes();
  quizzes.push(quiz);
  saveQuizzes(quizzes);
}

export function updateQuiz(updated: Quiz): void {
  const quizzes = getQuizzes();
  const index = quizzes.findIndex((q) => q.id === updated.id);
  if (index !== -1) {
    quizzes[index] = updated;
    saveQuizzes(quizzes);
  }
}

export function softDeleteQuiz(quizId: string): void {
  const quizzes = getQuizzes();
  const quiz = quizzes.find((q) => q.id === quizId);
  if (quiz) {
    quiz.isDeleted = true;
    if (quiz.isActive) {
      quiz.isActive = false;
      const available = quizzes.find((q) => !q.isDeleted && q.id !== quizId);
      if (available) available.isActive = true;
    }
    saveQuizzes(quizzes);
  }
}

export function restoreQuiz(quizId: string): void {
  const quizzes = getQuizzes();
  const quiz = quizzes.find((q) => q.id === quizId);
  if (quiz) {
    quiz.isDeleted = false;
    saveQuizzes(quizzes);
  }
}

export function permanentDeleteQuiz(quizId: string): void {
  const quizzes = getQuizzes().filter((q) => q.id !== quizId);
  saveQuizzes(quizzes);
}

export function getQuestions(): Question[] {
  const quiz = getActiveQuiz();
  return quiz?.questions ?? defaultQuestions;
}

export function getSessions(): Session[] {
  const stored = localStorage.getItem(SESSIONS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if ('plays' in parsed[0]) return parsed as Session[];
        return migrateOldSessions(parsed);
      }
      return [];
    } catch {
      return [];
    }
  }
  return [];
}

function migrateOldSessions(oldSessions: Array<{
  id: string; quizId: string; quizName: string;
  date: string; score: number; total: number;
  answers: Array<{ questionId: string; questionText: string; selectedIndex: number; correctIndex: number }>;
}>): Session[] {
  const grouped = new Map<string, typeof oldSessions>();
  oldSessions.forEach(s => {
    const key = s.quizId;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(s);
  });

  const sessions: Session[] = [];
  grouped.forEach((plays, quizId) => {
    const first = plays[0];
    sessions.push({
      id: `migrated-${quizId}`,
      name: first.quizName,
      quizId,
      quizName: first.quizName,
      isActive: false,
      isDeleted: false,
      createdAt: first.date,
      plays: plays.map(p => ({
        id: p.id,
        date: p.date,
        score: p.score,
        total: p.total,
        answers: p.answers,
      })),
    });
  });

  if (sessions.length > 0) sessions[sessions.length - 1].isActive = true;
  saveSessions(sessions);
  return sessions;
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getActiveSession(): Session | null {
  return getSessions().find(s => s.isActive && !s.isDeleted) ?? null;
}

export function setActiveSession(sessionId: string): void {
  const sessions = getSessions();
  sessions.forEach(s => (s.isActive = s.id === sessionId));
  saveSessions(sessions);
}

export function addSession(session: Session): void {
  const sessions = getSessions();
  sessions.push(session);
  saveSessions(sessions);
}

export function updateSession(updated: Session): void {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === updated.id);
  if (index !== -1) {
    sessions[index] = updated;
    saveSessions(sessions);
  }
}

export function addPlayToSession(sessionId: string, play: Play): void {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.plays.push(play);
    saveSessions(sessions);
  }
}

export function softDeleteSession(sessionId: string): void {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.isDeleted = true;
    if (session.isActive) {
      session.isActive = false;
      const available = sessions.find(s => !s.isDeleted && s.id !== sessionId);
      if (available) available.isActive = true;
    }
    saveSessions(sessions);
  }
}

export function restoreSession(sessionId: string): void {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.isDeleted = false;
    saveSessions(sessions);
  }
}

export function permanentDeleteSession(sessionId: string): void {
  const sessions = getSessions().filter(s => s.id !== sessionId);
  saveSessions(sessions);
}

export function getTimerSeconds(): number {
  const stored = localStorage.getItem(TIMER_KEY);
  if (stored) {
    const val = parseInt(stored, 10);
    return isNaN(val) ? 0 : val;
  }
  return 0;
}

export function saveTimerSeconds(seconds: number): void {
  localStorage.setItem(TIMER_KEY, String(seconds));
}

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin";
