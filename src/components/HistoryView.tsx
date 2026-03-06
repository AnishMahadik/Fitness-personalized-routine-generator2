import React from 'react';
import { HistoryItem } from '../types';
import { Calendar, ChevronRight, Dumbbell, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-zinc-400">No history yet</h3>
        <p className="text-zinc-600 max-w-xs mx-auto">Your generated workout plans will appear here once you save them.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {history.map((item, idx) => (
        <motion.button
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onSelect(item)}
          className="glass-card p-6 rounded-2xl text-left hover:border-emerald-500/50 transition-all group relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <h4 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{item.plan.planName}</h4>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Calendar className="w-3 h-3" />
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-zinc-800 px-2 py-1 rounded text-zinc-400">
              <Dumbbell className="w-3 h-3" />
              {item.plan.weeklySchedule.length} Days
            </div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-zinc-800 px-2 py-1 rounded text-zinc-400">
              <Clock className="w-3 h-3" />
              Recent
            </div>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-emerald-500/10 transition-all" />
        </motion.button>
      ))}
    </div>
  );
};
