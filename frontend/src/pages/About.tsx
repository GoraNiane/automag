import React from 'react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-accent-700 text-xs font-bold uppercase tracking-widest font-mono">Qui sommes-nous ?</span>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-none">
            AutoElite : L'Excellence Automobile au Sénégal
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            AutoElite a été fondée avec une vision claire : professionnaliser le marché automobile d'occasion et neuf au Sénégal et en Afrique de l'Ouest. Nous croyons que l'acquisition d'un véhicule doit être une expérience sereine, transparente et sécurisée.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Grâce à des partenariats solides avec des banques, des assureurs et un réseau de mécaniciens agréés, nous vous offrons un guichet unique pour l'achat, le financement et la reprise de votre voiture.
          </p>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800" 
            alt="AutoElite Team" 
            className="rounded-2xl shadow-lg border border-slate-100" 
          />
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="bg-slate-950 text-white rounded-2xl p-8 sm:p-12 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-slate-900">
        <div className="space-y-1">
          <span className="block text-3xl font-display font-extrabold text-white">500+</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Véhicules Vendus</p>
        </div>
        <div className="space-y-1">
          <span className="block text-3xl font-display font-extrabold text-white">98%</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Clients Satisfaits</p>
        </div>
        <div className="space-y-1">
          <span className="block text-3xl font-display font-extrabold text-white">150</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Points d'Inspection</p>
        </div>
        <div className="space-y-1">
          <span className="block text-3xl font-display font-extrabold text-white">24/7</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Support Client</p>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-display font-bold text-slate-900">Nos Valeurs Cardinales</h2>
          <p className="text-slate-500 text-sm">Ce qui guide chacun de nos conseillers au quotidien.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-accent-50 text-accent-700 rounded-full flex items-center justify-center mx-auto text-xl">
              🏆
            </div>
            <h3 className="font-bold text-lg text-slate-800">Qualité</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Nous trions sur le volet tous nos véhicules. Aucun compromis n'est fait sur la sécurité ou la fiabilité de nos produits.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-accent-50 text-accent-700 rounded-full flex items-center justify-center mx-auto text-xl">
              🤝
            </div>
            <h3 className="font-bold text-lg text-slate-800">Fiabilité</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Toutes les informations et historiques d'entretien que nous fournissons sur nos véhicules sont authentiques et traçables.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-accent-50 text-accent-700 rounded-full flex items-center justify-center mx-auto text-xl">
              🛡️
            </div>
            <h3 className="font-bold text-lg text-slate-800">Confiance</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Nous construisons des relations durables. Notre service client et nos garanties mécaniques en témoignent.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
