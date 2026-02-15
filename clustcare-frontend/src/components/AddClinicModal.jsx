import React, { useState } from 'react';

const AddClinicModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clinicName: '',
    username: '',
    password: '',
    location: '',
    clusterType: 'new', // Default to new for now
    clusterName: '',
    district: '' // Added district field
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Prepare the payload
    const payload = {
      clinicName: formData.clinicName,
      username: formData.username,
      password: formData.password,
      location: formData.location,
      clusterType: formData.clusterType,
      clusterName: formData.clusterName,
      // If your backend AdminController expects "district", add it here
      district: formData.district 
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again.');
        return;
      }
      const response = await fetch('http://localhost:8080/api/admin/add-clinic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Clinic Created Successfully!');
        onSave(); // Refresh the parent dashboard
        onClose(); // Close the modal
      } else {
        alert('Failed to create clinic. Check backend logs.');
      }
    } catch (error) {
      console.error('Error adding clinic:', error);
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Clinic</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Clinic Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
            <input type="text" name="clinicName" required className="mt-1 block w-full border border-gray-300 rounded p-2" onChange={handleChange} />
          </div>

          {/* Login Credentials */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Clinic ID (Username)</label>
              <input type="text" name="username" required className="mt-1 block w-full border border-gray-300 rounded p-2" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" required className="mt-1 block w-full border border-gray-300 rounded p-2" onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" required className="mt-1 block w-full border border-gray-300 rounded p-2" onChange={handleChange} />
          </div>

          {/* Cluster Section */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Cluster Assignment</h3>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm text-gray-600">Cluster Name</label>
                  <input type="text" name="clusterName" required placeholder="e.g. North Cluster" className="mt-1 block w-full border border-gray-300 rounded p-2" onChange={handleChange} />
               </div>
               <div>
                  <label className="block text-sm text-gray-600">District Name</label>
                  <input type="text" name="district" required placeholder="e.g. District A" className="mt-1 block w-full border border-gray-300 rounded p-2" onChange={handleChange} />
               </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create Clinic</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClinicModal;