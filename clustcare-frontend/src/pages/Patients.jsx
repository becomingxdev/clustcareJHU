import React, { useState } from 'react';
import AddPatientModal from '../components/AddPatientModal'; // <--- Import

const Patients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/clinic/patients', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        setError('Failed to fetch patients');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      // Only send fields that exist in Backend Entity
      const payload = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender
      };

      const response = await fetch('http://localhost:8080/api/clinic/patients', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchPatients(); // Refresh list
        setIsModalOpen(false);
      } else {
        alert('Failed to add patient');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding patient');
    }
  };

  const handleDischarge = async (id) => {
    if(!window.confirm("Discharge this patient?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/clinic/patients/${id}/discharge`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchPatients();
      } else {
        alert('Failed to discharge');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-600">Patient Records</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded shadow transition"
        >
          + Admit New Patient
        </button>
      </div>

      <AddPatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddPatient}
      />

      {loading ? (
        <p className="text-gray-500">Loading patients...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Age</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Since</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium">{patient.name}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{patient.age}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{patient.gender}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        patient.discharged ? 'bg-gray-300 text-gray-600' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {patient.discharged ? 'Discharged' : 'Admitted'}
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {!patient.discharged && (
                        <button 
                          onClick={() => handleDischarge(patient.id)}
                          className="text-white-500 hover:text-white-700 font-medium"
                        >
                          Discharge
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-5 text-center text-gray-500">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
 
export default Patients;