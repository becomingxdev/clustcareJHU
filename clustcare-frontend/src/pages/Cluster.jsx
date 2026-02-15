import React, { useState, useEffect } from 'react';
import ViewDoctorsModal from '../components/ViewDoctorsModal';
import ViewInventoryModal from '../components/ViewInventoryModal';
import RequestMedicineModal from '../components/RequestMedicineModal';
import RequestPatientModal from '../components/RequestPatientModal';

const Cluster = () => {
  const [activeTab, setActiveTab] = useState('network');
  const [me, setMe] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [medicineRequests, setMedicineRequests] = useState([]);
  const [patientRequests, setPatientRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal States
  const [viewDoctorsClinic, setViewDoctorsClinic] = useState(null);
  const [viewInventoryClinic, setViewInventoryClinic] = useState(null);
  const [requestMedicineTarget, setRequestMedicineTarget] = useState(null);
  const [requestPatientTarget, setRequestPatientTarget] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'medicine') fetchMedicineRequests();
    if (activeTab === 'patient') fetchPatientRequests();
  }, [activeTab]);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Me
      const meRes = await fetch('http://localhost:8080/api/clinic/cluster/me', { headers });
      if (!meRes.ok) throw new Error('Failed to fetch profile');
      const meData = await meRes.json();
      setMe(meData);

      // Fetch Clinics
      const clinicsRes = await fetch('http://localhost:8080/api/clinic/cluster/clinics', { headers });
      if (!clinicsRes.ok) throw new Error('Failed to fetch cluster clinics');
      const clinicsData = await clinicsRes.json();
      setClinics(clinicsData);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchMedicineRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/clinic/cluster/medicine-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setMedicineRequests(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPatientRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/clinic/cluster/patient-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setPatientRequests(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleMedicineAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/clinic/cluster/medicine-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error('Failed to update request');
      fetchMedicineRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePatientAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/clinic/cluster/patient-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error('Failed to update request');
      fetchPatientRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Cluster System...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cluster Collaboration</h1>
          <p className="text-gray-500 mt-1">Coordinate with other clinics in your cluster</p>
        </div>
        {me && (
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm">
            <span className="text-gray-500">My Clinic: </span>
            <span className="font-semibold text-gray-900">{me.name}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        {['network', 'medicine', 'patient'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-white-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
          >
            {tab === 'network' && 'Cluster Network'}
            {tab === 'medicine' && 'Medicine Requests'}
            {tab === 'patient' && 'Patient Requests'}
          </button>
        ))}
      </div>

      {/* Network Tab */}
      {activeTab === 'network' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">No other clinics found in this cluster.</p>
            </div>
          ) : (
            clinics.map((clinic) => (
              <div key={clinic.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    Partner Clinic
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{clinic.name}</h3>
                <p className="text-gray-500 text-sm mb-6 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {clinic.location}
                </p>

                <div className="space-y-2">
                  <button 
                    onClick={() => setViewDoctorsClinic(clinic)}
                    className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors text-left flex justify-between items-center group"
                  >
                    View Doctors
                    <span className="text-gray-400 group-hover:text-gray-600">→</span>
                  </button>
                  <button 
                    onClick={() => setViewInventoryClinic(clinic)}
                    className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors text-left flex justify-between items-center group"
                  >
                    View Inventory
                    <span className="text-gray-400 group-hover:text-gray-600">→</span>
                  </button>
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setRequestMedicineTarget(clinic)}
                      className="py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs transition-colors text-center"
                    >
                      Request Meds
                    </button>
                    <button 
                      onClick={() => setRequestPatientTarget(clinic)}
                      className="py-2 px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-xs transition-colors text-center"
                    >
                      Request Patient
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Medicine Requests Tab */}
      {activeTab === 'medicine' && (
        <RequestList 
          title="Medicine Requests"
          requests={medicineRequests}
          currentClinicId={me?.id}
          type="medicine"
          onAction={handleMedicineAction}
        />
      )}

      {/* Patient Requests Tab */}
      {activeTab === 'patient' && (
        <RequestList 
          title="Patient Record Requests"
          requests={patientRequests}
          currentClinicId={me?.id}
          type="patient"
          onAction={handlePatientAction}
        />
      )}

      {/* Modals */}
      <ViewDoctorsModal 
        isOpen={!!viewDoctorsClinic} 
        onClose={() => setViewDoctorsClinic(null)} 
        clinic={viewDoctorsClinic} 
      />
      <ViewInventoryModal 
        isOpen={!!viewInventoryClinic} 
        onClose={() => setViewInventoryClinic(null)} 
        clinic={viewInventoryClinic} 
      />
      <RequestMedicineModal 
        isOpen={!!requestMedicineTarget}
        onClose={() => setRequestMedicineTarget(null)}
        targetClinic={requestMedicineTarget}
        onSuccess={() => setActiveTab('medicine')} 
      />
      <RequestPatientModal 
        isOpen={!!requestPatientTarget}
        onClose={() => setRequestPatientTarget(null)}
        targetClinic={requestPatientTarget}
        onSuccess={() => setActiveTab('patient')} 
      />
    </div>
  );
};

const RequestList = ({ title, requests, currentClinicId, type, onAction }) => {
  const [filter, setFilter] = useState('received'); // 'received' or 'sent'
  
  const filteredRequests = requests.filter(req => 
    filter === 'received' 
      ? req.toClinicId === currentClinicId 
      : req.fromClinicId === currentClinicId
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800">{title}</h2>
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            <button
               onClick={() => setFilter('received')}
               className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                 filter === 'received' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
               }`}
            >
              Received (Inbound)
            </button>
            <button
               onClick={() => setFilter('sent')}
               className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                 filter === 'sent' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
               }`}
            >
              Sent (Outbound)
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">
                  {filter === 'received' ? 'From Clinic' : 'To Clinic'}
                </th>
                <th className="px-6 py-3 font-semibold">Details</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                {filter === 'received' && <th className="px-6 py-3 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                    No {filter} requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {filter === 'received' ? req.fromClinicName : req.toClinicName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {type === 'medicine' ? (
                        <span>
                          <span className="font-semibold text-gray-800">{req.medicineName}</span>
                          <span className="ml-2 text-gray-500">(Qty: {req.requestedQuantity})</span>
                        </span>
                      ) : (
                        <span>Patient ID: <span className="font-mono bg-gray-100 px-1 rounded">{req.patientId}</span></span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    {filter === 'received' && (
                      <td className="px-6 py-4 text-right">
                        {req.status === 'PENDING' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => onAction(req.id, 'APPROVE')}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-semibold hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => onAction(req.id, 'REJECT')}
                              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-300 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default Cluster;
