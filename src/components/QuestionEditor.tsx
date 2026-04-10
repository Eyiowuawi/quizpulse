import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  GripVertical,
  Type,
  List
} from 'lucide-react';
import { Quiz, Question } from '../types';
import { toast } from 'sonner';

interface QuestionEditorProps {
  quiz: Quiz;
  onSave: (updatedQuiz: Quiz) => void;
  onBack: () => void;
}

export function QuestionEditor({ quiz, onSave, onBack }: QuestionEditorProps) {
  const [editedQuiz, setEditedQuiz] = useState<Quiz>({ ...quiz });
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substring(2, 11),
      text: 'New Question',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
      timeLimit: 20
    };
    setEditedQuiz({
      ...editedQuiz,
      questions: [...editedQuiz.questions, newQuestion]
    });
    setActiveQuestionIndex(editedQuiz.questions.length);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = editedQuiz.questions.filter((_, i) => i !== index);
    setEditedQuiz({ ...editedQuiz, questions: newQuestions });
    if (activeQuestionIndex >= newQuestions.length) {
      setActiveQuestionIndex(Math.max(0, newQuestions.length - 1));
    }
  };

  const updateQuestion = (field: keyof Question, value: any) => {
    const newQuestions = [...editedQuiz.questions];
    newQuestions[activeQuestionIndex] = {
      ...newQuestions[activeQuestionIndex],
      [field]: value
    };
    setEditedQuiz({ ...editedQuiz, questions: newQuestions });
  };

  const updateOption = (optionIndex: number, value: string) => {
    const newQuestions = [...editedQuiz.questions];
    const newOptions = [...newQuestions[activeQuestionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[activeQuestionIndex] = {
      ...newQuestions[activeQuestionIndex],
      options: newOptions
    };
    setEditedQuiz({ ...editedQuiz, questions: newQuestions });
  };

  const handleSave = () => {
    onSave(editedQuiz);
    toast.success('Quiz saved successfully!');
  };

  const currentQuestion = editedQuiz.questions[activeQuestionIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="rounded-xl hover:bg-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">{editedQuiz.title}</h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Question Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 rounded-lg">
            {editedQuiz.questions.length} Questions
          </Badge>
          <Button 
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 rounded-xl px-6 font-black shadow-lg shadow-indigo-600/20"
          >
            <Save className="mr-2 w-4 h-4" />
            SAVE CHANGES
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Question List */}
        <aside className="w-80 border-r border-white/5 bg-zinc-950/30 flex flex-col">
          <div className="p-6 border-b border-white/5">
            <Button 
              onClick={handleAddQuestion}
              className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black uppercase italic tracking-tighter text-sm"
            >
              <Plus className="mr-2 w-4 h-4" />
              Add Question
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {editedQuiz.questions.map((q, i) => (
              <motion.button
                key={q.id}
                onClick={() => setActiveQuestionIndex(i)}
                className={`w-full p-4 rounded-2xl border text-left transition-all group relative ${
                  activeQuestionIndex === i 
                    ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/20' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-black italic mt-0.5 ${activeQuestionIndex === i ? 'text-white/60' : 'text-zinc-500'}`}>
                    {i + 1}
                  </span>
                  <p className={`text-sm font-bold line-clamp-2 ${activeQuestionIndex === i ? 'text-white' : 'text-zinc-300'}`}>
                    {q.text}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveQuestion(i);
                  }}
                  className={`absolute top-2 right-2 w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                    activeQuestionIndex === i ? 'hover:bg-white/10 text-white' : 'hover:bg-red-500/10 text-red-400'
                  }`}
                >
                  <Trash2 size={14} />
                </Button>
              </motion.button>
            ))}
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto bg-grid p-12">
          {currentQuestion ? (
            <motion.div 
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              {/* Question Text */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Type size={16} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Question Text</label>
                </div>
                <textarea 
                  value={currentQuestion.text}
                  onChange={(e) => updateQuestion('text', e.target.value)}
                  placeholder="Enter your question here..."
                  className="w-full bg-white/5 border-white/10 rounded-[2rem] p-8 text-3xl font-black tracking-tighter italic focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none min-h-[160px] resize-none"
                />
              </div>

              {/* Options Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <List size={16} />
                    <label className="text-[10px] font-black uppercase tracking-widest">Answer Options</label>
                  </div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Select the correct one</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((opt, i) => (
                    <div key={i} className="relative group">
                      <Input 
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        className={`h-16 pl-16 pr-6 bg-white/5 border-white/10 rounded-2xl font-bold text-lg focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                          currentQuestion.correctAnswer === i ? 'border-green-500/50 bg-green-500/5' : ''
                        }`}
                      />
                      <button 
                        onClick={() => updateQuestion('correctAnswer', i)}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                          currentQuestion.correctAnswer === i 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                            : 'bg-white/10 text-zinc-500 hover:bg-white/20'
                        }`}
                      >
                        {currentQuestion.correctAnswer === i ? <CheckCircle2 size={16} /> : <span className="text-xs font-black">{String.fromCharCode(65 + i)}</span>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="pt-12 border-t border-white/5 flex items-center gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock size={16} />
                    <label className="text-[10px] font-black uppercase tracking-widest">Time Limit (Seconds)</label>
                  </div>
                  <div className="flex items-center gap-4">
                    {[10, 20, 30, 60].map(time => (
                      <button
                        key={time}
                        onClick={() => updateQuestion('timeLimit', time)}
                        className={`px-6 py-3 rounded-xl font-black text-sm transition-all ${
                          currentQuestion.timeLimit === time 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                            : 'bg-white/5 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {time}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-zinc-500 mb-6">
                <Plus size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-2">No Questions Yet</h3>
              <p className="text-zinc-500 max-w-xs">Start building your arena by adding your first question.</p>
              <Button 
                onClick={handleAddQuestion}
                className="mt-8 bg-indigo-600 hover:bg-indigo-500 rounded-xl px-8 font-black"
              >
                ADD FIRST QUESTION
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
