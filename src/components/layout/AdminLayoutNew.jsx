import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';

export default function AdminLayoutNew() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-background-dark overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 scrollbar-hide">
                    <div className="max-w-7xl mx-auto w-full">
                        <div>
                            <div className="mb-6 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium text-center">
                                Admin Mode Active
                            </div>
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
