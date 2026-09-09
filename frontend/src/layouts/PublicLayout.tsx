import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Car, Heart, Menu, X, 
  MapPin, Phone, Mail, ChevronRight
} from 'lucide-react';
import PassatLogo from '../components/PassatLogo';
import { useMockStore } from '../store/mockStore';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { getWhatsAppLink, WHATSAPP_SELLER_NUMBER, getFormattedPhoneNumber } from '../config/whatsapp';
import TikTokIcon from '../components/TikTokIcon';
import TwitterIcon from '../components/TwitterIcon';
import InstagramIcon from '../components/InstagramIcon';
import LinkedInIcon from '../components/LinkedInIcon';
import { TIKTOK_URL, TWITTER_URL, INSTAGRAM_URL, LINKEDIN_URL } from '../config/socials';




export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites } = useMockStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWiggling) return; // Prevent double trigger during animation

    const now = Date.now();
    if (now - lastClickTime < 1500) {
      const nextClicks = logoClicks + 1;
      setLogoClicks(nextClicks);
      if (nextClicks === 5) {
        setIsWiggling(true);
        setLogoClicks(0);
        setTimeout(() => {
          setIsWiggling(false);
          navigate('/connexion');
        }, 800);
        return;
      }
    } else {
      setLogoClicks(1);
    }
    setLastClickTime(now);
    navigate('/');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setNewsletterSubscribed(true);
      setEmailInput('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const activeLinkClass = (path: string) => 
    location.pathname === path 
      ? "text-black font-bold relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black transition-all" 
      : "text-black/50 hover:text-black font-medium pb-1 relative transition-all";


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Banner / Info bar */}
      <div className="w-full overflow-hidden bg-black text-white text-xs py-2.5 border-b border-white/10 whitespace-nowrap flex items-center">
        <div className="inline-block animate-ticker">
          <span className="inline-flex items-center gap-1.5 text-white/70 mx-8">
            <Phone className="w-3.5 h-3.5 text-white" /> {getFormattedPhoneNumber()}
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/70 mx-8">
            <MapPin className="w-3.5 h-3.5 text-white" /> VDN, Dakar, Sénégal
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/70 mx-8">
            Horaires : Lun - Sam / 8h00 - 19h00
          </span>
          <span className="text-white font-extrabold mx-8">
            NBKF AutoElite — Qualité. Fiabilité. Confiance.
          </span>
        </div>
        <div className="inline-block animate-ticker">
          <span className="inline-flex items-center gap-1.5 text-white/70 mx-8">
            <Phone className="w-3.5 h-3.5 text-white" /> {getFormattedPhoneNumber()}
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/70 mx-8">
            <MapPin className="w-3.5 h-3.5 text-white" /> Hann Mariste 1,ecole japonaise
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/70 mx-8">
            Horaires : Lun - Sam / 8h00 - 19h00
          </span>
          <span className="text-white font-extrabold mx-8">
            AutoElite — Qualité. Fiabilité. Confiance.
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={handleLogoClick} 
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer select-none shrink-0"
          >
            <div className="p-1 sm:p-1.5 bg-black rounded-lg border border-black flex items-center justify-center shrink-0">
              <PassatLogo size={28} />
            </div>
            <div className="leading-tight">
              <span className="text-base sm:text-xl font-display font-bold tracking-tight text-black block">
                NBKF AUTO<span className="font-light text-black/80">ELITE</span>
              </span>
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest text-black/50 font-bold leading-none">
                Sénégal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className={activeLinkClass('/')}>Accueil</Link>
            <Link to="/voitures" className={activeLinkClass('/voitures')}>Voitures</Link>
            <Link to="/categories" className={activeLinkClass('/categories')}>Catégories</Link>
            <Link to="/a-propos" className={activeLinkClass('/a-propos')}>À propos</Link>
            <Link to="/contact" className={activeLinkClass('/contact')}>Contact</Link>
          </nav>

          {/* Desktop Quick Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Favorites Icon */}
            <Link 
              to="/voitures" 
              className="relative p-2.5 text-black hover:text-black/80 rounded-full transition-all duration-200"
              title="Véhicules favoris"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* WhatsApp Contact Button */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-black/70 hover:text-[#25D366] hover:scale-110 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center rounded-full bg-transparent border border-black/5 hover:border-[#25D366]/20 hover:bg-[#25D366]/5"
              aria-label="Contacter le vendeur sur WhatsApp"
              title="Contacter le vendeur sur WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>

            {/* TikTok Button */}
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-black/70 hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center rounded-full bg-transparent border border-black/5 hover:border-black/20 hover:bg-black/5"
              aria-label="Suivre sur TikTok"
              title="Suivre sur TikTok"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>

            {/* Twitter/X Button */}
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-black/70 hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center rounded-full bg-transparent border border-black/5 hover:border-black/20 hover:bg-black/5"
              aria-label="Suivre sur Twitter"
              title="Suivre sur Twitter"
            >
              <TwitterIcon className="w-5 h-5" />
            </a>

            {/* Instagram Button */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-black/70 hover:text-[#E1306C] hover:scale-110 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center rounded-full bg-transparent border border-black/5 hover:border-[#E1306C]/20 hover:bg-[#E1306C]/5"
              aria-label="Suivre sur Instagram"
              title="Suivre sur Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>

            {/* LinkedIn Button */}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-black/70 hover:text-[#0077B5] hover:scale-110 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center rounded-full bg-transparent border border-black/5 hover:border-[#0077B5]/20 hover:bg-[#0077B5]/5"
              aria-label="Suivre sur LinkedIn"
              title="Suivre sur LinkedIn"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Clean Mobile Menu Actions (No crowding, no overflow) */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            {/* Favorites Icon */}
            <Link 
              to="/voitures" 
              className="relative p-2 text-black hover:bg-black/5 rounded-full transition-colors"
              title="Favoris"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* WhatsApp Direct Mobile Button */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#25D366] hover:bg-[#25D366]/10 rounded-full transition-all active:scale-95 flex items-center justify-center border border-[#25D366]/30 bg-[#25D366]/5"
              aria-label="Contacter sur WhatsApp"
              title="Contacter sur WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>

            {/* Hamburger Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black hover:bg-black/5 rounded-xl border border-black/10 transition-colors cursor-pointer"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-black/5 bg-white/95 backdrop-blur-xl py-5 px-5 shadow-2xl animate-fade-in space-y-5">
            <nav className="flex flex-col space-y-1">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)} 
                className={`py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                  location.pathname === '/' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>Accueil</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link 
                to="/voitures" 
                onClick={() => setMobileMenuOpen(false)} 
                className={`py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                  location.pathname === '/voitures' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>Catalogue Voitures</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link 
                to="/categories" 
                onClick={() => setMobileMenuOpen(false)} 
                className={`py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                  location.pathname === '/categories' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>Catégories & Disponibilité</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link 
                to="/a-propos" 
                onClick={() => setMobileMenuOpen(false)} 
                className={`py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                  location.pathname === '/a-propos' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>À Propos d'AutoElite</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)} 
                className={`py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                  location.pathname === '/contact' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>Contact & Showroom</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            </nav>

            {/* Social Links Row in Drawer */}
            <div className="pt-4 border-t border-slate-100">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">
                Rejoignez-nous sur les réseaux
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-emerald-50 text-[#25D366] border border-emerald-100 flex items-center justify-center transition-transform active:scale-95"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 text-black border border-slate-200 flex items-center justify-center transition-transform active:scale-95"
                  title="TikTok"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 text-black border border-slate-200 flex items-center justify-center transition-transform active:scale-95"
                  title="Twitter / X"
                >
                  <TwitterIcon className="w-5 h-5" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-rose-50 text-[#E1306C] border border-rose-100 flex items-center justify-center transition-transform active:scale-95"
                  title="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-sky-50 text-[#0077B5] border border-sky-100 flex items-center justify-center transition-transform active:scale-95"
                  title="LinkedIn"
                >
                  <LinkedInIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Direct Call / Contact Bar */}
            <div className="pt-2">
              <a 
                href={`tel:${WHATSAPP_SELLER_NUMBER}`}
                className="w-full py-3 bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler le Showroom : {getFormattedPhoneNumber()}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-black text-white/50 pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-1.5 bg-black rounded-lg border border-white/20 flex items-center justify-center">
                  <PassatLogo size={36} />
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-white">
                  NBKF AUTO<span className="font-light text-white/70">ELITE</span>
                </span>
              </div>
              <p className="text-sm text-white/50 mb-6 leading-relaxed">
                Première plateforme vitrine d'annonces automobiles premium au Sénégal. Découvrez des véhicules de qualité exposés par nos membres.
              </p>
              <div className="space-y-3 text-sm">
                <a href={`tel:${WHATSAPP_SELLER_NUMBER}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-white" /> {getFormattedPhoneNumber()}
                </a>
                <a href="mailto:niane0211@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-white" /> niane0211@gmail.com
                </a>
                <span className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-white" /> VDN, Dakar, Sénégal
                </span>
              </div>
              <div className="flex items-center gap-2.5 mt-6">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/50 hover:text-[#25D366] hover:bg-white/5 border border-white/10 hover:border-[#25D366]/20 rounded-lg transition-all duration-300 flex items-center justify-center"
                  aria-label="Contacter sur WhatsApp"
                  title="Contacter sur WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 flex items-center justify-center"
                  aria-label="Suivre sur TikTok"
                  title="Suivre sur TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 flex items-center justify-center"
                  aria-label="Suivre sur Twitter"
                  title="Suivre sur Twitter"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/50 hover:text-[#E1306C] hover:bg-white/5 border border-white/10 hover:border-[#E1306C]/20 rounded-lg transition-all duration-300 flex items-center justify-center"
                  aria-label="Suivre sur Instagram"
                  title="Suivre sur Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/50 hover:text-[#0077B5] hover:bg-white/5 border border-white/10 hover:border-[#0077B5]/20 rounded-lg transition-all duration-300 flex items-center justify-center"
                  aria-label="Suivre sur LinkedIn"
                  title="Suivre sur LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Liens Utiles</h4>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link to="/voitures" className="hover:text-white flex items-center gap-1 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-white" /> Notre Catalogue
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-white flex items-center gap-1 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-white" /> Catégories
                  </Link>
                </li>
                <li>
                  <Link to="/a-propos" className="hover:text-white flex items-center gap-1 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-white" /> À Propos
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white flex items-center gap-1 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-white" /> Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Support */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Support & Légal</h4>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link to="/faq" className="hover:text-white flex items-center gap-1 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-white" /> FAQ (Foire aux questions)
                  </Link>
                </li>
                <li>
                  <Link to="/conditions" className="hover:text-white flex items-center gap-1 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-white" /> Conditions Générales
                  </Link>
                </li>
                <li>
                  <Link to="/confidentialite" className="hover:text-white flex items-center gap-1 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-white" /> Confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-white flex items-center gap-1 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-white" /> Gestion des Cookies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Newsletter</h4>
              <p className="text-sm text-white/50 mb-4 leading-relaxed">
                Inscrivez-vous pour recevoir les nouveautés automobiles et nos meilleures offres.
              </p>
              
              {newsletterSubscribed ? (
                <div className="p-3 bg-white/5 border border-white/10 text-white font-medium text-xs rounded-lg animate-fade-in">
                  Merci ! Votre inscription à la newsletter a été validée.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                  <input 
                    type="email" 
                    placeholder="Votre adresse email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 text-xs focus:border-white/40 focus:ring-1 focus:ring-white/40 focus:outline-none"
                  />
                  <button type="submit" className="w-full py-2.5 bg-white hover:bg-white/90 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer">
                    S'abonner
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60">
            <p>&copy; {new Date().getFullYear()} AutoElite Sénégal. Tous droits réservés.</p>
            <p className="flex items-center gap-1.5">
              <span>Réalisé par</span>
              <span className="font-extrabold text-white tracking-wider px-2 py-0.5 bg-white/10 rounded-md border border-white/10">
                GoraTech
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
