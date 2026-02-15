import React, { useState } from 'react';
import BookAppointmentModal from '../components/BookAppointmentModal'; // <--- Import

const Appointments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/clinic/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBookAppointment = (newApt) => {
    // For now, this is wired to just refresh list if modal saves to backend internally
    // If modal uses parent callback, we should implement POST here. 
    // Assuming user only asked for Cancel/Reschedule fixes, keeping existing flow minimal or assume modal works?
    // User request: "minimal logic to make buttons functional". 
    // I will assume modal works or is out of scope for "Cancel/Reschedule" task but I'll refresh list.
    fetchAppointments();
    setIsModalOpen(false);
  };

  const handleCancel = async (id) => {
    if(!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/clinic/appointments/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchAppointments();
      } else {
        alert("Failed to cancel appointment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReschedule = async (id, currentDate) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):", currentDate);
    if (!newDate) return;

    // formatted as LocalDate ISO
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/clinic/appointments/${id}/reschedule?date=${newDate}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchAppointments();
      } else {
        alert("Failed to reschedule. Ensure date format is YYYY-MM-DD");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-600">Appointments</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded shadow transition"
        >
          + Book Appointment
        </button>
      </div>

      <BookAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleBookAppointment}
      />

      {loading ? <p className="text-gray-500">Loading appointments...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.length > 0 ? appointments.map((apt) => (
            <div key={apt.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-gray-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-600">{apt.patient?.name || 'Unknown Patient'}</h3>
                  <p className="text-sm text-gray-400">with {apt.doctor?.name || 'Unknown Doctor'}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  apt.status === 'BOOKED' ? 'bg-gray-200 text-gray-700' : 
                  apt.status === 'COMPLETED' ? 'bg-gray-300 text-gray-700' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  {apt.status === 'BOOKED' ? 'Scheduled' : apt.status}
                </span>
              </div>
              
              <div className="flex items-center text-gray-400 mb-4">
                <span className="mr-4">📅 {apt.appointmentDate}</span>
                {/* Time is not in Appointment.java currently, hiding or showing dummy if needed. Model has only LocalDate. */}
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleReschedule(apt.id, apt.appointmentDate)}
                  disabled={apt.status === 'CANCELLED' || apt.status === 'COMPLETED'}
                  className={`flex-1 py-2 rounded text-sm ${
                    apt.status === 'CANCELLED' || apt.status === 'COMPLETED' 
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Reschedule
                </button>
                <button 
                  onClick={() => handleCancel(apt.id)}
                  disabled={apt.status === 'CANCELLED' || apt.status === 'COMPLETED'}
                  className={`flex-1 py-2 rounded text-sm ${
                    apt.status === 'CANCELLED' || apt.status === 'COMPLETED' 
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )) : (
            <p className="col-span-3 text-gray-500 text-center py-10">No appointments found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;