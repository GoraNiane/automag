import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, Share2, MapPin, Calendar, Gauge, Fuel, 
  Settings, Maximize, Check, Phone, Mail, 
  MessageSquare, Send, CheckCircle 
} from 'lucide-react';
import { useMockStore } from '../store/mockStore';
import { WHATSAPP_SELLER_NUMBER, getWhatsAppLink } from '../config/whatsapp';

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const { 
    vehicles, listings, favorites, toggleFavorite, 
    addContactRequest, currentUser, getSellerByListingId 
  } = useMockStore();

  const vehicle = vehicles.find(v => v.id === id);
  const isFav = favorites.includes(id || '');

  // Slide index
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Form Booking Contact / Message
  const [name, setName] = useState(currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [message, setMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-2xl font-bold text-slate-800">Véhicule introuvable</h2>
        <p className="text-slate-500">Le véhicule demandé n'existe pas ou a été supprimé.</p>
        <Link to="/voitures" className="btn-primary inline-flex">Retour au catalogue</Link>
      </div>
    );
  }

  // Get listing detail for views/seller
  const listing = listings.find(l => l.vehicleId === vehicle.id);
  const seller = listing ? getSellerByListingId(listing.sellerId) : null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    addContactRequest({
      name,
      email,
      phone,
      subject: `Intérêt pour ${vehicle.brand} ${vehicle.model}`,
      message
    });

    setContactSuccess(true);
    setMessage('');
    setTimeout(() => {
      setContactSuccess(false);
    }, 5000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Lien de l\'annonce copié dans le presse-papiers !');
  };

  // Find similar cars
  const similarCars = vehicles
    .filter(v => v.id !== vehicle.id && (v.brand === vehicle.brand || v.bodyType === vehicle.bodyType))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* breadcrumb */}
      <div className="text-xs text-slate-400 font-semibold space-x-2">
        <Link to="/" className="hover:text-accent-700">Accueil</Link>
        <span>/</span>
        <Link to="/voitures" className="hover:text-accent-700">Voitures</Link>
        <span>/</span>
        <span className="text-slate-800">{vehicle.brand} {vehicle.model}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side: Images & Spec Details (Col span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Photos gallery */}
          <div className="space-y-4">
            {/* Primary Display */}
            <div className="relative h-96 sm:h-[480px] bg-slate-950 rounded-2xl overflow-hidden group shadow-lg border border-slate-100">
              <img 
                src={vehicle.images[activeImageIndex] || vehicle.primaryImage} 
                alt={`${vehicle.brand} ${vehicle.model}`} 
                className="w-full h-full object-cover" 
              />
              
              {/* Fullscreen Trigger */}
              <button 
                onClick={() => setFullscreenImage(vehicle.images[activeImageIndex] || vehicle.primaryImage)}
                className="absolute bottom-4 right-4 p-2.5 bg-slate-950/80 hover:bg-slate-950 backdrop-blur-md text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                title="Plein écran"
              >
                <Maximize className="w-5 h-5" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4">
                <span className="bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  {vehicle.condition}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {vehicle.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {vehicle.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-accent-700 scale-95 shadow-sm' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Core Highlights */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">{vehicle.brand}</span>
                <h1 className="text-3xl font-display font-extrabold text-slate-900 mt-1">{vehicle.model}</h1>
                <div className="flex items-center flex-wrap gap-2 mt-2">
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
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    📍 {vehicle.location}, Sénégal
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Prix</span>
                <span className="text-3xl font-display font-extrabold text-accent-700 block">
                  {vehicle.price.toLocaleString('fr-FR')} <span className="text-lg font-bold">FCFA</span>
                </span>
              </div>
            </div>

            {/* Technical Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
                <Calendar className="w-5 h-5 text-accent-700" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Année</span>
                  <span className="text-sm font-bold text-slate-800">{vehicle.year}</span>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
                <Gauge className="w-5 h-5 text-accent-700" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Kilométrage</span>
                  <span className="text-sm font-bold text-slate-800">{vehicle.mileage.toLocaleString()} km</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
                <Fuel className="w-5 h-5 text-accent-700" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Énergie</span>
                  <span className="text-sm font-bold text-slate-800">{vehicle.fuel}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
                <Settings className="w-5 h-5 text-accent-700" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Boîte</span>
                  <span className="text-sm font-bold text-slate-800">{vehicle.transmission}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">Description du véhicule</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{vehicle.description}</p>
          </div>

          {/* Equipments */}
          <div className="bg-white border-2 border-black p-6 sm:p-8 rounded-none shadow-none space-y-4">
            <h2 className="text-xl font-bold text-black pb-3 border-b border-black/10">Équipements & Options</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {vehicle.equipments.map(eq => (
                <div key={eq} className="flex items-center gap-2 text-xs font-bold text-black">
                  <div className="w-5 h-5 bg-black text-white flex items-center justify-center flex-shrink-0 rounded-none">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  {eq}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Booking Form & Seller Contact (Col span 1) */}
        <div className="space-y-8">
          
          {/* Action Hub Panel */}
          <div className="flex gap-4">
            <button 
              onClick={() => toggleFavorite(vehicle.id)}
              className="flex-grow btn-secondary py-3 flex items-center justify-center gap-2 text-sm"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-accent-700 text-accent-700' : 'text-slate-600'}`} />
              {isFav ? 'Favoris activé' : 'Ajouter aux favoris'}
            </button>
            <button 
              onClick={handleShare}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              title="Partager"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Seller Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Vendeur</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center font-display font-black text-base border border-black">
                AE
              </div>
              <div>
                <h4 className="font-bold text-slate-850 text-sm">AutoElite Sénégal</h4>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Concessionnaire Premium</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">VDN, Dakar, Sénégal</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <a 
                href={`tel:${WHATSAPP_SELLER_NUMBER}`} 
                className="btn-dark w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4" /> Appeler le Vendeur
              </a>
              <a 
                href={getWhatsAppLink(
                  WHATSAPP_SELLER_NUMBER,
                  `Bonjour, je suis intéressé par votre véhicule ${vehicle.brand} ${vehicle.model} (${vehicle.year}) au prix de ${vehicle.price.toLocaleString()} FCFA.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Contacter sur WhatsApp
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white border-2 border-black p-6 rounded-none shadow-none space-y-6">
            <div className="space-y-1">
              <h3 className="font-bold text-black text-base">Contacter le Vendeur</h3>
              <p className="text-xs text-black/60">Envoyez un message pour obtenir plus d'informations.</p>
            </div>

            {contactSuccess ? (
              <div className="p-4 bg-black border-2 border-black text-white rounded-none space-y-2 text-center animate-fade-in">
                <CheckCircle className="w-8 h-8 text-white mx-auto" />
                <h4 className="font-bold text-sm">Message envoyé !</h4>
                <p className="text-xs text-white/80">Le vendeur a bien reçu votre demande et vous répondra sous peu.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Votre nom *</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Votre email *</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Votre téléphone</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221..." 
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Message *</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Bonjour, ce véhicule m'intéresse. Est-il toujours disponible ?" 
                    className="form-input resize-none" 
                  />
                </div>

                <button type="submit" className="w-full btn-primary py-2.5 text-xs">
                  <Send className="w-4 h-4" /> Envoyer mon message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Similar Cars Section */}
      {similarCars.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-slate-100">
          <h2 className="text-2xl font-display font-bold text-slate-900">Véhicules similaires</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {similarCars.map(car => (
              <div key={car.id} className="premium-card group flex flex-col h-full bg-white">
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img src={car.primaryImage} alt={car.model} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{car.brand}</span>
                    <h3 className="font-bold text-sm text-slate-800 leading-snug group-hover:text-accent-700 transition-colors">
                      <Link to={`/voitures/${car.id}`}>{car.model}</Link>
                    </h3>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-accent-700 font-display font-extrabold text-sm">
                      {car.price.toLocaleString('fr-FR')} <span className="text-[10px] font-semibold">FCFA</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">📍 {car.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Overlay */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <button 
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 text-white hover:text-accent-700 p-2 text-xl font-bold bg-slate-900/60 rounded-full"
          >
            ✕
          </button>
          <img src={fullscreenImage} alt="Fullscreen View" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}
