import React from 'react';
import { Link } from 'react-router-dom';
import { useMockStore } from '../store/mockStore';
import { ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { 
    name: 'Disponibles', 
    value: 'Disponible',
    icon: '📍', 
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600', 
    desc: 'Véhicules immédiatement disponibles à l\'achat dans notre showroom à Dakar. Prêts pour livraison immédiate sans délai.' 
  },
  { 
    name: 'Sous douane', 
    value: 'Sous douane',
    icon: '⚓', 
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600', 
    desc: 'Véhicules déjà présents sur le territoire sénégalais mais non encore dédouanés. Une opportunité d\'achat à tarif préférentiel.' 
  },
  { 
    name: 'Sur commande', 
    value: 'Sur commande',
    icon: '✈️', 
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600', 
    desc: 'Véhicules non présents en stock physique, importés sur mesure selon votre cahier des charges et vos critères spécifiques.' 
  }
];

export default function Categories() {
  const { vehicles, listings } = useMockStore();
  const publishedListings = listings.filter(l => l.status === 'Publiée');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900">Catégories de Stock</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explorez notre parc automobile selon les critères de disponibilité de nos véhicules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => {
          const count = vehicles.filter(v => 
            v.availability === cat.value && 
            publishedListings.some(l => l.vehicleId === v.id)
          ).length;

          return (
            <div key={cat.name} className="premium-card group bg-white flex flex-col h-full border border-black/5 hover:border-black/10 transition-all rounded-2xl overflow-hidden">
              {/* Photo */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/50 transition-colors" />
                <div className="absolute top-4 left-4 text-3xl p-3 bg-white/10 backdrop-blur-md rounded-2xl">{cat.icon}</div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-xs bg-black text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {count} {count > 1 ? 'Véhicules' : 'Véhicule'}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-slate-900 group-hover:text-black transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
                </div>
                
                <Link 
                  to={`/recherche?availability=${cat.value}`} 
                  className="text-xs font-bold text-black hover:underline flex items-center gap-1 self-start"
                >
                  Consulter les annonces <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
