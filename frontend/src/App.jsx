import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Explore from './components/Explore';
import DestinationDetails from './components/DestinationDetails';
import Planner from './components/Planner';
import ItineraryPage from './components/ItineraryPage';
import MyTrips from './components/MyTrips';
import HistoryPage from './components/HistoryPage';
import ProfileSettings from './components/ProfileSettings';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminDestinations from './components/AdminDestinations';
import AdminUsers from './components/AdminUsers';
import Dashboard from './components/Dashboard';
import About from './components/About';
import SavedDestinations from './components/SavedDestinations';
import HelpCenter from './components/HelpCenter';
import PolicyPage from './components/PolicyPage';
import SimplePlaceholder from './components/SimplePlaceholder';
import Bookings from './components/Bookings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<ProfileSettings />} />
        <Route path="/saved" element={<SavedDestinations />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<PolicyPage />} />
        <Route path="/terms" element={<PolicyPage />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/billing" element={<SimplePlaceholder />} />
        <Route path="/guides" element={<SimplePlaceholder />} />
        <Route path="/community" element={<SimplePlaceholder />} />
        <Route path="/careers" element={<SimplePlaceholder />} />
        <Route path="/blog" element={<SimplePlaceholder />} />
        <Route path="/contact" element={<SimplePlaceholder />} />
        <Route path="/cookies" element={<SimplePlaceholder />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/destinations" element={<AdminDestinations />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/itinerary/:tripId" element={<ItineraryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

        {/* Smart Dashboard Redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />
      </Routes>
    </Router>
  );
}

const DashboardRedirect = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
  } catch (e) {
    console.error("Auth error", e);
  }
  return <Dashboard />;
};

export default App;

