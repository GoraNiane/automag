import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Filter, Grid, SlidersHorizontal, Heart, MapPin, 
  RefreshCw, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { useMockStore } from '../store/mockStore';
import { FuelType, TransmissionType, BodyType, AvailabilityType } from '../types';

export default function Cars() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicles, listings, favorites, toggleFavorite } = useMockStore();

  // Mobile filters panel toggle
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read URL query params on mount/change
  const searchParams = new URLSearchParams(location.search);
  
  // Filter States
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [model, setModel] = useState(searchParams.get('model') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [yearMin, setYearMin] = useState(searchParams.get('yearMin') || '');
  const [yearMax, setYearMax] = useState(searchParams.get('yearMax') || '');
  const [fuel, setFuel] = useState(searchParams.get('fuel') || '');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '');
  const [bodyType, setBodyType] = useState(searchParams.get('bodyType') || '');
  const [carLocation, setCarLocation] = useState(searchParams.get('location') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [availability, setAvailability] = useState(searchParams.get('availability') || '');
  
  // Sort State
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recent');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state with URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setBrand(params.get('brand') || '');
    setModel(params.get('model') || '');
    setMinPrice(params.get('minPrice') || '');
    setMaxPrice(params.get('maxPrice') || '');
    setYearMin(params.get('yearMin') || '');
    setYearMax(params.get('yearMax') || '');
    setFuel(params.get('fuel') || '');
    setTransmission(params.get('transmission') || '');
    setBodyType(params.get('bodyType') || '');
    setCarLocation(params.get('location') || '');
    setCondition(params.get('condition') || '');
    setAvailability(params.get('availability') || '');
    setSortBy(params.get('sortBy') || 'recent');
    setCurrentPage(1); // reset to page 1 on query change
  }, [location.search]);

  // Handle filter changes and push to URL
  const applyFilters = (updatedParams: Record<string, string>) => {
    const currentParams = new URLSearchParams(location.search);
    
    Object.entries(updatedParams).forEach(([key, val]) => {
      if (val) {
        currentParams.set(key, val);
      } else {
        currentParams.delete(key);
      }
    });

    navigate({
      pathname: location.pathname,
      search: currentParams.toString()
    });
  };

  const handleReset = () => {
    setBrand('');
    setModel('');
    setMinPrice('');
    setMaxPrice('');
    setYearMin('');
    setYearMax('');
    setFuel('');
    setTransmission('');
    setBodyType('');
    setCarLocation('');
    setCondition('');
    setAvailability('');
    setSortBy('recent');
    navigate(location.pathname);
  };

  // Filter listings
  const publishedListings = listings.filter(l => l.status === 'Publiée');
  
  const filteredVehicles = vehicles.filter(v => {
    // Must be in active published listings
    const hasListing = publishedListings.some(l => l.vehicleId === v.id);
    if (!hasListing) return false;

    // Apply filters
    if (brand && v.brand.toLowerCase() !== brand.toLowerCase()) return false;
    if (model && !v.model.toLowerCase().includes(model.toLowerCase())) return false;
    if (minPrice && v.price < parseInt(minPrice)) return false;
    if (maxPrice && v.price > parseInt(maxPrice)) return false;
    if (yearMin && v.year < parseInt(yearMin)) return false;
    if (yearMax && v.year > parseInt(yearMax)) return false;
    if (fuel && v.fuel !== fuel) return false;
    if (transmission && v.transmission !== transmission) return false;
    if (bodyType && v.bodyType !== bodyType) return false;
    if (carLocation && v.location.toLowerCase() !== carLocation.toLowerCase()) return false;
    if (condition && v.condition !== condition) return false;
    if (availability && v.availability !== availability) return false;

    return true;
  });

  // Sort listings
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    const listingA = listings.find(l => l.vehicleId === a.id);
    const listingB = listings.find(l => l.vehicleId === b.id);
    const dateA = listingA ? new Date(listingA.createdAt).getTime() : 0;
    const dateB = listingB ? new Date(listingB.createdAt).getTime() : 0;

    switch (sortBy) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'mileage':
        return a.mileage - b.mileage;
      case 'popular':
        return (listingB?.views || 0) - (listingA?.views || 0);
      case 'recent':
      default:
        return dateB - dateA;
    }
  });

  // Pagination logic
  const totalItems = sortedVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedVehicles = sortedVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Extract unique filter dropdown values from database
  const brands = Array.from(new Set(vehicles.map(v => v.brand)));
  const locations = Array.from(new Set(vehicles.map(v => v.location)));

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent-700" /> Filtres de recherche
        </span>
        <button 
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-accent-700 font-semibold transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Réinitialiser
        </button>
      </div>

      {/* Brand */}
      <div className="space-y-1.5">
        <label className="form-label">Marque</label>
        <select 
          value={brand}
          onChange={(e) => applyFilters({ brand: e.target.value })}
          className="form-input"
        >
          <option value="">Toutes les marques</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Availability (Stock Category) */}
      <div className="space-y-1.5">
        <label className="form-label font-bold text-slate-700">Catégorie de Stock</label>
        <select 
          value={availability} 
          onChange={(e) => applyFilters({ availability: e.target.value })}
          className="form-input"
        >
          <option value="">Tous les véhicules</option>
          <option value="Disponible">Disponible immédiatement</option>
          <option value="Sous douane">Sous douane</option>
          <option value="Sur commande">Sur commande</option>
        </select>
      </div>

      {/* Model */}
      <div className="space-y-1.5">
        <label className="form-label">Modèle</label>
        <input 
          type="text" 
          placeholder="Ex: RAV4, Classe C..." 
          value={model}
          onChange={(e) => setModel(e.target.value)}
          onBlur={() => applyFilters({ model })}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters({ model })}
          className="form-input"
        />
      </div>

      {/* Price Range */}
      <div className="space-y-1.5">
        <label className="form-label">Prix (FCFA)</label>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => applyFilters({ minPrice })}
            className="form-input"
          />
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => applyFilters({ maxPrice })}
            className="form-input"
          />
        </div>
      </div>

      {/* Year Range */}
      <div className="space-y-1.5">
        <label className="form-label">Année</label>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={yearMin}
            onChange={(e) => setYearMin(e.target.value)}
            onBlur={() => applyFilters({ yearMin })}
            className="form-input"
          />
          <input 
            type="number" 
            placeholder="Max" 
            value={yearMax}
            onChange={(e) => setYearMax(e.target.value)}
            onBlur={() => applyFilters({ yearMax })}
            className="form-input"
          />
        </div>
      </div>

      {/* Fuel Type */}
      <div className="space-y-1.5">
        <label className="form-label">Carburant</label>
        <select 
          value={fuel} 
          onChange={(e) => applyFilters({ fuel: e.target.value })}
          className="form-input"
        >
          <option value="">Tous les carburants</option>
          <option value="Essence">Essence</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybride">Hybride</option>
          <option value="Électrique">Électrique</option>
          <option value="GPL">GPL</option>
        </select>
      </div>

      {/* Transmission */}
      <div className="space-y-1.5">
        <label className="form-label">Transmission</label>
        <select 
          value={transmission} 
          onChange={(e) => applyFilters({ transmission: e.target.value })}
          className="form-input"
        >
          <option value="">Toutes</option>
          <option value="Manuelle">Manuelle</option>
          <option value="Automatique">Automatique</option>
        </select>
      </div>

      {/* Body Type */}
      <div className="space-y-1.5">
        <label className="form-label">Carrosserie</label>
        <select 
          value={bodyType} 
          onChange={(e) => applyFilters({ bodyType: e.target.value })}
          className="form-input"
        >
          <option value="">Toutes les carrosseries</option>
          <option value="Citadine">Citadine</option>
          <option value="Berline">Berline</option>
          <option value="SUV">SUV</option>
          <option value="4x4">4x4</option>
          <option value="Coupé">Coupé</option>
          <option value="Cabriolet">Cabriolet</option>
          <option value="Utilitaire">Utilitaire</option>
          <option value="Camionnette">Camionnette</option>
        </select>
      </div>

      {/* Condition */}
      <div className="space-y-1.5">
        <label className="form-label">État du véhicule</label>
        <select 
          value={condition} 
          onChange={(e) => applyFilters({ condition: e.target.value })}
          className="form-input"
        >
          <option value="">Tous</option>
          <option value="Neuf">Neuf</option>
          <option value="Occasion Europe">Occasion Europe</option>
          <option value="Occasion Sénégal">Occasion Sénégal</option>
        </select>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <label className="form-label">Localisation</label>
        <select 
          value={carLocation} 
          onChange={(e) => applyFilters({ location: e.target.value })}
          className="form-input"
        >
          <option value="">Toutes les villes</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
    </div>
  );

  let pageTitle = location.pathname === '/recherche' ? 'Recherche Avancée' : 'Catalogue de Véhicules';
  let pageDesc = `${totalItems} ${totalItems > 1 ? 'véhicules disponibles' : 'véhicule disponible'} au Sénégal`;

  if (availability === 'Disponible') {
    pageTitle = `Véhicules disponibles (${totalItems})`;
    pageDesc = "Découvrez notre stock de véhicules immédiatement disponibles à l'achat dans notre showroom à Dakar. Prêts pour livraison immédiate.";
  } else if (availability === 'Sous douane') {
    pageTitle = `Véhicules sous douane (${totalItems})`;
    pageDesc = "Découvrez nos véhicules déjà présents sur le territoire sénégalais mais non encore dédouanés. Une opportunité d'achat à tarif préférentiel.";
  } else if (availability === 'Sur commande') {
    pageTitle = `Véhicules sur commande (${totalItems})`;
    pageDesc = "Découvrez nos véhicules disponibles à l'importation sur mesure selon votre cahier des charges et vos critères spécifiques.";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-6">
        {/* Title / Info banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-slate-900">
              {pageTitle}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {pageDesc}
            </p>
          </div>
          
          {/* Sorting and Mobile toggles */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => applyFilters({ sortBy: e.target.value })}
              className="form-input w-full sm:w-48 text-xs font-semibold"
            >
              <option value="recent">Plus récent</option>
              <option value="priceAsc">Prix croissant</option>
              <option value="priceDesc">Prix décroissant</option>
              <option value="mileage">Kilométrage</option>
              <option value="popular">Annonces populaires</option>
            </select>
            
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-lg text-xs font-semibold"
            >
              <Filter className="w-4 h-4" /> Filtres
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8">
          {/* Desktop Filters panel */}
          <aside className="hidden lg:block w-72 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm h-fit">
            <FiltersContent />
          </aside>

          {/* Listings Grid */}
          <div className="flex-grow space-y-8">
            {paginatedVehicles.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                <span className="text-4xl">🔍</span>
                <h3 className="font-bold text-lg text-slate-800">
                  {availability 
                    ? "Aucun véhicule disponible dans cette catégorie pour le moment." 
                    : "Aucun résultat trouvé"
                  }
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {availability 
                    ? "Nous n'avons actuellement aucun véhicule sous ce statut. Parcourez l'ensemble de notre catalogue pour trouver votre bonheur."
                    : "Nous n'avons pas trouvé de véhicule correspondant à vos critères. Modifiez vos filtres ou réinitialisez la recherche."
                  }
                </p>
                <button 
                  onClick={handleReset}
                  className="btn-primary py-2 px-6 text-xs mx-auto"
                >
                  {availability ? "Voir tous les véhicules" : "Réinitialiser les filtres"}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedVehicles.map(vehicle => {
                    const isFav = favorites.includes(vehicle.id);
                    return (
                      <div key={vehicle.id} className="premium-card group flex flex-col h-full bg-white">
                        {/* Image */}
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                          <img 
                            src={vehicle.primaryImage} 
                            alt={`${vehicle.brand} ${vehicle.model}`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <span 
                              className="text-[9px] font-bold px-2.5 py-0.5 uppercase tracking-wider rounded-full border shadow-sm"
                              style={
                                vehicle.availability === 'Disponible' 
                                  ? { backgroundColor: '#e6fffa', color: '#047481', borderColor: '#b2f5ea' }
                                  : vehicle.availability === 'Sous douane'
                                  ? { backgroundColor: '#fffbeb', color: '#d97706', borderColor: '#fef3c7' }
                                  : { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#dbeafe' }
                              }
                            >
                              {vehicle.availability.toUpperCase()}
                            </span>
                            {vehicle.condition === 'Neuf' && (
                              <span className="bg-black text-white text-[9px] font-bold px-2.5 py-0.5 border border-black uppercase tracking-wider rounded-full">
                                Neuf
                              </span>
                            )}
                          </div>
                          
                          <button 
                            onClick={() => toggleFavorite(vehicle.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-black hover:text-white border border-black/5 hover:scale-105 backdrop-blur-md transition-all duration-300 rounded-full shadow-sm cursor-pointer"
                          >
                            <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-black text-black' : 'text-black/60'}`} />
                          </button>
                        </div>

                        {/* Details */}
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-1">
                            <span className="text-xs text-black/50 font-bold uppercase tracking-wider">{vehicle.brand}</span>
                            <h3 className="font-bold text-base text-black leading-snug group-hover:underline transition-colors">
                              <Link to={`/voitures/${vehicle.id}`}>{vehicle.model}</Link>
                            </h3>
                          </div>

                          <div className="grid grid-cols-3 gap-2 py-1.5 border-y border-slate-50 text-[10px] text-slate-500 font-medium">
                            <span className="text-center">{vehicle.year}</span>
                            <span className="text-center border-x border-slate-100">{vehicle.fuel}</span>
                            <span className="text-center truncate">{vehicle.transmission}</span>
                          </div>

                          <div className="flex justify-between items-end pt-3 border-t border-slate-50">
                            <div>
                              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Prix</span>
                              <span className="text-accent-700 font-display font-extrabold text-sm">
                                {vehicle.price.toLocaleString('fr-FR')} <span className="text-[10px] font-semibold">FCFA</span>
                              </span>
                            </div>
                            <Link 
                              to={`/voitures/${vehicle.id}`}
                              className="text-[10px] font-bold text-black hover:underline flex items-center gap-0.5 border border-black/5 rounded-lg px-2.5 py-1.5 bg-black/5 hover:bg-black hover:text-white transition-all duration-200"
                            >
                              Voir détails
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button 
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                          currentPage === page 
                            ? 'bg-accent-700 text-white shadow-sm' 
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters slide-in overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative w-80 bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between animate-slide-up">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-800 text-sm">Filtres</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FiltersContent />
            </div>
            <button 
              onClick={() => setMobileFiltersOpen(false)}
              className="btn-primary w-full mt-6 py-2.5"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
