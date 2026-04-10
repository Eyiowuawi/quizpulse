import * as React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Users, Trophy, Timer, Share2, Plus, ArrowRight } from 'lucide-react';

interface LandingProps {
  onJoin: (name: string, quizId: string) => void;
  onModerator: () => void;
}

export function Landing({ onJoin, onModerator }: LandingProps) {
  const [name, setName] = useState('');
  const [quizId, setQuizId] = useState('');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden bg-grid">
      {/* Background Glows */}
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">
        {/* Navigation / Header */}
        <nav className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black italic text-xl shadow-lg shadow-indigo-600/20">
              Q
            </div>
            <span className="font-display font-black text-2xl tracking-tighter uppercase">QuizPulse</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={onModerator}
            className="font-bold hover:bg-white/5 rounded-xl"
          >
            Moderator Login
          </Button>
        </nav>

        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8">
                <Zap className="w-3 h-3 fill-current" />
                The Future of Quizzing
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-8 uppercase italic">
                IGNITE THE <br />
                <span className="gradient-text">COMPETITION</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-12 max-w-xl leading-relaxed font-medium">
                Experience the most vibrant, real-time quiz platform. Built for teams that demand energy, speed, and pure interactive fun.
              </p>

              <div className="flex flex-wrap gap-4 mb-16">
                <Button 
                  size="lg" 
                  onClick={onModerator}
                  className="h-16 px-8 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-lg shadow-xl shadow-white/10"
                >
                  <Plus className="mr-2 w-5 h-5" />
                  Create Quiz
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-16 px-8 border-zinc-800 hover:bg-white/5 rounded-2xl font-black text-lg"
                >
                  Explore Features
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-white/5 pt-12">
                <StatItem label="Active Players" value="12.4k+" />
                <StatItem label="Quizzes Run" value="850k+" />
                <StatItem label="Avg. Rating" value="4.9/5" />
                <StatItem label="Uptime" value="99.9%" />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Join Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/20 transition-colors" />
                
                <div className="mb-10">
                  <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">Join Arena</h2>
                  <p className="text-zinc-400 font-medium">Ready to prove your knowledge?</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Identity</label>
                    <Input 
                      placeholder="Enter your nickname" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-16 bg-white/5 border-white/10 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg font-bold placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Access Code</label>
                    <Input 
                      placeholder="000-000" 
                      value={quizId}
                      onChange={(e) => setQuizId(e.target.value)}
                      className="h-16 bg-white/5 border-white/10 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-2xl font-mono font-black tracking-[0.3em] placeholder:text-zinc-600 text-center"
                    />
                  </div>
                  <Button 
                    className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] text-2xl font-black shadow-2xl shadow-indigo-600/40 transition-all active:scale-[0.98] group"
                    disabled={!name || !quizId}
                    onClick={() => onJoin(name, quizId)}
                  >
                    ENTER ARENA
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-zinc-900 bg-zinc-800 overflow-hidden shadow-xl">
                        <img src={`https://picsum.photos/seed/user${i}/40/40`} alt="user" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Live Now</p>
                    <p className="text-lg font-black text-white">1,248 Players</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <section className="mt-48">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Massive Multiplayer"
              desc="Host up to 1,000 participants simultaneously with zero lag and instant updates."
              color="indigo"
            />
            <FeatureCard 
              icon={<Trophy className="w-8 h-8" />}
              title="Dynamic Ranking"
              desc="Our proprietary scoring algorithm factors in speed, accuracy, and streaks."
              color="purple"
            />
            <FeatureCard 
              icon={<Timer className="w-8 h-8" />}
              title="Custom Pace"
              desc="Moderators control every second, or let the auto-timer drive the pressure."
              color="pink"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20"
  };

  return (
    <div className="glass-card p-10 rounded-[2.5rem] hover:translate-y-[-8px] transition-all duration-300">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{title}</h3>
      <p className="text-zinc-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
