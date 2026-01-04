import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';

export default function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 scrollbar-hide">
          <div className="max-w-7xl mx-auto w-full">
            <div>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
