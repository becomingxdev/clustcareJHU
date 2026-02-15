import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddMedicineModal from '../components/AddMedicineModal';
import EditMedicineModal from '../components/EditMedicineModal';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const navigate = useNavigate();

  const fetchInventory = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/clinic/inventory', {
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
        throw new Error('Failed to fetch inventory');
      }

      const data = await response.json();
      console.log('API Response for inventory:', data);

      if (!Array.isArray(data)) {
        setError('Invalid data format from server');
        return;
      }

      setInventory(data);
      setError(null);
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError('Failed to load inventory. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [navigate]);

  const handleAddMedicine = async (newMedicine) => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/clinic/inventory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMedicine)
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to add medicine');
      }

      setIsAddModalOpen(false);
      await fetchInventory();
    } catch (err) {
      console.error('Error adding medicine:', err);
      setError('Failed to add medicine. Please try again.');
    }
  };

  const handleEditMedicine = async (updatedMedicine) => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/clinic/inventory/${updatedMedicine.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMedicine)
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update medicine');
      }

      setIsEditModalOpen(false);
      setSelectedMedicine(null);
      await fetchInventory();
    } catch (err) {
      console.error('Error updating medicine:', err);
      setError('Failed to update medicine. Please try again.');
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8080/api/clinic/inventory/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchInventory();
      } else {
        alert('Failed to delete medicine');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting medicine');
    }
  };

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setIsEditModalOpen(true);
  };

  const getStatus = (expiryDate, quantity) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    
    if (expiry < today) {
      return { label: 'Expired', color: 'bg-red-100 text-red-700' };
    } else if (quantity < 10) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
    }
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600 font-semibold animate-pulse">
          Loading Inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-600 tracking-tight">
            Medicine Inventory
          </h2>
          <p className="text-gray-400 mt-1">
            Manage your clinic's medicine stock
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 md:mt-0 bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md transition-colors duration-200 flex items-center font-medium"
        >
          <span className="mr-2 text-xl">+</span> Add Medicine
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-700 font-medium">{error}</p>
        </div>
      )}

      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMedicine}
      />

      {selectedMedicine && (
        <EditMedicineModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMedicine(null);
          }}
          onSave={handleEditMedicine}
          medicine={selectedMedicine}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {inventory.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700">
              No Medicines Found
            </h3>
            <p className="text-gray-400 mt-2">
              Click "Add Medicine" to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase">
                    Medicine Name
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase">
                    Quantity
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
                {inventory.map((item) => {
                  const status = getStatus(item.expiryDate, item.quantityAvailable);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium">{item.medicineName}</div>
                        <div className="text-xs text-gray-400">
                          ID: #{item.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.description || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.quantityAvailable}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-sm font-medium text-gray-500 hover:text-gray-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMedicine(item.id)}
                          className="text-sm font-medium text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
