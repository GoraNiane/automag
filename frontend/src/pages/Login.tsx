import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMockStore } from '../store/mockStore';
import { LogIn, Key, Mail, ShieldAlert, Shield } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useMockStore();

  const [email, setEmail] = useState('admin@autoelite.sn');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (email.toLowerCase() !== 'admin@autoelite.sn') {
      setError('Accès restreint aux administrateurs autorisés.');
      return;
    }

    // Attempt login with password
    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Identifiants incorrects.');
    }
  };


  return (
    <div className="max-w-md mx-auto px-4 py-24 space-y-8 flex flex-col justify-center min-h-[80vh]">
      
      <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6 relative overflow-hidden">
        
        {/* Shield Icon Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-extrabold text-black tracking-tight">Accès Espace Admin</h1>
            <p className="text-[11px] text-black/50 font-medium">Saisissez votre code pour accéder à la console AutoElite.</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" /> 
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-black/50 mb-1">
              Mot de passe de sécurité
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-black/40" />
              <input 
                type="password" 
                required 
                placeholder="••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-neutral-300 text-sm font-medium" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-black hover:bg-neutral-900 text-white font-bold rounded-xl border border-black hover:border-neutral-900 transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer text-xs mt-6 shadow-sm shadow-black/10"
          >
            <LogIn className="w-4 h-4" /> Se connecter à l'administration
          </button>
        </form>

      </div>
    </div>
  );
}
