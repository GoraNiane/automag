import React, { useState } from 'react';
import { useMockStore } from '../store/mockStore';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, Trash2, ShieldAlert } from 'lucide-react';
import { ListingStatus } from '../types';

export default function AdminListings() {
  const { listings, vehicles, updateListingStatus, deleteListing, users } = useMockStore();

  const [activeTab, setActiveTab] = useState<'Toutes' | 'En attente' | 'Publiées' | 'Refusées' | 'Vendue'>('Toutes');

  const filteredListings = listings.filter(l => {
    if (activeTab === 'Toutes') return true;
    if (activeTab === 'En attente') return l.status === 'En attente';
    if (activeTab === 'Publiées') return l.status === 'Publiée';
    if (activeTab === 'Refusées') return l.status === 'Refusée';
    if (activeTab === 'Vendue') return l.status === 'Vendue';
    return true;
  });

  const getStatusBadgeClass = (status: ListingStatus) => {
    switch (status) {
      case 'Publiée': return 'bg-black text-white border border-black rounded-full';
      case 'En attente': return 'bg-white text-black border border-black rounded-full';
      case 'Vendue': return 'bg-white text-black/40 border border-black/15 rounded-full';
      case 'Refusée': return 'bg-white text-black/35 border border-black/15 line-through rounded-full';
      default: return 'bg-white text-black border border-black/10 rounded-full';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-black">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-black">Gestion des Annonces</h1>
        <p className="text-xs text-black/60 mt-1">Gérez les publications d'annonces automobiles affichées sur le catalogue public.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-black/5 pb-3">
        {(['Toutes', 'En attente', 'Publiées', 'Refusées', 'Vendue'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-black text-white border-black shadow-sm' 
                : 'text-black/60 hover:text-black border-black/5 bg-white hover:bg-black/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        {filteredListings.length === 0 ? (
          <div className="p-12 text-center text-xs text-black/50 font-bold space-y-2">
            <ShieldAlert className="w-8 h-8 text-black mx-auto" />
            <p>Aucune annonce ne correspond à ce filtre.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/5 text-black/70 uppercase font-bold border-b border-black/5">
                  <th className="p-4">Annonce ID</th>
                  <th className="p-4">Véhicule</th>
                  <th className="p-4">Auteur (Vendeur)</th>
                  <th className="p-4">Date de dépôt</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredListings.map(l => {
                  const car = vehicles.find(v => v.id === l.vehicleId);
                  const seller = users.find(u => u.id === l.sellerId);
                  if (!car) return null;

                  return (
                    <tr key={l.id} className="hover:bg-black/5 text-black transition-colors">
                      <td className="p-4 font-mono font-bold text-[10px] text-black/40">{l.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={car.primaryImage} alt={car.model} className="w-12 h-8 rounded-lg border border-black/5 object-cover" />
                          <div>
                            <span className="block font-bold text-black">{car.brand} {car.model}</span>
                            <span className="text-[9px] text-black/50">{car.price.toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {seller ? (
                          <div>
                            <span className="block font-bold text-black">{seller.firstName} {seller.lastName}</span>
                            <span className="text-[9px] text-black/50">{seller.email}</span>
                          </div>
                        ) : 'Inconnu'}
                      </td>
                      <td className="p-4 text-black/60">{new Date(l.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${getStatusBadgeClass(l.status)}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2.5">
                          <Link to={`/voitures/${car.id}`} className="rounded-lg p-1.5 bg-black/5 hover:bg-black hover:text-white transition-all text-black/60" title="Voir l'annonce">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {l.status === 'En attente' && (
                            <>
                              <button 
                                onClick={() => updateListingStatus(l.id, 'Publiée')}
                                className="rounded-lg p-1.5 bg-black hover:bg-black/90 text-white transition-all cursor-pointer"
                                title="Approuver"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => updateListingStatus(l.id, 'Refusée')}
                                className="rounded-lg p-1.5 bg-white hover:bg-black/5 text-black/70 border border-black/10 hover:border-black transition-all cursor-pointer"
                                title="Rejeter"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => deleteListing(l.id)}
                            className="rounded-lg p-1.5 bg-black/5 hover:bg-red-500 hover:text-white text-black/50 transition-all cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
