import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Quiz, Participant } from '../types';
import { Timer, Trophy, Zap, CheckCircle2, XCircle, Users, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizRunnerProps {
  quiz: Quiz;
  participant: Participant;
  onComplete: () => void;
}

export function QuizRunner({ quiz, participant, onComplete }: QuizRunnerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.questions[0].timeLimit);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Time out
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isAnswered]);

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.floor((timeLeft / currentQuestion.timeLimit) * 500);
      const points = 1000 + timeBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#ffffff']
      });
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setShowLeaderboard(true);
      } else {
        onComplete();
      }
    }, 2500);
  };

  const nextQuestion = () => {
    const nextIdx = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIdx);
    const nextQ = quiz.questions[nextIdx];
    setTimeLeft(nextQ.timeLimit);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowLeaderboard(false);
  };

  if (showLeaderboard) {
    return (
      <div className="min-h-screen bg-grid flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-2xl glass-card rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">Leaderboard</h2>
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
              Q {currentQuestionIndex + 1} / {quiz.questions.length}
            </Badge>
          </div>

          <div className="space-y-4 mb-12 relative z-10">
            {[
              { name: participant.name, score: score, isYou: true, rank: 1 },
              { name: 'Alex J.', score: Math.max(0, score - 450), isYou: false, rank: 2 },
              { name: 'Sarah W.', score: Math.max(0, score - 1200), isYou: false, rank: 3 },
              { name: 'Mike R.', score: Math.max(0, score - 2100), isYou: false, rank: 4 },
            ].map((player, i) => (
              <motion.div 
                key={player.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  player.isYou 
                    ? 'bg-indigo-500/20 border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex items-center gap-5">
                  <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm italic ${
                    player.rank === 1 ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    #{player.rank}
                  </span>
                  <span className={`text-lg font-black uppercase italic tracking-tight ${player.isYou ? 'text-white' : 'text-zinc-400'}`}>
                    {player.name} {player.isYou && <span className="text-indigo-400 ml-2">(YOU)</span>}
                  </span>
                </div>
                <span className="font-mono font-black text-2xl tracking-tighter text-indigo-400">{player.score}</span>
              </motion.div>
            ))}
          </div>

          <Button 
            onClick={nextQuestion}
            className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] text-2xl font-black shadow-2xl shadow-indigo-600/40 transition-all group"
          >
            NEXT QUESTION
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-8 bg-grid relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-2xl italic shadow-2xl shadow-indigo-600/30">
            Q
          </div>
          <div>
            <h3 className="font-black text-zinc-500 text-[10px] uppercase tracking-[0.2em] mb-1">Question {currentQuestionIndex + 1} / {quiz.questions.length}</h3>
            <p className="font-display font-black text-xl tracking-tight uppercase italic">{quiz.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Current Score</p>
            <p className="text-4xl font-black font-mono text-indigo-400 tracking-tighter">{score}</p>
          </div>
          {streak > 1 && (
            <motion.div 
              initial={{ scale: 0, rotate: -10 }} 
              animate={{ scale: 1, rotate: 0 }}
              className="flex flex-col items-center px-6 py-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500 shadow-lg shadow-orange-500/5"
            >
              <Zap className="w-5 h-5 fill-current mb-1" />
              <span className="text-xs font-black uppercase tracking-tighter">{streak}x STREAK</span>
            </motion.div>
          )}
        </div>
      </header>

      {/* Question Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          {!isAnswered ? (
            <motion.div 
              key="question"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full text-center"
            >
              {/* Timer Circle */}
              <div className="relative w-32 h-32 mx-auto mb-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="377"
                    animate={{ strokeDashoffset: 377 * (1 - timeLeft / currentQuestion.timeLimit) }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="text-indigo-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-black font-mono tracking-tighter">
                  {timeLeft}
                </div>
              </div>

              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-20 leading-[0.9] uppercase italic">
                {currentQuestion.text}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {currentQuestion.options.map((option, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(i)}
                    className={`group relative h-24 rounded-[2rem] border-2 transition-all text-left px-10 overflow-hidden flex items-center ${
                      selectedOption === i 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-white/5 hover:border-white/20 bg-white/5 backdrop-blur-sm'
                    }`}
                  >
                    <div className="flex items-center gap-8 w-full">
                      <span className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl italic transition-colors ${
                        selectedOption === i ? 'bg-indigo-500 text-white' : 'bg-white/10 text-zinc-400 group-hover:bg-white/20'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-2xl font-black tracking-tight uppercase italic">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="feedback"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className={`w-48 h-48 rounded-full flex items-center justify-center mb-12 shadow-2xl ${
                  selectedOption === currentQuestion.correctAnswer 
                    ? 'bg-green-500/20 text-green-500 shadow-green-500/20' 
                    : 'bg-red-500/20 text-red-500 shadow-red-500/20'
                }`}
              >
                {selectedOption === currentQuestion.correctAnswer ? (
                  <CheckCircle2 className="w-24 h-24" />
                ) : (
                  <XCircle className="w-24 h-24" />
                )}
              </motion.div>
              <h2 className={`text-8xl font-black italic tracking-tighter mb-6 uppercase ${
                selectedOption === currentQuestion.correctAnswer ? 'text-green-500' : 'text-red-500'
              }`}>
                {selectedOption === currentQuestion.correctAnswer ? 'LEGENDARY!' : 'OOF, WRONG'}
              </h2>
              <p className="text-zinc-400 text-2xl font-medium max-w-xl leading-relaxed">
                {selectedOption === currentQuestion.correctAnswer 
                  ? `You're on fire! That's another ${1000 + Math.floor((timeLeft / currentQuestion.timeLimit) * 500)} points in the bag.`
                  : `The correct path was: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 flex justify-center relative z-10">
        <div className="flex items-center gap-3 px-6 py-3 glass rounded-full text-zinc-400 text-xs font-black uppercase tracking-[0.2em]">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>1,248 Players Competing</span>
        </div>
      </footer>
    </div>
  );
}
