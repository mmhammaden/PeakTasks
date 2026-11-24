import { useState, useEffect, useRef } from 'react';

const WORK_MS = 25 * 60 * 1000;
const BREAK_MS = 5 * 60 * 1000;

const fmt = (secs) => {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const PomodoroTimer = () => {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [secs, setSecs] = useState(WORK_MS / 1000);
  const [sessions, setSessions] = useState(0);
  const deadline = useRef(null);
  const remaining = useRef(WORK_MS);

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      if (deadline.current === null) return;
      const timeLeft = deadline.current - Date.now();
      if (timeLeft > 0) {
        setSecs(Math.ceil(timeLeft / 1000));
        return;
      }

      deadline.current = null;
      remaining.current = isBreak ? WORK_MS : BREAK_MS;
      setSecs(remaining.current / 1000);
      setRunning(false);
      setIsBreak(!isBreak);

      if (!isBreak) {
        setSessions((count) => count + 1);
        if (globalThis.Notification?.permission === 'granted') {
          try {
            new Notification('PeakTasks 🍅', { body: 'Nice work! Take a 5 min break.' });
          } catch {
            // Some browsers expose notifications but cannot display them from a page.
          }
        }
      }
    };

    const interval = setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [running, isBreak]);

  const toggle = (e) => {
    e.stopPropagation();
    if (running) {
      remaining.current = Math.max(0, deadline.current - Date.now());
      deadline.current = null;
      setSecs(Math.ceil(remaining.current / 1000));
      setRunning(false);
      return;
    }

    deadline.current = Date.now() + remaining.current;
    setRunning(true);
    if (globalThis.Notification?.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  };

  const reset = (e) => {
    e.stopPropagation();
    deadline.current = null;
    remaining.current = WORK_MS;
    setRunning(false);
    setIsBreak(false);
    setSecs(WORK_MS / 1000);
  };

  const pct = 1 - secs * 1000 / (isBreak ? BREAK_MS : WORK_MS);

  const circumference = 2 * Math.PI * 16; // r=16

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {/* trigger button */}
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        title="Pomodoro timer"
        aria-expanded={open}
        className={`text-base p-1 rounded transition-colors ${
          running
            ? 'text-red-400 pomo-active'
            : 'text-slate-500 hover:text-red-400'
        }`}
      >
        🍅
      </button>

      {/* popover */}
      {open && (
        <div className="absolute right-0 top-8 z-30 bg-slate-800 border border-slate-700 rounded-xl p-4 w-52 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              {isBreak ? '☕ Break' : '🍅 Focus'}
            </span>
            {sessions > 0 && (
              <span className="text-xs text-[#4477ff]">{sessions} done</span>
            )}
          </div>

          {/* svg ring */}
          <div className="flex justify-center mb-3">
            <svg width="56" height="56" className="-rotate-90">
              <circle cx="28" cy="28" r="16" fill="none" stroke="#1e293b" strokeWidth="4" />
              <circle
                cx="28" cy="28" r="16" fill="none"
                stroke={isBreak ? '#22c55e' : '#ef4444'}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - pct)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.9s linear' }}
              />
            </svg>
            <span className="absolute mt-3.5 text-sm font-mono font-bold text-white">
              {fmt(secs)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggle}
              className={`flex-1 text-sm font-medium py-1.5 rounded-lg transition-colors ${
                running
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-[#003399] hover:bg-[#0044cc] text-white'
              }`}
            >
              {running ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={reset}
              aria-label="Reset Pomodoro timer"
              className="text-sm px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            >
              ↺
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
