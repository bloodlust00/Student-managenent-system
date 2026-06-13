import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Plus, X, GraduationCap } from 'lucide-react';

const TeacherStudents = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', rollNumber: '', classId: '', parentName: '', parentContact: ''
  });

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await api.get('/teacher/classes');
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClass(res.data[0]._id);
        setFormData(prev => ({ ...prev, classId: res.data[0]._id }));
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      const res = await api.get(`/teacher/classes/${selectedClass}/students`);
      setStudents(res.data);
    };
    fetchStudents();
  }, [selectedClass]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teacher/students', formData);
      toast.success('Student created successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', rollNumber: '', classId: selectedClass, parentName: '', parentContact: '' });
      // Refresh students
      const res = await api.get(`/teacher/classes/${selectedClass}/students`);
      setStudents(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create student');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label className="text-sm font-medium text-gray-600 mr-4">Filter by Class:</label>
        <select 
          className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-primary"
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 font-semibold text-gray-600">Roll No.</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Email (Login)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-700">{s.rollNumber}</td>
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full"><GraduationCap size={16}/></div>
                  {s.user?.name}
                </td>
                <td className="py-3 px-4">{s.user?.email}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan="3" className="text-center py-6 text-gray-500">No students found for this class.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between p-6 border-b"><h2 className="text-xl font-bold">Add Student to Class</h2><button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Roll Number</label>
                  <input required type="text" className="input-field" value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Login Email</label>
                  <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Login Password</label>
                  <input required type="password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1">Assign Class</label>
                 <select required className="input-field" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})}>
                   {classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
                 </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="submit" className="btn-primary">Create Student Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
