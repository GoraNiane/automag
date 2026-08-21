import React from 'react';
import { useMockStore } from '../store/mockStore';
import { User, ShieldAlert, Key } from 'lucide-react';

export default function AdminUsers() {
  const { users, currentUser } = useMockStore();

  const handleRoleChange = (userId: string, currentRole: string) => {
    // Simply display role change instruction or simulate changing
    alert('Simulation : Rôle utilisateur modifié avec succès ! (Dans un environnement réel, cela envoie un appel API PUT/PATCH)');
  };

  return (
    <div className="space-y-6 animate-fade-in text-black">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-black">Gestion des Utilisateurs</h1>
        <p className="text-xs text-black/60 mt-1">Supervisez les rôles d'accès et comptes enregistrés sur la plateforme.</p>
      </div>

      <div className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black/5 text-black/70 uppercase font-bold border-b border-black/5">
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Email</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Date d'inscription</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-black/5 text-black transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} 
                        alt={u.firstName} 
                        className="w-8 h-8 rounded-full object-cover border border-black/5" 
                      />
                      <span className="font-bold text-black">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 text-black/60">{u.phone}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${
                      u.role === 'ADMIN' ? 'bg-black text-white border-black rounded-full' :
                      u.role === 'SELLER' ? 'bg-white text-black border-black rounded-full' :
                      'bg-white text-black/50 border-black/15 rounded-full'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-black/50">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="p-4 text-right">
                    {u.id !== currentUser?.id ? (
                      <button 
                        onClick={() => handleRoleChange(u.id, u.role)}
                        className="px-3 py-1 bg-white hover:bg-black hover:text-white text-black border border-black/15 hover:border-black rounded-lg font-bold text-[9px] transition-colors cursor-pointer"
                      >
                        Changer de rôle
                      </button>
                    ) : (
                      <span className="text-[10px] text-black/40 font-bold uppercase italic">Moi-même</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
