import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Inventory from './pages/Inventory';
import Cluster from './pages/Cluster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/clinic-dashboard" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="cluster" element={<Cluster />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;