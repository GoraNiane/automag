import React from 'react';
import { useMockStore } from '../store/mockStore';
import { 
  Car, Anchor, Clock, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { vehicles } = useMockStore();

  const totalListings = vehicles.length;
  const inStockCount = vehicles.filter(v => v.availability === 'Disponible').length;
  const sousDouaneCount = vehicles.filter(v => v.availability === 'Sous douane').length;
  const surCommandeCount = vehicles.filter(v => v.availability === 'Sur commande').length;

  // Latest 4 added vehicles
  const latestVehicles = [...vehicles].slice(-4).reverse();

  return (
    <div className="space-y-10 animate-fade-in text-black">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-black">Tableau de Bord Admin</h1>
        <p className="text-xs text-black/60 mt-1">Supervision globale du parc automobile et de la disponibilité du stock.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Stock */}
        <div className="bg-white border border-black/5 p-6 rounded-2xl flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div>
            <span className="block text-[10px] text-black/50 font-bold uppercase tracking-wider text-slate-500">Total Stock</span>
            <span className="block text-3xl font-display font-black text-black mt-1">{totalListings}</span>
            <span className="text-[10px] text-emerald-600 font-extrabold underline">{inStockCount} disponibles</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white">
            <Car className="w-6 h-6" />
          </div>
        </div>

        {/* Sous Douane */}
        <div className="bg-white border border-black/5 p-6 rounded-2xl flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div>
            <span className="block text-[10px] text-black/50 font-bold uppercase tracking-wider text-slate-500">Sous Douane</span>
            <span className="block text-3xl font-display font-black text-black mt-1">{sousDouaneCount}</span>
            <span className="text-[10px] text-amber-600 font-semibold">En cours de dédouanement</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white">
            <Anchor className="w-6 h-6" />
          </div>
        </div>

        {/* Sur Commande */}
        <div className="bg-white border border-black/5 p-6 rounded-2xl flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div>
            <span className="block text-[10px] text-black/50 font-bold uppercase tracking-wider text-slate-500">Sur Commande</span>
            <span className="block text-3xl font-display font-black text-black mt-1">{surCommandeCount}</span>
            <span className="text-[10px] text-blue-600 font-semibold">Importation à la demande</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Latest Stock */}
      <div className="bg-white border border-black/5 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
        <div className="flex justify-between items-center border-b border-black/5 pb-3">
          <h3 className="font-bold text-sm text-black uppercase tracking-wider">Dernières entrées en stock</h3>
          <Link to="/admin/vehicules" className="text-xs text-black font-extrabold hover:underline flex items-center gap-0.5">
            Gérer le stock <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestVehicles.length === 0 ? (
          <div className="py-8 text-center text-xs text-black/50 font-bold">
            Aucun véhicule en stock pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-black/5 animate-fade-in">
            {latestVehicles.map(car => {
              return (
                <div key={car.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <img src={car.primaryImage} alt={car.model} className="w-16 h-10 rounded-lg border border-black/5 object-cover" />
                    <div>
                      <span className="block font-black text-black text-xs">{car.brand} {car.model}</span>
                      <span className="text-[10px] text-black/60">Prix: {car.price.toLocaleString()} FCFA • Ville: {car.location} • Année: {car.year}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-full border shadow-sm ${
                      car.availability === 'Disponible' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : car.availability === 'Sous douane'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {car.availability}
                    </span>
                    <Link 
                      to={`/voitures/${car.id}`}
                      className="px-3.5 py-1.5 bg-black hover:bg-black/90 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Voir la fiche <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
