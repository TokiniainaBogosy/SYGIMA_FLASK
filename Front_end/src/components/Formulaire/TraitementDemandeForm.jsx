import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const TraitementDemandeForm = () => {
  const [requests, setRequests] = useState([
    { id: 1, service: 'Marketing', materiel: 'MacBook Pro M3', date: '2024-05-20', statut: 'en_attente', motif_rejet: '' },
    { id: 2, service: 'RH', materiel: 'Écran Dell 27"', date: '2024-05-21', statut: 'approuve', motif_rejet: '' },
  ]);

  const [rejectingId, setRejectingId] = useState(null);
  const [tempMotif, setTempMotif] = useState('');

  const updateStatus = (id, newStatus, motif = '') => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, statut: newStatus, motif_rejet: motif } : req
    ));
    setRejectingId(null);
    setTempMotif('');
  };

  const getStatusBadge = (statut) => {
    const styles = {
      en_attente: "bg-amber-100 text-amber-700 border-amber-200",
      approuve: "bg-emerald-100 text-emerald-700 border-emerald-200",
      rejete: "bg-rose-100 text-rose-700 border-rose-200"
    };
    const labels = { en_attente: 'En attente', approuve: 'Approuvé', rejete: 'Rejeté' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[statut]}`}>
        {labels[statut]}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Demandes Matériel</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-bottom border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Service</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Matériel</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Statut</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{req.service}</p>
                    <p className="text-xs text-gray-500">{req.date}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{req.materiel}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(req.statut)}
                    {req.motif_rejet && (
                      <p className="text-xs text-rose-600 mt-1 flex items-start gap-1">
                        <AlertCircle size={12} className="mt-0.5" />
                        {req.motif_rejet}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.statut === 'en_attente' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => updateStatus(req.id, 'approuve')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => setRejectingId(req.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Rejeter"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Rejet Simple */}
        {rejectingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Motif du rejet</h3>
              <p className="text-sm text-gray-500 mb-4">Veuillez indiquer pourquoi cette demande est refusée.</p>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="3"
                placeholder="Ex: Budget annuel épuisé, Matériel déjà disponible en stock..."
                value={tempMotif}
                onChange={(e) => setTempMotif(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button 
                  disabled={!tempMotif.trim()}
                  onClick={() => updateStatus(rejectingId, 'rejete', tempMotif)}
                  className="px-4 py-2 text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 rounded-lg disabled:opacity-50"
                >
                  Confirmer le rejet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraitementDemandeForm;