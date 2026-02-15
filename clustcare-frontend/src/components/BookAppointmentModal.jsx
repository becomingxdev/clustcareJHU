import React, { useState, useEffect } from 'react';

const BookAppointmentModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: ''
  });
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setFormData({ patientId: '', doctorId: '', date: '', time: '' });
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [patRes, docRes] = await Promise.all([
        fetch('http://localhost:8080/api/clinic/patients', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:8080/api/clinic/doctors', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (patRes.ok) setPatients(await patRes.json());
      if (docRes.ok) setDoctors(await docRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        date: formData.date
        // time is ignored by backend currently but kept in UI
      };

      const response = await fetch('http://localhost:8080/api/clinic/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSave(formData);
        onClose();
      } else {
        alert('Failed to book appointment');
      }
    } catch (e) {
      console.error(e);
      alert('Error booking appointment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name</label>
            <select 
              name="patientId" 
              required 
              value={formData.patientId}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
              onChange={handleChange}
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {loading && <span className="text-xs text-gray-400">Loading patients...</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor</label>
            <select 
              name="doctorId" 
              required 
              value={formData.doctorId}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
              onChange={handleChange}
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} - {d.specialization || 'General'}</option>
              ))}
            </select>
            {loading && <span className="text-xs text-gray-400">Loading doctors...</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input 
                type="date" 
                name="date" 
                required 
                value={formData.date}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input 
                type="time" 
                name="time" 
                required 
                value={formData.time}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentModal;