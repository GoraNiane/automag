import React, { useState } from 'react';
import { useMockStore } from '../store/mockStore';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const { addContactRequest } = useMockStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    addContactRequest({
      name,
      email,
      phone,
      subject: subject || 'Demande générale',
      message
    });

    setSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900">Contactez-nous</h1>
        <p className="text-sm text-slate-500 mt-1">
          Une question sur un véhicule ? Un projet d'achat ou de vente ? Notre équipe à Dakar est à votre disposition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Direct contact info */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-base">Nos coordonnées</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <a href="tel:+221338000000" className="flex items-center gap-3 text-slate-600 hover:text-accent-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Téléphone</span>
                  +221 33 800 00 00
                </div>
              </a>

              <a href="mailto:contact@autoelite.sn" className="flex items-center gap-3 text-slate-600 hover:text-accent-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Email</span>
                  contact@autoelite.sn
                </div>
              </a>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Localisation</span>
                  VDN, Dakar, Sénégal
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Horaires d'ouverture</span>
                  Lundi - Samedi: 8h00 - 19h00
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-slate-900 text-slate-400 h-60 rounded-2xl overflow-hidden relative shadow-sm border border-slate-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-35" />
            <div className="text-center space-y-2 z-10 p-6">
              <span className="text-3xl">📍</span>
              <h4 className="text-white font-bold text-sm">Notre Showroom Principal</h4>
              <p className="text-[10px] text-slate-400">VDN extension, Face cité Keur Gorgui, Dakar</p>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-2 bg-white border-2 border-black p-6 sm:p-8 rounded-none shadow-none space-y-6">
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-black" /> Écrivez-nous un message
          </h2>

          {success ? (
            <div className="p-4 bg-black border-2 border-black text-white rounded-none space-y-2 text-center animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-white mx-auto" />
              <h4 className="font-bold text-sm font-display">Message envoyé avec succès !</h4>
              <p className="text-xs text-white/80">Notre équipe commerciale va vous répondre dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="form-label">Nom complet *</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ibrahima Sow" 
                    className="form-input" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="form-label">Adresse email *</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: ibrahima@email.sn" 
                    className="form-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="form-label">Numéro de téléphone</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +221 77..." 
                    className="form-input" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="form-label">Sujet du message</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Demande de renseignement" 
                    className="form-input" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="form-label">Message *</label>
                <textarea 
                  rows={5} 
                  required 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez votre message détaillé ici..." 
                  className="form-input resize-none" 
                />
              </div>

              <button type="submit" className="btn-primary py-2.5 px-8 text-xs ml-auto flex">
                <Send className="w-4 h-4" /> Envoyer mon message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
