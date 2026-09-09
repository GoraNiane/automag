import React from 'react';
import toast from 'react-hot-toast';
import { useMockStore } from '../store/mockStore';
import { Trash2, Eye, MapPin, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminVehicles() {
  const { vehicles, listings, deleteListing } = useMockStore();

  const handleDelete = async (vehicleId: string) => {
    const listing = listings.find(l => l.vehicleId === vehicleId);
    if (listing) {
      if (confirm('Voulez-vous vraiment supprimer ce véhicule et son annonce du système ?')) {
        try {
          await deleteListing(listing.id);
          toast.success('Véhicule supprimé avec succès.');
        } catch {
          toast.error('Erreur lors de la suppression.');
        }
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Gestion des Véhicules</h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualisez l'ensemble du parc automobile enregistré, modifiez les catégories et caractéristiques, ou supprimez des fiches obsolètes.
          </p>
        </div>
        <Link to="/admin/vehicules/nouveau" className="btn-primary py-2 px-5 text-xs bg-black text-white hover:bg-black/90">
          Ajouter un véhicule
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <th className="p-4">Véhicule</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Prix</th>
                <th className="p-4">Année</th>
                <th className="p-4">Kilométrage</th>
                <th className="p-4">Localisation</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/50 text-slate-700 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={v.primaryImage} alt={v.model} className="w-12 h-8 rounded object-cover border border-slate-100" />
                      <div>
                        <span className="block font-bold text-slate-900">{v.brand}</span>
                        <span className="text-[10px] text-slate-400">{v.model} ({v.condition})</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-full border shadow-xs ${
                      v.availability === 'Disponible' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : v.availability === 'Sous douane'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {v.availability}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{v.price.toLocaleString()} FCFA</td>
                  <td className="p-4 text-slate-650">{v.year}</td>
                  <td className="p-4 text-slate-650">{v.mileage.toLocaleString()} km</td>
                  <td className="p-4 text-slate-650">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {v.location}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={`/voitures/${v.id}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded transition-all flex items-center justify-center"
                        title="Voir fiche publique"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <Link 
                        to={`/admin/vehicules/modifier/${v.id}`} 
                        className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded transition-all flex items-center justify-center"
                        title="Modifier la fiche"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(v.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all flex items-center justify-center cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
