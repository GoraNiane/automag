import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FileText, Shield, Sparkles } from 'lucide-react';

export default function Legals() {
  const { pathname } = useLocation();

  const getPageContent = () => {
    switch (pathname) {
      case '/conditions':
        return {
          title: "Conditions Générales d'Utilisation",
          subtitle: "Dernière mise à jour : Août 2026",
          body: "Bienvenue sur AutoElite. Les présentes conditions régissent l'accès et l'utilisation de notre plateforme de publication d'annonces automobiles au Sénégal. En publiant ou en consultant une annonce sur AutoElite, vous acceptez de respecter ces CGU. Vous vous engagez à fournir des informations véridiques sur l'état de votre véhicule. Les annonces frauduleuses ou trompeuses seront immédiatement supprimées de notre serveur par les administrateurs sans préavis."
        };
      case '/confidentialite':
        return {
          title: "Politique de Confidentialité",
          subtitle: "Dernière mise à jour : Août 2026",
          body: "Chez AutoElite, la protection de vos données personnelles est une priorité. Nous collectons uniquement les informations nécessaires au bon fonctionnement de nos formulaires de contact, de demande d'essai et de simulation de financement. Vos coordonnées (téléphone, email, nom) ne sont jamais transmises à des tiers sans votre consentement préalable."
        };
      case '/cookies':
        return {
          title: "Politique relative aux Cookies",
          subtitle: "Dernière mise à jour : Août 2026",
          body: "AutoElite utilise des cookies de session pour retenir vos préférences de recherche (votre marque préférée, vos favoris sauvegardés) et pour analyser l'audience de notre plateforme. Vous pouvez choisir de désactiver les cookies dans les paramètres de votre navigateur sans que cela n'affecte l'utilisation globale du site."
        };
      case '/mentions-legales':
      default:
        return {
          title: "Mentions Légales",
          subtitle: "AutoElite Sénégal",
          body: "La plateforme AutoElite est éditée par AutoElite SAS, société de droit sénégalais au capital de 10 000 000 FCFA, immatriculée au RCCM de Dakar. Directeur de la publication : Ibrahima Diallo. Hébergeur de la plateforme : Vercel / Render S3 compatible. Pour toute réclamation, contactez-nous par mail à niane0211@gmail.com."
        };
    }
  };

  const { title, subtitle, body } = getPageContent();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 animate-fade-in">
      <div className="space-y-2 border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-display font-extrabold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{subtitle}</p>
      </div>

      <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm text-slate-600 text-sm leading-relaxed space-y-4 font-medium">
        <p>{body}</p>
        <p>
          Pour en savoir plus sur l'exercice de vos droits ou pour toute question relative à l'utilisation de la plateforme, vous pouvez contacter notre service juridique à l'adresse email <strong className="text-accent-700">niane0211@gmail.com</strong>.
        </p>
      </div>

      <div className="pt-4 text-center">
        <Link to="/" className="text-xs font-bold text-accent-700 hover:text-accent-850">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
