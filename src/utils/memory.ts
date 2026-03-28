const APP_KEYS = ['quiz-quizzes', 'quiz-sessions', 'quiz-timer-seconds'];

export interface MemoryData {
  version: number;
  exportedAt: string;
  data: Record<string, string>;
}

export function downloadMemory(): void {
  const data: Record<string, string> = {};
  APP_KEYS.forEach((key) => {
    const val = localStorage.getItem(key);
    if (val !== null) data[key] = val;
  });

  const memory: MemoryData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };

  const blob = new Blob([JSON.stringify(memory, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `memoria-quiz-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadMemory(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const memory = JSON.parse(content) as MemoryData;

        if (!memory.version || !memory.data) {
          resolve({ success: false, message: 'Arquivo inválido. Formato não reconhecido.' });
          return;
        }

        // Apply data to localStorage
        Object.entries(memory.data).forEach(([key, value]) => {
          if (APP_KEYS.includes(key)) {
            localStorage.setItem(key, value);
          }
        });

        resolve({
          success: true,
          message: `Memória restaurada com sucesso! (exportada em ${new Date(memory.exportedAt).toLocaleDateString('pt-BR')})`,
        });
      } catch {
        resolve({ success: false, message: 'Erro ao ler o arquivo. Verifique se é um arquivo de memória válido.' });
      }
    };
    reader.onerror = () => {
      resolve({ success: false, message: 'Erro ao ler o arquivo.' });
    };
    reader.readAsText(file);
  });
}
