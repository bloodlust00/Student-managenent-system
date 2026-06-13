import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Briefcase, Hash } from 'lucide-react';
import api from '../../services/api';

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/teacher/profile');
        setProfile(response.data.profile);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-6 flex justify-center"><span className="text-gray-500">Loading profile...</span></div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const user = profile?.user;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">View your teacher account and employment details.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary/5 p-8 flex items-center justify-center border-b border-gray-100">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center">
                  <User className="mr-2 text-primary" size={18}/> Full Name
                </p>
                <p className="text-gray-800 font-medium text-lg">{user?.name || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center">
                  <Mail className="mr-2 text-primary" size={18}/> Email Address
                </p>
                <p className="text-gray-800 font-medium text-lg">{user?.email || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center">
                  <Shield className="mr-2 text-primary" size={18}/> Role
                </p>
                <p className="text-gray-800 font-medium text-lg bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full inline-block">
                  {user?.role || 'Teacher'}
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center">
                  <Hash className="mr-2 text-primary" size={18}/> Employee ID
                </p>
                <p className="text-gray-800 font-medium text-lg bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 inline-block">
                  {profile?.employeeId || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center">
                  <Briefcase className="mr-2 text-primary" size={18}/> Subject Expertise
                </p>
                <p className="text-gray-800 font-medium text-lg bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 inline-block">
                  {profile?.subject || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center">
                  <Calendar className="mr-2 text-primary" size={18}/> Join Date
                </p>
                <p className="text-gray-800 font-medium text-lg">
                  {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
