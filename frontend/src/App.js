import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import IncomeExpense from './pages/IncomeExpense';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import SideBarPages from './components/SideBarPages';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary to-secondary">
      <Router>
        <Routes>
          {/* pages wiht only navbar */}
          <Route element={<NavBarOnlyPages />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* pages with sidebar + navbar */}
          <Route element={<SideBarPages />}>
            <Route path="/income-expense" element={<IncomeExpense />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/goals" element={<Goals />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}


// include navbar
const NavBarOnlyPages = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
