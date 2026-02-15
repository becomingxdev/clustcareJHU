import React, { useState } from 'react';

const AddMedicineModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    medicineName: '',
    description: '',
    expiryDate: '',
    quantityAvailable: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.medicineName || !formData.expiryDate || !formData.quantityAvailable) {
      alert('Please fill in all required fields');
      return;
    }

    if (parseInt(formData.quantityAvailable) < 0) {
      alert('Quantity must be a positive number');
      return;
    }

    // Convert quantity to integer
    const dataToSubmit = {
      ...formData,
      quantityAvailable: parseInt(formData.quantityAvailable)
    };

    onSave(dataToSubmit);
    
    // Reset form
    setFormData({
      medicineName: '',
      description: '',
      expiryDate: '',
      quantityAvailable: ''
    });
  };

  const handleClose = () => {
    setFormData({
      medicineName: '',
      description: '',
      expiryDate: '',
      quantityAvailable: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Medicine</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="medicineName"
              value={formData.medicineName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="e.g., Paracetamol"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Optional description"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity Available <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantityAvailable"
              value={formData.quantityAvailable}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="e.g., 100"
              min="0"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
            >
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
