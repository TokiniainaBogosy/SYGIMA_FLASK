import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';

const MaterielManager = ({ selectedMateriel, setSelectedMateriel, setMateriels, newReference, setNewReference, newDesignation, setNewDesignation, newCategorie, setNewCategorie, newUnite, setNewUnite }) => {

  // 3. Envoyer la modification (PATCH)
  const { patch } = useApi()

const handleUpdate = async (e) => {
  e.preventDefault()
  try {
    await patch(
      `/materiel/materiel/update/${selectedMateriel.id}`,
      { reference: newReference, designation: newDesignation, categorie: newCategorie, unite: newUnite }
    )
    setMateriels(prev =>
      prev.map(m =>
        m.id === selectedMateriel.id
          ? { ...m, reference: newReference, designation: newDesignation, categorie: newCategorie, unite: newUnite }
          : m
      )
    )
    setSelectedMateriel(null)
  } catch (err) { /* error géré par le hook */ }
}
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gestion des Matériaux</h2>
      
      {/* Tableau des catégories */}
      {/* <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td className="border p-2">{cat.nom}</td>
              <td className="border p-2">
                <button 
                  onClick={() => openEdit(cat)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Modifier
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      {/* Modal d'édition (s'affiche seulement si editingCategorie n'est pas null) */}
      
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Modifier le matériel</h3>
            <form onSubmit={handleUpdate}>
              {/* <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Référence</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newReference}
                  onChange={(e) => setNewReference(e.target.value)}
                  autoFocus
                />
              </div> */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Designation</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  autoFocus
                />
                </div>
                <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Unite</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newUnite}
                  onChange={(e) => setNewUnite(e.target.value)}
                  autoFocus
                />
                </div>
                <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Categorie</label>
                <input 
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newCategorie}
                  onChange={(e) => setNewCategorie(e.target.value)}
                  autoFocus
                />
                </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setSelectedMateriel(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      
    </div>
  );
};

export default MaterielManager;