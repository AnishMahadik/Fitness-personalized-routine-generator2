import React from 'react';
import { UserProfile } from '../types';
import { Dumbbell, Target, Clock, Calendar, User, Ruler, Weight } from 'lucide-react';

interface FitnessFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const FitnessForm: React.FC<FitnessFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<UserProfile>({
    age: 25,
    gender: 'male',
    weight: 70,
    height: 175,
    goal: 'weight_loss',
    experienceLevel: 'beginner',
    equipment: [],
    daysPerWeek: 3,
    sessionDuration: 45,
  });

  const equipmentOptions = [
    'Full Gym', 'Dumbbells', 'Resistance Bands', 'Pull-up Bar', 'Kettlebells', 'Bench', 'Yoga Mat'
  ];

  const toggleEquipment = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const bmi = (formData.weight / ((formData.height / 100) ** 2)).toFixed(1);
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (val < 25) return { label: 'Healthy', color: 'text-emerald-400' };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };
  const bmiInfo = getBmiCategory(parseFloat(bmi));

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6">
      {/* BMI Indicator */}
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between border-emerald-500/20 bg-emerald-500/5">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Live BMI Calculator</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black font-display">{bmi}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-black/20 ${bmiInfo.color}`}>
              {bmiInfo.label}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-zinc-800 flex items-center justify-center relative">
          <div 
            className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin-slow" 
            style={{ clipPath: `inset(0 0 ${100 - (parseFloat(bmi) / 40 * 100)}% 0)` }}
          />
          <Target className="w-5 h-5 text-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">Personal Details</label>
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div className="flex gap-2">
              {['male', 'female', 'other'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`flex-1 py-2 rounded-lg border text-sm capitalize transition-all ${
                    formData.gender === g ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="relative flex-1">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="number"
                  placeholder="Height (cm)"
                  value={formData.height}
                  onChange={e => setFormData({ ...formData, height: parseInt(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Goals & Experience */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">Goals & Level</label>
          <div className="space-y-3">
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select
                value={formData.goal}
                onChange={e => setFormData({ ...formData, goal: e.target.value as any })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none transition-all"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
                <option value="general_health">General Health</option>
              </select>
            </div>
            <div className="flex gap-2">
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, experienceLevel: level as any })}
                  className={`flex-1 py-2 rounded-lg border text-xs capitalize transition-all ${
                    formData.experienceLevel === level ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Commitment */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">Commitment</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Days per week</span>
              <span className="text-emerald-500 font-bold">{formData.daysPerWeek} days</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={formData.daysPerWeek}
              onChange={e => setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Session Duration</span>
              <span className="text-emerald-500 font-bold">{formData.sessionDuration} min</span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="5"
              value={formData.sessionDuration}
              onChange={e => setFormData({ ...formData, sessionDuration: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">Available Equipment</label>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => toggleEquipment(item)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                formData.equipment.includes(item)
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Crafting Your Plan...
          </>
        ) : (
          <>
            <Dumbbell className="w-5 h-5" />
            Generate Personalized Routine
          </>
        )}
      </button>
    </form>
  );
};
