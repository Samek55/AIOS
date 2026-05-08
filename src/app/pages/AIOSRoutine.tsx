import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Flame,
  Plus,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { useAiosApp } from '../state/AiosAppContext';
import type { RoutineSection } from '../types/aios';
import { titleCase } from '../lib/formatters';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function AIOSRoutine() {
  const {
    addTask,
    habits,
    mood,
    productivityScore,
    tasksBySection,
    todayLabel,
    toggleHabit,
    toggleTask,
  } = useAiosApp();
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits' | 'focus'>('tasks');
  const [expandedSection, setExpandedSection] = useState<RoutineSection | null>(null);
  const [showAddTask, setShowAddTask] = useState<RoutineSection | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const sections: Array<{ id: RoutineSection; label: string }> = [
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'evening', label: 'Evening' },
  ];

  const allTasks = Object.values(tasksBySection).flat();
  const completedTasks = allTasks.filter((task) => task.completed).length;

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#222222]">
            Daily Routine
          </h1>
          <p style={{ fontSize: '13px' }} className="text-[#888]">
            {todayLabel} • Mood mode {mood}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[#222222] px-4 py-3 text-white">
          <Target size={15} className="text-[#C2DBC4]" />
          <div>
            <p style={{ fontSize: '17px', fontWeight: 700 }}>{productivityScore}%</p>
            <p style={{ fontSize: '10px' }} className="text-white/50">
              Productivity score
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[#222222] p-5 text-white">
        <div className="mb-3 flex items-center justify-between">
          <p style={{ fontSize: '14px', fontWeight: 600 }}>Today Progress</p>
          <span style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#C2DBC4]">
            {completedTasks}/{allTasks.length} tasks
          </span>
        </div>
        <div className="mb-4 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#C2DBC4]"
            style={{ width: `${productivityScore}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>{completedTasks}</p>
            <p style={{ fontSize: '11px' }} className="text-white/50">
              Done
            </p>
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>
              {allTasks.length - completedTasks}
            </p>
            <p style={{ fontSize: '11px' }} className="text-white/50">
              Remaining
            </p>
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>
              {habits.filter((habit) => habit.completedDays[6]).length}
            </p>
            <p style={{ fontSize: '11px' }} className="text-white/50">
              Habits today
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {(['tasks', 'habits', 'focus'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl border py-2 transition-all ${
              activeTab === tab
                ? 'border-[#222222] bg-[#222222] text-white'
                : 'border-[#C2DBC4]/30 bg-white text-[#666] hover:border-[#C2DBC4]'
            }`}
            style={{ fontSize: '13px', fontWeight: activeTab === tab ? 700 : 500 }}
          >
            {titleCase(tab)}
          </button>
        ))}
      </div>

      {activeTab === 'tasks' ? (
        <div className="space-y-4">
          {sections.map((section) => {
            const sectionTasks = tasksBySection[section.id];
            const sectionDone = sectionTasks.filter((task) => task.completed).length;
            const expanded = expandedSection !== section.id;
            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-2xl border border-[#C2DBC4]/20 bg-white"
              >
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === section.id ? null : section.id,
                    )
                  }
                  className="flex w-full items-center gap-3 p-4 transition-colors hover:bg-[#F5FAF5]"
                >
                  <div className="min-w-0 flex-1 text-left">
                    <p style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222]">
                      {section.label}
                    </p>
                    <p style={{ fontSize: '12px' }} className="text-[#888]">
                      {sectionDone}/{sectionTasks.length} completed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#C2DBC4]"
                        style={{
                          width: `${(sectionDone / Math.max(sectionTasks.length, 1)) * 100}%`,
                        }}
                      />
                    </div>
                    {expanded ? (
                      <ChevronDown size={16} className="text-[#888]" />
                    ) : (
                      <ChevronRight size={16} className="text-[#888]" />
                    )}
                  </div>
                </button>

                {expanded ? (
                  <div className="space-y-2 px-4 pb-4">
                    {sectionTasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-[#F5FAF5] ${
                          task.completed ? 'opacity-60' : ''
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 size={20} className="shrink-0 text-[#7BAF80]" />
                        ) : (
                          <Circle size={20} className="shrink-0 text-[#ccc]" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p
                            style={{ fontSize: '13px', fontWeight: 600 }}
                            className={task.completed ? 'line-through text-[#aaa]' : 'text-[#222222]'}
                          >
                            {task.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[#888]">
                            <div className="flex items-center gap-1">
                              <Clock size={10} />
                              <span style={{ fontSize: '10px' }}>
                                {task.timeLabel ?? 'Flexible'}
                              </span>
                            </div>
                            <span style={{ fontSize: '10px' }}>{task.tag}</span>
                          </div>
                        </div>
                      </button>
                    ))}

                    {showAddTask === section.id ? (
                      <div className="flex gap-2 pt-1">
                        <input
                          value={newTaskTitle}
                          onChange={(event) => setNewTaskTitle(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              addTask(section.id, newTaskTitle);
                              setNewTaskTitle('');
                              setShowAddTask(null);
                            }
                          }}
                          placeholder={`Add a ${section.label.toLowerCase()} task`}
                          className="flex-1 rounded-xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-3 py-2 text-[#222222] outline-none placeholder:text-[#bbb] focus:border-[#C2DBC4]"
                          style={{ fontSize: '13px' }}
                        />
                        <button
                          onClick={() => {
                            addTask(section.id, newTaskTitle);
                            setNewTaskTitle('');
                            setShowAddTask(null);
                          }}
                          className="rounded-xl bg-[#222222] px-3 py-2 text-white"
                        >
                          <Plus size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setNewTaskTitle('');
                            setShowAddTask(null);
                          }}
                          className="rounded-xl bg-gray-100 px-3 py-2 text-[#666]"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddTask(section.id)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[#888] transition-colors hover:bg-[#F5FAF5] hover:text-[#222222]"
                        style={{ fontSize: '13px' }}
                      >
                        <Plus size={14} />
                        Add task to {section.label.toLowerCase()}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {activeTab === 'habits' ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Calendar size={15} className="text-[#888]" />
              <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-[#666]">
                This week
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-32 shrink-0" />
              {days.map((day, index) => (
                <div
                  key={`${day}-${index}`}
                  className={`flex-1 rounded-lg py-1.5 text-center ${
                    index === 6 ? 'bg-[#222222]' : 'bg-[#F5FAF5]'
                  }`}
                >
                  <p
                    style={{ fontSize: '10px', fontWeight: 700 }}
                    className={index === 6 ? 'text-[#C2DBC4]' : 'text-[#888]'}
                  >
                    {day}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-4"
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${habit.color}25` }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{habit.emoji}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#222222]">
                    {habit.name}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-[#888]">
                    <div className="flex items-center gap-1">
                      <Flame size={12} style={{ color: habit.color }} />
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>
                        {habit.streak} day streak
                      </span>
                    </div>
                    <span style={{ fontSize: '11px' }}>
                      Goal {habit.goal} days
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`rounded-xl px-3 py-2 transition-all ${
                    habit.completedDays[6]
                      ? 'bg-[#222222] text-white'
                      : 'bg-[#F5FAF5] text-[#666] hover:bg-[#E8F3E9]'
                  }`}
                  style={{ fontSize: '12px', fontWeight: 700 }}
                >
                  {habit.completedDays[6] ? 'Done today' : 'Mark today'}
                </button>
              </div>

              <div className="flex gap-2">
                <div className="w-32 shrink-0">
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((habit.streak / habit.goal) * 100, 100)}%`,
                        backgroundColor: habit.color,
                      }}
                    />
                  </div>
                </div>
                {habit.completedDays.map((done, index) => (
                  <div
                    key={`${habit.id}-${index}`}
                    className="flex h-6 flex-1 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: done ? `${habit.color}30` : '#f5f5f5',
                    }}
                  >
                    {done ? (
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 rounded-2xl bg-[#222222] p-4 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C2DBC4]">
              <Trophy size={22} className="text-[#222222]" />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700 }}>Consistency is building</p>
              <p style={{ fontSize: '12px' }} className="text-white/60">
                Your habit layer is now tied to the dashboard and assistant.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === 'focus' ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-6 text-center">
            <p
              style={{ fontSize: '11px', fontWeight: 700 }}
              className="mb-1 uppercase tracking-wide text-[#7BAF80]"
            >
              Focus mode
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 700 }} className="text-[#222222]">
              25:00
            </h2>
            <p style={{ fontSize: '12px' }} className="mt-1 text-[#888]">
              Suggested next block: Deep work session
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                className="flex items-center gap-2 rounded-xl bg-[#222222] px-6 py-2.5 text-white transition-colors hover:bg-[#333333]"
                style={{ fontSize: '14px', fontWeight: 700 }}
              >
                <Zap size={15} />
                Start focus
              </button>
              <button
                className="rounded-xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-5 py-2.5 text-[#666] transition-colors hover:bg-[#E8F3E9]"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-4 text-center">
              <p style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
                4
              </p>
              <p style={{ fontSize: '11px' }} className="text-[#888]">
                Focus sessions
              </p>
            </div>
            <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-4 text-center">
              <p style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
                100 min
              </p>
              <p style={{ fontSize: '11px' }} className="text-[#888]">
                Focus time
              </p>
            </div>
            <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-4 text-center">
              <p style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
                3
              </p>
              <p style={{ fontSize: '11px' }} className="text-[#888]">
                Tasks advanced
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
