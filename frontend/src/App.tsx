import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Categories from './pages/Categories';
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Legals from './pages/Legals';
import Login from './pages/Login';

// Admin Panel Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminVehicles from './pages/AdminVehicles';
import AdminNewListing from './pages/AdminNewListing';
import AdminListings from './pages/AdminListings';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';

import { useMockStore } from './store/mockStore';

export default function App() {
  const { fetchCatalog } = useMockStore();
  React.useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return (
    <>

      <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/voitures" element={<Cars />} />
          <Route path="/voitures/:id" element={<CarDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/recherche" element={<Cars />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/conditions" element={<Legals />} />
          <Route path="/confidentialite" element={<Legals />} />
          <Route path="/cookies" element={<Legals />} />
          <Route path="/mentions-legales" element={<Legals />} />
          <Route path="/connexion" element={<Login />} />
        </Route>

        {/* Admin Dashboard Workspace (Protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="vehicules" element={<AdminVehicles />} />
          <Route path="vehicules/nouveau" element={<AdminNewListing />} />
          <Route path="vehicules/modifier/:id" element={<AdminNewListing />} />
          <Route path="parametres" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
}
