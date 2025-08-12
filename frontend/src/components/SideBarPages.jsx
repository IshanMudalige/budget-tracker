import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const SideBarPages = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div>
            <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
            <div className="flex min-h-screen">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex flex-col flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SideBarPages;
