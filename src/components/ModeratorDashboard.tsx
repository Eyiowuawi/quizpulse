import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Plus, 
  Play, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  Users,
  Activity,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { defaultQuiz } from '../lib/mockData';
import { toast } from 'sonner';
import { Quiz } from '../types';
import { QuestionEditor } from './QuestionEditor';
import { LiveMonitor } from './LiveMonitor';

interface ModeratorDashboardProps {
  onBack: () => void;
}

type DashboardView = 'overview' | 'participants' | 'analytics' | 'live' | 'settings' | 'editor';

export function ModeratorDashboard({ onBack }: ModeratorDashboardProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([defaultQuiz]);
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDesc, setNewQuizDesc] = useState('');

  const handleCreateQuiz = () => {
    if (!newQuizTitle) return;

    const newQuiz: Quiz = {
      id: Math.random().toString(36).substring(2, 11),
      title: newQuizTitle,
      description: newQuizDesc,
      questions: []
    };

    setQuizzes([newQuiz, ...quizzes]);
    setNewQuizTitle('');
    setNewQuizDesc('');
    setIsCreateOpen(false);
    toast.success('Quiz created successfully!');
    
    // Auto open editor for new quiz
    setActiveQuiz(newQuiz);
    setCurrentView('editor');
  };

  const handleDeleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
    toast.error('Quiz deleted');
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentView('live');
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentView('editor');
  };

  const handleSaveQuiz = (updatedQuiz: Quiz) => {
    setQuizzes(quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q));
    setActiveQuiz(null);
    setCurrentView('overview');
  };

  if (currentView === 'editor' && activeQuiz) {
    return (
      <QuestionEditor 
        quiz={activeQuiz} 
        onSave={handleSaveQuiz} 
        onBack={() => setCurrentView('overview')} 
      />
    );
  }

  if (currentView === 'live' && activeQuiz) {
    return (
      <LiveMonitor 
        quiz={activeQuiz} 
        onEnd={() => setCurrentView('overview')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-8 hidden lg:flex flex-col bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black italic text-xl shadow-lg shadow-indigo-600/20">
            Q
          </div>
          <span className="font-display font-black tracking-tighter text-2xl uppercase">QUIZPULSE</span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarLink 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={currentView === 'overview'} 
            onClick={() => setCurrentView('overview')}
          />
          <SidebarLink 
            icon={<Users size={20} />} 
            label="Participants" 
            active={currentView === 'participants'} 
            onClick={() => setCurrentView('participants')}
          />
          <SidebarLink 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={currentView === 'analytics'} 
            onClick={() => setCurrentView('analytics')}
          />
          <SidebarLink 
            icon={<Activity size={20} />} 
            label="Live Monitor" 
            active={currentView === 'live'} 
            onClick={() => setCurrentView('live')}
          />
          <SidebarLink 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={currentView === 'settings'} 
            onClick={() => setCurrentView('settings')}
          />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="w-full justify-start text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl h-12 font-bold"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Exit Console
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto bg-grid">
        <AnimatePresence mode="wait">
          {currentView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                <div>
                  <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase italic">Command Center</h1>
                  <p className="text-zinc-400 font-medium">Welcome back, Moderator. Your arenas are ready.</p>
                </div>
                
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-16 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-600/30 group">
                      <Plus className="mr-2 w-6 h-6 group-hover:rotate-90 transition-transform" />
                      NEW ARENA
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card text-zinc-50 rounded-[2.5rem] sm:max-w-md border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">Create Arena</DialogTitle>
                      <DialogDescription className="text-zinc-400 font-medium">
                        Define the parameters for your new quiz session.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Arena Title</label>
                        <Input 
                          placeholder="e.g. Galactic Trivia Night" 
                          value={newQuizTitle}
                          onChange={(e) => setNewQuizTitle(e.target.value)}
                          className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Description</label>
                        <Input 
                          placeholder="What's the mission objective?" 
                          value={newQuizDesc}
                          onChange={(e) => setNewQuizDesc(e.target.value)}
                          className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsCreateOpen(false)}
                        className="rounded-2xl h-12 font-bold text-zinc-400 hover:text-white"
                      >
                        Abort
                      </Button>
                      <Button 
                        onClick={handleCreateQuiz}
                        disabled={!newQuizTitle}
                        className="bg-indigo-600 hover:bg-indigo-500 rounded-2xl h-12 px-8 font-black"
                      >
                        INITIALIZE
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <StatCard label="Total Arenas" value={quizzes.length.toString()} change="+2" icon={<Activity className="w-4 h-4" />} />
                <StatCard label="Live Players" value="2.4k" change="+15%" icon={<Users className="w-4 h-4" />} />
                <StatCard label="Avg. Score" value="8,420" change="+5%" icon={<Zap className="w-4 h-4" />} />
              </div>

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Your Arenas</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl border-white/5 bg-white/5 font-bold">Recent</Button>
                  <Button variant="ghost" size="sm" className="rounded-xl text-zinc-500 font-bold">Drafts</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {quizzes.map((quiz) => (
                  <motion.div 
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <div className="glass-card p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-2">
                          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                            {quiz.questions.length} Questions
                          </Badge>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                            Ready
                          </Badge>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditQuiz(quiz)}
                            className="w-10 h-10 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5"
                          >
                            <Edit size={18} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="w-10 h-10 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>

                      <h3 className="text-3xl font-black mb-2 tracking-tighter uppercase italic">{quiz.title}</h3>
                      <p className="text-zinc-400 font-medium mb-8 line-clamp-2">
                        {quiz.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800" />
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            {quiz.questions.length > 0 ? 'Last run: 2h ago' : 'No runs yet'}
                          </span>
                        </div>
                        <Button 
                          onClick={() => handleStartQuiz(quiz)}
                          className="h-12 px-6 bg-white text-black hover:bg-zinc-200 rounded-xl font-black transition-all active:scale-95"
                        >
                          <Play className="mr-2 w-4 h-4 fill-current" />
                          LAUNCH
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'participants' && (
            <PlaceholderView 
              title="Participants" 
              desc="Manage and monitor your active user base." 
              icon={<Users size={48} />}
            />
          )}

          {currentView === 'analytics' && (
            <PlaceholderView 
              title="Analytics" 
              desc="Deep dive into performance metrics and engagement data." 
              icon={<BarChart3 size={48} />}
            />
          )}

          {currentView === 'settings' && (
            <PlaceholderView 
              title="Settings" 
              desc="Configure your command center and personal preferences." 
              icon={<Settings size={48} />}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function PlaceholderView({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col items-center justify-center text-center py-20"
    >
      <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-indigo-400 mb-8 border border-white/10 shadow-2xl shadow-indigo-500/10">
        {icon}
      </div>
      <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-4">{title}</h2>
      <p className="text-zinc-400 text-xl max-w-md font-medium leading-relaxed">{desc}</p>
      <Badge className="mt-8 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
        Coming Soon to Console
      </Badge>
    </motion.div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase italic tracking-tighter transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
          : 'text-zinc-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value, change, icon }: { label: string, value: string, change: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-8 rounded-[2.5rem]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-4">
        <h3 className="text-4xl font-black tracking-tighter">{value}</h3>
        <span className="text-xs font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{change}</span>
      </div>
    </div>
  );
}
