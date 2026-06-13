import React, { useState, useEffect } from 'react';
import { BookOpen, Users } from 'lucide-react';
import api from '../../services/api';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    classesCount: 0,
    studentCount: 0,
    teacherDetails: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/teacher/dashboard');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6 flex justify-center"><span className="text-gray-500">Loading dashboard...</span></div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {stats.teacherDetails?.user?.name || 'Teacher'}!</h1>
        <p className="text-gray-600">Here is an overview of your classes and students.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Classes Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-lg mr-4">
            <BookOpen className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Assigned Classes</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.classesCount}</h3>
          </div>
        </div>

        {/* Students Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 p-4 rounded-lg mr-4">
            <Users className="text-indigo-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Students</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.studentCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
