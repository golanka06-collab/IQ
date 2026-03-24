import React, { useState, useEffect, useCallback } from 'react';
import { categories, Category, Question } from './data/questions';
import { 
  Brain, 
  Hash, 
  ArrowRightLeft, 
  SearchX, 
  Timer, 
  Trophy, 
  ChevronRight, 
  RotateCcw, 
  Home,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Screen = 'home' | 'quiz' | 'result' | 'daily';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{questionId: string, selected: string, isCorrect: boolean}[]>([]);
  const [isDailyMode, setIsDailyMode] = useState(false);

  const startQuiz = (category: Category) => {
    const shuffled = [...category.questions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled);
    setSelectedCategory(category);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setShowAnswer(false);
    setTimeLeft(30);
    setCurrentScreen('quiz');
    setIsDailyMode(false);
  };

  const startDailyQuiz = () => {
    // Collect 10 random questions from all categories
    const allQuestions = categories.flatMap(c => c.questions);
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizQuestions(shuffled);
    setSelectedCategory({ id: 'daily', name: 'தினசரி வினாடி வினா (Daily Quiz)', icon: 'Calendar', questions: shuffled });
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setShowAnswer(false);
    setTimeLeft(30);
    setCurrentScreen('quiz');
    setIsDailyMode(true);
  };

  const handleAnswer = (option: string) => {
    if (showAnswer) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.answer;
    
    if (isCorrect) setScore(prev => prev + 1);
    
    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selected: option,
      isCorrect
    }]);
    
    setShowAnswer(true);
  };

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      setTimeLeft(30);
    } else {
      setCurrentScreen('result');
    }
  }, [currentQuestionIndex, quizQuestions.length]);

  useEffect(() => {
    let timer: number;
    if (currentScreen === 'quiz' && !showAnswer && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showAnswer) {
      handleAnswer(''); // Time out
    }
    return () => clearInterval(timer);
  }, [currentScreen, showAnswer, timeLeft]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hash': return <Hash className="w-6 h-6" />;
      case 'Brain': return <Brain className="w-6 h-6" />;
      case 'ArrowRightLeft': return <ArrowRightLeft className="w-6 h-6" />;
      case 'SearchX': return <SearchX className="w-6 h-6" />;
      case 'Calendar': return <Calendar className="w-6 h-6" />;
      default: return <Brain className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="bg-white border-b border-[#141414]/10 p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => setCurrentScreen('home')}>
            <div className="bg-[#5A5A40] p-2 rounded-xl text-white">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="font-serif italic text-xl font-bold tracking-tight">Tamil IQ Master</h1>
          </div>
          {currentScreen === 'quiz' && (
            <div className="flex items-center gap-2 bg-[#141414]/5 px-3 py-1 rounded-full">
              <Timer className={`w-4 h-4 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}`} />
              <span className={`font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-24">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-[#141414]/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif italic text-2xl">வணக்கம்!</h2>
                  <Trophy className="text-yellow-500 w-8 h-8" />
                </div>
                <p className="text-[#141414]/60 leading-relaxed">
                  உங்கள் அறிவாற்றலை சோதிக்கவும், போட்டித் தேர்வுகளுக்கு தயாராகவும் சிறந்த தளம்.
                </p>
                <button 
                  onClick={startDailyQuiz}
                  className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-colors shadow-lg shadow-[#5A5A40]/20"
                >
                  <Calendar className="w-5 h-5" />
                  இன்றைய வினாடி வினா (Daily Quiz)
                </button>
              </section>

              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-widest text-[#141414]/40 px-2">பிரிவுகள் (Categories)</h3>
                <div className="grid gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => startQuiz(category)}
                      className="bg-white p-4 rounded-2xl border border-[#141414]/5 flex items-center justify-between hover:border-[#5A5A40] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#5A5A40]/10 p-3 rounded-xl text-[#5A5A40] group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                          {getIcon(category.icon)}
                        </div>
                        <div className="text-left">
                          <span className="font-bold block">{category.name}</span>
                          <span className="text-xs text-[#141414]/40">{category.questions.length} கேள்விகள்</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#141414]/20 group-hover:text-[#5A5A40]" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentScreen === 'quiz' && selectedCategory && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#141414]/40">
                  {selectedCategory.name}
                </span>
                <span className="font-mono text-sm font-bold">
                  {currentQuestionIndex + 1} / {quizQuestions.length}
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#141414]/5 min-h-[160px] flex items-center justify-center text-center">
                <h2 className="text-xl font-bold leading-relaxed">
                  {quizQuestions[currentQuestionIndex].question}
                </h2>
              </div>

              <div className="grid gap-3">
                {quizQuestions[currentQuestionIndex].options.map((option, idx) => {
                  const isCorrect = option === quizQuestions[currentQuestionIndex].answer;
                  const isSelected = userAnswers[currentQuestionIndex]?.selected === option;
                  
                  let btnClass = "bg-white border-[#141414]/5 text-[#141414]";
                  if (showAnswer) {
                    if (isCorrect) btnClass = "bg-green-100 border-green-500 text-green-700";
                    else if (isSelected) btnClass = "bg-red-100 border-red-500 text-red-700";
                    else btnClass = "bg-white border-[#141414]/5 opacity-50";
                  } else {
                    btnClass = "bg-white border-[#141414]/5 hover:border-[#5A5A40] active:scale-95";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={showAnswer}
                      onClick={() => handleAnswer(option)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between ${btnClass}`}
                    >
                      <span>{option}</span>
                      {showAnswer && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                      {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-[#5A5A40]/5 p-4 rounded-2xl border border-[#5A5A40]/10">
                    <div className="flex items-center gap-2 text-[#5A5A40] mb-2">
                      <Lightbulb className="w-4 h-4" />
                      <span className="font-bold text-sm">விளக்கம் (Explanation):</span>
                    </div>
                    <p className="text-sm text-[#141414]/70 italic leading-relaxed">
                      {quizQuestions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-[#141414] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                  >
                    {currentQuestionIndex === quizQuestions.length - 1 ? 'முடிவுகளைக் காண்க' : 'அடுத்த கேள்வி'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentScreen === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="bg-white p-8 rounded-[40px] shadow-xl border border-[#141414]/5 space-y-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-8 border-[#5A5A40]/10 flex items-center justify-center">
                    <span className="text-4xl font-serif italic font-bold">{Math.round((score / quizQuestions.length) * 100)}%</span>
                  </div>
                  <Trophy className="absolute -bottom-2 -right-2 w-10 h-10 text-yellow-500 bg-white rounded-full p-1" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-serif italic font-bold">சிறப்பு!</h2>
                  <p className="text-[#141414]/60">உங்கள் மதிப்பெண்: {score} / {quizQuestions.length}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                    <span className="block text-2xl font-bold text-green-600">{score}</span>
                    <span className="text-xs font-bold uppercase text-green-600/60">சரியானவை</span>
                  </div>
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <span className="block text-2xl font-bold text-red-600">{quizQuestions.length - score}</span>
                    <span className="text-xs font-bold uppercase text-red-600/60">தவறானவை</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="flex-1 bg-white border border-[#141414]/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  முகப்பு
                </button>
                <button
                  onClick={() => selectedCategory && startQuiz(selectedCategory)}
                  className="flex-1 bg-[#5A5A40] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  மீண்டும் முயற்சி
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav (Home only) */}
      {currentScreen === 'home' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#141414]/10 p-4 flex justify-around items-center">
          <button className="flex flex-col items-center gap-1 text-[#5A5A40]">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">முகப்பு</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#141414]/30">
            <Trophy className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">தரவரிசை</span>
          </button>
        </nav>
      )}
    </div>
  );
}
