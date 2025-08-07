import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="p-4 flex justify-between items-center bg-white/80">
      <Link to="/" className={`${user ? "hidden lg:block" : ""}`}><img src="/logo.png" alt="Logo" style={{ maxWidth: "80%" }} /></Link>
      {user ? (<button
        // onClick={onToggleSidebar}
        className="lg:hidden text-xl"
        aria-label="Toggle Sidebar"
      >
        <i className="fas fa-bars"></i>
      </button>) : null}
      <div>
        {user ? (
          <>
            <Link to="/tasks" className="mr-4">CRUD</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-8">Login</Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
