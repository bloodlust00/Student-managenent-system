import React, { useState, useEffect } from 'react';
import { User, BookOpen, GraduationCap, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/student/dashboard');
        setData(response.data);
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

  const profile = data?.profile;
  const user = profile?.user;
  const studentClass = profile?.studentClass;
  const attendance = data?.attendance || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name || 'Student'}!</h1>
        <p className="text-gray-600">Here is your student profile overview.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-primary/5 p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <User className="mr-2 text-primary" size={24} /> Profile Information
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1 flex items-center">
                <GraduationCap className="mr-2" size={16}/> Roll Number
              </p>
              <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{profile?.rollNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1 flex items-center">
                <BookOpen className="mr-2" size={16}/> Class & Section
              </p>
              <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                {studentClass ? `${studentClass.name} - Section ${studentClass.section}` : 'Not Assigned'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1 flex items-center">
                <User className="mr-2" size={16}/> Parent Name
              </p>
              <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{profile?.parentName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1 flex items-center">
                <Calendar className="mr-2" size={16}/> Enrollment Date
              </p>
              <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                {profile?.enrollmentDate ? new Date(profile.enrollmentDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-50 p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="mr-2 text-indigo-600" size={24} /> Recent Attendance
          </h2>
        </div>
        <div className="p-6">
          {attendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-600">Date</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'Present' ? 'bg-green-100 text-green-800' :
                          record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status === 'Present' && <CheckCircle size={14} className="mr-1" />}
                          {record.status === 'Absent' && <XCircle size={14} className="mr-1" />}
                          {record.status === 'Late' && <Clock size={14} className="mr-1" />}
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No attendance records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
