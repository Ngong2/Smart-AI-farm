import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './components/Home/Home';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Services from './components/Services/Services';
import NotFound from './components/NotFound/NotFound';

// Service Details
import ServiceDetail from './components/Services/ServiceDetail';

// Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminLogin from './components/Auth/AdminLogin';

// Main App Pages
import Dashboard from './components/Dashboard/Dashboard';
import FarmerDashboard from './components/Dashboard/FarmerDashboard';
import CropDiseaseDetection from './components/Crop/CropDiseaseDetection';
import CropHistory from './components/Crop/CropHistory';
import WeatherAdvisory from './components/Weather/WeatherAdvisory';
import SoilAdvisory from './components/Soil/SoilAdvisory';
import Subscription from './components/Subscription/Subscription';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    user = {};
  }

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/Admin" replace />;
  }

  return children;
};

const Layout = () => {

  const location = useLocation();

  // Routes that should NOT show Navbar/Footer
  const dashboardRoutes = [
    '/dashboard',
    '/farmer-dashboard',
    '/crop/detect',
    '/crop/history',
    '/weather',
    '/soil',
    '/Admin',
    '/admin'
  ];

  const hideLayout = dashboardRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: { background: '#22c55e' },
          },
          error: {
            style: { background: '#ef4444' },
          },
        }}
      />

      {!hideLayout && <Navbar />}

      <main className={`flex-grow ${!hideLayout ? 'pt-20' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes>

            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Admin" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/Admin" replace />} />

            {/* Protected */}
            <Route path="/dashboard" element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }/>

            <Route path="/farmer-dashboard" element={
              <ProtectedRoute>
                <FarmerDashboard />
              </ProtectedRoute>
            }/>

            <Route path="/crop/detect" element={
              <ProtectedRoute>
                <CropDiseaseDetection />
              </ProtectedRoute>
            }/>

            <Route path="/crop/history" element={
              <ProtectedRoute>
                <CropHistory />
              </ProtectedRoute>
            }/>

            <Route path="/weather" element={
              <ProtectedRoute>
                <WeatherAdvisory />
              </ProtectedRoute>
            }/>

            <Route path="/soil" element={
              <ProtectedRoute>
                <SoilAdvisory />
              </ProtectedRoute>
            }/>

            <Route path="/subscription" element={<Subscription />}/>

            <Route path="*" element={<NotFound />} />

          </Routes>
        </AnimatePresence>
      </main>

      {!hideLayout && <Footer />}

    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
