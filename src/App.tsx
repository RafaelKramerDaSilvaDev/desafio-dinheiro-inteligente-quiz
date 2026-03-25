import { useState, useCallback } from 'react';
import type { Screen } from './types';
import { getQuestions } from './store';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import AdminScreen from './components/AdminScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  function handleStart() {
    const questions = getQuestions();
    setTotalQuestions(questions.length);
    setScreen('quiz');
  }

  const handleFinish = useCallback((finalScore: number) => {
    setScore(finalScore);
    setScreen('result');
  }, []);

  function handleRestart() {
    setScreen('home');
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-[100dvh] relative">
      {screen === 'home' && (
        <HomeScreen
          onStart={handleStart}
          onAdmin={() => setScreen('admin')}
        />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          questions={getQuestions()}
          onFinish={handleFinish}
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
