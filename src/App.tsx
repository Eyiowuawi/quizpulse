/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster } from '@/components/ui/sonner';
import { Landing } from '@/components/Landing';
import { QuizRunner } from '@/components/QuizRunner';
import { ModeratorDashboard } from '@/components/ModeratorDashboard';
import { Lobby } from '@/components/Lobby';
import { Results } from '@/components/Results';
import { AppState, Quiz, Participant } from './types';
import { defaultQuiz } from './lib/mockData';

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>(defaultQuiz);
  const [participant, setParticipant] = useState<Participant | null>(null);

  const handleJoin = (name: string, quizId: string) => {
    setParticipant({
      id: Math.random().toString(36).substring(2, 11),
      name,
      score: 0,
      streak: 0
    });
    setState('lobby');
    
    // Auto-start for demo purposes
    setTimeout(() => {
      setState('quiz');
    }, 3000);
  };

  const handleStartModerator = () => {
    setState('moderator');
  };

  const handleBackToLanding = () => {
    setState('landing');
    setParticipant(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {state === 'landing' && (
          <Landing 
            onJoin={handleJoin} 
            onModerator={handleStartModerator} 
          />
        )}
        
        {state === 'lobby' && (
          <Lobby 
            participant={participant}
            quizTitle={currentQuiz.title}
          />
        )}

        {state === 'quiz' && (
          <QuizRunner 
            quiz={currentQuiz}
            participant={participant!}
            onComplete={() => setState('results')}
          />
        )}

        {state === 'results' && (
          <Results 
            participant={participant}
            onHome={handleBackToLanding}
          />
        )}

        {state === 'moderator' && (
          <ModeratorDashboard 
            onBack={handleBackToLanding}
          />
        )}
      </AnimatePresence>
      <Toaster position="top-center" />
    </div>
  );
}

