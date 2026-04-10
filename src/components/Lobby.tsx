import { motion } from 'motion/react';
import { Participant } from '../types';
import { Users, Zap, Rocket } from 'lucide-react';

interface LobbyProps {
  participant: Participant | null;
  quizTitle: string;
}

export function Lobby({ participant, quizTitle }: LobbyProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-grid flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="glass-card p-12 rounded-[3rem] max-w-lg w-full relative z-10"
      >
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-600/40 animate-float">
          <Rocket className="w-12 h-12 text-white fill-current" />
        </div>

        <h2 className="text-4xl font-black mb-2 tracking-tighter">Ready for takeoff?</h2>
        <p className="text-zinc-400 mb-8">You're in the lobby for <span className="text-indigo-400 font-bold">{quizTitle}</span></p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-bold">Players Joined</span>
            </div>
            <span className="text-2xl font-black font-mono">12/20</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-bold">Your Status</span>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/20">
              Ready
            </span>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-white/5">
          <p className="text-zinc-500 text-sm font-medium italic">
            "The quiz will start as soon as the moderator is ready..."
          </p>
        </div>
      </motion.div>

      {/* Floating Avatars Placeholder */}
      <div className="mt-12 flex -space-x-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center text-lg shadow-xl"
          >
            {['👤', '🐱', '🦊', '🐻', '🐼'][i-1]}
          </motion.div>
        ))}
        <div className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-indigo-600 flex items-center justify-center text-xs font-bold shadow-xl">
          +7
        </div>
      </div>
    </motion.div>
  );
}
