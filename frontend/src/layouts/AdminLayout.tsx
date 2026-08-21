import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  Shield, Car, FileText, Users, 
  Settings, LogOut, ChevronLeft, LayoutDashboard, PlusCircle
} from 'lucide-react';
import { useMockStore } from '../store/mockStore';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useMockStore();

  React.useEffect(() => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      navigate('/connexion');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Tableau de bord', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Gestion du Stock', to: '/admin/vehicules', icon: Car },
    { label: 'Ajouter un véhicule', to: '/admin/vehicules/nouveau', icon: PlusCircle },
    { label: 'Paramètres Généraux', to: '/admin/parametres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Top Banner Control Panel */}
      <div className="bg-black border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-none">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> Voir le site public
          </Link>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <span className="font-display font-bold tracking-wider text-sm uppercase text-white">
              AutoElite Admin Control Panel
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-xs font-bold text-white">{currentUser.firstName} {currentUser.lastName}</span>
            <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Super Administrator</span>
          </div>
          <img 
            src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} 
            alt="admin avatar" 
            className="w-10 h-10 rounded-full object-cover border border-white/20" 
          />
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-black border-r border-white/10 p-6 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="pb-6 border-b border-white/10 flex items-center gap-2">
              <span className="text-xl font-display font-bold tracking-tight text-white">
                AUTO<span className="font-light text-white/80">ELITE</span>
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-white/10 text-white/95 rounded-full uppercase font-bold tracking-widest font-mono">
                System
              </span>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink 
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-black border border-white shadow-sm' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Logout */}
          <div className="pt-6 border-t border-white/10 mt-8">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-white hover:bg-white/10 border border-white/10 hover:border-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full text-black bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
