import React, { useState, useMemo } from 'react';
import { useApi } from '../hooks/useApi';

// Constantes pour les filtres de modules
const MODULES = [
  { id: 'all', label: "Tout l'historique" },
  { id: 'stocks', label: 'Stock' },
  { id: 'categories_materiel', label: 'Catégories' },
  { id: 'materiels', label: 'Matériel' },
  { id: 'demandes', label: 'Demandes' },
  { id: 'lignes_demande', label: 'Lignes de demande' }
];

export default function HistoriqueAffichage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Récupération des données et des états directement depuis le hook personnalisé
  const { data: mockLogs, loading: isLoading, error } = useApi('/historique/');

  // Calcul mémorisé des logs filtrés (évite l'utilisation d'un useEffect + state supplémentaire)
  const filteredLogs = useMemo(() => {
    if (!mockLogs || !Array.isArray(mockLogs)) return [];

    return mockLogs.filter((log) => {
      // 1. Filtre par onglet/module
      const matchModule = activeTab === 'all' || log.table_cible === activeTab;

      // 2. Filtre par terme de recherche
      const search = searchTerm.trim().toLowerCase();
      if (!search) return matchModule;

      const descriptionText = log.details || log.description || '';
      const matchSearch =
        (log.utilisateur && log.utilisateur.toLowerCase().includes(search)) ||
        (log.action && log.action.toLowerCase().includes(search));

      return matchModule && matchSearch;
    });
  }, [mockLogs, activeTab, searchTerm]);

  // Fonction utilitaire pour le badge de couleur par action
  const getActionBadgeColor = (action = '') => {
    switch (action.toLowerCase()) {
      case 'création' :
        return 'bg-green-100 text-green-800 border-green-200';
      case 'soumission':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'modification':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suppression':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'désactivation':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'traitement':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historique du Système</h1>
        <p className="text-sm text-gray-500">Suivi des actions et modifications effectuées sur l'application.</p>
      </div>

      {/* Barre d'outils : Recherche & Onglets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Navigation par onglets (Modules) */}
          <div className="flex flex-wrap gap-2">
            {MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors border ${
                  activeTab === mod.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {mod.label}
              </button>
            ))}
          </div>

          {/* Barre de recherche */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher une action, un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

        </div>
      </div>

      {/* Tableau des Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Chargement de l'historique...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Une erreur est survenue lors du chargement de l'historique.</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucun historique trouvé pour les critères sélectionnés.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Date & Heure</th>
                  <th className="px-6 py-3">Utilisateur</th>
                  <th className="px-6 py-3">Module</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-gray-600">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                      {log.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {log.utilisateur || 'Système'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize px-2 py-1 text-xs bg-gray-100 rounded text-gray-600 font-medium">
                        {log.table_cible}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md break-words">
                      {Object.entries(log.details || {}).map(([key, value]) => (
                        <div key={key} className="mb-1">
                          <span className="font-semibold">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}