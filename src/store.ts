import type { Question, QuizSession } from "./types";

const STORAGE_KEY = "quiz-questions";
const SESSIONS_KEY = "quiz-sessions";

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

export function getQuestions(): Question[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultQuestions;
    }
  }
  return defaultQuestions;
}

export function saveQuestions(questions: Question[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function resetQuestions(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getSessions(): QuizSession[] {
  const stored = localStorage.getItem(SESSIONS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveSession(session: QuizSession): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function clearSessions(): void {
  localStorage.removeItem(SESSIONS_KEY);
}

export const ADMIN_PASSWORD = "quiz026";
