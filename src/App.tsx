import { useState, useCallback } from 'react';
import type { Screen } from './types';
import { getActiveSession, getQuizzes } from './store';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import AdminScreen from './components/AdminScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  function handleStart() {
    const session = getActiveSession();
    if (!session) return;
    const quizzes = getQuizzes();
    const quiz = quizzes.find(q => q.id === session.quizId && !q.isDeleted);
    if (!quiz || quiz.questions.length === 0) return;
    setTotalQuestions(quiz.questions.length);
    setScreen('quiz');
  }

  const handleFinish = useCallback((finalScore: number) => {
    setScore(finalScore);
    setScreen('result');
  }, []);

  function handleRestart() {
    setScreen('home');
  }

  const session = getActiveSession();
  const quizzes = getQuizzes();
  const quiz = session ? quizzes.find(q => q.id === session.quizId && !q.isDeleted) : null;

  return (
    <div className="w-full min-h-[100dvh] relative">
      {screen === 'home' && (
        <HomeScreen
          sessionName={session?.name}
          quizName={quiz?.name}
          onStart={handleStart}
          onAdmin={() => setScreen('admin')}
        />
      )}
      {screen === 'quiz' && quiz && session && (
        <QuizScreen
          questions={quiz.questions}
          sessionId={session.id}
          onFinish={handleFinish}
          onQuit={() => setScreen('home')}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          score={score}
          total={totalQuestions}
          onRestart={handleRestart}
        />
      )}
      {screen === 'admin' && (
        <AdminScreen onBack={() => setScreen('home')} />
      )}
    </div>
  );
}
