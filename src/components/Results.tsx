import { motion } from 'motion/react';
import { Participant } from '../types';
import { Trophy, Home, RotateCcw, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsProps {
  participant: Participant | null;
  onHome: () => void;
}

export function Results({ participant, onHome }: ResultsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-grid flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="max-w-2xl w-full"
      >
        <div className="relative mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(234,179,8,0.3)]"
          >
            <Trophy className="w-16 h-16 text-black fill-current" />
          </motion.div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: -100, x: (i - 6) * 20 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="absolute top-0 left-1/2"
              >
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </motion.div>
            ))}
          </div>
        </div>

        <h1 className="text-6xl font-black mb-2 tracking-tighter uppercase italic">Quiz Complete!</h1>
        <p className="text-zinc-400 text-xl mb-12">Amazing performance, {participant?.name}!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-3xl">
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">Final Score</p>
            <p className="text-4xl font-black text-indigo-400">{participant?.score}</p>
          </div>
          <div className="glass-card p-6 rounded-3xl border-indigo-500/30 bg-indigo-500/5">
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">Rank</p>
            <p className="text-4xl font-black text-white">#1</p>
          </div>
          <div className="glass-card p-6 rounded-3xl">
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">Max Streak</p>
            <p className="text-4xl font-black text-orange-400">{participant?.streak}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onHome}
            size="lg"
            className="h-16 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-lg font-bold"
          >
            <Home className="mr-2 w-5 h-5" />
            Back to Home
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="h-16 px-8 rounded-2xl border-zinc-800 hover:bg-zinc-900 text-lg font-bold"
          >
            <Share2 className="mr-2 w-5 h-5" />
            Share Result
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
