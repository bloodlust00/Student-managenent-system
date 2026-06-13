import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 focus-within:ring-2 ring-primary transition-all">
        <Search size={18} className="text-gray-500" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-primary transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
          <Link to={`/${user?.role?.toLowerCase()}/profile`} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
