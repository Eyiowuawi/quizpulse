import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Zap, 
  Trophy, 
  Timer, 
  ArrowRight, 
  Pause, 
  Play, 
  SkipForward,
  Activity,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Quiz, Participant } from '../types';

interface LiveMonitorProps {
  quiz: Quiz;
  onEnd: () => void;
}

export function LiveMonitor({ quiz, onEnd }: LiveMonitorProps) {
  const [currentStep, setCurrentStep] = useState<'lobby' | 'question' | 'leaderboard' | 'final'>('lobby');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Mock participants
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Alex J.', score: 4500, streak: 3 },
    { id: '2', name: 'Sarah W.', score: 4200, streak: 2 },
    { id: '3', name: 'Mike R.', score: 3800, streak: 1 },
    { id: '4', name: 'Emma D.', score: 3500, streak: 0 },
    { id: '5', name: 'Chris P.', score: 3100, streak: 2 },
  ]);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'question' && timeLeft > 0 && !isPaused) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (currentStep === 'question' && timeLeft === 0) {
      setCurrentStep('leaderboard');
    }
    return () => clearTimeout(timer);
  }, [currentStep, timeLeft, isPaused]);

  const startQuiz = () => {
    setCurrentStep('question');
    setTimeLeft(quiz.questions[0].timeLimit);
  };

  const nextStep = () => {
    if (currentStep === 'leaderboard') {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentStep('question');
        setTimeLeft(quiz.questions[currentQuestionIndex + 1].timeLimit);
      } else {
        setCurrentStep('final');
      }
    } else if (currentStep === 'question') {
      setCurrentStep('leaderboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black italic text-xl shadow-lg shadow-indigo-600/20">
            Q
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">{quiz.title}</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Live Session • {participants.length} Players</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={onEnd}
            className="rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 font-bold"
          >
            End Session
          </Button>
          <div className="h-8 w-[1px] bg-white/5 mx-2" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsPaused(!isPaused)} className="rounded-xl border-white/5 bg-white/5">
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
            </Button>
            <Button variant="outline" size="icon" onClick={nextStep} className="rounded-xl border-white/5 bg-white/5">
              <SkipForward size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-12 bg-grid flex gap-12">
        {/* Left: Main Stage */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {currentStep === 'lobby' && (
              <motion.div 
                key="lobby"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex-1 glass-card rounded-[3rem] flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-32 h-32 bg-indigo-600/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                  <Users size={48} className="text-indigo-400" />
                </div>
                <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-4">Waiting for Players</h2>
                <p className="text-zinc-400 text-xl max-w-md mb-12">Share the code <span className="text-white font-black font-mono tracking-widest">882 192</span> to let participants join the arena.</p>
                <Button 
                  onClick={startQuiz}
                  className="h-20 px-12 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] text-2xl font-black shadow-2xl shadow-indigo-600/40 group"
                >
                  START ARENA
                  <Zap className="ml-2 w-6 h-6 group-hover:rotate-12 transition-transform" />
                </Button>
              </motion.div>
            )}

            {currentStep === 'question' && (
              <motion.div 
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center justify-between mb-12">
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-2 rounded-xl font-black text-sm uppercase tracking-widest">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </Badge>
                  <div className="flex items-center gap-4">
                    <Timer size={24} className="text-indigo-400" />
                    <span className="text-4xl font-black font-mono tracking-tighter">{timeLeft}s</span>
                  </div>
                </div>

                <h2 className="text-6xl font-black tracking-tighter uppercase italic mb-16 leading-[0.9]">
                  {currentQuestion.text}
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {currentQuestion.options.map((opt, i) => (
                    <div key={i} className="h-24 glass-card rounded-[2rem] flex items-center px-10 gap-8 border-white/5">
                      <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xl italic text-zinc-500">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-2xl font-black tracking-tight uppercase italic">{opt}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-12 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Activity size={20} className="text-green-500" />
                    <span className="text-sm font-black uppercase tracking-widest text-zinc-500">Real-time Responses: <span className="text-white">12 / {participants.length}</span></span>
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-zinc-950 bg-zinc-800" />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'leaderboard' && (
              <motion.div 
                key="leaderboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-12">Leaderboard</h2>
                <div className="space-y-4 flex-1">
                  {participants.sort((a, b) => b.score - a.score).map((p, i) => (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="h-20 glass-card rounded-2xl flex items-center justify-between px-8 border-white/5"
                    >
                      <div className="flex items-center gap-6">
                        <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm italic ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/5 text-zinc-500'}`}>
                          #{i + 1}
                        </span>
                        <span className="text-xl font-black uppercase italic tracking-tight">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-8">
                        {p.streak > 1 && (
                          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                            {p.streak}x Streak
                          </Badge>
                        )}
                        <span className="text-3xl font-black font-mono tracking-tighter text-indigo-400">{p.score}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button 
                  onClick={nextStep}
                  className="mt-12 h-20 bg-white text-black hover:bg-zinc-200 rounded-[2rem] text-2xl font-black group"
                >
                  {currentQuestionIndex < quiz.questions.length - 1 ? 'NEXT QUESTION' : 'FINAL RESULTS'}
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {currentStep === 'final' && (
              <motion.div 
                key="final"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-40 h-40 bg-yellow-500/10 rounded-full flex items-center justify-center mb-12 shadow-2xl shadow-yellow-500/20">
                  <Trophy size={80} className="text-yellow-500" />
                </div>
                <h2 className="text-7xl font-black tracking-tighter uppercase italic mb-4">Arena Complete</h2>
                <p className="text-zinc-400 text-2xl font-medium mb-16">The champion is <span className="text-white font-black italic">{participants[0].name}</span> with {participants[0].score} points!</p>
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={onEnd}
                    className="h-16 px-10 border-white/10 hover:bg-white/5 rounded-2xl text-xl font-black"
                  >
                    CLOSE MONITOR
                  </Button>
                  <Button 
                    className="h-16 px-10 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xl font-black shadow-xl shadow-indigo-600/30"
                  >
                    SAVE ANALYTICS
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Sidebar Stats */}
        <aside className="w-96 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Live Feed</h3>
            <div className="space-y-6">
              <FeedItem icon={<CheckCircle2 className="text-green-500" />} text="Sarah W. answered correctly!" time="Just now" />
              <FeedItem icon={<Zap className="text-orange-500" />} text="Alex J. is on a 5x streak!" time="2m ago" />
              <FeedItem icon={<Users className="text-indigo-400" />} text="New player joined: Chris P." time="5m ago" />
              <FeedItem icon={<XCircle className="text-red-500" />} text="Mike R. missed the last one." time="8m ago" />
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Arena Stats</h3>
            <div className="space-y-6">
              <StatRow label="Avg. Response Time" value="4.2s" />
              <StatRow label="Accuracy Rate" value="68%" />
              <StatRow label="Peak Players" value="128" />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function FeedItem({ icon, text, time }: { icon: React.ReactNode, text: string, time: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-sm font-bold text-zinc-200">{text}</p>
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{time}</p>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      <span className="text-lg font-black text-white">{value}</span>
    </div>
  );
}
