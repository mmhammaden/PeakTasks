import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
  const { pathname } = useLocation();

  // yes i'm logging 404s in the console, you're welcome
  console.warn(`🚨 404 — someone tried to visit "${pathname}" and now we're all suffering`);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* big sad number */}
        <div className="relative mb-6">
          <div className="text-[10rem] font-black leading-none text-slate-800 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl animate-bounce">🤔</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Huh. That page doesn't exist.
        </h1>

        <p className="text-slate-400 mb-2">
          You tried to visit <code className="text-[#4477ff] bg-slate-800 px-1.5 py-0.5 rounded text-sm">{pathname}</code>
        </p>

        <p className="text-slate-500 text-sm mb-8">
          Either you typed something wrong, clicked a broken link, or you're just
          exploring — which is fine, honestly. No judgment. But there's nothing here.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            ← Take me home
          </Link>
          <Link to="/about" className="btn-secondary">
            Read the about page instead
          </Link>
        </div>

        <p className="text-slate-600 text-xs mt-8">
          Error 404 · PeakTasks · This message will self-destruct never
        </p>
      </div>
    </div>
  );
};

export default NotFound;
