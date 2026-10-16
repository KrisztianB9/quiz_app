import { useState } from 'react';
import StartScreen from './components/StartScreen';
import Quiz from './components/Quiz';
import Result from './components/Result';

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'quiz', 'result'
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);

  const startQuiz = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setScore(0);
    setGameState('quiz');
  };

  const finishQuiz = (finalScore) => {
    setScore(finalScore);
    setGameState('result');
  };

  const restartGame = () => {
    setGameState('start');
  };

  return (
      <div className="app-container">
        {gameState === 'start' && <StartScreen onStart={startQuiz} />}
        {gameState === 'quiz' && <Quiz difficulty={difficulty} onFinish={finishQuiz} />}
        {gameState === 'result' && <Result score={score} onRestart={restartGame} />}
      </div>
  );
}

export default App;
