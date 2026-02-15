import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddDoctorModal from '../components/AddDoctorModal';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/clinic/doctors', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch doctors list');
      }

      const data = await response.json();
      console.log('API Response for doctors:', data);

      if (!Array.isArray(data)) {
        setError('Invalid data format from server');
        return;
      }

      setDoctors(data);
      setError(null);
    } catch (err) {
      console.error('Error loading doctors:', err);
      setError('Failed to load doctors list. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [navigate]);

  const handleStatusToggle = async (id, currentStatus) => {
    const action = currentStatus ? "disable" : "enable";
    if(!window.confirm(`Are you sure you want to ${action} this doctor?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/clinic/doctors/${id}/toggle-status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchDoctors();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  // ✅ THIS IS THE FIX
  const handleAddDoctor = async (newDoctor) => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/clinic/doctors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newDoctor.name,
          specialization: newDoctor.specialization
        })
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to add doctor');
      }

      setIsModalOpen(false);
      await fetchDoctors(); // refresh list after successful insert
    } catch (err) {
      console.error('Error adding doctor:', err);
      setError('Failed to add doctor. Please try again.');
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600 font-semibold animate-pulse">
          Loading Doctors Directory...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-600 tracking-tight">
            Doctors Directory
          </h2>
          <p className="text-gray-400 mt-1">
            Manage your clinic's medical staff
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md transition-colors duration-200 flex items-center font-medium"
        >
          <span className="mr-2 text-xl">+</span> Add New Doctor
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-700 font-medium">{error}</p>
        </div>
      )}

      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddDoctor}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {doctors.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700">
              No Doctors Found
            </h3>
            <p className="text-gray-400 mt-2">
              Click "Add New Doctor" to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase">
                    Doctor Name
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase">
                    Specialization
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-right text-xs font-semibold text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-xs text-gray-400">
                        ID: #{doctor.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {doctor.specialization || 'General'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        doctor.active ? 'bg-gray-200 text-gray-700' : 'bg-gray-300 text-gray-500'
                      }`}>
                        {doctor.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleStatusToggle(doctor.id, doctor.active)}
                        className={`text-sm font-medium ${
                          doctor.active ? 'text-white-500 hover:text-white-700' : 'text-white-400 hover:text-white-600'
                        }`}
                      >
                        {doctor.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
