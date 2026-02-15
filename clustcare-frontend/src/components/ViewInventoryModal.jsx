import React, { useState, useEffect } from 'react';

const ViewInventoryModal = ({ isOpen, onClose, clinic }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && clinic) {
      fetchInventory();
    }
  }, [isOpen, clinic]);

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/clinic/cluster/clinics/${clinic.id}/inventory`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="bg-gray-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h3 className="text-lg font-semibold">Inventory at {clinic?.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : inventory.length === 0 ? (
            <div className="text-center text-gray-500">No inventory shared.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2 text-sm font-semibold text-gray-600">Medicine</th>
                  <th className="py-2 text-sm font-semibold text-gray-600">Available Quantity</th>
                  <th className="py-2 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-gray-800">{item.medicineName}</td>
                    <td className="py-3 text-gray-600">{item.quantityAvailable}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.quantityAvailable > 10 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.quantityAvailable > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInventoryModal;
