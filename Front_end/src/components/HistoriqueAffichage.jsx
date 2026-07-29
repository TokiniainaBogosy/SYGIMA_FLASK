import React, { useState, useEffect } from 'react';

// Constantes pour les filtres de modules
const MODULES = [
  { id: 'all', label: 'Tout l\'historique' },
  { id: 'stock', label: 'Stock' },
  { id: 'categorie', label: 'Catégories' },
  { id: 'materiel', label: 'Matériel' },
  { id: 'demande', label: 'Demandes' },
  { id: 'utilisateur', label: 'Utilisateurs' }
];

export default function HistoriqueAffichage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulation du fetch de l'API (À remplacer par votre appel Axios/Fetch)
  useEffect(() => {
    setIsLoading(true);
    // Exemple de données fictives concordant avec vos modules
    const mockLogs = [
      { id: 1, date: '2026-06-29 11:15', utilisateur: 'Tokini', action: 'Création', module: 'materiel', description: 'Ajout du matériel "Écran ASUS 24 pouces"' },
      { id: 2, date: '2026-06-29 10:30', utilisateur: 'Admin_Sygima', action: 'Modification', module: 'stock', description: 'Ajustement de stock pour "Câbles HDMI" (-10 unités)' },
      { id: 3, date: '2026-06-28 16:45', utilisateur: 'Rindra', action: 'Approbation', module: 'demande', description: 'Demande de matériel #1044 validée' },
      { id: 4, date: '2026-06-28 14:20', utilisateur: 'Tokini', action: 'Création', module: 'categorie', description: 'Nouvelle catégorie créée : "Périphériques Réseau"' },
      { id: 5, date: '2026-06-27 09:00', utilisateur: 'Système', action: 'Désactivation', module: 'utilisateur', description: 'Utilisateur "test_user" désactivé pour inactivité' }
    ];
    
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    setIsLoading(false);
  }, []);

  // Gestion des filtres et de la recherche
  useEffect(() => {
    let result = logs;

    if (activeTab !== 'all') {
      result = result.filter(log => log.module === activeTab);
    }

    if (searchTerm.trim() !== '') {
      result = result.filter(log => 
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.utilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(result);
  }, [activeTab, searchTerm, logs]);

  // Fonction utilitaire pour le badge de couleur par action
  const getActionBadgeColor = (action) => {
    switch (action.toLowerCase()) {
      case 'création': return 'bg-green-100 text-green-800 border-green-200';
      case 'modification': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'suppression': case 'désactivation': return 'bg-red-100 text-red-800 border-red-200';
      case 'approbation': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                      {log.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {log.utilisateur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize px-2 py-1 text-xs bg-gray-100 rounded text-gray-600 font-medium">
                        {log.module === 'categorie' ? 'Catégorie' : log.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md break-words">
                      {log.description}
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