import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Acheter',
    items: [
      { q: "Quelles sont les vérifications faites sur les voitures ?", a: "Toutes nos voitures subissent une inspection mécanique rigoureuse sur 150 points (moteur, carrosserie, trains roulants, sécurité et électronique) avant d'être mises en vente." },
      { q: "Puis-je essayer un véhicule avant de l'acheter ?", a: "Absolument. Vous pouvez planifier une demande d'essai sur route en ligne directement sur la fiche détaillée du véhicule à la date et heure de votre choix." },
      { q: "Fournissez-vous la carte grise et les mutations ?", a: "Oui, notre équipe administrative s'occupe de l'ensemble des formalités d'immatriculation et de mutation de carte grise pour vous livrer la voiture clé en main." }
    ]
  },
  {
    category: 'Vendre',
    items: [
      { q: "Comment publier une annonce sur AutoElite ?", a: "Il suffit de créer un compte gratuit, puis d'aller dans votre espace utilisateur pour cliquer sur 'Publier une annonce'. Remplissez les 6 étapes de notre formulaire (specs, photos, description) et soumettez-la. Elle sera vérifiée et en ligne sous 24h." },
      { q: "L'affichage des annonces est-il gratuit ?", a: "Oui, la publication d'annonces de base est entièrement gratuite pour les particuliers. Nous proposons des options de mise en avant payantes pour vendre plus rapidement." }
    ]
  },
  {
    category: 'Financement & Reprise',
    items: [
      { q: "Comment fonctionne la reprise automobile ?", a: "Vous soumettez les détails et photos de votre véhicule actuel via la page 'Reprise'. Nos experts font une estimation de rachat. Si vous l'acceptez, ce montant est déduit du prix de votre nouvelle voiture chez nous." },
      { q: "Quels sont les documents requis pour une demande de crédit ?", a: "Généralement, les banques partenaires demandent vos 3 derniers bulletins de salaire, vos 3 derniers relevés bancaires, une pièce d'identité et un justificatif de domicile au Sénégal." }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('Acheter');
  const [openIndexes, setOpenIndexes] = useState<Record<string, boolean>>({});

  const toggleAccordion = (qText: string) => {
    setOpenIndexes(prev => ({ ...prev, [qText]: !prev[qText] }));
  };

  const selectedCategoryData = FAQ_DATA.find(cat => cat.category === activeCategory) || FAQ_DATA[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-extrabold text-slate-900">Foire Aux Questions</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Trouvez des réponses rapides aux questions les plus fréquentes sur l'achat, la vente et le financement de votre voiture.
        </p>
      </div>

      {/* Category selector */}
      <div className="flex justify-center gap-3 border-b border-slate-100 pb-4">
        {FAQ_DATA.map(cat => (
          <button 
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
              activeCategory === cat.category 
                ? 'bg-accent-700 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="space-y-4">
        {selectedCategoryData.items.map((item) => {
          const isOpen = !!openIndexes[item.q];
          return (
            <div 
              key={item.q}
              className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm transition-all"
            >
              <button 
                onClick={() => toggleAccordion(item.q)}
                className="w-full px-6 py-4 flex justify-between items-center text-left text-slate-800 font-bold text-sm hover:bg-slate-50/50"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-accent-700 flex-shrink-0" />
                  {item.q}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-slate-500 text-xs leading-relaxed border-t border-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
