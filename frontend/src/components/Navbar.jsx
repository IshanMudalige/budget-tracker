import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import Notifications from './Notifications';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 p-4 flex justify-between items-center bg-white/80 backdrop-blur">
      <Link to="/" className={`${user ? "hidden lg:block" : ""}`}><img src="/logo.png" alt="Logo" style={{ maxWidth: "80%" }} /></Link>
      {user ? (<button
        onClick={onToggleSidebar}
        className="lg:hidden text-xl"
        aria-label="Toggle Sidebar"
      >
        <i className="fas fa-bars"></i>
      </button>) : null}
      <div>
        {user ? (
          <div className='flex items-center'>
          <Link to="/dashboard" className="flex items-center mr-4 px-4 py-2 hover:bg-gray-100">
          <i className="fas fa-user-circle text-2xl mr-2" hidden></i>
          <div>Dashboard</div>
          </Link>
          <Notifications />
          <div ref={dropdownRef} className="relative inline-block">
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100"
            >
              <i className="fas fa-user-circle text-2xl mr-2"></i>
              <span className="hidden sm:inline">{user.name || "Profile"}</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          </div>
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
