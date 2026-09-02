import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages (Lazy Loaded for fast initial load)
const Home = lazy(() => import('./pages/Home'));
const Cars = lazy(() => import('./pages/Cars'));
const CarDetails = lazy(() => import('./pages/CarDetails'));
const Categories = lazy(() => import('./pages/Categories'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Legals = lazy(() => import('./pages/Legals'));
const Login = lazy(() => import('./pages/Login'));

// Admin Panel Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminVehicles = lazy(() => import('./pages/AdminVehicles'));
const AdminNewListing = lazy(() => import('./pages/AdminNewListing'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));

import { useMockStore } from './store/mockStore';

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-black" />
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Chargement...</span>
    </div>
  );
}

export default function App() {
  const { fetchCatalog } = useMockStore();
  React.useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#09090b',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }
        }} 
      />

      <Router>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </Router>
    </>
  );
}
