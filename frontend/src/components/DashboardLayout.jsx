import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap,
  ChevronRight,
  User as UserIcon,
  Award,
  Edit3,
  Megaphone
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-blue-900/10 text-blue-900 border border-blue-900/20';
      case 'TEACHER':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-250';
      case 'STUDENT':
        return 'bg-slate-100 text-slate-800 border border-slate-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const menuItems = [
    {
      name: 'Overview',
      path: '/',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'TEACHER', 'STUDENT']
    },
    {
      name: 'Course Catalog',
      path: '/courses',
      icon: BookOpen,
      roles: ['ADMIN', 'TEACHER', 'STUDENT']
    },
    {
      name: 'My Transcript & GPA',
      path: '/transcript',
      icon: Award,
      roles: ['STUDENT']
    },
    {
      name: 'Faculty Grading Portal',
      path: '/grading',
      icon: Edit3,
      roles: ['TEACHER']
    },
    {
      name: 'User Directory',
      path: '/users',
      icon: Users,
      roles: ['ADMIN']
    },
    {
      name: 'Campus Broadcasts',
      path: '/announcements',
      icon: Megaphone,
      roles: ['ADMIN', 'TEACHER', 'STUDENT']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f224a] text-white border-r border-blue-950 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header/Logo */}
          <div className="h-16 flex items-center px-6 border-b border-blue-950/60 justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white text-[#0f224a] shadow-md">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-wide">
                  ODROS UNI
                </h1>
                <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider -mt-1">
                  Management Sys
                </p>
              </div>
            </Link>
            <button 
              className="lg:hidden text-blue-200 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-white text-[#0f224a] font-bold shadow-md' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? 'text-[#0f224a]' : 'text-blue-200 group-hover:text-white'
                    }`} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-[#0f224a]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info / Logout */}
        <div className="p-4 border-t border-blue-950 bg-[#0a1733]">
          <div className="flex items-center gap-3 px-2 py-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-blue-900/50 flex items-center justify-center text-white border border-blue-800">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h2 className="text-sm font-semibold truncate text-white">
                {user?.username}
              </h2>
              <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold tracking-wide uppercase bg-white/10 text-white border border-white/20">
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all duration-250"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-650 hover:bg-slate-200 focus:outline-none lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 hidden sm:block">
              Welcome back, <span className="text-[#0f224a]">{user?.username}</span>!
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs text-slate-500 font-semibold">{user?.email}</p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleBadgeColor(user?.role)}`}>
                {user?.role} Dashboard
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
