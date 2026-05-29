import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold text-[#4477ff] group-hover:text-[#6699ff] transition-colors">
            PeakTasks
          </span>
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <Link
              to="/about"
              className="text-sm text-slate-400 hover:text-[#4477ff] transition-colors hidden sm:block"
            >
              About
            </Link>
            <span className="text-sm text-slate-400 hidden sm:block">·</span>
            <span className="text-sm text-slate-400 hidden sm:block">
              {user.name || user.email}
            </span>
            <button onClick={handleLogout} className="btn-secondary text-sm py-1.5">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
