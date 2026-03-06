import React from 'react';
import { FitnessForm } from './components/FitnessForm';
import { WorkoutDisplay } from './components/WorkoutDisplay';
import { AuthModal } from './components/AuthModal';
import { HistoryView } from './components/HistoryView';
import { UserProfile, FitnessPlan, User, HistoryItem } from './types';
import { generateFitnessPlan } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, RefreshCcw, ArrowLeft, History, LogOut, User as UserIcon } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<FitnessPlan | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [view, setView] = React.useState<'home' | 'history'>('home');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data));
  }, []);

  const fetchHistory = async () => {
    if (!user) return;
    const res = await fetch('/api/history');
    if (res.ok) {
      const data = await res.json();
      setHistory(data);
    }
  };

  const handleGenerate = async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setIsSaved(false);
    try {
      const generatedPlan = await generateFitnessPlan(profile);
      setPlan(generatedPlan);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!user || !plan) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        setIsSaved(true);
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to save plan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setHistory([]);
    setView('home');
  };

  const handleReset = () => {
    setPlan(null);
    setError(null);
    setView('home');
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white selection:bg-emerald-500/30">
      {/* Navigation / Header */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight leading-none">FitGen</span>
              <span className="text-[10px] text-emerald-500/60 font-mono font-medium">v1.2.4</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setView(view === 'history' ? 'home' : 'history');
                    if (view === 'home') fetchHistory();
                  }}
                  className={`flex items-center gap-2 text-sm transition-colors ${view === 'history' ? 'text-emerald-500' : 'text-zinc-400 hover:text-white'}`}
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </button>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-zinc-300 hidden sm:inline">{user.username}</span>
                  <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <AuthModal onLogin={setUser} />
            )}
          </div>
        </div>
      </nav>

      <main className="py-12 px-6">
        <AnimatePresence mode="wait">
          {view === 'history' ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold font-display">Your Training History</h2>
                <p className="text-zinc-500">Review your past generated routines</p>
              </div>
              <HistoryView 
                history={history} 
                onSelect={(item) => {
                  setPlan(item.plan);
                  setView('home');
                  setIsSaved(true);
                }} 
              />
            </motion.div>
          ) : !plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-extrabold font-display leading-tight">
                  Your Body, <br />
                  <span className="gradient-text">AI Engineered.</span>
                </h1>
                <p className="text-zinc-500 text-lg">
                  Stop guessing. Get a science-backed fitness routine tailored to your goals, equipment, and lifestyle.
                </p>
              </div>

              {error && (
                <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm">
                  {error}
                </div>
              )}

              <FitnessForm onSubmit={handleGenerate} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <WorkoutDisplay 
                plan={plan} 
                onSave={user ? handleSavePlan : undefined}
                isSaving={isSaving}
                isSaved={isSaved}
              />
              
              <div className="mt-12 text-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Generate Another Plan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Dumbbell className="w-4 h-4" />
            <span className="font-display font-bold text-sm tracking-tight">FitGen AI</span>
          </div>
          <p className="text-zinc-600 text-xs text-center md:text-left">
            Powered by Gemini 3.1 Pro. Always consult a physician before starting any new exercise program.
          </p>
          <div className="flex gap-6 text-zinc-500 text-xs uppercase tracking-widest font-medium">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
