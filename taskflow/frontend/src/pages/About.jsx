import { Link } from 'react-router-dom';

// this page took me way longer to write than the actual app lol
const About = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link to="/" className="text-sm text-slate-500 hover:text-[#4477ff] transition-colors mb-8 inline-block">
        ← back to tasks
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4477ff] mb-2">About PeakTasks ⚡</h1>
        <p className="text-slate-400 text-sm">the story behind this thing</p>
      </div>

      <div className="space-y-6 text-slate-300 leading-relaxed">
        <div className="card border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">Why I built this</h2>
          <p className="text-slate-400">
            Honestly? I was tired of using Notion for tasks and Todoist for reminders and some random
            sticky note app for "quick things" — it was a mess. I wanted one place that actually
            worked the way my brain works. So I built it myself.
          </p>
          <p className="text-slate-400 mt-3">
            I also wanted to practice building a proper full-stack app from scratch — auth, database,
            REST API, the whole thing — without reaching for some heavy framework that does everything
            for you. Turns out it's actually not that bad when you just sit down and do it.
          </p>
        </div>

        <div className="card border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">The Pomodoro thing 🍅</h2>
          <p className="text-slate-400">
            I added the Pomodoro timer because I kept switching between my task list and a separate
            timer app, which is kind of ironic when you're trying to stay focused. Now it's right
            there on each task. Hit the 🍅 button, work for 25 minutes, take a break. Simple.
          </p>
          <p className="text-slate-400 mt-3">
            Does it make me more productive? Honestly, sometimes. But it looks cool so it stays.
          </p>
        </div>

        <div className="card border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">Tech stack</h2>
          <p className="text-slate-400 mb-3">
            Nothing fancy, just stuff that works:
          </p>
          <ul className="space-y-1.5 text-slate-400 text-sm">
            {[
              ['⚙️', 'Node.js + Express', 'backend API — boring but reliable'],
              ['🐘', 'PostgreSQL', 'raw SQL, no ORM, I like knowing whats happening'],
              ['⚛️', 'React 18 + Vite', 'frontend — fast dev server, no complaints'],
              ['🎨', 'Tailwind CSS', 'utility classes are actually great, fight me'],
              ['🔐', 'JWT auth', 'tokens in localStorage, bcrypt for passwords'],
            ].map(([icon, name, desc]) => (
              <li key={name} className="flex items-start gap-2">
                <span>{icon}</span>
                <span>
                  <span className="text-slate-200 font-medium">{name}</span>
                  <span className="text-slate-500"> — {desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-3">What's next</h2>
          <p className="text-slate-400">
            A few things I want to add when I get around to it:
          </p>
          <ul className="mt-3 space-y-1 text-slate-400 text-sm list-disc list-inside">
            <li>task tags / labels (been putting this off for weeks)</li>
            <li>recurring tasks — the infastructure is almost there</li>
            <li>mobile app maybe? probably not, the web version works fine on mobile</li>
            <li>dark/light mode toggle (it's always dark mode, let's be real)</li>
          </ul>
        </div>

        <div className="card border-[#003399]/50 bg-[#003399]/10">
          <p className="text-slate-300 text-sm">
            Built with too much coffee and a genuine hatred for context-switching. If you find a bug,
            that's a feature. If you have feedback, I'm probably not listening but feel free to shout
            into the void anyway. ✌️
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
