import { Quiz } from '../types';

export const defaultQuiz: Quiz = {
  id: 'default-quiz',
  title: 'General Knowledge Challenge',
  description: 'Test your knowledge across various topics!',
  questions: [
    {
      id: '1',
      text: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      timeLimit: 15,
    },
    {
      id: '2',
      text: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
      timeLimit: 10,
    },
    {
      id: '3',
      text: 'Which element has the chemical symbol "O"?',
      options: ['Gold', 'Silver', 'Oxygen', 'Iron'],
      correctAnswer: 2,
      timeLimit: 15,
    },
    {
      id: '4',
      text: 'Who painted the Mona Lisa?',
      options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'],
      correctAnswer: 2,
      timeLimit: 20,
    },
    {
      id: '5',
      text: 'What is the largest ocean on Earth?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
      correctAnswer: 3,
      timeLimit: 15,
    }
  ]
};
