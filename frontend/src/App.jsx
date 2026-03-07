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
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/destinations" element={<AdminDestinations />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/itinerary/:tripId" element={<ItineraryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Smart Dashboard Redirect */}
        <Route path="/dashboard" element={
          localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).role === 'admin'
            ? <Navigate to="/admin/dashboard" />
            : <Dashboard />
        } />
      </Routes>
    </Router>
  );
}

export default App;
