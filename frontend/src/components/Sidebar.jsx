import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose = () => { } }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: "fas fa-chart-pie", path: "/dashboard" },
    { name: "Income & Expense", icon: "fas fa-money-bill", path: "/income-expense" },
    { name: "Reports", icon: "fas fa-chart-line", path: "/reports" },
    { name: "Goals", icon: "fas fa-trophy", path: "/goals" },
  ];

  return (
    <div
      className={`
    fixed top-0 left-0 w-64 h-screen bg-white/35 z-40 p-5 border-r
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:block
  `}
    >
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${location.pathname === item.path
                ? "text-purple-500 font-semibold"
                : "text-gray-500 hover:bg-secondary/40"
              }`}
          >
            <i className={`${item.icon} w-5`}></i>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
