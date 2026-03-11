import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  ClipboardList,
  Bell,
  Lightbulb,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAppData();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const userRole = isAdminRoute ? 'Admin' : 'Student';

  useEffect(() => {
    if (!currentUser) navigate('/');
    if (currentUser && isAdminRoute && currentUser.role !== 'admin') navigate('/student');
    if (currentUser && !isAdminRoute && currentUser.role !== 'student') navigate('/admin');
  }, [currentUser, isAdminRoute, navigate]);

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: BookOpen, label: 'Subjects', path: '/admin/subjects' },
    { icon: GraduationCap, label: 'Grades', path: '/admin/grades' },
    { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
    { icon: ClipboardList, label: 'Assignments', path: '/admin/assignments' },
    { icon: Bell, label: 'Alerts', path: '/admin/alerts' },
    { icon: Lightbulb, label: 'Recommendations', path: '/admin/recommendations' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'User Management', path: '/admin/users' },
  ];

  const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
    { icon: ClipboardList, label: 'Assignments', path: '/student/assignments' },
    { icon: Bell, label: 'Alerts', path: '/student/alerts' },
    { icon: Lightbulb, label: 'Recommendations', path: '/student/recommendations' },
  ];

  const navItems = isAdminRoute ? adminNavItems : studentNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = currentUser?.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-lg">Academic Tracker</h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mt-1">{userRole} Portal</p>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <Button variant="outline" className="w-full justify-start gap-3" onClick={handleLogout}>
              <LogOut className="w-5 h-5" /> Logout
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">{initials}</div>
            </div>
          </div>
        </div>
        <div className="p-6"><Outlet /></div>
      </main>
    </div>
  );
}
