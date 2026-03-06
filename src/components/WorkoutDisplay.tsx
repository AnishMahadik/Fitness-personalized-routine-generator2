import React from 'react';
import { FitnessPlan, WorkoutDay, Exercise } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronDown, Info, Apple, Lightbulb, CheckCircle2 } from 'lucide-react';

interface WorkoutDisplayProps {
  plan: FitnessPlan;
}

export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ plan }) => {
  const [expandedDay, setExpandedDay] = React.useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold font-display gradient-text">{plan.planName}</h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">{plan.overview}</p>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-display flex items-center gap-2">
          <CheckCircle2 className="text-emerald-500 w-5 h-5" />
          Weekly Training Schedule
        </h3>
        <div className="space-y-3">
          {plan.weeklySchedule.map((day, idx) => (
            <div key={idx} className="glass-card rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-sm">
                    {day.day.substring(0, 3)}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-lg">{day.day}</h4>
                    <p className="text-zinc-500 text-sm">{day.focus}</p>
                  </div>
                </div>
                {expandedDay === idx ? <ChevronDown className="w-5 h-5 text-zinc-500" /> : <ChevronRight className="w-5 h-5 text-zinc-500" />}
              </button>

              <AnimatePresence>
                {expandedDay === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {day.exercises.map((ex, exIdx) => (
                          <div key={exIdx} className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between items-start">
                              <h5 className="font-bold text-emerald-400">{ex.name}</h5>
                              <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">
                                {ex.targetMuscle}
                              </span>
                            </div>
                            <div className="flex gap-4 text-xs text-zinc-400 font-mono">
                              {ex.sets && <span>{ex.sets} Sets</span>}
                              {ex.reps && <span>{ex.reps} Reps</span>}
                              {ex.duration && <span>{ex.duration}</span>}
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed italic">
                              {ex.instructions}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold font-display flex items-center gap-2 text-orange-400">
            <Apple className="w-5 h-5" />
            Nutrition Strategy
          </h3>
          <ul className="space-y-3">
            {plan.nutritionAdvice.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-400">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold font-display flex items-center gap-2 text-blue-400">
            <Lightbulb className="w-5 h-5" />
            Pro Performance Tips
          </h3>
          <ul className="space-y-3">
            {plan.proTips.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-400">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
