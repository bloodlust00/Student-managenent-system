import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';

const TeacherAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await api.get('/teacher/classes');
      setClasses(res.data);
      if (res.data.length > 0) setSelectedClass(res.data[0]._id);
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      const res = await api.get(`/teacher/classes/${selectedClass}/students`);
      setStudents(res.data);
      
      // Initialize attendance to 'Present' by default
      const initialAtnd = {};
      res.data.forEach(s => { initialAtnd[s._id] = 'Present'; });
      setAttendance(initialAtnd);
    };
    fetchStudents();
  }, [selectedClass]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    const payload = {
      classId: selectedClass,
      date,
      attendanceData: Object.keys(attendance).map(studentId => ({
        studentId,
        status: attendance[studentId]
      }))
    };
    
    try {
      await api.post('/teacher/attendance', payload);
      toast.success('Attendance saved successfully!');
    } catch (error) {
      toast.error('Failed to save attendance');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Take Attendance</h1>
        <button onClick={handleSubmit} className="btn-primary flex items-center gap-2">
          <Save size={18} /> Save Attendance
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Class:</label>
          <select 
            className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-primary w-48"
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Date:</label>
          <input 
            type="date" 
            className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-primary w-48"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-3 px-4 font-semibold text-gray-600 rounded-tl-lg">Roll No.</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Student Name</th>
              <th className="py-3 px-4 font-semibold text-gray-600 rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{s.rollNumber}</td>
                <td className="py-3 px-4">{s.user?.name}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {['Present', 'Absent', 'Late'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(s._id, status)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          attendance[s._id] === status
                            ? status === 'Present' ? 'bg-green-500 text-white' : status === 'Absent' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan="3" className="text-center py-6 text-gray-500">No students found. Add students first.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherAttendance;
