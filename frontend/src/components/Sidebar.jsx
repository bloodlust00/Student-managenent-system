import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Home, Users, BookOpen, FileText, Bell, 
  Settings, LogOut, CheckSquare, User
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (!user) return [];
    
    const base = `/${user.role.toLowerCase()}`;
    
    if (user.role === 'Admin') {
      return [
        { name: 'Dashboard', path: `${base}/dashboard`, icon: <Home size={20} /> },
        { name: 'Profile', path: `${base}/profile`, icon: <User size={20} /> },
        { name: 'Students', path: `${base}/students`, icon: <Users size={20} /> },
        { name: 'Teachers', path: `${base}/teachers`, icon: <BookOpen size={20} /> },
        { name: 'Classes', path: `${base}/classes`, icon: <CheckSquare size={20} /> },
        { name: 'Notices', path: `${base}/notices`, icon: <Bell size={20} /> },
      ];
    } else if (user.role === 'Teacher') {
      return [
        { name: 'Dashboard', path: `${base}/dashboard`, icon: <Home size={20} /> },
        { name: 'Profile', path: `${base}/profile`, icon: <User size={20} /> },
        { name: 'My Classes', path: `${base}/classes`, icon: <BookOpen size={20} /> },
        { name: 'Students', path: `${base}/students`, icon: <Users size={20} /> },
        { name: 'Attendance', path: `${base}/attendance`, icon: <CheckSquare size={20} /> },
      ];
    } else {
      return [
        { name: 'Dashboard', path: `${base}/dashboard`, icon: <Home size={20} /> },
        { name: 'Profile', path: `${base}/profile`, icon: <User size={20} /> },
        { name: 'My Attendance', path: `${base}/attendance`, icon: <CheckSquare size={20} /> },
        { name: 'My Marks', path: `${base}/marks`, icon: <FileText size={20} /> },
      ];
    }
  };

  const links = getLinks();

  return (
    <div className="bg-white w-64 h-full border-r border-gray-200 flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="text-primary" /> EduCore System
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {links.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
