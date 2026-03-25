import { useState, useEffect } from 'react';
import type { Question } from '../types';
import { getQuestions, saveQuestions, resetQuestions, ADMIN_PASSWORD } from '../store';

interface AdminScreenProps {
  onBack: () => void;
}

export default function AdminScreen({ onBack }: AdminScreenProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authenticated) {
      setQuestions(getQuestions());
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
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-6">
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

  // Admin panel
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary text-white py-4 px-6 flex items-center justify-between shadow-md sticky top-0 z-10">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white font-semibold transition-colors"
        >
          ← Voltar
        </button>
        <h2 className="text-lg font-bold">Configurações</h2>
        <div className="w-16" />
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <button
            onClick={handleSave}
            className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm"
          >
            {saved ? '✓ Salvo!' : 'Salvar Alterações'}
          </button>
          <button
            onClick={addQuestion}
            className="bg-secondary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-secondary-light transition-colors text-sm"
          >
            + Adicionar Pergunta
          </button>
          <button
            onClick={handleReset}
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
              {/* Question header */}
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
                      removeQuestion(qIndex);
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

              {/* Editing area */}
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
                        updateQuestion(qIndex, 'text', e.target.value)
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
                          updateOption(qIndex, oIndex, e.target.value)
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
                        updateQuestion(
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
      </div>
    </div>
  );
}
