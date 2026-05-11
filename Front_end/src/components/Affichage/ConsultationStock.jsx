import React, { useState } from 'react';
import { Search, Package, AlertTriangle, CheckCircle2, MoreVertical } from 'lucide-react';

const ConsultationStock = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [inventory, setInventory] = useState([
    { id: 1, nom: 'MacBook Pro M3', categorie: 'Informatique', quantite: 5, seuil: 2, emplacement: 'Bureau 101' },
    { id: 2, nom: 'Écran Dell 27"', categorie: 'Périphériques', quantite: 1, seuil: 3, emplacement: 'Entrepôt A' },
    { id: 3, nom: 'Souris Logitech MX', categorie: 'Accessoires', quantite: 12, seuil: 5, emplacement: 'Bureau 101' },
    { id: 4, nom: 'Clavier Mécanique', categorie: 'Accessoires', quantite: 0, seuil: 2, emplacement: 'Entrepôt B' },
  ]);

  const filteredInventory = inventory.filter(item =>
    item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (qte, seuil) => {
    if (qte === 0) return { label: 'Rupture', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: <AlertTriangle size={14} /> };
    if (qte <= seuil) return { label: 'Stock Faible', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <AlertTriangle size={14} /> };
    return { label: 'Disponible', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={14} /> };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventaire du Matériel</h1>
            <p className="text-gray-500 text-sm">Consultez et gérez les ressources disponibles en temps réel.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Rechercher un matériel..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Références" value={inventory.length} icon={<Package className="text-indigo-600" />} />
          <StatCard title="En Rupture" value={inventory.filter(i => i.quantite === 0).length} icon={<AlertTriangle className="text-rose-600" />} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4 text-center">Quantité</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => {
                const status = getStockStatus(item.quantite, item.seuil);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.nom}</div>
                      <div className="text-xs text-gray-400">{item.emplacement}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {item.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-bold ${item.quantite <= item.seuil ? 'text-rose-600' : 'text-gray-700'}`}>
                        {item.quantite}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredInventory.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              Aucun article ne correspond à votre recherche.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="p-3 bg-gray-50 rounded-lg italic">
      {icon}
    </div>
  </div>
);

export default ConsultationStock;