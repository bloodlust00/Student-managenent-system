import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Plus, X, BookOpen } from 'lucide-react';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', section: '' });

  const fetchClasses = async () => {
    try {
      const res = await api.get('/teacher/classes');
      setClasses(res.data);
    } catch (error) {
      toast.error('Failed to load classes');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teacher/classes', formData);
      toast.success('Class created successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', section: '' });
      fetchClasses();
    } catch (error) {
      toast.error('Failed to create class');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map((c) => (
          <div key={c._id} className="card hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-primary rounded-full"><BookOpen size={24}/></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{c.name}</h3>
                <p className="text-sm text-gray-500 font-medium">Section: {c.section}</p>
              </div>
            </div>
          </div>
        ))}
        {classes.length === 0 && <p className="text-gray-500 col-span-3">No classes created yet.</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between p-6 border-b"><h2 className="text-xl font-bold">New Class</h2><button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class Name (e.g., Grade 10)</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Section (e.g., A)</label>
                <input required type="text" className="input-field" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;
