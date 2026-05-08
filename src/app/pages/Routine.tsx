import { useState } from 'react';
import {
  CheckCircle2, Circle, Plus, X, ChevronDown, ChevronRight,
  Flame, Trophy, Target, Clock, Brain, Zap, Calendar,
  Coffee, Dumbbell, BookOpen, Moon, Sun, Sunset, Star
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  tag: string;
  time?: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
}

interface Habit {
  id: number;
  name: string;
  emoji: string;
  streak: number;
  goal: number;
  completed: boolean[];
  color: string;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const today = new Date().getDay();

const initialTasks: Record<string, Task[]> = {
  morning: [
    { id: 1, title: 'Morning Workout (30 min)', tag: 'fitness', time: '7:00 AM', priority: 'high', done: true },
    { id: 2, title: 'Meditate for 10 minutes', tag: 'wellness', time: '7:45 AM', priority: 'medium', done: true },
    { id: 3, title: 'Read tech news (15 min)', tag: 'learning', time: '8:15 AM', priority: 'low', done: false },
  ],
  afternoon: [
    { id: 4, title: 'Team standup meeting', tag: 'work', time: '9:30 AM', priority: 'high', done: true },
    { id: 5, title: 'Complete project proposal', tag: 'work', time: '11:00 AM', priority: 'high', done: false },
    { id: 6, title: 'Healthy lunch break', tag: 'health', time: '12:30 PM', priority: 'medium', done: false },
    { id: 7, title: 'Deep work session (2h)', tag: 'work', time: '2:00 PM', priority: 'high', done: false },
  ],
  evening: [
    { id: 8, title: 'Evening jog (5km)', tag: 'fitness', time: '6:00 PM', priority: 'medium', done: false },
    { id: 9, title: 'Prepare tomorrow\'s schedule', tag: 'planning', time: '8:00 PM', priority: 'medium', done: false },
    { id: 10, title: 'Read a book (30 min)', tag: 'learning', time: '9:00 PM', priority: 'low', done: false },
    { id: 11, title: 'Sleep by 11 PM', tag: 'health', time: '11:00 PM', priority: 'high', done: false },
  ],
};

const initialHabits: Habit[] = [
  { id: 1, name: 'Morning Workout', emoji: '💪', streak: 12, goal: 30, completed: [true, true, true, true, true, true, false], color: '#C2DBC4' },
  { id: 2, name: 'Drink 8 Glasses', emoji: '💧', streak: 8, goal: 21, completed: [true, true, false, true, true, true, false], color: '#7BA7DC' },
  { id: 3, name: 'Read Daily', emoji: '📚', streak: 5, goal: 30, completed: [true, false, true, true, true, false, false], color: '#C77DFF' },
  { id: 4, name: 'Meditate', emoji: '🧘', streak: 15, goal: 30, completed: [true, true, true, true, true, true, false], color: '#F4A261' },
  { id: 5, name: 'No Junk Food', emoji: '🥗', streak: 3, goal: 14, completed: [false, true, true, true, false, false, false], color: '#7BAF80' },
];

const tagColors: Record<string, { bg: string; text: string }> = {
  fitness: { bg: '#E8F3E9', text: '#5A9E60' },
  work: { bg: '#E8F0FE', text: '#4A7CC7' },
  health: { bg: '#FFF0E8', text: '#D4693A' },
  wellness: { bg: '#F3E8FE', text: '#8B4EC4' },
  learning: { bg: '#FEF8E8', text: '#B8860B' },
  planning: { bg: '#F5FAF5', text: '#5A7A5A' },
};

const priorityColors: Record<string, string> = {
  high: '#E63946',
  medium: '#F4A261',
  low: '#C2DBC4',
};

export default function Routine() {
  const [tasks, setTasks] = useState(initialTasks);
  const [habits, setHabits] = useState(initialHabits);
  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits' | 'focus'>('tasks');

  const toggleTask = (section: string, id: number) => {
    setTasks(prev => ({
      ...prev,
      [section]: prev[section].map(t => t.id === id ? { ...t, done: !t.done } : t),
    }));
  };

  const addTask = (section: string) => {
    if (!newTaskTitle.trim()) return;
    setTasks(prev => ({
      ...prev,
      [section]: [...prev[section], {
        id: Date.now(), title: newTaskTitle, tag: 'work',
        time: '', priority: 'medium', done: false,
      }],
    }));
    setNewTaskTitle('');
    setShowAddTask(null);
  };

  const toggleHabit = (id: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const newCompleted = [...h.completed];
      newCompleted[6] = !newCompleted[6];
      return { ...h, completed: newCompleted, streak: newCompleted[6] ? h.streak + 1 : Math.max(0, h.streak - 1) };
    }));
  };

  const allTasks = Object.values(tasks).flat();
  const doneTasks = allTasks.filter(t => t.done).length;
  const productivity = Math.round((doneTasks / allTasks.length) * 100);

  const sections = [
    { key: 'morning', label: 'Morning', icon: Sun, emoji: '🌅', tasks: tasks.morning },
    { key: 'afternoon', label: 'Afternoon', icon: Coffee, emoji: '☀️', tasks: tasks.afternoon },
    { key: 'evening', label: 'Evening', icon: Moon, emoji: '🌙', tasks: tasks.evening },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#222222]">Daily Routine</h1>
          <p style={{ fontSize: '13px' }} className="text-[#888]">Sunday, April 5, 2026</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <div className="w-8 h-8 rounded-xl bg-[#E8F3E9] flex items-center justify-center">
              <Target size={15} className="text-[#7BAF80]" />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 700 }} className="text-[#222222]">{productivity}%</span>
          </div>
          <p style={{ fontSize: '11px' }} className="text-[#888]">Productivity Score</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-[#222222] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p style={{ fontSize: '14px', fontWeight: 600 }} className="text-white">Today's Progress</p>
          <span style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#C2DBC4]">{doneTasks}/{allTasks.length} tasks</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[#C2DBC4] rounded-full transition-all duration-500"
            style={{ width: `${productivity}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Done', value: doneTasks, color: '#C2DBC4', icon: '✅' },
            { label: 'Remaining', value: allTasks.length - doneTasks, color: '#F4A261', icon: '⏳' },
            { label: 'Streak', value: '5 🔥', color: '#C77DFF', icon: '🎯' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p style={{ fontSize: '20px', fontWeight: 700 }} className="text-white">{s.value}</p>
              <p style={{ fontSize: '11px' }} className="text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['tasks', 'habits', 'focus'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl capitalize transition-all border ${
              activeTab === tab
                ? 'bg-[#222222] text-white border-[#222222]'
                : 'bg-white text-[#666] border-[#C2DBC4]/30 hover:border-[#C2DBC4]'
            }`}
            style={{ fontSize: '13px', fontWeight: activeTab === tab ? 600 : 400 }}
          >
            {tab === 'tasks' ? '✅ Tasks' : tab === 'habits' ? '🔥 Habits' : '🎯 Focus'}
          </button>
        ))}
      </div>

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {sections.map(({ key, label, emoji, tasks: sectionTasks }) => {
            const done = sectionTasks.filter(t => t.done).length;
            const isExpanded = expandedSection !== key;
            return (
              <div key={key} className="bg-white rounded-2xl border border-[#C2DBC4]/20 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-[#F5FAF5] transition-colors"
                >
                  <span className="text-xl">{emoji}</span>
                  <div className="flex-1 text-left">
                    <p style={{ fontSize: '15px', fontWeight: 600 }} className="text-[#222222]">{label}</p>
                    <p style={{ fontSize: '12px' }} className="text-[#888]">{done}/{sectionTasks.length} completed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C2DBC4] rounded-full" style={{ width: `${(done / sectionTasks.length) * 100}%` }} />
                    </div>
                    {expandedSection === key ? <ChevronDown size={16} className="text-[#888]" /> : <ChevronRight size={16} className="text-[#888]" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {sectionTasks.map(task => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-[#F5FAF5] ${task.done ? 'opacity-60' : ''}`}
                        onClick={() => toggleTask(key, task.id)}
                      >
                        {task.done
                          ? <CheckCircle2 size={20} className="text-[#7BAF80] fill-[#7BAF80] shrink-0" />
                          : <Circle size={20} className="text-[#ccc] shrink-0" />
                        }
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: '13px', fontWeight: 500 }} className={`${task.done ? 'line-through text-[#aaa]' : 'text-[#222222]'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {task.time && (
                              <div className="flex items-center gap-1">
                                <Clock size={10} className="text-[#bbb]" />
                                <span style={{ fontSize: '10px' }} className="text-[#bbb]">{task.time}</span>
                              </div>
                            )}
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                backgroundColor: tagColors[task.tag]?.bg || '#f3f4f6',
                                color: tagColors[task.tag]?.text || '#6b7280',
                              }}
                              className="px-1.5 py-0.5 rounded-md">
                              {task.tag}
                            </span>
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: priorityColors[task.priority] }} />
                      </div>
                    ))}

                    {/* Add task */}
                    {showAddTask === key ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          autoFocus
                          value={newTaskTitle}
                          onChange={e => setNewTaskTitle(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') addTask(key); if (e.key === 'Escape') setShowAddTask(null); }}
                          placeholder="Add task..."
                          className="flex-1 px-3 py-2 bg-[#F5FAF5] border border-[#C2DBC4]/30 rounded-xl text-[#222] placeholder:text-[#bbb] outline-none focus:border-[#C2DBC4]"
                          style={{ fontSize: '13px' }}
                        />
                        <button onClick={() => addTask(key)} className="px-3 py-2 bg-[#222222] text-white rounded-xl hover:bg-[#333] transition-colors">
                          <Plus size={15} />
                        </button>
                        <button onClick={() => setShowAddTask(null)} className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddTask(key)}
                        className="flex items-center gap-2 w-full px-3 py-2.5 mt-1 text-[#888] hover:text-[#222] hover:bg-[#F5FAF5] rounded-xl transition-all"
                        style={{ fontSize: '13px' }}
                      >
                        <Plus size={15} /> Add task to {label.toLowerCase()}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* HABITS TAB */}
      {activeTab === 'habits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222]">Habit Tracker</h3>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#222222] text-white rounded-xl hover:bg-[#333] transition-colors" style={{ fontSize: '12px', fontWeight: 600 }}>
              <Plus size={13} /> New Habit
            </button>
          </div>

          {/* Week header */}
          <div className="bg-white rounded-2xl border border-[#C2DBC4]/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={15} className="text-[#888]" />
              <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#666]">This Week (Mar 30 – Apr 5)</p>
            </div>
            <div className="flex gap-2">
              <div className="w-32 shrink-0" />
              {DAYS.map((d, i) => (
                <div key={i} className={`flex-1 text-center py-1.5 rounded-lg ${i === 6 ? 'bg-[#222222]' : ''}`}>
                  <p style={{ fontSize: '10px', fontWeight: 600 }} className={i === 6 ? 'text-[#C2DBC4]' : 'text-[#888]'}>{d}</p>
                </div>
              ))}
            </div>
          </div>

          {habits.map(habit => (
            <div key={habit.id} className="bg-white rounded-2xl border border-[#C2DBC4]/20 p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{habit.emoji}</span>
                <div className="flex-1">
                  <p style={{ fontSize: '14px', fontWeight: 600 }} className="text-[#222222]">{habit.name}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Flame size={12} style={{ color: habit.color }} />
                      <span style={{ fontSize: '11px', fontWeight: 600 }} className="text-[#888]">{habit.streak} day streak</span>
                    </div>
                    <span style={{ fontSize: '11px' }} className="text-[#888]">Goal: {habit.goal} days</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    habit.completed[6]
                      ? 'text-white'
                      : 'bg-gray-100 text-[#888] hover:bg-[#E8F3E9]'
                  }`}
                  style={habit.completed[6] ? { backgroundColor: habit.color } : {}}
                >
                  {habit.completed[6] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </button>
              </div>

              {/* Week dots */}
              <div className="flex gap-2 items-center">
                <div className="w-32 shrink-0">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(habit.streak / habit.goal) * 100}%`, backgroundColor: habit.color }} />
                  </div>
                  <p style={{ fontSize: '9px' }} className="text-[#bbb] mt-0.5">{Math.round((habit.streak / habit.goal) * 100)}% to goal</p>
                </div>
                {habit.completed.map((done, i) => (
                  <div
                    key={i}
                    className="flex-1 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: done ? habit.color + '30' : '#f5f5f5' }}
                  >
                    {done && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Achievement */}
          <div className="bg-[#222222] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C2DBC4] flex items-center justify-center shrink-0">
              <Trophy size={22} className="text-[#222222]" />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-white">15-Day Meditation Streak!</p>
              <p style={{ fontSize: '12px' }} className="text-white/50">Keep it up to earn the "Zen Master" badge 🧘</p>
            </div>
            <Star size={18} className="text-yellow-400 fill-yellow-400 shrink-0 ml-auto" />
          </div>
        </div>
      )}

      {/* FOCUS TAB */}
      {activeTab === 'focus' && (
        <div className="space-y-4">
          {/* Pomodoro Timer */}
          <div className="bg-white rounded-2xl border border-[#C2DBC4]/20 p-6 text-center">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222] mb-4">🍅 Pomodoro Focus Timer</h3>
            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg width={160} height={160} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={80} cy={80} r={68} fill="none" stroke="#f0f0f0" strokeWidth={10} />
                <circle cx={80} cy={80} r={68} fill="none" stroke="#C2DBC4" strokeWidth={10}
                  strokeDasharray={`${2 * Math.PI * 68}`}
                  strokeDashoffset={`${2 * Math.PI * 68 * 0.4}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p style={{ fontSize: '36px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }} className="text-[#222222]">15:00</p>
                <p style={{ fontSize: '11px' }} className="text-[#888]">Focus Session</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#222222] text-white rounded-xl hover:bg-[#333] transition-colors" style={{ fontSize: '14px', fontWeight: 600 }}>
                <Zap size={15} /> Start Focus
              </button>
              <button className="px-4 py-2.5 bg-[#F5FAF5] border border-[#C2DBC4]/30 text-[#666] rounded-xl hover:bg-[#E8F3E9] transition-colors" style={{ fontSize: '14px' }}>
                Reset
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {['25 min', '15 min', '5 min'].map(t => (
                <button key={t} className="px-3 py-1 bg-[#F5FAF5] rounded-lg text-[#666] hover:bg-[#E8F3E9] transition-colors" style={{ fontSize: '12px' }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Focus Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Focus Sessions', value: '4', icon: Brain, color: '#C2DBC4' },
              { label: 'Focus Time', value: '100 min', icon: Clock, color: '#7BA7DC' },
              { label: 'Tasks Focused', value: '3', icon: Target, color: '#F4A261' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#C2DBC4]/20 p-4 text-center">
                <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: s.color + '20' }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <p style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">{s.value}</p>
                <p style={{ fontSize: '10px' }} className="text-[#888]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Focus Music */}
          <div className="bg-white rounded-2xl border border-[#C2DBC4]/20 p-5">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222] mb-3">🎵 Focus Sounds</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'Brown Noise', emoji: '🌊', active: true },
                { name: 'Rain Sounds', emoji: '🌧️', active: false },
                { name: 'Forest Ambience', emoji: '🌲', active: false },
                { name: 'Coffee Shop', emoji: '☕', active: false },
                { name: 'Lo-fi Beats', emoji: '🎸', active: false },
                { name: 'Binaural Beats', emoji: '🧠', active: false },
              ].map(s => (
                <button key={s.name} className={`p-3 rounded-xl border transition-all text-center ${s.active ? 'bg-[#E8F3E9] border-[#C2DBC4]' : 'bg-[#F5FAF5] border-[#C2DBC4]/20 hover:border-[#C2DBC4]'}`}>
                  <span className="text-xl block mb-1">{s.emoji}</span>
                  <p style={{ fontSize: '11px', fontWeight: s.active ? 600 : 400 }} className={s.active ? 'text-[#5A9E60]' : 'text-[#666]'}>{s.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}