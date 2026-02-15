import React, { useState } from 'react';

const AddDoctorModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Send data back to parent
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-600">Add New Doctor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-gray-500 focus:border-gray-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Specialty</label>
            <select
              name="specialty"
              className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-gray-500 focus:border-gray-500"
              onChange={handleChange}
            >
              <option value="">Select Specialty</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Email (Username)</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-gray-500 focus:border-gray-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Password</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-gray-500 focus:border-gray-500"
              onChange={handleChange}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;