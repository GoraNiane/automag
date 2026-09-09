import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, ChevronRight, Heart, CheckCircle2
} from 'lucide-react';
import { useMockStore } from '../store/mockStore';
import { motion } from 'framer-motion';
import heroBanner from '../assets/hero-banner.jpg';

const STOCK_GROUPS = [
  { name: 'Disponible immédiatement', value: 'Disponible', icon: '📍', description: 'En stock physique dans notre showroom à Dakar, prêts pour livraison immédiate.', image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sous douane', value: 'Sous douane', icon: '⚓', description: 'Véhicules déjà arrivés au Sénégal, en cours de dédouanement réglementaire.', image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sur commande', value: 'Sur commande', icon: '✈️', description: 'Importation sur mesure depuis l\'Europe ou les USA selon votre cahier des charges.', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400' }
];

export default function Home() {
  const navigate = useNavigate();
  const { vehicles, listings, favorites, toggleFavorite } = useMockStore();

  // Search form state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [year, setYear] = useState('');

  // Extract unique brands from vehicles
  const uniqueBrands = Array.from(new Set(vehicles.map(v => v.brand))).sort();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (model) params.set('model', model);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (year) params.set('yearMin', year);
    navigate(`/voitures?${params.toString()}`);
  };

  // Get active listings that are published
  const publishedListings = listings.filter(l => l.status === 'Publiée');
  const featuredVehicles = vehicles
    .filter(v => publishedListings.some(l => l.vehicleId === v.id) && v.isFeatured)
    .slice(0, 4);

  const getCountForGroup = (availability: string) => {
    return vehicles.filter(v => v.availability === availability).length;
  };

  return (
    <div className="space-y-12 md:space-y-20 pb-20 w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full bg-slate-950 overflow-hidden">
        {/* Background Image Container with Full Photo Framing */}
        <div className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[620px] xl:min-h-[680px] w-full flex flex-col justify-between pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-36">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src={heroBanner} 
              alt="Véhicules d'occasion AutoElite Sénégal" 
              className="w-full h-full object-cover object-[center_60%] sm:object-center select-none" 
              fetchPriority="high"
            />
            {/* Cinematic Gradient Overlays to preserve both text readability and car visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/90 lg:from-black/75 lg:via-black/30 lg:to-black/85" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
            <div className="max-w-2xl space-y-4 sm:space-y-6">
              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white inline-flex items-center gap-1.5 border border-white/20 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Concessionnaire Automobile Premium
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.15]"
              >
                Découvrez nos véhicules <span className="text-white font-light italic">d'occasion</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-lg font-light"
              >
                Trouvez votre véhicule idéal disponible immédiatement, sous douane ou importé sur commande selon vos exigences.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3 pt-1"
              >
                <Link to="/voitures" className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-xl shadow-black/40">
                  <span>Parcourir le catalogue</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Quick Search Panel (Desktop: Absolute overlap, Mobile: Integrated Clean Card) */}
        <div className="relative -mt-8 sm:-mt-10 lg:mt-0 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:transform lg:translate-y-1/2 z-20 max-w-5xl mx-auto px-4">
          <form 
            onSubmit={handleSearch}
            className="bg-white border border-slate-200/80 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end"
          >
            <div>
              <label className="form-label text-[11px] font-bold text-slate-700">Marque</label>
              <select 
                value={brand}
                onChange={(e) => { setBrand(e.target.value); setModel(''); }}
                className="form-input bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm"
              >
                <option value="">Toutes les marques</option>
                {uniqueBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label text-[11px] font-bold text-slate-700">Modèle</label>
              <input 
                type="text" 
                placeholder="Ex: Classe C, Tucson..." 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="form-input bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm"
              />
            </div>
            
            <div>
              <label className="form-label text-[11px] font-bold text-slate-700">Budget Max (FCFA)</label>
              <input 
                type="number" 
                placeholder="Ex: 20 000 000" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-input bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="form-label text-[11px] font-bold text-slate-700">Année Min</label>
              <input 
                type="number" 
                placeholder="Ex: 2020" 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="form-input bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm"
              />
            </div>

            <div>
              <button type="submit" className="w-full btn-primary h-[42px] py-0 text-xs sm:text-sm font-bold shadow-md">
                <Search className="w-4 h-4" /> <span>Rechercher</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Spacer for desktop floating search bar */}
      <div className="hidden lg:block h-14 xl:h-20" />

      {/* Scroll animation variants */}
      {(() => {
        const containerVariants = {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08
            }
          }
        };

        const itemVariants = {
          hidden: { opacity: 0, y: 30 },
          show: { 
            opacity: 1, 
            y: 0, 
            transition: { 
              type: "spring" as const, 
              stiffness: 70, 
              damping: 15,
              duration: 0.6
            } 
          }
        };

        return (
          <>
            {/* Stock Groups Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-xl mx-auto space-y-2"
              >
                <h2 className="text-3xl font-display font-bold text-slate-900">Catégories de notre Stock</h2>
                <p className="text-slate-500 text-sm">Trouvez le véhicule correspondant à vos critères de disponibilité.</p>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, margin: "-80px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {STOCK_GROUPS.map((group) => {
                  const count = getCountForGroup(group.value);
                  return (
                    <motion.div key={group.name} variants={itemVariants}>
                      <Link 
                        to={`/recherche?availability=${group.value}`}
                        className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 block"
                      >
                        <img 
                          src={group.image} 
                          alt={group.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/80 transition-colors" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                          <div className="flex justify-between items-start">
                            <span className="text-3xl p-3 bg-white/10 backdrop-blur-md rounded-2xl">{group.icon}</span>
                            <span className="bg-white/10 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                              {count} {count > 1 ? 'Véhicules' : 'Véhicule'}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <h3 className="font-bold text-xl">{group.name}</h3>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">{group.description}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>

            {/* Featured Vehicles Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex justify-between items-end"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold text-slate-900">Véhicules récents à la une</h2>
                  <p className="text-slate-500 text-sm">Découvrez nos dernières annonces exposées en vedette.</p>
                </div>
                <Link to="/voitures" className="text-accent-700 hover:text-accent-800 font-bold text-sm flex items-center gap-1">
                  Tout voir <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, margin: "-80px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {featuredVehicles.map(vehicle => {
                  const isFav = favorites.includes(vehicle.id);
                  return (
                    <motion.div key={vehicle.id} variants={itemVariants} className="h-full">
                      <div className="premium-card group flex flex-col h-full">
                        {/* Photo Container */}
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img 
                            src={vehicle.primaryImage} 
                            alt={`${vehicle.brand} ${vehicle.model}`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {vehicle.condition === 'Neuf' && (
                              <span className="bg-black text-white text-[9px] font-bold px-2.5 py-0.5 border border-black uppercase tracking-wider rounded-full">
                                Nouveau
                              </span>
                            )}
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
                              {vehicle.availability?.toUpperCase() || ''}
                            </span>
                          </div>
                          
                          {/* Favorite button */}
                          <button 
                            onClick={() => toggleFavorite(vehicle.id)}
                            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow transition-all duration-200"
                          >
                            <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-accent-700 text-accent-700' : 'text-slate-600'}`} />
                          </button>
                        </div>

                        {/* Info Container */}
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-1">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{vehicle.brand}</span>
                            <h3 className="font-bold text-lg text-slate-800 leading-snug group-hover:text-accent-700 transition-colors">
                              <Link to={`/voitures/${vehicle.id}`}>{vehicle.model}</Link>
                            </h3>
                          </div>

                          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-50 text-[11px] text-slate-500 font-medium">
                            <span className="text-center">{vehicle.year}</span>
                            <span className="text-center border-x border-slate-100">{vehicle.fuel}</span>
                            <span className="text-center truncate">{vehicle.transmission}</span>
                          </div>

                          <div className="flex justify-between items-end pt-2">
                            <div>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Prix</span>
                              <span className="text-accent-700 font-display font-extrabold text-base">
                                {vehicle.price.toLocaleString('fr-FR')} <span className="text-xs font-semibold">FCFA</span>
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
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>

            {/* Simple Showcase info banner */}
            <section className="bg-slate-950 text-white py-20 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="space-y-6"
                >
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest font-mono">AutoElite</span>
                  <h2 className="text-4xl font-display font-extrabold tracking-tight">Votre partenaire de confiance pour l'achat de voitures au Sénégal</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Nous proposons un catalogue de véhicules rigoureusement sélectionnés et inspectés. Que vous recherchiez un véhicule disponible immédiatement à Dakar, sous douane en cours d'immatriculation ou que vous souhaitiez commander un véhicule sur mesure importé d'Europe ou des USA, notre équipe vous accompagne dans chaque étape.
                  </p>

                  <div className="space-y-4 pt-4 text-xs font-semibold">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span>Fiches descriptives complètes et photos réelles.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span>Accompagnement personnalisé et contact direct avec notre conseiller.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span>Garantie de qualité et service de livraison à Dakar et dans tout le pays.</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="relative"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800" 
                    alt="Luxury car details" 
                    className="rounded-2xl shadow-2xl brightness-90 border border-slate-800"
                  />
                </motion.div>
              </div>
            </section>
          </>
        );
      })()}
    </div>
  );
}
