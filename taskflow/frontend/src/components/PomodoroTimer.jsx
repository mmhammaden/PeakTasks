import { useState, useEffect, useRef } from 'react';

// 25 min work, 5 min break — classic pomodoro
// TODO: improrve this later — let users set custom durations from settings
const WORK_MINS = 25;
const BREAK_MINS = 5;

const fmt = (secs) => {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const PomodoroTimer = ({ taskId, taskTitle }) => {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [secs, setSecs] = useState(WORK_MINS * 60);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  // stop timer when card unmounts — learned this the hard way lol
  useEffect(() => () => clearInterval(intervalRef.current), []);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecs((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);

          if (!isBreak) {
            setSessions((s) => s + 1);
            console.log(`🍅 Pomodoro done for "${taskTitle}" — go touch some grass`);
            // notify if browser allows it
            if (Notification.permission === 'granted') {
              new Notification('PeakTasks 🍅', { body: `Nice work! Take a 5 min break.` });
            }
            setIsBreak(true);
            return BREAK_MINS * 60;
          } else {
            console.log('☕ Break over. Back to the grind, champ.');
            setIsBreak(false);
            return WORK_MINS * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, isBreak, taskTitle]);

  const toggle = (e) => {
    e.stopPropagation();
    if (!running && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setRunning((r) => !r);
  };

  const reset = (e) => {
    e.stopPropagation();
    clearInterval(intervalRef.current);
    setRunning(false);
    setIsBreak(false);
    setSecs(WORK_MINS * 60);
  };

  const pct = isBreak
    ? 1 - secs / (BREAK_MINS * 60)
    : 1 - secs / (WORK_MINS * 60);

  const circumference = 2 * Math.PI * 16; // r=16

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {/* trigger button */}
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        title="Pomodoro timer"
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
