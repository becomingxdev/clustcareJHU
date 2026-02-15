import React, { useState } from 'react';

const AddPatientModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    condition: '',
    contact: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Admit New Patient</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input type="number" name="age" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Condition / Diagnosis</label>
            <input type="text" name="condition" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g. Flu, Fracture, Dengue" onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="tel" name="contact" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleChange} />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Admit Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;