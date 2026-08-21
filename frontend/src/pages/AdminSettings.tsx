import React, { useState } from 'react';
import { Save, Search, Globe } from 'lucide-react';

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('AutoElite Sénégal');
  const [phone, setPhone] = useState('+221 33 800 00 00');
  const [seoTitle, setSeoTitle] = useState('AutoElite | Vitrine d\'Annonces Automobiles Premium au Sénégal');
  const [seoMeta, setSeoMeta] = useState('Découvrez les meilleures annonces de voitures exposées à Dakar, Thiès, Saly et Saint-Louis. Contactez directement les vendeurs.');
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in text-slate-100">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Paramètres Système</h1>
        <p className="text-xs text-slate-400 mt-1">Configurez les paramètres généraux et les règles SEO de la vitrine.</p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-900 text-emerald-400 text-xs font-bold rounded-lg">
          ✓ Paramètres enregistrés avec succès !
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General section */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-md space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-accent-500 flex items-center gap-2 border-b border-slate-850 pb-2">
            <Globe className="w-4 h-4" /> Informations Générales
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="form-label text-slate-400">Nom de la Plateforme</label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="form-input bg-slate-900 border-slate-800 text-white" />
            </div>
            <div className="space-y-1.5">
              <label className="form-label text-slate-400">Téléphone de contact</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input bg-slate-900 border-slate-800 text-white" />
            </div>
          </div>
        </div>

        {/* SEO config */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-md space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-accent-500 flex items-center gap-2 border-b border-slate-850 pb-2">
            <Search className="w-4 h-4" /> Optimisation Moteurs de recherche (SEO)
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="form-label text-slate-400">Titre SEO par défaut</label>
              <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="form-input bg-slate-900 border-slate-800 text-white" />
            </div>
            <div className="space-y-1.5">
              <label className="form-label text-slate-400">Description Meta</label>
              <textarea rows={3} value={seoMeta} onChange={(e) => setSeoMeta(e.target.value)} className="form-input bg-slate-900 border-slate-800 text-white resize-none" />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary py-2.5 px-8 text-xs flex items-center gap-2">
            <Save className="w-4.5 h-4.5" /> Enregistrer les paramètres
          </button>
        </div>
      </form>
    </div>
  );
}
