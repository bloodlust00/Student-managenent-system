import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, BookOpen, UserCheck, IndianRupee, Bell } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
    <div className={`p-4 rounded-full ${colorClass} mb-4`}>
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    {subtitle && <p className="text-xs text-green-500 font-medium mt-2">{subtitle}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    studentsCount: 0,
    teachersCount: 0,
    classesCount: 0,
    feesCollection: 0,
    recentNotices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your school's performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.studentsCount} 
          icon={Users} 
          colorClass="bg-blue-500"
          subtitle="+12% from last month"
        />
        <StatCard 
          title="Total Classes" 
          value={stats.classesCount} 
          icon={BookOpen} 
          colorClass="bg-green-500"
        />
        <StatCard 
          title="Total Teachers" 
          value={stats.teachersCount} 
          icon={UserCheck} 
          colorClass="bg-purple-500"
        />
        <StatCard 
          title="Fees Collection" 
          value={`₹${stats.feesCollection.toLocaleString()}`} 
          icon={IndianRupee} 
          colorClass="bg-orange-500"
          subtitle="On track"
        />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
           <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
             <Bell size={20} className="text-primary"/> Recent Notices
           </h2>
           <button className="text-primary text-sm font-medium hover:underline">View All</button>
        </div>
        
        {stats.recentNotices.length > 0 ? (
          <ul className="space-y-3">
            {stats.recentNotices.map((notice, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="font-medium text-gray-800">{notice.title}</p>
                <p className="text-sm text-gray-500 mt-1">{notice.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No notices to show right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
