import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Plus, X, User } from 'lucide-react';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', employeeId: '', subject: ''
  });

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/admin/teachers');
      setTeachers(res.data);
    } catch (error) {
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/teachers', formData);
      toast.success('Teacher created successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', employeeId: '', subject: '' });
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create teacher');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Teachers</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add New Teacher
        </button>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-600">Name</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Email (Login ID)</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Employee ID</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Subject</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-full"><User size={16}/></div>
                    {t.user?.name}
                  </td>
                  <td className="py-3 px-4">{t.user?.email}</td>
                  <td className="py-3 px-4">{t.employeeId}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {t.subject}
                    </span>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr><td colSpan="4" className="text-center py-6 text-gray-500">No teachers found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Add New Teacher</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateTeacher} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Login Email</label>
                <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Login Password</label>
                <input required type="password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Employee ID</label>
                  <input required type="text" className="input-field" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input required type="text" className="input-field" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="btn-primary">Create Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;
